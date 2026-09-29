// Ensure window.fetch can be safely assigned in strict mode if it only has a getter on Window.prototype
if (typeof window !== 'undefined') {
  try {
    const win = window;

    try {
      if ('fetch' in Object.prototype) {
        delete (Object.prototype as unknown as Record<string, unknown>).fetch;
      }
    } catch (_) {}
    try {
      if (typeof EventTarget !== 'undefined' && EventTarget.prototype && 'fetch' in EventTarget.prototype) {
        delete (EventTarget.prototype as unknown as Record<string, unknown>).fetch;
      }
    } catch (_) {}

    const rawFetch = win.fetch;
    let currentFetch = typeof rawFetch === 'function' ? rawFetch.bind(win) : rawFetch;

    const defineSafeFetch = (target: object | null | undefined) => {
      if (!target || target === Object.prototype || (typeof EventTarget !== 'undefined' && target === EventTarget.prototype)) return;
      try {
        Object.defineProperty(target, 'fetch', {
          get: () => currentFetch,
          set: (fn: typeof fetch) => {
            currentFetch = typeof fn === 'function' ? fn : currentFetch;
          },
          configurable: true,
          enumerable: true,
        });
      } catch (_) {
        try {
          Object.defineProperty(target, 'fetch', {
            value: currentFetch,
            writable: true,
            configurable: true,
            enumerable: true,
          });
        } catch (_) {}
      }
    };

    if (typeof Window !== 'undefined' && Window.prototype) {
      defineSafeFetch(Window.prototype);
    }
    if (Object.getPrototypeOf(win)) {
      defineSafeFetch(Object.getPrototypeOf(win));
    }
    defineSafeFetch(win);
  } catch (_) {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
