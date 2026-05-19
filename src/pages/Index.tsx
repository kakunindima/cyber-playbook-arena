import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { useLocale } from '@/i18n/LocaleContext';
import { TeamRole } from '@/types/game';
import { Shield, Skull, Eye, Globe } from 'lucide-react';

const ROUTES: Record<TeamRole, string> = {
  red: '/red-team',
  blue: '/blue-team',
  purple: '/purple-team',
};

const Index = () => {
  const [hovered, setHovered] = useState<TeamRole | null>(null);
  const { startGame } = useGame();
  const { locale, setLocale, t } = useLocale();
  const navigate = useNavigate();

  const handleSelect = (role: TeamRole) => {
    startGame(role);
    navigate(ROUTES[role]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background scanline relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(hsl(142 70% 45% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(142 70% 45% / 0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
        {(['uk', 'en'] as const).map(l => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
              locale === l
                ? 'border-primary text-foreground bg-primary/10'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="relative z-10 text-center mb-12">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground text-glow-green mb-4 tracking-wider">
          CYBER ARENA
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-mono max-w-xl mx-auto">
          {t('index.subtitle')}
        </p>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary to-transparent w-64 mx-auto" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 px-4 items-center">
        {/* Red Team */}
        <button
          onClick={() => handleSelect('red')}
          onMouseEnter={() => setHovered('red')}
          onMouseLeave={() => setHovered(null)}
          className={`group relative w-72 p-8 rounded border transition-all duration-300 text-left
            ${hovered === 'red' ? 'border-cyber-red bg-cyber-red/10 scale-105' : 'border-border bg-card hover:border-cyber-red/50'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Skull className="w-8 h-8 text-cyber-red" />
            <h2 className="font-display text-2xl font-bold text-cyber-red text-glow-red">RED TEAM</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{t('index.redDesc')}</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {['index.redBullet1', 'index.redBullet2', 'index.redBullet3', 'index.redBullet4'].map(k => (
              <li key={k} className="flex items-center gap-2"><span className="text-cyber-red">▸</span> {t(k)}</li>
            ))}
          </ul>
          <div className={`absolute bottom-4 right-4 text-xs font-display transition-opacity ${hovered === 'red' ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-cyber-red animate-blink">[ ENTER ]</span>
          </div>
        </button>

        <div className="flex items-center justify-center">
          <span className="font-display text-2xl text-muted-foreground font-bold">VS</span>
        </div>

        {/* Blue Team */}
        <button
          onClick={() => handleSelect('blue')}
          onMouseEnter={() => setHovered('blue')}
          onMouseLeave={() => setHovered(null)}
          className={`group relative w-72 p-8 rounded border transition-all duration-300 text-left
            ${hovered === 'blue' ? 'border-cyber-blue bg-cyber-blue/10 scale-105' : 'border-border bg-card hover:border-cyber-blue/50'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-cyber-blue" />
            <h2 className="font-display text-2xl font-bold text-cyber-blue text-glow-blue">BLUE TEAM</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{t('index.blueDesc')}</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {['index.blueBullet1', 'index.blueBullet2', 'index.blueBullet3', 'index.blueBullet4'].map(k => (
              <li key={k} className="flex items-center gap-2"><span className="text-cyber-blue">▸</span> {t(k)}</li>
            ))}
          </ul>
          <div className={`absolute bottom-4 right-4 text-xs font-display transition-opacity ${hovered === 'blue' ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-cyber-blue animate-blink">[ ENTER ]</span>
          </div>
        </button>

        <div className="flex items-center justify-center">
          <span className="font-display text-2xl text-muted-foreground font-bold">+</span>
        </div>

        {/* Purple Team */}
        <button
          onClick={() => handleSelect('purple')}
          onMouseEnter={() => setHovered('purple')}
          onMouseLeave={() => setHovered(null)}
          className={`group relative w-72 p-8 rounded border transition-all duration-300 text-left
            ${hovered === 'purple' ? 'border-cyber-purple bg-cyber-purple/10 scale-105' : 'border-border bg-card hover:border-cyber-purple/50'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-cyber-purple" />
            <h2 className="font-display text-2xl font-bold text-cyber-purple">PURPLE TEAM</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{t('index.purpleDesc')}</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {['index.purpleBullet1', 'index.purpleBullet2', 'index.purpleBullet3', 'index.purpleBullet4'].map(k => (
              <li key={k} className="flex items-center gap-2"><span className="text-cyber-purple">▸</span> {t(k)}</li>
            ))}
          </ul>
          <div className={`absolute bottom-4 right-4 text-xs font-display transition-opacity ${hovered === 'purple' ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-cyber-purple animate-blink">[ ENTER ]</span>
          </div>
        </button>
      </div>

      <div className="relative z-10 mt-12 text-center">
        <p className="text-xs text-muted-foreground font-mono">{t('index.goal')}</p>
      </div>
    </div>
  );
};

export default Index;
