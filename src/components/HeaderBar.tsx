import React from 'react';
import { Volume2, VolumeX, Camera, Sparkles, Cpu } from 'lucide-react';
import { MaterialMode } from '../types';

interface HeaderBarProps {
  materialMode: MaterialMode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTakeScreenshot: () => void;
  activeServiceStatus: 'green' | 'yellow' | 'red' | 'blue';
}

const SerialBadge: React.FC = () => (
  <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest font-semibold uppercase bg-white/10 text-slate-300 rounded-md border border-white/10">
    SN: VCE-0X492A1-L640
  </span>
);

const BrandTitle: React.FC = () => (
  <div>
    <div className="flex items-center gap-2">
      <h1 className="text-sm font-bold tracking-wider uppercase font-mono text-white">
        VMware SD-WAN <span className="text-blue-400">Edge 640</span>
      </h1>
      <SerialBadge />
    </div>
    <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
      Interactive 3D Studio & Frosted Glass Diagnostics
    </p>
  </div>
);

const BrandHeader: React.FC = () => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
      <Cpu className="w-5 h-5" />
    </div>
    <BrandTitle />
  </div>
);

interface StatusBadgesProps {
  activeServiceStatus: 'green' | 'yellow' | 'red' | 'blue';
  materialMode: MaterialMode;
}

const StatusBadges: React.FC<StatusBadgesProps> = ({ activeServiceStatus, materialMode }) => {
  const getStatusBadge = () => {
    switch (activeServiceStatus) {
      case 'green':
        return { label: 'ACTIVATED & ONLINE', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'yellow':
        return { label: 'UNCONFIGURED / PENDING', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'red':
        return { label: 'WAN FAULT / OFFLINE', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'blue':
        return { label: 'HA STANDBY MODE', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="hidden md:flex items-center gap-3">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${statusBadge.bg}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
        {statusBadge.label}
      </div>

      {materialMode === 'predator' && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/40 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PREDATOR STEALTH CAMO</span>
        </div>
      )}
    </div>
  );
};

interface HeaderActionsProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTakeScreenshot: () => void;
}

const AudioIcon: React.FC<{ soundEnabled: boolean }> = ({ soundEnabled }) =>
  soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />;

const AudioButton: React.FC<{ soundEnabled: boolean; onToggleSound: () => void }> = ({ soundEnabled, onToggleSound }) => {
  const btnClass = soundEnabled
    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-100'
    : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300';
  const label = soundEnabled ? 'Audio On' : 'Muted';

  return (
    <button
      onClick={onToggleSound}
      className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors duration-200 flex items-center gap-2 backdrop-blur-md ${btnClass}`}
      title="Toggle Audio Feedback"
    >
      <AudioIcon soundEnabled={soundEnabled} />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
};

const ScreenshotButton: React.FC<{ onTakeScreenshot: () => void }> = ({ onTakeScreenshot }) => (
  <button
    onClick={onTakeScreenshot}
    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 text-xs font-mono transition-colors duration-200 flex items-center gap-2 backdrop-blur-md"
    title="Take 3D Snapshot"
  >
    <Camera className="w-4 h-4" />
    <span className="hidden lg:inline">Snapshot</span>
  </button>
);

const HeaderActions: React.FC<HeaderActionsProps> = ({
  soundEnabled,
  onToggleSound,
  onTakeScreenshot
}) => (
  <div className="flex items-center gap-2">
    <AudioButton soundEnabled={soundEnabled} onToggleSound={onToggleSound} />
    <ScreenshotButton onTakeScreenshot={onTakeScreenshot} />
  </div>
);

export const HeaderBar: React.FC<HeaderBarProps> = ({
  materialMode,
  soundEnabled,
  onToggleSound,
  onTakeScreenshot,
  activeServiceStatus
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/5 backdrop-blur-md border-b border-white/10 text-slate-100">
      <BrandHeader />
      <StatusBadges activeServiceStatus={activeServiceStatus} materialMode={materialMode} />
      <HeaderActions soundEnabled={soundEnabled} onToggleSound={onToggleSound} onTakeScreenshot={onTakeScreenshot} />
    </header>
  );
};
