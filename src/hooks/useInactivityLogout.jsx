import { useEffect, useRef } from 'react';

const DEFAULT_INACTIVITY_MS = 120000;

function useInactivityLogout(handleLogout, timeoutMs = DEFAULT_INACTIVITY_MS) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (typeof handleLogout !== 'function') {
      return undefined;
    }

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        handleLogout();
      }, timeoutMs);
    };

    const events = ['mousemove', 'click', 'keypress'];

    events.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleLogout, timeoutMs]);
}

export default useInactivityLogout;
