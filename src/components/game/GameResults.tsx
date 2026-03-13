import { useGame } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, XCircle, RotateCcw, Home } from 'lucide-react';

const GameResults = () => {
  const { state, resetGame } = useGame();
  const navigate = useNavigate();

  if (!state) return null;

  const won = state.gameResult === 'win';
  const isRed = state.role === 'red';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background scanline">
      <div className="max-w-2xl w-full mx-4 p-8 rounded border border-border bg-card">
        <div className="text-center mb-8">
          {won ? (
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${isRed ? 'text-cyber-red' : 'text-cyber-blue'}`} />
          ) : (
            <XCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          )}
          <h1 className={`font-display text-3xl font-bold mb-2 ${
            won ? (isRed ? 'text-cyber-red text-glow-red' : 'text-cyber-blue text-glow-blue') : 'text-muted-foreground'
          }`}>
            {won ? 'ПЕРЕМОГА!' : 'ПОРАЗКА'}
          </h1>
          <p className="text-muted-foreground">
            {isRed
              ? won ? 'Секретний файл успішно отримано!' : 'Не вдалося отримати доступ до файлу.'
              : won ? 'Сервер захищено від усіх атак!' : 'Хакери скомпрометували систему.'
            }
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded bg-muted/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Очки</p>
            <p className="text-2xl font-display font-bold text-cyber-yellow">{state.score}</p>
          </div>
          <div className="p-4 rounded bg-muted/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Ходів</p>
            <p className="text-2xl font-display font-bold text-foreground">{state.turn - 1}</p>
          </div>
          <div className="p-4 rounded bg-muted/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Зламано</p>
            <p className="text-2xl font-display font-bold text-cyber-red">{state.compromisedAccounts.length}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-display text-sm font-bold text-foreground mb-3 tracking-wider">ІСТОРІЯ ДІЙ</h3>
          <div className="space-y-1 max-h-48 overflow-auto">
            {state.actionHistory.map((a, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-mono p-2 rounded bg-muted/20 border border-border/30">
                <div>
                  <span className="text-muted-foreground mr-2">#{a.turn}</span>
                  <span className="text-foreground">{a.action}</span>
                  <span className="text-muted-foreground ml-2">— {a.result}</span>
                </div>
                {a.pointsGained > 0 && (
                  <span className="text-cyber-yellow">+{a.pointsGained}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { resetGame(); navigate('/'); }} className="gap-2">
            <Home className="w-4 h-4" /> На головну
          </Button>
          <Button onClick={() => { resetGame(); navigate('/'); }} className="gap-2 bg-primary text-primary-foreground">
            <RotateCcw className="w-4 h-4" /> Грати знову
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
