import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Shield, Skull } from 'lucide-react';

const Index = () => {
  const [hovered, setHovered] = useState<'red' | 'blue' | null>(null);
  const { startGame } = useGame();
  const navigate = useNavigate();

  const handleSelect = (role: 'red' | 'blue') => {
    startGame(role);
    navigate(role === 'red' ? '/red-team' : '/blue-team');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background scanline relative overflow-hidden">
      {/* Background grid effect */}
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

      <div className="relative z-10 flex flex-col md:flex-row gap-8 px-4">
        {/* Red Team Card */}
        <button
          onClick={() => handleSelect('red')}
          onMouseEnter={() => setHovered('red')}
          onMouseLeave={() => setHovered(null)}
          className={`group relative w-80 p-8 rounded border transition-all duration-300 text-left
            ${hovered === 'red'
              ? 'border-cyber-red border-glow-red bg-cyber-red/10 scale-105'
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

        {/* VS */}
        <div className="flex items-center justify-center">
          <span className="font-display text-3xl text-muted-foreground font-bold">VS</span>
        </div>

        {/* Blue Team Card */}
        <button
          onClick={() => handleSelect('blue')}
          onMouseEnter={() => setHovered('blue')}
          onMouseLeave={() => setHovered(null)}
          className={`group relative w-80 p-8 rounded border transition-all duration-300 text-left
            ${hovered === 'blue'
              ? 'border-cyber-blue border-glow-blue bg-cyber-blue/10 scale-105'
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
