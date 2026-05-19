import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLocale } from '@/i18n/LocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Terminal, FileKey, Scan, Database } from 'lucide-react';

const RedTeamPanel = () => {
  const { state, scanPorts, sendPhishing, socialEngineer, bruteforce, sqlInjection, accessFile } = useGame();
  const { t } = useLocale();
  const [phishTarget, setPhishTarget] = useState('');
  const [phishSubject, setPhishSubject] = useState('');
  const [phishBody, setPhishBody] = useState('');
  const [socialTarget, setSocialTarget] = useState('');
  const [socialApproach, setSocialApproach] = useState('friendly');
  const [bruteTarget, setBruteTarget] = useState('');

  if (!state) return null;

  return (
    <Tabs defaultValue="phishing" className="h-full">
      <TabsList className="bg-muted/30 border border-border mb-4">
        <TabsTrigger value="phishing" className="text-xs gap-1 data-[state=active]:text-cyber-red"><Mail className="w-3 h-3" /> {t('red.tab.phishing')}</TabsTrigger>
        <TabsTrigger value="social" className="text-xs gap-1 data-[state=active]:text-cyber-red"><MessageSquare className="w-3 h-3" /> {t('red.tab.social')}</TabsTrigger>
        <TabsTrigger value="technical" className="text-xs gap-1 data-[state=active]:text-cyber-red"><Terminal className="w-3 h-3" /> {t('red.tab.technical')}</TabsTrigger>
        <TabsTrigger value="access" className="text-xs gap-1 data-[state=active]:text-cyber-red"><FileKey className="w-3 h-3" /> {t('red.tab.access')}</TabsTrigger>
      </TabsList>

      {/* Phishing */}
      <TabsContent value="phishing" className="space-y-4">
        <div className="p-4 rounded border border-border bg-card">
          <h3 className="font-display text-sm font-bold text-cyber-red mb-4">{t('red.phishing.title')}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t('red.phishing.target')}</label>
              <select
                value={phishTarget}
                onChange={e => setPhishTarget(e.target.value)}
                className="w-full h-9 rounded border border-input bg-muted px-3 text-sm font-mono text-foreground"
              >
                <option value="">{t('red.phishing.selectTarget')}</option>
                {state.npcs.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.avatar} {n.name} ({t('role.' + n.role)}) — {t('role.trust')}: {n.trustLevel}%
                    {n.isCompromised ? ' ✓' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t('red.phishing.subject')}</label>
              <Input
                value={phishSubject}
                onChange={e => setPhishSubject(e.target.value)}
                placeholder={t('red.phishing.subjectPlaceholder')}
                className="bg-muted text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t('red.phishing.body')}</label>
              <Textarea
                value={phishBody}
                onChange={e => setPhishBody(e.target.value)}
                placeholder={t('red.phishing.bodyPlaceholder')}
                className="bg-muted text-foreground min-h-[100px]"
              />
            </div>
            <Button
              onClick={() => {
                if (!phishTarget || !phishSubject) return;
                sendPhishing({ targetId: phishTarget, subject: phishSubject, body: phishBody, linkUrl: 'http://fake-login.school.edu.ua', success: null });
                setPhishSubject('');
                setPhishBody('');
              }}
              disabled={!phishTarget || !phishSubject}
              className="w-full bg-cyber-red text-cyber-red-foreground hover:bg-cyber-red/80"
            >
              <Mail className="w-4 h-4 mr-2" /> {t('red.phishing.send')}
            </Button>
          </div>
        </div>

        {Object.keys(state.discoveredPasswords).length > 0 && (
          <div className="p-4 rounded border border-cyber-red/30 bg-cyber-red/5">
            <h4 className="text-xs font-display font-bold text-cyber-red mb-2">{t('red.phishing.passwords')}</h4>
            {Object.entries(state.discoveredPasswords).map(([email, pwd]) => (
              <div key={email} className="text-xs font-mono flex justify-between py-1 border-b border-border/30 last:border-0">
                <span className="text-muted-foreground">{email}</span>
                <span className="text-cyber-green">{pwd}</span>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Social Engineering */}
      <TabsContent value="social" className="space-y-4">
        <div className="p-4 rounded border border-border bg-card">
          <h3 className="font-display text-sm font-bold text-cyber-red mb-4">{t('red.social.title')}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t('red.social.target')}</label>
              <select
                value={socialTarget}
                onChange={e => setSocialTarget(e.target.value)}
                className="w-full h-9 rounded border border-input bg-muted px-3 text-sm font-mono text-foreground"
              >
                <option value="">{t('red.phishing.selectTarget')}</option>
                {state.npcs.map(n => (
                  <option key={n.id} value={n.id}>{n.avatar} {n.name} ({t('role.' + n.role)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t('red.social.approach')}</label>
              <div className="flex gap-2">
                {[
                  { val: 'friendly', key: 'red.social.friendly' },
                  { val: 'authority', key: 'red.social.authority' },
                  { val: 'urgency', key: 'red.social.urgency' },
                ].map(a => (
                  <button
                    key={a.val}
                    onClick={() => setSocialApproach(a.val)}
                    className={`flex-1 p-2 text-xs rounded border transition-all ${
                      socialApproach === a.val
                        ? 'border-cyber-red bg-cyber-red/10 text-cyber-red'
                        : 'border-border bg-muted text-muted-foreground hover:border-cyber-red/50'
                    }`}
                  >
                    {t(a.key)}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={() => socialTarget && socialEngineer(socialTarget, socialApproach)}
              disabled={!socialTarget}
              className="w-full bg-cyber-red text-cyber-red-foreground hover:bg-cyber-red/80"
            >
              <MessageSquare className="w-4 h-4 mr-2" /> {t('red.social.start')}
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Technical */}
      <TabsContent value="technical" className="space-y-4">
        <div className="p-4 rounded border border-border bg-card space-y-3">
          <h3 className="font-display text-sm font-bold text-cyber-red mb-2">{t('red.technical.title')}</h3>

          <Button onClick={scanPorts} variant="outline" className="w-full justify-start gap-2 border-cyber-red/30 hover:bg-cyber-red/10 text-foreground">
            <Scan className="w-4 h-4 text-cyber-red" /> {t('red.technical.scan')}
          </Button>

          <div className="border-t border-border pt-3">
            <label className="text-xs text-muted-foreground block mb-1">{t('red.technical.bruteLabel')}</label>
            <select
              value={bruteTarget}
              onChange={e => setBruteTarget(e.target.value)}
              className="w-full h-9 rounded border border-input bg-muted px-3 text-sm font-mono text-foreground mb-2"
            >
              <option value="">{t('red.technical.bruteSelect')}</option>
              {state.npcs.map(n => (
                <option key={n.id} value={n.id}>{n.avatar} {n.name} ({n.email})</option>
              ))}
            </select>
            <Button
              onClick={() => bruteTarget && bruteforce(bruteTarget)}
              disabled={!bruteTarget}
              variant="outline"
              className="w-full justify-start gap-2 border-cyber-red/30 hover:bg-cyber-red/10 text-foreground"
            >
              <Terminal className="w-4 h-4 text-cyber-red" /> {t('red.technical.runBrute')}
            </Button>
          </div>

          <Button onClick={sqlInjection} variant="outline" className="w-full justify-start gap-2 border-cyber-red/30 hover:bg-cyber-red/10 text-foreground">
            <Database className="w-4 h-4 text-cyber-red" /> {t('red.technical.sqli')}
          </Button>
        </div>

        <div className="p-4 rounded border border-border bg-card">
          <h4 className="text-xs font-display font-bold text-foreground mb-2">{t('red.technical.ports')}</h4>
          <div className="space-y-1">
            {state.ports.map(p => (
              <div key={p.port} className="flex justify-between text-xs font-mono py-1 border-b border-border/30">
                <span className={p.isOpen ? 'text-cyber-green' : 'text-muted-foreground'}>
                  {p.port}/{p.service}
                </span>
                <span className={p.isOpen ? 'text-cyber-green' : 'text-cyber-red'}>
                  {p.isOpen ? t('status.open') : t('status.closed')}
                </span>
                {p.vulnerability && <span className="text-cyber-yellow">{p.vulnerability}</span>}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Access */}
      <TabsContent value="access" className="space-y-4">
        <div className="p-4 rounded border border-border bg-card">
          <h3 className="font-display text-sm font-bold text-cyber-red mb-4">{t('red.access.title')}</h3>
          <div className="mb-4 p-3 rounded bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('red.access.currentLevel')}</p>
            <p className={`font-display font-bold text-lg ${
              state.accessLevel === 'admin' ? 'text-cyber-red' :
              state.accessLevel === 'teacher' ? 'text-cyber-yellow' :
              state.accessLevel === 'student' ? 'text-cyber-green' : 'text-muted-foreground'
            }`}>
              {state.accessLevel === 'none' ? t('red.access.noAccess') : state.accessLevel.toUpperCase()}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            {state.files.map(f => (
              <div key={f.id} className={`flex items-center justify-between text-xs font-mono p-2 rounded border ${
                f.isSecret ? 'border-cyber-yellow/30 bg-cyber-yellow/5' : 'border-border/30 bg-muted/20'
              }`}>
                <span className={f.isSecret ? 'text-cyber-yellow' : 'text-foreground'}>
                  {f.isSecret ? '🔒 ' : '📄 '}{f.path}
                </span>
                <span className="text-muted-foreground">[{f.accessLevel}]</span>
              </div>
            ))}
          </div>

          <Button onClick={accessFile} className="w-full bg-cyber-red text-cyber-red-foreground hover:bg-cyber-red/80">
            <FileKey className="w-4 h-4 mr-2" /> {t('red.access.getFile')}
          </Button>
          {state.accessLevel !== 'admin' && (
            <p className="text-xs text-cyber-yellow mt-2 text-center">{t('red.access.needAdmin')}</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RedTeamPanel;
