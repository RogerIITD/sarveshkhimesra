'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type { Achievement, AchievementId } from './achievements';
import { ACHIEVEMENTS, getAchievement } from './achievements';
import {
  GAME_STATE_KEY,
  STREAK_KEY,
  readGameState,
  readStreak,
  todayUTC,
  writeGameState,
} from './storage';
import type { GameEvent } from './commands';

type State = {
  xp: number;
  achievements: AchievementId[];
  classic: boolean;
  turbo: boolean;
  streak: number;
  lastUnlock: Achievement | null;
  hydrated: boolean;
};

type Action =
  | { type: 'hydrate'; payload: Partial<State> }
  | { type: 'unlock'; id: AchievementId }
  | { type: 'toggle-classic' }
  | { type: 'set-classic'; value: boolean }
  | { type: 'set-turbo'; value: boolean }
  | { type: 'clear-toast' }
  | { type: 'reset' };

const INITIAL: State = {
  xp: 0,
  achievements: [],
  classic: false,
  turbo: false,
  streak: 1,
  lastUnlock: null,
  hydrated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, hydrated: true };
    case 'unlock': {
      if (state.achievements.includes(action.id)) return state;
      const ach = getAchievement(action.id);
      if (!ach) return state;
      return {
        ...state,
        achievements: [...state.achievements, action.id],
        xp: state.xp + ach.xp,
        lastUnlock: ach,
      };
    }
    case 'toggle-classic':
      return { ...state, classic: !state.classic };
    case 'set-classic':
      return { ...state, classic: action.value };
    case 'set-turbo':
      return { ...state, turbo: action.value };
    case 'clear-toast':
      return { ...state, lastUnlock: null };
    case 'reset':
      return { ...INITIAL, classic: state.classic, streak: state.streak, hydrated: true };
  }
}

type Ctx = State & {
  unlock: (id: AchievementId) => void;
  toggleClassic: () => void;
  setTurbo: (v: boolean) => void;
  resetProgress: () => void;
  dispatchEvent: (event: GameEvent) => void;
  emitter: EventTarget;
};

const GameContext = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const emitterRef = useRef<EventTarget | null>(null);
  if (emitterRef.current === null && typeof window !== 'undefined') {
    emitterRef.current = new EventTarget();
  }

  // Hydrate from localStorage + compute streak + unlock first_contact.
  useEffect(() => {
    const stored = readGameState();
    const streak = readStreak(todayUTC()).count;
    dispatch({
      type: 'hydrate',
      payload: {
        xp: stored.xp,
        achievements: stored.achievements as AchievementId[],
        classic: stored.classic,
        turbo: stored.turbo,
        streak,
      },
    });
    // Defer to next tick so the hydrate is applied before the unlock check.
    queueMicrotask(() => dispatch({ type: 'unlock', id: 'first_contact' }));
  }, []);

  // Persist on change (skip until hydrated to avoid clobbering stored data).
  useEffect(() => {
    if (!state.hydrated) return;
    writeGameState({
      xp: state.xp,
      achievements: state.achievements,
      classic: state.classic,
      turbo: state.turbo,
    });
  }, [state.hydrated, state.xp, state.achievements, state.classic, state.turbo]);

  // Auto-clear toast after 3s.
  useEffect(() => {
    if (!state.lastUnlock) return;
    const id = setTimeout(() => dispatch({ type: 'clear-toast' }), 3000);
    return () => clearTimeout(id);
  }, [state.lastUnlock]);

  const unlock = useCallback((id: AchievementId) => dispatch({ type: 'unlock', id }), []);
  const toggleClassic = useCallback(() => dispatch({ type: 'toggle-classic' }), []);
  const setTurbo = useCallback((v: boolean) => dispatch({ type: 'set-turbo', value: v }), []);

  const resetProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GAME_STATE_KEY);
      localStorage.removeItem(STREAK_KEY);
    }
    dispatch({ type: 'reset' });
  }, []);

  const dispatchEvent = useCallback(
    (event: GameEvent) => {
      if (event.type === 'theme') {
        dispatch({ type: 'set-classic', value: event.mode === 'classic' });
      } else if (event.type === 'reset') {
        resetProgress();
      }
      emitterRef.current?.dispatchEvent(new CustomEvent('game', { detail: event }));
    },
    [resetProgress],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      unlock,
      toggleClassic,
      setTurbo,
      resetProgress,
      dispatchEvent,
      emitter: emitterRef.current ?? new EventTarget(),
    }),
    [state, unlock, toggleClassic, setTurbo, resetProgress, dispatchEvent],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): Ctx {
  const v = useContext(GameContext);
  if (!v) throw new Error('useGame must be used inside <GameProvider>');
  return v;
}

export { ACHIEVEMENTS };
