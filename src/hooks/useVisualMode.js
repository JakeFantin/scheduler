// USE VISUAL MODE HOOK, HANDLES MODE IN A STACK STRUCTURE
import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // TRANSITIONS TO A NEW STATE, ADDING IT ONTO THE HISTORY, UNLESS REPLACE IS TRUE, THEN IT REPLACES THE TOP OF THE HISTORY STACK INSTEAD
  function transition(newMode, replace = false) {
      setMode(newMode);
      setHistory(prev => [...prev.slice(0, replace ? prev.length-1 : prev.length), newMode])
  }
  // GOES BACK IN THE HISTORY BY ONE
  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(prev => prev.slice(0, prev.length-1));
    }
  }

  return { mode, transition, back };

};