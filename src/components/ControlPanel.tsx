import React from 'react';
import { CameraPreset, MaterialMode } from '../types';
import { Camera, Eye, Layers, Sparkles, Box, Shield, Zap, Activity } from 'lucide-react';

interface CameraPresetOption {
  id: CameraPreset;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const CAMERA_PRESETS: CameraPresetOption[] = [
  { id: 'overview', label: '3D Overview', Icon: Camera },
  { id: 'front', label: 'Front Panel', Icon: Eye },
  { id: 'rear', label: 'Rear Ports', Icon: Box },
  { id: 'top', label: 'Top View', Icon: Layers },
  { id: 'ports', label: 'Port Zoom', Icon: Zap },
  { id: 'exploded', label: 'Exploded', Icon: Activity }
];

interface MaterialModeOption {
  id: MaterialMode;
  label: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconColorClass: string;
  colorClass: string;
}

const MATERIAL_MODES: MaterialModeOption[] = [
  { id: 'default', label: 'Factory White', desc: 'Enterprise Arctic White Finish', Icon: Box, iconColorClass: 'text-slate-100', colorClass: 'hover:border-slate-300' },
  { id: 'predator', label: 'Predator Cloak', desc: 'Refractive Optical Camouflage Shader', Icon: Sparkles, iconColorClass: 'text-cyan-400', colorClass: 'hover:border-cyan-400 text-cyan-400' },
  { id: 'xray', label: 'X-Ray Thermal', desc: 'Internal Heat Radiation Map', Icon: Shield, iconColorClass: 'text-rose-400', colorClass: 'hover:border-rose-400 text-rose-400' },
  { id: 'hologram', label: 'Cyber Matrix', desc: 'Digital Holographic Scanline Grid', Icon: Layers, iconColorClass: 'text-emerald-400', colorClass: 'hover:border-emerald-400 text-emerald-400' },
  { id: 'carbon', label: 'Stealth Carbon', desc: 'High-Gloss Carbon Fiber Matrix', Icon: Box, iconColorClass: 'text-slate-300', colorClass: 'hover:border-slate-400' },
  { id: 'gold', label: 'Titanium Gold', desc: 'Specularity & Metallic Polish', Icon: Zap, iconColorClass: 'text-amber-400', colorClass: 'hover:border-amber-400 text-amber-400' }
];

interface ControlPanelProps {
  cameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  materialMode: MaterialMode;
  onSelectMaterialMode: (mode: MaterialMode) => void;
  explodeFactor: number;
  onChangeExplodeFactor: (factor: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  cameraPreset,
  onSelectCameraPreset,
  materialMode,
  onSelectMaterialMode,
  explodeFactor,
  onChangeExplodeFactor
}) => {
  return (
    <aside className="absolute bottom-6 left-6 z-30 w-80 md:w-96 p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-slate-200 flex flex-col gap-5">
      {/* 1. Camera View Angles */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
            <Camera className="w-3.5 h-3.5 text-blue-400" /> View Angle Presets
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {CAMERA_PRESETS.map(preset => {
            const PresetIcon = preset.Icon;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectCameraPreset(preset.id)}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-mono font-medium border transition-all duration-200 ${
                  cameraPreset === preset.id
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border-white/10'
                }`}
              >
                <PresetIcon className="w-3.5 h-3.5" />
                <span className="truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Exploded Assembly Slider */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Exploded View Assembly
          </span>
          <span className="text-xs font-mono text-blue-400 font-bold">
            {Math.round(explodeFactor * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={explodeFactor}
          onChange={e => onChangeExplodeFactor(parseFloat(e.target.value))}
          aria-label="Exploded view assembly factor"
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>0% Assembled</span>
          <span>50% PCB Inspect</span>
          <span>100% Full Explode</span>
        </div>
      </div>

      {/* 3. Material & Shader Presets */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Material Shaders (Predator Lab)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {MATERIAL_MODES.map(mode => {
            const ModeIcon = mode.Icon;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMaterialMode(mode.id)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${
                  materialMode === mode.id
                    ? 'bg-white/10 border-blue-400 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/50'
                    : `bg-white/5 text-slate-400 border-white/10 ${mode.colorClass}`
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <ModeIcon className={`w-4 h-4 ${mode.iconColorClass}`} />
                  <span className="text-xs font-mono font-bold text-slate-200">{mode.label}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug line-clamp-1">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
