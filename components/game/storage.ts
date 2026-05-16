export const GAME_STATE_KEY = 'khimesra.game.v1';
export const STREAK_KEY = 'khimesra.streak.v1';

export type GameState = {
  xp: number;
  achievements: string[];
  classic: boolean;
  turbo: boolean;
};

export type Streak = { count: number; lastVisitUTC: string };

const DEFAULT_STATE: GameState = {
  xp: 0,
  achievements: [],
  classic: false,
  turbo: false,
};

function safeRead<T>(key: string, expectedVersion: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data?.version !== expectedVersion) return null;
    return data.payload as T;
  } catch {
    return null;
  }
}

function safeWrite<T>(key: string, version: string, payload: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify({ version, payload }));
}

export function readGameState(): GameState {
  return safeRead<GameState>(GAME_STATE_KEY, 'v1') ?? DEFAULT_STATE;
}

export function writeGameState(state: GameState): void {
  safeWrite(GAME_STATE_KEY, 'v1', state);
}

function previousUtcDay(today: string): string {
  const d = new Date(today + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function readStreak(today: string): Streak {
  const stored = safeRead<Streak>(STREAK_KEY, 'v1');
  let next: Streak;
  if (!stored) {
    next = { count: 1, lastVisitUTC: today };
  } else if (stored.lastVisitUTC === today) {
    next = stored;
  } else if (stored.lastVisitUTC === previousUtcDay(today)) {
    next = { count: stored.count + 1, lastVisitUTC: today };
  } else {
    next = { count: 1, lastVisitUTC: today };
  }
  writeStreak(next);
  return next;
}

export function writeStreak(s: Streak): void {
  safeWrite(STREAK_KEY, 'v1', s);
}

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}
