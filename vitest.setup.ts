import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// jsdom 25 + vitest 2 sometimes leaves localStorage undefined on globalThis.
// Provide a minimal in-memory polyfill so tests can use it directly.
class MemoryStorage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear(): void { this.store.clear(); }
  getItem(key: string): string | null { return this.store.has(key) ? this.store.get(key)! : null; }
  setItem(key: string, value: string): void { this.store.set(key, String(value)); }
  removeItem(key: string): void { this.store.delete(key); }
  key(i: number): string | null { return Array.from(this.store.keys())[i] ?? null; }
}

if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.clear !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), writable: true });
}

beforeEach(() => {
  globalThis.localStorage.clear();
});
