import { useGame } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import GameHeader from '@/components/game/GameHeader';
import PurpleTeamPanel from '@/components/game/PurpleTeamPanel';

const PurpleTeamPage = () => {
  const { state } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || state.role !== 'purple') navigate('/');
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className="h-screen flex flex-col bg-background scanline">
      <GameHeader />
      <div className="flex-1 overflow-hidden">
        <PurpleTeamPanel />
      </div>
    </div>
  );
};

export default PurpleTeamPage;
