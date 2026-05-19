import { useGame } from '@/contexts/GameContext';
import { useLocale } from '@/i18n/LocaleContext';
import { Timer, Zap, Hash, Shield, Skull, Eye, Globe } from 'lucide-react';

const LangToggle = () => {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center gap-1">
      <Globe className="w-3 h-3 text-muted-foreground" />
      {(['uk', 'en'] as const).map(l => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors ${
            locale === l
              ? 'border-primary text-foreground bg-primary/10'
              : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const GameHeader = () => {
  const { state } = useGame();
  const { t } = useLocale();
  if (!state) return null;

  if (state.role === 'purple') {
    const annotatedCount = Object.keys(state.purpleAnnotations).length;
    const totalSteps = state.purpleTimeline.length;
    return (
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-cyber-purple" />
          <span className="font-display text-sm font-bold text-cyber-purple">PURPLE TEAM</span>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">{t('header.step')}:</span>
            <span className="text-foreground">{state.purpleCurrentStep + 1}/{totalSteps}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">{t('header.analyzed')}:</span>
            <span className="text-cyber-purple">{annotatedCount}/{totalSteps}</span>
          </div>
          <div className="h-1 w-24 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-cyber-purple transition-all"
              style={{ width: totalSteps > 0 ? `${(annotatedCount / totalSteps) * 100}%` : '0%' }}
            />
          </div>
          <LangToggle />
        </div>
      </header>
    );
  }

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

      <div className="flex items-center gap-5 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{t('header.turn')}:</span>
          <span className="text-foreground">{state.turn}/{state.maxTurns}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyber-yellow" />
          <span className="text-muted-foreground">{t('header.score')}:</span>
          <span className="text-cyber-yellow">{state.score}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${state.timeRemaining < 60 ? 'text-cyber-red animate-pulse-glow' : ''}`}>
          <Timer className="w-3.5 h-3.5" />
          <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">{t('header.level')}:</span>
          <span className={`${
            state.accessLevel === 'admin' ? 'text-cyber-red' :
            state.accessLevel === 'teacher' ? 'text-cyber-yellow' :
            state.accessLevel === 'student' ? 'text-cyber-green' : 'text-muted-foreground'
          }`}>
            {state.accessLevel === 'none' ? '—' : state.accessLevel}
          </span>
        </div>
        <LangToggle />
      </div>
    </header>
  );
};

export default GameHeader;
