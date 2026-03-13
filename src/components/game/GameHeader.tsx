import { useGame } from '@/contexts/GameContext';
import { Timer, Zap, Hash, Shield, Skull } from 'lucide-react';

const GameHeader = () => {
  const { state } = useGame();
  if (!state) return null;

  const isRed = state.role === 'red';
  const mins = Math.floor(state.timeRemaining / 60);
  const secs = state.timeRemaining % 60;
  const accentClass = isRed ? 'text-cyber-red' : 'text-cyber-blue';
  const glowClass = isRed ? 'text-glow-red' : 'text-glow-blue';

  return (
    <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {isRed ? <Skull className="w-5 h-5 text-cyber-red" /> : <Shield className="w-5 h-5 text-cyber-blue" />}
        <span className={`font-display text-sm font-bold ${accentClass} ${glowClass}`}>
          {isRed ? 'RED TEAM' : 'BLUE TEAM'}
        </span>
      </div>

      <div className="flex items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Хід:</span>
          <span className="text-foreground">{state.turn}/{state.maxTurns}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyber-yellow" />
          <span className="text-muted-foreground">Очки:</span>
          <span className="text-cyber-yellow">{state.score}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${state.timeRemaining < 60 ? 'text-cyber-red animate-pulse-glow' : ''}`}>
          <Timer className="w-3.5 h-3.5" />
          <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Рівень:</span>
          <span className={`${
            state.accessLevel === 'admin' ? 'text-cyber-red' :
            state.accessLevel === 'teacher' ? 'text-cyber-yellow' :
            state.accessLevel === 'student' ? 'text-cyber-green' : 'text-muted-foreground'
          }`}>
            {state.accessLevel === 'none' ? '—' : state.accessLevel}
          </span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
