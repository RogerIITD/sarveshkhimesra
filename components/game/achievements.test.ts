import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS, getAchievement, totalXpFor } from './achievements';

describe('achievement registry', () => {
  it('exposes 12 unique ids', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ACHIEVEMENTS).toHaveLength(12);
  });

  it('every achievement has positive xp', () => {
    for (const a of ACHIEVEMENTS) expect(a.xp).toBeGreaterThan(0);
  });

  it('getAchievement returns matching record', () => {
    expect(getAchievement('first_contact')?.xp).toBe(10);
    expect(getAchievement('nope')).toBeUndefined();
  });

  it('totalXpFor sums only known ids', () => {
    expect(totalXpFor(['first_contact', 'server'])).toBe(25);
    expect(totalXpFor(['first_contact', 'unknown_id'])).toBe(10);
  });
});
