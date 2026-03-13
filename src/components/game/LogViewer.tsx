import { useGame } from '@/contexts/GameContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const LogViewer = () => {
  const { state } = useGame();
  if (!state) return null;

  const typeStyles: Record<string, string> = {
    info: 'text-cyber-green',
    warning: 'text-cyber-yellow',
    danger: 'text-cyber-red',
    success: 'text-cyber-blue',
  };

  const typeLabels: Record<string, string> = {
    info: 'INFO',
    warning: 'WARN',
    danger: 'CRIT',
    success: 'OK',
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-display text-xs font-bold text-foreground tracking-wider">СИСТЕМНІ ЛОГИ</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {[...state.logs].reverse().map(log => (
            <div key={log.id} className="text-[10px] font-mono p-1.5 rounded bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-muted-foreground">{log.timestamp}</span>
                <span className={`font-bold ${typeStyles[log.type]}`}>[{typeLabels[log.type]}]</span>
                <span className="text-muted-foreground">{log.source}</span>
                {log.ip && <span className="text-cyber-purple">{log.ip}</span>}
              </div>
              <p className={typeStyles[log.type]}>{log.message}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LogViewer;
