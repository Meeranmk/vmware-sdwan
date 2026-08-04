import React from 'react';
import { NetworkState } from '../types';
import { Activity, Wifi, ShieldAlert, Radio, Zap, ArrowRightLeft, Server } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DiagnosticsPanelProps {
  networkState: NetworkState;
  onChangeNetworkState: (newState: NetworkState) => void;
}

export const DiagnosticsPanel: React.FC<DiagnosticsPanelProps> = ({
  networkState,
  onChangeNetworkState
}) => {
  const toggleWan1 = () => {
    const next = networkState.wan1Status === 'online' ? 'offline' : 'online';
    updateWanStatuses(next, networkState.wan2Status, networkState.lteBackup);
  };

  const toggleWan2 = () => {
    const next = networkState.wan2Status === 'online' ? 'offline' : 'online';
    updateWanStatuses(networkState.wan1Status, next, networkState.lteBackup);
  };

  const toggleLte = () => {
    updateWanStatuses(networkState.wan1Status, networkState.wan2Status, !networkState.lteBackup);
  };

  const updateWanStatuses = (w1: 'online' | 'degraded' | 'offline', w2: 'online' | 'degraded' | 'offline', lte: boolean) => {
    let serviceLed: 'green' | 'yellow' | 'red' | 'blue' = 'green';
    let latency = 14;
    let packetLoss = 0.001;

    if (w1 === 'offline' && w2 === 'offline' && !lte) {
      serviceLed = 'red';
      latency = 999;
      packetLoss = 100.0;
    } else if (w1 === 'offline' || w2 === 'offline') {
      serviceLed = 'yellow';
      latency = 38;
      packetLoss = 0.12;
    }

    soundEngine.playStatusChange(serviceLed);

    onChangeNetworkState({
      ...networkState,
      wan1Status: w1,
      wan2Status: w2,
      lteBackup: lte,
      activeServiceStatus: serviceLed,
      latencyMs: latency,
      packetLoss: packetLoss
    });
  };

  const triggerHaMode = () => {
    const newLed = networkState.activeServiceStatus === 'blue' ? 'green' : 'blue';
    soundEngine.playStatusChange(newLed);
    onChangeNetworkState({
      ...networkState,
      activeServiceStatus: newLed
    });
  };

  return (
    <div className="absolute bottom-6 right-6 z-30 w-80 md:w-96 p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-slate-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-400" /> DMPO SD-WAN Telemetry
        </span>
        <button
          onClick={triggerHaMode}
          className={`px-2 py-0.5 text-[10px] font-mono rounded-md border transition-all ${
            networkState.activeServiceStatus === 'blue'
              ? 'bg-sky-500/20 text-sky-300 border-sky-400'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
          }`}
        >
          {networkState.activeServiceStatus === 'blue' ? 'HA Active' : 'Set HA Mode'}
        </button>
      </div>

      {/* WAN Uplink Status Toggles */}
      <div className="grid grid-cols-3 gap-2">
        {/* WAN 1 */}
        <button
          onClick={toggleWan1}
          className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
            networkState.wan1Status === 'online'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold">WAN 1 GE3</span>
            <span className={`w-2 h-2 rounded-full ${networkState.wan1Status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          </div>
          <span className="text-xs font-mono font-bold">{networkState.wan1Status === 'online' ? 'Fiber 1G' : 'Down'}</span>
        </button>

        {/* WAN 2 */}
        <button
          onClick={toggleWan2}
          className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
            networkState.wan2Status === 'online'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold">WAN 2 GE4</span>
            <span className={`w-2 h-2 rounded-full ${networkState.wan2Status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          </div>
          <span className="text-xs font-mono font-bold">{networkState.wan2Status === 'online' ? 'BB 1G' : 'Down'}</span>
        </button>

        {/* LTE */}
        <button
          onClick={toggleLte}
          className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
            networkState.lteBackup
              ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
              : 'bg-white/5 border-white/10 text-slate-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold">4G/5G LTE</span>
            <Radio className="w-3 h-3" />
          </div>
          <span className="text-xs font-mono font-bold">{networkState.lteBackup ? 'Active' : 'Standby'}</span>
        </button>
      </div>

      {/* Dynamic Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-center font-mono">
        <div>
          <span className="text-[10px] text-slate-400">RTT Latency</span>
          <div className="text-sm font-bold text-blue-400">{networkState.latencyMs} ms</div>
        </div>
        <div>
          <span className="text-[10px] text-slate-400">Packet Loss</span>
          <div className="text-sm font-bold text-blue-400">{networkState.packetLoss}%</div>
        </div>
        <div>
          <span className="text-[10px] text-slate-400">Throughput</span>
          <div className="text-sm font-bold text-emerald-400">1.8 Gbps</div>
        </div>
      </div>

      {/* Live DMPO Path Steering Info */}
      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" /> DMPO Overlay Tunnels
        </span>
        <span className="text-blue-300 font-bold">128 Flows Active</span>
      </div>
    </div>
  );
};
