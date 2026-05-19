export type TeamRole = 'red' | 'blue' | 'purple';

export interface NPC {
  id: string;
  name: string;
  role: 'teacher' | 'student' | 'admin';
  email: string;
  password: string;
  trustLevel: number; // 0-100, how likely to fall for phishing/social eng
  has2FA: boolean;
  isCompromised: boolean;
  avatar: string;
}

export interface ServerFile {
  id: string;
  name: string;
  path: string;
  isSecret: boolean;
  accessLevel: 'public' | 'teacher' | 'admin';
  isEncrypted: boolean;
}

export interface ServerPort {
  port: number;
  service: string;
  isOpen: boolean;
  vulnerability: string | null;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  source: string;
  message: string;
  ip?: string;
}

export interface FirewallRule {
  id: string;
  ip: string;
  action: 'allow' | 'block';
  reason: string;
}

export interface PhishingEmail {
  targetId: string;
  subject: string;
  body: string;
  linkUrl: string;
  success: boolean | null;
}

export interface PurpleTimelineEntry {
  id: string;
  turn: number;
  team: 'red' | 'blue';
  action: string;
  result: string;
  pointsGained: number;
  autoInsight: string;
}

export interface PurpleAnnotation {
  rating: 'effective' | 'neutral' | 'ineffective';
  recommendation: string;
}

export interface GameState {
  role: TeamRole;
  turn: number;
  maxTurns: number;
  score: number;
  timeRemaining: number;
  isGameOver: boolean;
  gameResult: 'win' | 'lose' | null;

  // Server state
  npcs: NPC[];
  files: ServerFile[];
  ports: ServerPort[];
  logs: LogEntry[];
  firewallRules: FirewallRule[];

  // Red team progress
  accessLevel: 'none' | 'student' | 'teacher' | 'admin';
  compromisedAccounts: string[];
  discoveredPasswords: Record<string, string>;
  secretFileAccessed: boolean;

  // Blue team state
  detectedThreats: string[];
  blockedIPs: string[];
  passwordPolicySeverity: 'weak' | 'medium' | 'strong';
  globalTwoFactor: boolean;
  incidentsResolved: number;

  // Action log
  actionHistory: ActionRecord[];

  // Purple team
  purpleTimeline: PurpleTimelineEntry[];
  purpleCurrentStep: number;
  purpleAnnotations: Record<number, PurpleAnnotation>;
}

export interface ActionRecord {
  turn: number;
  action: string;
  result: string;
  pointsGained: number;
}

export const INITIAL_NPCS: NPC[] = [
  { id: 'npc1', name: 'Олена Петренко', role: 'admin', email: 'o.petrenko@school.edu.ua', password: 'Admin2024!', trustLevel: 15, has2FA: false, isCompromised: false, avatar: '👩‍💼' },
  { id: 'npc2', name: 'Іван Коваленко', role: 'teacher', email: 'i.kovalenko@school.edu.ua', password: 'fizika123', trustLevel: 55, has2FA: false, isCompromised: false, avatar: '👨‍🏫' },
  { id: 'npc3', name: 'Марія Шевченко', role: 'teacher', email: 'm.shevchenko@school.edu.ua', password: 'Mariya1985', trustLevel: 40, has2FA: false, isCompromised: false, avatar: '👩‍🏫' },
  { id: 'npc4', name: 'Дмитро Бондаренко', role: 'student', email: 'd.bondarenko@school.edu.ua', password: 'qwerty123', trustLevel: 80, has2FA: false, isCompromised: false, avatar: '👨‍🎓' },
  { id: 'npc5', name: 'Анна Лисенко', role: 'student', email: 'a.lysenko@school.edu.ua', password: 'anna2006', trustLevel: 70, has2FA: false, isCompromised: false, avatar: '👩‍🎓' },
  { id: 'npc6', name: 'Тарас Мельник', role: 'teacher', email: 't.melnyk@school.edu.ua', password: 'Informatyka#1', trustLevel: 25, has2FA: false, isCompromised: false, avatar: '👨‍💻' },
];

export const INITIAL_FILES: ServerFile[] = [
  { id: 'f1', name: 'розклад.xlsx', path: '/public/розклад.xlsx', isSecret: false, accessLevel: 'public', isEncrypted: false },
  { id: 'f2', name: 'оцінки_11А.xlsx', path: '/teachers/оцінки_11А.xlsx', isSecret: false, accessLevel: 'teacher', isEncrypted: false },
  { id: 'f3', name: 'екзаменаційні_білети.pdf', path: '/admin/exams/екзаменаційні_білети.pdf', isSecret: true, accessLevel: 'admin', isEncrypted: true },
  { id: 'f4', name: 'бюджет_школи.xlsx', path: '/admin/бюджет_школи.xlsx', isSecret: false, accessLevel: 'admin', isEncrypted: false },
  { id: 'f5', name: 'домашнє_завдання.docx', path: '/public/домашнє_завдання.docx', isSecret: false, accessLevel: 'public', isEncrypted: false },
  { id: 'f6', name: 'паролі_wifi.txt', path: '/admin/паролі_wifi.txt', isSecret: false, accessLevel: 'admin', isEncrypted: false },
];

export const INITIAL_PORTS: ServerPort[] = [
  { port: 22, service: 'SSH', isOpen: true, vulnerability: null },
  { port: 80, service: 'HTTP', isOpen: true, vulnerability: 'outdated_apache' },
  { port: 443, service: 'HTTPS', isOpen: true, vulnerability: null },
  { port: 3306, service: 'MySQL', isOpen: true, vulnerability: 'default_credentials' },
  { port: 8080, service: 'Tomcat', isOpen: false, vulnerability: null },
  { port: 21, service: 'FTP', isOpen: true, vulnerability: 'anonymous_login' },
];

export function createInitialGameState(role: TeamRole): GameState {
  return {
    role,
    turn: 1,
    maxTurns: 15,
    score: 0,
    timeRemaining: 300,
    isGameOver: false,
    gameResult: null,
    npcs: INITIAL_NPCS.map(n => ({ ...n })),
    files: INITIAL_FILES.map(f => ({ ...f })),
    ports: INITIAL_PORTS.map(p => ({ ...p })),
    logs: [
      { id: 'log0', timestamp: '09:00:00', type: 'info', source: 'system', message: 'Сервер школи запущено. Всі системи працюють нормально.' },
    ],
    firewallRules: [],
    accessLevel: 'none',
    compromisedAccounts: [],
    discoveredPasswords: {},
    secretFileAccessed: false,
    detectedThreats: [],
    blockedIPs: [],
    passwordPolicySeverity: 'weak',
    globalTwoFactor: false,
    incidentsResolved: 0,
    actionHistory: [],
    purpleTimeline: [],
    purpleCurrentStep: 0,
    purpleAnnotations: {},
  };
}
