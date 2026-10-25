import { useSyncExternalStore } from 'react';

/** 의존성 없이 쓰는 아주 작은 전역 스토어 (zustand 와 비슷한 사용감) */
export function createStore<T extends object>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  const get = () => state;
  const set = (patch: Partial<T> | ((s: T) => Partial<T>)) => {
    const next = typeof patch === 'function' ? patch(state) : patch;
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  function useStore(): T;
  function useStore<U>(selector: (s: T) => U): U;
  function useStore<U>(selector?: (s: T) => U) {
    const sel = selector ?? ((s: T) => s as unknown as U);
    return useSyncExternalStore(subscribe, () => sel(state), () => sel(state));
  }
  return { get, set, subscribe, useStore };
}
