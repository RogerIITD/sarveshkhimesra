import { describe, it, expect, vi } from 'vitest';
import { parseCommand, runCommand, COMMAND_REGISTRY } from './commands';

describe('parseCommand', () => {
  it('lowercases, trims, splits args', () => {
    expect(parseCommand('  Help  ')).toEqual({ name: 'help', args: [] });
    expect(parseCommand('play maafi')).toEqual({ name: 'play', args: ['maafi'] });
    expect(parseCommand('ls travel/india')).toEqual({ name: 'ls', args: ['travel/india'] });
  });

  it('returns null for empty input', () => {
    expect(parseCommand('')).toBeNull();
    expect(parseCommand('   ')).toBeNull();
  });
});

describe('runCommand', () => {
  const ctx = () => ({ unlock: vi.fn(), emit: vi.fn() });

  it('help returns text with visible commands', () => {
    const out = runCommand('help', ctx());
    expect(out.kind).toBe('text');
    expect(out.body).toContain('whoami');
  });

  it('returns not-found for unknown', () => {
    const out = runCommand('xyzzy', ctx());
    expect(out.kind).toBe('error');
    expect(out.body).toMatch(/command not found/i);
  });

  it('shayari unlocks shayari_open', () => {
    const c = ctx();
    runCommand('shayari', c);
    expect(c.unlock).toHaveBeenCalledWith('shayari_open');
  });

  it('play maafi unlocks maafi_played', () => {
    const c = ctx();
    runCommand('play maafi', c);
    expect(c.unlock).toHaveBeenCalledWith('maafi_played');
  });

  it('ls travel and ls travel/india both unlock travel_seen', () => {
    const c = ctx();
    runCommand('ls travel', c);
    runCommand('ls travel/india', c);
    expect(c.unlock).toHaveBeenCalledWith('travel_seen');
    expect(c.unlock).toHaveBeenCalledTimes(2);
  });

  it('ls sports unlocks sports_seen', () => {
    const c = ctx();
    runCommand('ls sports', c);
    expect(c.unlock).toHaveBeenCalledWith('sports_seen');
  });

  it('help body does not leak secret command names', () => {
    const out = runCommand('help', ctx());
    expect(out.body).not.toMatch(/shayari/);
    expect(out.body).not.toMatch(/play maafi/);
    expect(out.body).not.toMatch(/ls travel/);
  });

  it('open <app> emits open-app and rejects unknown apps', () => {
    const c = ctx();
    expect(runCommand('open camera/', c).kind).toBe('text');
    expect(c.emit).toHaveBeenCalledWith({ type: 'open-app', app: 'camera' });
    expect(runCommand('open netflix', ctx()).kind).toBe('error');
  });

  it('persona <side> emits persona and rejects unknown sides', () => {
    const c = ctx();
    expect(runCommand('persona poet', c).kind).toBe('text');
    expect(c.emit).toHaveBeenCalledWith({ type: 'persona', persona: 'poet' });
    expect(runCommand('persona villain', ctx()).kind).toBe('error');
  });

  it('registry contains expected commands', () => {
    const names = COMMAND_REGISTRY.map((c) => c.name).sort();
    expect(names).toContain('help');
    expect(names).toContain('clear');
    expect(names).toContain('whoami');
    expect(names).toContain('shayari');
    expect(names).toContain('play');
    expect(names).toContain('ls');
    expect(names).toContain('contact');
    expect(names).toContain('cat');
    expect(names).toContain('theme');
    expect(names).toContain('reset');
  });
});
