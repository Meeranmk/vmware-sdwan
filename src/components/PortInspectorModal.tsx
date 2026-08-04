import React from 'react';
import { PortInfo, InternalComponent } from '../types';
import { X, Network, Zap, ShieldCheck, Activity, Cpu, HardDrive } from 'lucide-react';

interface PortInspectorModalProps {
  selectedPort: PortInfo | null;
  selectedComponent: InternalComponent | null;
  onClose: () => void;
}

export const PortInspectorModal: React.FC<PortInspectorModalProps> = ({
  selectedPort,
  selectedComponent,
  onClose
}) => {
  if (!selectedPort && !selectedComponent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl text-slate-100 flex flex-col gap-5">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* PORT INSPECTOR VIEW */}
        {selectedPort && (
          <>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300 rounded-md border border-blue-400/30">
                  {selectedPort.type.toUpperCase()} INTERFACE
                </span>
                <h3 className="text-lg font-bold font-mono text-white mt-0.5">{selectedPort.name}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block mb-1">Speed / Physical Standard</span>
                <span className="font-bold text-blue-300">{selectedPort.speed}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block mb-1">Configured IP Address</span>
                <span className="font-bold text-emerald-400">{selectedPort.ipAddress || 'DHCP / Dynamic'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs font-mono text-slate-400 block mb-1">Port Role & Assignment</span>
              <p className="text-xs font-mono font-bold text-amber-300">{selectedPort.role}</p>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/10">
              {selectedPort.description}
            </div>

            {/* Real-time Traffic Simulator Graph */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Live Packet Stream
                </span>
                <span className="text-blue-400 font-bold">{selectedPort.trafficMbps || 120} Mbps</span>
              </div>

              {/* Simulated Sine Wave Bar Graph */}
              <div className="h-10 flex items-end justify-between gap-1 pt-2">
                {[40, 65, 80, 50, 90, 75, 85, 95, 60, 70, 88, 100, 78, 82, 92, 60].map((h, i) => (
                  <div
                    key={i}
                    className="w-full bg-blue-500/80 rounded-t-sm transition-all duration-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* INTERNAL COMPONENT VIEW */}
        {selectedComponent && (
          <>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-400/30">
                  INTERNAL HARDWARE
                </span>
                <h3 className="text-lg font-bold font-mono text-white mt-0.5">{selectedComponent.name}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block mb-1">Hardware Specification</span>
                <span className="font-bold text-indigo-300">{selectedComponent.specs}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block mb-1">Thermal Sensor</span>
                <span className="font-bold text-emerald-400">{selectedComponent.temperature || 42}°C Optimal</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/10">
              {selectedComponent.description}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
