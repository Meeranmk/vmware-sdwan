import React from 'react';
import { MaterialSettings, MaterialMode } from '../types';
import { Sliders, RotateCw, Waves, Compass } from 'lucide-react';

interface ShaderControlsProps {
  materialMode: MaterialMode;
  settings: MaterialSettings;
  onChangeSettings: (newSettings: MaterialSettings) => void;
}

export const ShaderControls: React.FC<ShaderControlsProps> = ({
  materialMode,
  settings,
  onChangeSettings
}) => {
  const updateSetting = (key: keyof MaterialSettings, val: number | boolean) => {
    onChangeSettings({
      ...settings,
      [key]: val
    });
  };

  return (
    <div className="absolute top-20 right-6 z-30 w-72 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-slate-200 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-blue-400" /> Shader & Render Fine-Tuning
        </span>
      </div>

      {/* Auto Rotate Switch */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
        <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
          <RotateCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" /> Auto Turntable
        </span>
        <button
          onClick={() => updateSetting('autoRotate', !settings.autoRotate)}
          className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 ${
            settings.autoRotate ? 'bg-blue-500 justify-end' : 'bg-slate-800 justify-start'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-white shadow-md" />
        </button>
      </div>

      {/* Predator Camo Specific Tuning */}
      {materialMode === 'predator' && (
        <div className="flex flex-col gap-3.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between text-xs font-mono text-blue-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" /> Stealth Distortion IOR
            </span>
            <span>{settings.ior.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.2"
            step="0.02"
            value={settings.ior}
            onChange={e => updateSetting('ior', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />

          <div className="flex items-center justify-between text-xs font-mono text-blue-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Ripple Speed
            </span>
            <span>{settings.stealthRippleSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="6.0"
            step="0.1"
            value={settings.stealthRippleSpeed}
            onChange={e => updateSetting('stealthRippleSpeed', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />

          <div className="flex items-center justify-between text-xs font-mono text-blue-400 font-bold">
            <span>Hex Lattice Freq</span>
            <span>{settings.stealthFrequency.toFixed(0)}</span>
          </div>
          <input
            type="range"
            min="4"
            max="30"
            step="1"
            value={settings.stealthFrequency}
            onChange={e => updateSetting('stealthFrequency', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
        </div>
      )}
    </div>
  );
};
