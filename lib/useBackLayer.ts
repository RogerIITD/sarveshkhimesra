'use client';

import { useEffect, useRef } from 'react';

// Makes the browser / phone back button close things one layer at a time
// (photo viewer → app sheet → desktop), instead of leaving the site.
//
// Each open layer pushes one history entry. Back pops the top layer. Closing a
// layer from the UI removes its entry again (history.back), and that pop is
// skipped so it doesn't also close the layer underneath.
type Layer = { id: number; close: () => void };
const stack: Layer[] = [];
let skip = 0;
let listening = false;
let nextId = 1;

function onPop() {
  if (skip > 0) {
    skip--;
    return;
  }
  stack.pop()?.close();
}

export function useBackLayer(open: boolean, close: () => void) {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return;
    if (!listening) {
      window.addEventListener('popstate', onPop);
      listening = true;
    }
    const layer: Layer = { id: nextId++, close: () => closeRef.current() };
    stack.push(layer);
    // keep Next's router state, just add a marker on top
    window.history.pushState({ ...window.history.state, layer: layer.id }, '');
    return () => {
      const i = stack.indexOf(layer);
      if (i === -1) return; // already popped by the back button
      stack.splice(i, 1);
      skip++;
      window.history.back();
    };
  }, [open]);
}
