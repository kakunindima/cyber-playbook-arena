import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { TeamRole } from '@/types/game';
import { Shield, Skull, Eye } from 'lucide-react';

const ROUTES: Record<TeamRole, string> = {
  red: '/red-team',
  blue: '/blue-team',
  purple: '/purple-team',
};

const Index = () => {
  const [hovered, setHovered] = useState<TeamRole | null>(null);
  const { startGame } = useGame();
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

      <div className="relative z-10 text-center mb-12">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground text-glow-green mb-4 tracking-wider">
          CYBER ARENA
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-mono max-w-xl mx-auto">
          Навчальна симуляція з кібербезпеки. Оберіть свою роль.
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
            ${hovered === 'red'
              ? 'border-cyber-red bg-cyber-red/10 scale-105'
              : 'border-border bg-card hover:border-cyber-red/50'
            }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Skull className="w-8 h-8 text-cyber-red" />
            <h2 className="font-display text-2xl font-bold text-cyber-red text-glow-red">RED TEAM</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            🔴 Хакер — проникни на шкільний сервер та отримай доступ до секретного файлу.
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-cyber-red">▸</span> Фішинг-атаки</li>
            <li className="flex items-center gap-2"><span className="text-cyber-red">▸</span> Соціальна інженерія</li>
            <li className="flex items-center gap-2"><span className="text-cyber-red">▸</span> Брутфорс та SQL-ін'єкції</li>
            <li className="flex items-center gap-2"><span className="text-cyber-red">▸</span> Сканування портів</li>
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
            ${hovered === 'blue'
              ? 'border-cyber-blue bg-cyber-blue/10 scale-105'
              : 'border-border bg-card hover:border-cyber-blue/50'
            }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-cyber-blue" />
            <h2 className="font-display text-2xl font-bold text-cyber-blue text-glow-blue">BLUE TEAM</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            🔵 Захисник — захисти шкільний сервер від кібератак та збережи секретний файл.
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-cyber-blue">▸</span> Моніторинг логів</li>
            <li className="flex items-center gap-2"><span className="text-cyber-blue">▸</span> Налаштування firewall</li>
            <li className="flex items-center gap-2"><span className="text-cyber-blue">▸</span> Двофакторна автентифікація</li>
            <li className="flex items-center gap-2"><span className="text-cyber-blue">▸</span> Реагування на інциденти</li>
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
            ${hovered === 'purple'
              ? 'border-cyber-purple bg-cyber-purple/10 scale-105'
              : 'border-border bg-card hover:border-cyber-purple/50'
            }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-cyber-purple" />
            <h2 className="font-display text-2xl font-bold text-cyber-purple">PURPLE TEAM</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            🟣 Аналітик — спостерігай за операцією обох команд та оцінюй кожен крок.
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-cyber-purple">▸</span> Огляд хронології атаки</li>
            <li className="flex items-center gap-2"><span className="text-cyber-purple">▸</span> Аналіз ефективності дій</li>
            <li className="flex items-center gap-2"><span className="text-cyber-purple">▸</span> Рекомендації для обох команд</li>
            <li className="flex items-center gap-2"><span className="text-cyber-purple">▸</span> Підсумковий звіт операції</li>
          </ul>
          <div className={`absolute bottom-4 right-4 text-xs font-display transition-opacity ${hovered === 'purple' ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-cyber-purple animate-blink">[ ENTER ]</span>
          </div>
        </button>
      </div>

      <div className="relative z-10 mt-12 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Мета: отримати/захистити файл <span className="text-cyber-yellow">"екзаменаційні_білети.pdf"</span> на шкільному сервері
        </p>
      </div>
    </div>
  );
};

export default Index;
