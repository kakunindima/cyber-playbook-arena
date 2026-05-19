import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLocale } from '@/i18n/LocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, Lock, AlertTriangle, Search, ShieldCheck, KeyRound, WifiOff, UserX } from 'lucide-react';

const BlueTeamPanel = () => {
  const { state, enableFirewall, enforce2FA, changePasswords, closePort, isolateAccount, analyzeLogs } = useGame();
  const { t } = useLocale();
  const [blockIp, setBlockIp] = useState('');
  const [isolateTarget, setIsolateTarget] = useState('');

  if (!state) return null;

  const compromisedCount = state.npcs.filter(n => n.isCompromised).length;
  const openVulnPorts = state.ports.filter(p => p.isOpen && p.vulnerability);

  return (
    <div className="space-y-4">
      {/* Security Dashboard */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded border border-border bg-card text-center">
          <p className="text-[10px] text-muted-foreground mb-1">{t('blue.stat.threats')}</p>
          <p className={`text-xl font-display font-bold ${state.detectedThreats.length > 0 ? 'text-cyber-red' : 'text-cyber-green'}`}>
            {state.detectedThreats.length}
          </p>
        </div>
        <div className="p-3 rounded border border-border bg-card text-center">
          <p className="text-[10px] text-muted-foreground mb-1">{t('blue.stat.compromised')}</p>
          <p className={`text-xl font-display font-bold ${compromisedCount > 0 ? 'text-cyber-red' : 'text-cyber-green'}`}>
            {compromisedCount}
          </p>
        </div>
        <div className="p-3 rounded border border-border bg-card text-center">
          <p className="text-[10px] text-muted-foreground mb-1">{t('status.2faOn')}</p>
          <p className={`text-xl font-display font-bold ${state.globalTwoFactor ? 'text-cyber-green' : 'text-cyber-yellow'}`}>
            {state.globalTwoFactor ? 'ON' : 'OFF'}
          </p>
        </div>
        <div className="p-3 rounded border border-border bg-card text-center">
          <p className="text-[10px] text-muted-foreground mb-1">{t('blue.stat.passwords')}</p>
          <p className={`text-xl font-display font-bold ${
            state.passwordPolicySeverity === 'strong' ? 'text-cyber-green' :
            state.passwordPolicySeverity === 'medium' ? 'text-cyber-yellow' : 'text-cyber-red'
          }`}>
            {state.passwordPolicySeverity === 'strong' ? '★★★' : state.passwordPolicySeverity === 'medium' ? '★★' : '★'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="monitor" className="h-full">
        <TabsList className="bg-muted/30 border border-border mb-4">
          <TabsTrigger value="monitor" className="text-xs gap-1 data-[state=active]:text-cyber-blue"><Activity className="w-3 h-3" /> {t('blue.tab.monitor')}</TabsTrigger>
          <TabsTrigger value="firewall" className="text-xs gap-1 data-[state=active]:text-cyber-blue"><Shield className="w-3 h-3" /> {t('blue.tab.firewall')}</TabsTrigger>
          <TabsTrigger value="security" className="text-xs gap-1 data-[state=active]:text-cyber-blue"><Lock className="w-3 h-3" /> {t('blue.tab.security')}</TabsTrigger>
          <TabsTrigger value="incident" className="text-xs gap-1 data-[state=active]:text-cyber-blue"><AlertTriangle className="w-3 h-3" /> {t('blue.tab.incident')}</TabsTrigger>
        </TabsList>

        {/* Monitoring */}
        <TabsContent value="monitor" className="space-y-4">
          <div className="p-4 rounded border border-border bg-card">
            <h3 className="font-display text-sm font-bold text-cyber-blue mb-4">{t('blue.monitor.title')}</h3>
            <Button onClick={analyzeLogs} className="w-full bg-cyber-blue text-cyber-blue-foreground hover:bg-cyber-blue/80 mb-4">
              <Search className="w-4 h-4 mr-2" /> {t('blue.monitor.analyze')}
            </Button>
            <h4 className="text-xs font-display font-bold text-foreground mb-2">{t('blue.monitor.users')}</h4>
            <div className="space-y-1">
              {state.npcs.map(n => (
                <div key={n.id} className={`flex items-center justify-between text-xs font-mono p-2 rounded border ${
                  n.isCompromised ? 'border-cyber-red/50 bg-cyber-red/5' : 'border-border/30 bg-muted/20'
                }`}>
                  <span>{n.avatar} {n.name} <span className="text-muted-foreground">({t('role.' + n.role)})</span></span>
                  <div className="flex gap-2">
                    {n.has2FA && <span className="text-cyber-green text-[10px]">{t('status.2faOn')}</span>}
                    {n.isCompromised && <span className="text-cyber-red text-[10px] font-bold">{t('status.compromised')}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Firewall */}
        <TabsContent value="firewall" className="space-y-4">
          <div className="p-4 rounded border border-border bg-card">
            <h3 className="font-display text-sm font-bold text-cyber-blue mb-4">{t('blue.firewall.title')}</h3>
            <div className="flex gap-2 mb-4">
              <Input
                value={blockIp}
                onChange={e => setBlockIp(e.target.value)}
                placeholder={t('blue.firewall.placeholder')}
                className="bg-muted text-foreground flex-1"
              />
              <Button
                onClick={() => { if (blockIp) { enableFirewall(blockIp); setBlockIp(''); } }}
                disabled={!blockIp}
                className="bg-cyber-blue text-cyber-blue-foreground hover:bg-cyber-blue/80"
              >
                {t('blue.firewall.block')}
              </Button>
            </div>

            <h4 className="text-xs font-display font-bold text-foreground mb-2">{t('blue.firewall.ipsFromLogs')}</h4>
            <div className="space-y-1">
              {[...new Set(state.logs.filter(l => l.ip).map(l => l.ip!))].map(ip => (
                <div key={ip} className="flex justify-between items-center text-xs font-mono p-2 rounded border border-border/30 bg-muted/20">
                  <span className="text-cyber-purple">{ip}</span>
                  {state.blockedIPs.includes(ip) ? (
                    <span className="text-cyber-red">{t('status.blocked')}</span>
                  ) : (
                    <Button size="sm" variant="outline" className="h-6 text-[10px] border-cyber-blue/30" onClick={() => enableFirewall(ip)}>
                      {t('blue.firewall.block')}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <h4 className="text-xs font-display font-bold text-foreground mb-2 mt-4">{t('blue.firewall.openPorts')}</h4>
            <div className="space-y-1">
              {state.ports.filter(p => p.isOpen).map(p => (
                <div key={p.port} className="flex justify-between items-center text-xs font-mono p-2 rounded border border-border/30 bg-muted/20">
                  <div>
                    <span className="text-cyber-green">{p.port}/{p.service}</span>
                    {p.vulnerability && <span className="text-cyber-yellow ml-2">⚠ {p.vulnerability}</span>}
                  </div>
                  <Button size="sm" variant="outline" className="h-6 text-[10px] border-cyber-blue/30" onClick={() => closePort(p.port)}>
                    <WifiOff className="w-3 h-3 mr-1" /> {t('blue.firewall.close')}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security Config */}
        <TabsContent value="security" className="space-y-4">
          <div className="p-4 rounded border border-border bg-card space-y-3">
            <h3 className="font-display text-sm font-bold text-cyber-blue mb-2">{t('blue.security.title')}</h3>
            <Button
              onClick={enforce2FA}
              disabled={state.globalTwoFactor}
              className="w-full bg-cyber-blue text-cyber-blue-foreground hover:bg-cyber-blue/80"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              {state.globalTwoFactor ? t('blue.security.2faOn') : t('blue.security.enable2fa')}
            </Button>
            <Button
              onClick={changePasswords}
              variant="outline"
              className="w-full border-cyber-blue/30 hover:bg-cyber-blue/10 text-foreground"
            >
              <KeyRound className="w-4 h-4 mr-2" /> {t('blue.security.changePasswords')}
            </Button>
          </div>
        </TabsContent>

        {/* Incident Response */}
        <TabsContent value="incident" className="space-y-4">
          <div className="p-4 rounded border border-border bg-card">
            <h3 className="font-display text-sm font-bold text-cyber-blue mb-4">{t('blue.incident.title')}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t('blue.incident.isolateLabel')}</label>
                <select
                  value={isolateTarget}
                  onChange={e => setIsolateTarget(e.target.value)}
                  className="w-full h-9 rounded border border-input bg-muted px-3 text-sm font-mono text-foreground mb-2"
                >
                  <option value="">{t('blue.incident.selectAccount')}</option>
                  {state.npcs.map(n => (
                    <option key={n.id} value={n.id}>
                      {n.avatar} {n.name} {n.isCompromised ? t('status.suspect') : ''}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={() => { if (isolateTarget) { isolateAccount(isolateTarget); setIsolateTarget(''); } }}
                  disabled={!isolateTarget}
                  className="w-full bg-cyber-blue text-cyber-blue-foreground hover:bg-cyber-blue/80"
                >
                  <UserX className="w-4 h-4 mr-2" /> {t('blue.incident.doIsolate')}
                </Button>
              </div>
              <div className="p-3 rounded bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground">{t('blue.incident.resolved')} <span className="text-cyber-green font-bold">{state.incidentsResolved}</span></p>
                <p className="text-xs text-muted-foreground">{t('blue.incident.blockedIPs')} <span className="text-cyber-blue font-bold">{state.blockedIPs.length}</span></p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlueTeamPanel;
