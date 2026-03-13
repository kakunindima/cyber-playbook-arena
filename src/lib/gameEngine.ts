import { GameState, LogEntry, NPC, PhishingEmail } from '@/types/game';

let logIdCounter = 1;
const nextLogId = () => `log_${logIdCounter++}`;
const currentTime = (turn: number) => {
  const h = 9 + Math.floor(turn * 0.5);
  const m = (turn % 2) * 30;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
};

function addLog(state: GameState, type: LogEntry['type'], source: string, message: string, ip?: string): LogEntry {
  const entry: LogEntry = { id: nextLogId(), timestamp: currentTime(state.turn), type, source, message, ip };
  state.logs = [...state.logs, entry];
  return entry;
}

// ============ RED TEAM ACTIONS ============

export function redScanPorts(state: GameState): GameState {
  const s = { ...state };
  const openPorts = s.ports.filter(p => p.isOpen);
  const vulnPorts = openPorts.filter(p => p.vulnerability);

  addLog(s, 'warning', 'firewall', `Виявлено сканування портів з IP 192.168.1.${100 + s.turn}`, `192.168.1.${100 + s.turn}`);

  let result = `Знайдено ${openPorts.length} відкритих портів.`;
  if (vulnPorts.length > 0) {
    result += ` Вразливості: ${vulnPorts.map(p => `${p.port}/${p.service} (${p.vulnerability})`).join(', ')}`;
  }

  s.score += 10;
  s.turn += 1;
  s.actionHistory = [...s.actionHistory, { turn: s.turn - 1, action: 'Сканування портів', result, pointsGained: 10 }];

  return checkGameOver(s);
}

export function redSendPhishing(state: GameState, email: PhishingEmail): GameState {
  const s = { ...state };
  const target = s.npcs.find(n => n.id === email.targetId);
  if (!target) return s;

  const hasKeywords = email.subject.toLowerCase().includes('терміново') ||
    email.subject.toLowerCase().includes('пароль') ||
    email.body.toLowerCase().includes('оновити') ||
    email.body.toLowerCase().includes('підтвердити');

  let successChance = target.trustLevel;
  if (hasKeywords) successChance += 15;
  if (target.has2FA) successChance -= 40;
  if (s.passwordPolicySeverity === 'strong') successChance -= 20;

  const roll = Math.random() * 100;
  const success = roll < successChance;

  if (success) {
    target.isCompromised = true;
    s.compromisedAccounts = [...s.compromisedAccounts, target.id];
    s.discoveredPasswords = { ...s.discoveredPasswords, [target.email]: target.password };

    if (target.role === 'admin') s.accessLevel = 'admin';
    else if (target.role === 'teacher' && s.accessLevel !== 'admin') s.accessLevel = 'teacher';
    else if (s.accessLevel === 'none') s.accessLevel = 'student';

    addLog(s, 'danger', 'email', `Користувач ${target.name} перейшов за фішинговим посиланням!`);
    s.score += 25;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Фішинг → ${target.name}`, result: `Успішно! Отримано пароль: ${target.password}`, pointsGained: 25 }];
  } else {
    addLog(s, 'info', 'email', `Користувач ${target.name} проігнорував підозрілий лист.`);
    if (Math.random() > 0.5) {
      addLog(s, 'warning', 'email', `${target.name} повідомив адміністратора про підозрілий лист!`);
    }
    s.score += 2;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Фішинг → ${target.name}`, result: 'Невдача — лист проігноровано', pointsGained: 2 }];
  }

  s.npcs = s.npcs.map(n => n.id === target.id ? target : n);
  s.turn += 1;
  return checkGameOver(s);
}

export function redSocialEngineering(state: GameState, targetId: string, approach: string): GameState {
  const s = { ...state };
  const target = s.npcs.find(n => n.id === targetId);
  if (!target) return s;

  let successChance = target.trustLevel * 0.8;
  if (approach === 'friendly') successChance += 10;
  if (approach === 'authority') successChance += (target.role === 'student' ? 20 : -10);
  if (approach === 'urgency') successChance += 15;

  const success = Math.random() * 100 < successChance;

  if (success) {
    const infoType = Math.random() > 0.5 ? 'password' : 'hint';
    if (infoType === 'password') {
      s.discoveredPasswords = { ...s.discoveredPasswords, [target.email]: target.password };
      s.score += 20;
      s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Соц. інженерія → ${target.name}`, result: `Отримано пароль: ${target.password}`, pointsGained: 20 }];
    } else {
      const hint = target.password.substring(0, 3) + '***';
      s.score += 10;
      s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Соц. інженерія → ${target.name}`, result: `Отримано підказку: "${hint}"`, pointsGained: 10 }];
    }
    addLog(s, 'info', 'chat', `${target.name} обмінювався повідомленнями з невідомим акаунтом.`);
  } else {
    addLog(s, 'warning', 'chat', `${target.name} повідомив про підозрілу розмову.`);
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Соц. інженерія → ${target.name}`, result: 'Невдача — користувач не довіряє', pointsGained: 0 }];
  }

  s.turn += 1;
  return checkGameOver(s);
}

export function redBruteforce(state: GameState, targetId: string): GameState {
  const s = { ...state };
  const target = s.npcs.find(n => n.id === targetId);
  if (!target) return s;

  let successChance = 40;
  if (s.passwordPolicySeverity === 'weak') successChance += 30;
  if (s.passwordPolicySeverity === 'strong') successChance -= 25;
  if (target.has2FA) successChance -= 40;

  const weakPasswords = ['qwerty123', 'anna2006', 'fizika123'];
  if (weakPasswords.includes(target.password)) successChance += 20;

  const blocked = s.blockedIPs.length > 0;
  if (blocked) successChance -= 30;

  addLog(s, 'danger', 'auth', `Множинні спроби входу в акаунт ${target.email}!`, `192.168.1.${100 + s.turn}`);

  const success = Math.random() * 100 < successChance;

  if (success) {
    target.isCompromised = true;
    s.compromisedAccounts = [...s.compromisedAccounts, target.id];
    s.discoveredPasswords = { ...s.discoveredPasswords, [target.email]: target.password };

    if (target.role === 'admin') s.accessLevel = 'admin';
    else if (target.role === 'teacher' && s.accessLevel !== 'admin') s.accessLevel = 'teacher';
    else if (s.accessLevel === 'none') s.accessLevel = 'student';

    addLog(s, 'danger', 'auth', `Успішний вхід в акаунт ${target.email} після брутфорсу!`);
    s.score += 20;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Брутфорс → ${target.name}`, result: `Успішно! Пароль: ${target.password}`, pointsGained: 20 }];
  } else {
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Брутфорс → ${target.name}`, result: 'Невдача — пароль не зламано', pointsGained: 0 }];
  }

  s.npcs = s.npcs.map(n => n.id === target.id ? target : n);
  s.turn += 1;
  return checkGameOver(s);
}

export function redSqlInjection(state: GameState): GameState {
  const s = { ...state };
  const mysqlPort = s.ports.find(p => p.port === 3306);
  const hasVuln = mysqlPort?.isOpen && mysqlPort?.vulnerability === 'default_credentials';

  addLog(s, 'danger', 'webapp', `SQL-ін\'єкція спроба через веб-форму!`, `192.168.1.${100 + s.turn}`);

  if (hasVuln) {
    s.accessLevel = s.accessLevel === 'none' ? 'student' : s.accessLevel;
    const dumped = s.npcs.slice(0, 3).map(n => ({ email: n.email, pwd: n.password }));
    dumped.forEach(d => { s.discoveredPasswords = { ...s.discoveredPasswords, [d.email]: d.pwd }; });
    addLog(s, 'danger', 'database', 'SQL-ін\'єкція успішна! Дамп таблиці users отримано.');
    s.score += 30;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: 'SQL-ін\'єкція', result: `Успішно! Отримано ${dumped.length} записів з БД`, pointsGained: 30 }];
  } else {
    addLog(s, 'info', 'webapp', 'SQL-ін\'єкція заблокована — параметризовані запити.');
    s.score += 3;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: 'SQL-ін\'єкція', result: 'Невдача — захист працює', pointsGained: 3 }];
  }

  s.turn += 1;
  return checkGameOver(s);
}

export function redAccessFile(state: GameState): GameState {
  const s = { ...state };

  if (s.accessLevel === 'admin') {
    s.secretFileAccessed = true;
    s.score += 50;
    addLog(s, 'danger', 'filesystem', 'Секретний файл "екзаменаційні_білети.pdf" було завантажено!');
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: 'Доступ до секретного файлу', result: 'УСПІХ! Файл отримано!', pointsGained: 50 }];
    s.isGameOver = true;
    s.gameResult = 'win';
  } else {
    addLog(s, 'warning', 'filesystem', `Спроба доступу до секретного файлу з рівнем "${s.accessLevel}" — відмовлено.`);
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: 'Доступ до секретного файлу', result: `Відмовлено — потрібен рівень admin (зараз: ${s.accessLevel})`, pointsGained: 0 }];
  }

  s.turn += 1;
  return checkGameOver(s);
}

// ============ BLUE TEAM ACTIONS ============

export function blueEnableFirewall(state: GameState, ip: string): GameState {
  const s = { ...state };
  s.firewallRules = [...s.firewallRules, { id: `fw_${Date.now()}`, ip, action: 'block', reason: 'Заблоковано вручну' }];
  s.blockedIPs = [...s.blockedIPs, ip];
  addLog(s, 'success', 'firewall', `IP ${ip} заблоковано.`);
  s.score += 10;
  s.turn += 1;
  s.actionHistory = [...s.actionHistory, { turn: s.turn - 1, action: `Блокування IP: ${ip}`, result: 'IP заблоковано успішно', pointsGained: 10 }];
  return checkGameOver(s);
}

export function blueEnforce2FA(state: GameState): GameState {
  const s = { ...state };
  s.globalTwoFactor = true;
  s.npcs = s.npcs.map(n => ({ ...n, has2FA: true }));
  addLog(s, 'success', 'security', 'Двофакторна автентифікація увімкнена для всіх акаунтів.');
  s.score += 20;
  s.turn += 1;
  s.actionHistory = [...s.actionHistory, { turn: s.turn - 1, action: 'Увімкнення 2FA', result: 'Всі акаунти тепер з 2FA', pointsGained: 20 }];
  return checkGameOver(s);
}

export function blueChangePasswords(state: GameState): GameState {
  const s = { ...state };
  const newPasswords = ['X#k9mP!2q', 'Zt$8nR@4w', 'Bv&7cL*3e', 'Hj%6dF^5y', 'Qm!4gS#8u', 'Wp$3hN@7r'];
  s.npcs = s.npcs.map((n, i) => ({ ...n, password: newPasswords[i] || `SecureP@ss${i}!` }));
  s.passwordPolicySeverity = 'strong';
  addLog(s, 'success', 'security', 'Усі паролі змінено на складні. Політика паролів: сильна.');
  s.score += 15;
  s.turn += 1;
  s.actionHistory = [...s.actionHistory, { turn: s.turn - 1, action: 'Зміна паролів', result: 'Всі паролі оновлено до складних', pointsGained: 15 }];
  return checkGameOver(s);
}

export function blueClosePort(state: GameState, port: number): GameState {
  const s = { ...state };
  s.ports = s.ports.map(p => p.port === port ? { ...p, isOpen: false, vulnerability: null } : p);
  addLog(s, 'success', 'network', `Порт ${port} закрито.`);
  s.score += 10;
  s.turn += 1;
  s.actionHistory = [...s.actionHistory, { turn: s.turn - 1, action: `Закриття порту ${port}`, result: 'Порт закрито успішно', pointsGained: 10 }];
  return checkGameOver(s);
}

export function blueIsolateAccount(state: GameState, npcId: string): GameState {
  const s = { ...state };
  const npc = s.npcs.find(n => n.id === npcId);
  if (!npc) return s;

  if (npc.isCompromised) {
    npc.isCompromised = false;
    s.compromisedAccounts = s.compromisedAccounts.filter(id => id !== npcId);
    s.incidentsResolved += 1;
    addLog(s, 'success', 'security', `Акаунт ${npc.name} ізольовано та відновлено.`);
    s.score += 20;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Ізоляція акаунту: ${npc.name}`, result: 'Скомпрометований акаунт відновлено', pointsGained: 20 }];
  } else {
    addLog(s, 'info', 'security', `Акаунт ${npc.name} перевірено — компрометації не виявлено.`);
    s.score += 2;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: `Ізоляція акаунту: ${npc.name}`, result: 'Акаунт чистий', pointsGained: 2 }];
  }

  s.npcs = s.npcs.map(n => n.id === npcId ? npc : n);
  s.turn += 1;
  return checkGameOver(s);
}

export function blueAnalyzeLogs(state: GameState): GameState {
  const s = { ...state };
  const threats = s.logs.filter(l => l.type === 'danger' || l.type === 'warning');
  const newThreats = threats.filter(t => !s.detectedThreats.includes(t.id));

  if (newThreats.length > 0) {
    s.detectedThreats = [...s.detectedThreats, ...newThreats.map(t => t.id)];
    s.score += newThreats.length * 5;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: 'Аналіз логів', result: `Виявлено ${newThreats.length} нових загроз`, pointsGained: newThreats.length * 5 }];
  } else {
    s.score += 2;
    s.actionHistory = [...s.actionHistory, { turn: s.turn, action: 'Аналіз логів', result: 'Нових загроз не знайдено', pointsGained: 2 }];
  }

  addLog(s, 'info', 'analyst', `Аналіз логів завершено. Всього загроз: ${s.detectedThreats.length}`);
  s.turn += 1;
  return checkGameOver(s);
}

// Blue team auto-attack simulation
export function simulateRedTeamAttack(state: GameState): GameState {
  const s = { ...state };
  const attacks = ['phishing', 'bruteforce', 'scan', 'sqli'];
  const attack = attacks[Math.floor(Math.random() * attacks.length)];

  const targetNpc = s.npcs[Math.floor(Math.random() * s.npcs.length)];
  const attackIp = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

  switch (attack) {
    case 'phishing':
      addLog(s, 'warning', 'email', `Підозрілий лист надіслано на ${targetNpc.email}`, attackIp);
      if (!targetNpc.has2FA && Math.random() * 100 < targetNpc.trustLevel) {
        targetNpc.isCompromised = true;
        s.compromisedAccounts = [...s.compromisedAccounts, targetNpc.id];
        addLog(s, 'danger', 'email', `${targetNpc.name} натиснув на фішингове посилання!`);
      }
      break;
    case 'bruteforce':
      addLog(s, 'danger', 'auth', `Брутфорс-атака на акаунт ${targetNpc.email}!`, attackIp);
      if (s.passwordPolicySeverity === 'weak' && !targetNpc.has2FA && Math.random() > 0.5) {
        targetNpc.isCompromised = true;
        s.compromisedAccounts = [...s.compromisedAccounts, targetNpc.id];
        addLog(s, 'danger', 'auth', `Акаунт ${targetNpc.email} зламано!`);
      }
      break;
    case 'scan':
      addLog(s, 'warning', 'firewall', 'Сканування портів з зовнішньої IP-адреси', attackIp);
      break;
    case 'sqli':
      addLog(s, 'danger', 'webapp', 'Спроба SQL-ін\'єкції через форму входу!', attackIp);
      break;
  }

  s.npcs = s.npcs.map(n => n.id === targetNpc.id ? targetNpc : n);
  return s;
}

function checkGameOver(state: GameState): GameState {
  const s = { ...state };

  if (s.role === 'red') {
    if (s.secretFileAccessed) {
      s.isGameOver = true;
      s.gameResult = 'win';
    } else if (s.turn > s.maxTurns) {
      s.isGameOver = true;
      s.gameResult = 'lose';
    }
  }

  if (s.role === 'blue') {
    if (s.turn > s.maxTurns) {
      s.isGameOver = true;
      const compromised = s.npcs.filter(n => n.isCompromised).length;
      s.gameResult = compromised === 0 ? 'win' : 'lose';
    }
  }

  return s;
}
