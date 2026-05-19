import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLocale } from '@/i18n/LocaleContext';
import { PurpleAnnotation } from '@/types/game';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Eye, ChevronLeft, ChevronRight, CheckCircle, FileText } from 'lucide-react';

const RATING_COLOR: Record<PurpleAnnotation['rating'], string> = {
  effective: 'text-cyber-green border-cyber-green bg-cyber-green/10',
  neutral: 'text-cyber-yellow border-cyber-yellow bg-cyber-yellow/10',
  ineffective: 'text-cyber-red border-cyber-red bg-cyber-red/10',
};

const RATING_MUTED = 'text-muted-foreground border-border hover:border-muted-foreground';

const PurpleTeamPanel = () => {
  const { state, setCurrentStep, annotateStep } = useGame();
  const { t } = useLocale();
  const [rating, setRating] = useState<PurpleAnnotation['rating']>('neutral');
  const [recommendation, setRecommendation] = useState('');

  const step = state?.purpleTimeline[state.purpleCurrentStep ?? 0];
  const existing = state?.purpleAnnotations[state.purpleCurrentStep ?? 0];
  const currentStep = state?.purpleCurrentStep ?? 0;

  // Pre-fill form when navigating between steps
  useEffect(() => {
    const ann = state?.purpleAnnotations[currentStep];
    setRating(ann?.rating ?? 'neutral');
    setRecommendation(ann?.recommendation ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  if (!state || state.role !== 'purple') return null;

  const { purpleTimeline, purpleAnnotations } = state;
  const annotatedCount = Object.keys(purpleAnnotations).length;
  const totalSteps = purpleTimeline.length;
  const allAnnotated = annotatedCount === totalSteps;

  const redScore = purpleTimeline.filter(e => e.team === 'red').reduce((s, e) => s + e.pointsGained, 0);
  const blueScore = purpleTimeline.filter(e => e.team === 'blue').reduce((s, e) => s + e.pointsGained, 0);

  const countRating = (team: 'red' | 'blue', r: PurpleAnnotation['rating']) =>
    Object.entries(purpleAnnotations).filter(([i, a]) => purpleTimeline[Number(i)]?.team === team && a.rating === r).length;

  const handleSave = () => {
    annotateStep(currentStep, { rating, recommendation });
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="h-full flex">
      {/* Left: Timeline */}
      <div className="w-64 border-r border-border flex flex-col shrink-0">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-cyber-purple" />
          <p className="font-display text-xs font-bold text-cyber-purple tracking-wider">{t('purple.timeline.title')}</p>
          <span className="ml-auto text-xs text-muted-foreground font-mono">{annotatedCount}/{totalSteps}</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {purpleTimeline.map((entry, i) => {
              const annotated = i in purpleAnnotations;
              const isActive = i === currentStep;
              const teamColor = entry.team === 'red' ? 'text-cyber-red' : 'text-cyber-blue';
              return (
                <button
                  key={entry.id}
                  onClick={() => setCurrentStep(i)}
                  className={`w-full text-left p-2 rounded border text-xs font-mono transition-colors ${
                    isActive ? 'border-cyber-purple bg-cyber-purple/10' : 'border-border hover:border-cyber-purple/40 bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className={`font-bold ${teamColor}`}>{entry.team === 'red' ? '● RED' : '● BLU'}</span>
                    <span className="text-muted-foreground ml-auto">{t('header.turn')} {entry.turn}</span>
                    {annotated && <CheckCircle className="w-3 h-3 text-cyber-green shrink-0" />}
                  </div>
                  <p className="text-muted-foreground truncate">{entry.action}</p>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Center: Step detail + annotation */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {step && (
          <>
            <div className="flex items-center justify-between">
              <span className={`font-display text-sm font-bold ${step.team === 'red' ? 'text-cyber-red' : 'text-cyber-blue'}`}>
                {step.team === 'red' ? 'RED TEAM' : 'BLUE TEAM'} — {t('header.turn')} {step.turn}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{currentStep + 1} / {totalSteps}</span>
            </div>

            <div className="p-3 rounded border border-border bg-muted/20 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('purple.label.action')}</p>
              <p className="text-sm font-mono text-foreground">{step.action}</p>
            </div>

            <div className="p-3 rounded border border-border bg-muted/20 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('purple.label.result')}</p>
              <p className="text-sm font-mono text-foreground">{step.result}</p>
              {step.pointsGained > 0 && <p className="text-xs text-cyber-yellow">+{step.pointsGained} {t('purple.label.points')}</p>}
            </div>

            <div className="p-3 rounded border border-cyber-purple/30 bg-cyber-purple/5 space-y-1">
              <p className="text-[10px] text-cyber-purple font-bold uppercase tracking-wider">{t('purple.label.autoInsight')}</p>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">{t('purple.insight.' + step.id)}</p>
            </div>

            {/* Annotation form */}
            <div className="p-3 rounded border border-border bg-card space-y-3">
              <p className="font-display text-xs font-bold text-foreground tracking-wider">{t('purple.label.yourReview')}</p>
              <div className="flex gap-2">
                {(['effective', 'neutral', 'ineffective'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`flex-1 py-1.5 rounded text-xs font-mono border transition-colors ${
                      rating === r ? RATING_COLOR[r] : RATING_MUTED
                    }`}
                  >
                    {t('purple.label.' + r)}
                  </button>
                ))}
              </div>
              <Textarea
                value={recommendation}
                onChange={e => setRecommendation(e.target.value)}
                placeholder={t('purple.label.placeholder')}
                className="text-xs font-mono h-20 resize-none"
              />
              <Button onClick={handleSave} size="sm" className="w-full bg-cyber-purple text-white hover:bg-cyber-purple/80">
                {existing ? t('purple.label.update') : t('purple.label.save')}
              </Button>
            </div>

            {existing && (
              <div className="p-3 rounded border border-cyber-green/30 bg-cyber-green/5 space-y-1">
                <p className="text-[10px] text-cyber-green font-bold uppercase tracking-wider">{t('purple.label.saved')}</p>
                <p className={`text-xs font-bold ${RATING_COLOR[existing.rating].split(' ')[0]}`}>{t('purple.label.' + existing.rating)}</p>
                {existing.recommendation && <p className="text-xs text-muted-foreground">{existing.recommendation}</p>}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0} className="flex-1 gap-1">
                <ChevronLeft className="w-3 h-3" /> {t('purple.label.prev')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep + 1)} disabled={currentStep === totalSteps - 1} className="flex-1 gap-1">
                {t('purple.label.next')} <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </>
        )}

        {allAnnotated && (
          <div className="p-4 rounded border border-cyber-purple bg-cyber-purple/10 text-center space-y-1">
            <FileText className="w-6 h-6 text-cyber-purple mx-auto" />
            <p className="font-display text-sm font-bold text-cyber-purple">{t('purple.label.complete')}</p>
            <p className="text-xs text-muted-foreground">{t('purple.label.completeDesc', { total: String(totalSteps) })}</p>
          </div>
        )}
      </div>

      {/* Right: Summary */}
      <div className="w-56 border-l border-border p-3 space-y-4 shrink-0 overflow-auto">
        <p className="font-display text-xs font-bold text-cyber-purple tracking-wider">{t('purple.summary.title')}</p>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase">{t('purple.summary.progress')}</p>
          <p className="text-lg font-display font-bold text-foreground">{annotatedCount} / {totalSteps}</p>
          <div className="h-1 bg-muted rounded overflow-hidden">
            <div className="h-full bg-cyber-purple transition-all" style={{ width: `${(annotatedCount / totalSteps) * 100}%` }} />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase">{t('purple.summary.redScore')}</p>
          <p className="text-sm font-display font-bold text-cyber-red">{redScore}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase">{t('purple.summary.blueScore')}</p>
          <p className="text-sm font-display font-bold text-cyber-blue">{blueScore}</p>
        </div>

        {(['red', 'blue'] as const).map(team => (
          <div key={team} className="space-y-1">
            <p className={`text-[10px] uppercase font-bold ${team === 'red' ? 'text-cyber-red' : 'text-cyber-blue'}`}>
              {team === 'red' ? t('purple.summary.redTeam') : t('purple.summary.blueTeam')}
            </p>
            <div className="text-xs font-mono space-y-0.5">
              {(['effective', 'neutral', 'ineffective'] as const).map(r => (
                <div key={r} className="flex justify-between">
                  <span className={RATING_COLOR[r].split(' ')[0]}>{t('purple.label.' + r)}</span>
                  <span className="text-foreground">{countRating(team, r)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurpleTeamPanel;
