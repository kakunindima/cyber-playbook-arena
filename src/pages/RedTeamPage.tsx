import { useGame } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import GameHeader from '@/components/game/GameHeader';
import GameResults from '@/components/game/GameResults';
import RedTeamPanel from '@/components/game/RedTeamPanel';
import LogViewer from '@/components/game/LogViewer';

const RedTeamPage = () => {
  const { state } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || state.role !== 'red') navigate('/');
  }, [state, navigate]);

  if (!state) return null;
  if (state.isGameOver) return <GameResults />;

  return (
    <div className="h-screen flex flex-col bg-background scanline">
      <GameHeader />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <RedTeamPanel />
        </div>
        <div className="w-80 border-l border-border overflow-auto">
          <LogViewer />
        </div>
      </div>
    </div>
  );
};

export default RedTeamPage;
