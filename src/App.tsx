import React, { useState } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { HeaderBar } from './components/HeaderBar';
import { ControlPanel } from './components/ControlPanel';
import { ShaderControls } from './components/ShaderControls';
import { DiagnosticsPanel } from './components/DiagnosticsPanel';
import { PortInspectorModal } from './components/PortInspectorModal';
import { MaterialMode, CameraPreset, MaterialSettings, NetworkState, PortInfo, InternalComponent } from './types';
import { soundEngine } from './utils/audio';

export default function App() {
  const [materialMode, setMaterialMode] = useState<MaterialMode>('default');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.45,
    metalness: 0.7,
    transmission: 0.8,
    ior: 1.15,
    stealthRippleSpeed: 2.0,
    stealthFrequency: 12.0,
    glowIntensity: 1.5,
    wireframe: false,
    autoRotate: true
  });

  const [networkState, setNetworkState] = useState<NetworkState>({
    wan1Status: 'online',
    wan2Status: 'online',
    lteBackup: true,
    activeServiceStatus: 'green',
    latencyMs: 14,
    packetLoss: 0.001,
    bandwidthUsageGbps: 1.8,
    activeFlows: 128
  });

  const [selectedPort, setSelectedPort] = useState<PortInfo | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<InternalComponent | null>(null);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
  };

  const handleSelectMaterialMode = (mode: MaterialMode) => {
    setMaterialMode(mode);
    if (mode === 'predator') {
      soundEngine.playStealthActivate();
    } else {
      soundEngine.playClick();
    }
  };

  const handleSelectCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    soundEngine.playClick();
    if (preset === 'exploded' && explodeFactor === 0) {
      setExplodeFactor(0.6);
    }
  };

  const handleTakeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    soundEngine.playClick();
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `VMware_SDWAN_Edge_640_${materialMode}_${Date.now()}.png`;
    link.href = image;
    link.click();
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* Ambient Frosted Glass Background Orbs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900 blur-[150px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] rounded-full bg-cyan-800 blur-[100px]"></div>
      </div>

      {/* 1. Header Bar */}
      <HeaderBar
        materialMode={materialMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onTakeScreenshot={handleTakeScreenshot}
        activeServiceStatus={networkState.activeServiceStatus}
      />

      {/* 2. Main 3D WebGL Canvas */}
      <main className="w-full h-full">
        <ThreeCanvas
          materialMode={materialMode}
          materialSettings={materialSettings}
          cameraPreset={cameraPreset}
          explodeFactor={explodeFactor}
          serviceLedStatus={networkState.activeServiceStatus}
          onSelectPort={(port) => {
            setSelectedPort(port);
            setSelectedComponent(null);
          }}
          onSelectComponent={(comp) => {
            setSelectedComponent(comp);
            setSelectedPort(null);
          }}
        />
      </main>

      {/* 3. Bottom-Left Control Panel (Angles, Exploded View, Material Presets) */}
      <ControlPanel
        cameraPreset={cameraPreset}
        onSelectCameraPreset={handleSelectCameraPreset}
        materialMode={materialMode}
        onSelectMaterialMode={handleSelectMaterialMode}
        explodeFactor={explodeFactor}
        onChangeExplodeFactor={setExplodeFactor}
      />

      {/* 4. Top-Right Shader Fine-Tuning Panel */}
      <ShaderControls
        materialMode={materialMode}
        settings={materialSettings}
        onChangeSettings={setMaterialSettings}
      />

      {/* 5. Bottom-Right Telemetry & Diagnostics Panel */}
      <DiagnosticsPanel
        networkState={networkState}
        onChangeNetworkState={setNetworkState}
      />

      {/* 6. Port & Component Raycasting Inspector Modal */}
      <PortInspectorModal
        selectedPort={selectedPort}
        selectedComponent={selectedComponent}
        onClose={() => {
          setSelectedPort(null);
          setSelectedComponent(null);
        }}
      />
    </div>
  );
}
