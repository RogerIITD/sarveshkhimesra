import { describe, it, expect, beforeEach } from 'vitest';
import {
  readGameState,
  writeGameState,
  readStreak,
  writeStreak,
  GAME_STATE_KEY,
} from './storage';

describe('readGameState', () => {
  beforeEach(() => localStorage.clear());

  it('returns defaults when empty', () => {
    expect(readGameState()).toEqual({
      xp: 0,
      achievements: [],
      classic: false,
      turbo: false,
    });
  });

  it('reads what was written', () => {
    writeGameState({
      xp: 50,
      achievements: ['first_contact'],
      classic: true,
      turbo: false,
    });
    expect(readGameState()).toEqual({
      xp: 50,
      achievements: ['first_contact'],
      classic: true,
      turbo: false,
    });
  });

  it('ignores stored data with wrong version', () => {
    localStorage.setItem(
      GAME_STATE_KEY,
      JSON.stringify({ version: 'v0', payload: { xp: 999, achievements: [], classic: false, turbo: false } }),
    );
    expect(readGameState()).toEqual({
      xp: 0,
      achievements: [],
      classic: false,
      turbo: false,
    });
  });

  it('survives malformed JSON', () => {
    localStorage.setItem(GAME_STATE_KEY, '{not json');
    expect(readGameState()).toEqual({
      xp: 0,
      achievements: [],
      classic: false,
      turbo: false,
    });
  });
});

describe('streak', () => {
  beforeEach(() => localStorage.clear());

  it('returns 1 with today when empty', () => {
    expect(readStreak('2026-05-16')).toEqual({ count: 1, lastVisitUTC: '2026-05-16' });
  });

  it('increments when called on the next day', () => {
    writeStreak({ count: 3, lastVisitUTC: '2026-05-15' });
    expect(readStreak('2026-05-16')).toEqual({ count: 4, lastVisitUTC: '2026-05-16' });
  });

  it('does not change when called twice the same day', () => {
    writeStreak({ count: 3, lastVisitUTC: '2026-05-16' });
    expect(readStreak('2026-05-16')).toEqual({ count: 3, lastVisitUTC: '2026-05-16' });
  });

  it('resets to 1 when a day is skipped', () => {
    writeStreak({ count: 5, lastVisitUTC: '2026-05-14' });
    expect(readStreak('2026-05-16')).toEqual({ count: 1, lastVisitUTC: '2026-05-16' });
  });
});
