import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { GameState, TeamRole, createInitialGameState, PhishingEmail } from '@/types/game';
import {
  redScanPorts, redSendPhishing, redSocialEngineering, redBruteforce,
  redSqlInjection, redAccessFile,
  blueEnableFirewall, blueEnforce2FA, blueChangePasswords, blueClosePort,
  blueIsolateAccount, blueAnalyzeLogs, simulateRedTeamAttack,
} from '@/lib/gameEngine';

interface GameContextValue {
  state: GameState | null;
  startGame: (role: TeamRole) => void;
  resetGame: () => void;
  // Red actions
  scanPorts: () => void;
  sendPhishing: (email: PhishingEmail) => void;
  socialEngineer: (targetId: string, approach: string) => void;
  bruteforce: (targetId: string) => void;
  sqlInjection: () => void;
  accessFile: () => void;
  // Blue actions
  enableFirewall: (ip: string) => void;
  enforce2FA: () => void;
  changePasswords: () => void;
  closePort: (port: number) => void;
  isolateAccount: (npcId: string) => void;
  analyzeLogs: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = useCallback((role: TeamRole) => {
    setState(createInitialGameState(role));
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState(null);
  }, []);

  // Timer
  useEffect(() => {
    if (state && !state.isGameOver && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (!prev || prev.isGameOver) return prev;
          const newTime = prev.timeRemaining - 1;
          if (newTime <= 0) {
            return { ...prev, timeRemaining: 0, isGameOver: true, gameResult: prev.role === 'blue' ? 'win' : 'lose' };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [state?.isGameOver, state?.timeRemaining]);

  // Blue team: simulate attacks every 2 turns
  const update = (fn: (s: GameState) => GameState) => {
    setState(prev => {
      if (!prev || prev.isGameOver) return prev;
      let next = fn(prev);
      if (next.role === 'blue' && next.turn % 2 === 0 && !next.isGameOver) {
        next = simulateRedTeamAttack(next);
      }
      return next;
    });
  };

  const value: GameContextValue = {
    state,
    startGame,
    resetGame,
    scanPorts: () => update(redScanPorts),
    sendPhishing: (email) => update(s => redSendPhishing(s, email)),
    socialEngineer: (targetId, approach) => update(s => redSocialEngineering(s, targetId, approach)),
    bruteforce: (targetId) => update(s => redBruteforce(s, targetId)),
    sqlInjection: () => update(redSqlInjection),
    accessFile: () => update(redAccessFile),
    enableFirewall: (ip) => update(s => blueEnableFirewall(s, ip)),
    enforce2FA: () => update(blueEnforce2FA),
    changePasswords: () => update(blueChangePasswords),
    closePort: (port) => update(s => blueClosePort(s, port)),
    isolateAccount: (npcId) => update(s => blueIsolateAccount(s, npcId)),
    analyzeLogs: () => update(blueAnalyzeLogs),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
