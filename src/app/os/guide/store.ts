"use client";

// Per-reader state for the guide: ticked checks and the chosen computer. Kept in this browser only; if storage is
// blocked (private window), it lives in memory for the visit and the page still works.

import { useSyncExternalStore } from "react";
import { STORAGE_KEY, osFrom, parseDone, toggleDone, type Os } from "./data";
import { parseTicks, toggleTick } from "./progress";

const listeners = new Set<() => void>();
const memory: Record<string, string | null> = {};
const OS_KEY = "os-guide.os";

function readKey(key: string): string | null {
  if (key in memory) return memory[key];
  try {
    memory[key] = localStorage.getItem(key);
  } catch {
    memory[key] = null;
  }
  return memory[key];
}

function writeKey(key: string, value: string) {
  memory[key] = value;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* blocked storage: keep it in memory for this visit */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export function useDone() {
  const raw = useSyncExternalStore(subscribe, () => readKey(STORAGE_KEY), () => null);
  const done = parseDone(raw);
  const toggle = (id: string) => writeKey(STORAGE_KEY, JSON.stringify(toggleDone(done, id)));
  return [done, toggle] as const;
}

/** Ticked labs for one module page, kept under its own key. */
export function useTicks(key: string, ids: readonly string[]) {
  const raw = useSyncExternalStore(subscribe, () => readKey(key), () => null);
  const done = parseTicks(raw, ids);
  const toggle = (id: string) => writeKey(key, JSON.stringify(toggleTick(done, id, ids)));
  return [done, toggle] as const;
}

/** A small JSON value for one page (the diagnostic's answers), kept in this browser. */
export function useStored(key: string): [string | null, (next: (current: string | null) => string) => void] {
  const raw = useSyncExternalStore(subscribe, () => readKey(key), () => null);
  // The update reads what is saved at the moment of the call, so two quick changes never overwrite each other.
  return [raw, (next) => writeKey(key, next(readKey(key)))];
}

export function useOs() {
  const os = useSyncExternalStore(
    subscribe,
    () => (readKey(OS_KEY) as Os | null) ?? osFrom(navigator.userAgent),
    () => "mac" as Os,
  );
  return [os, (next: Os) => writeKey(OS_KEY, next)] as const;
}
