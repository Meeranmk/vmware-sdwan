export type MaterialMode = 'default' | 'predator' | 'xray' | 'carbon' | 'gold' | 'hologram';

export type CameraPreset = 'overview' | 'front' | 'rear' | 'top' | 'ports' | 'exploded';

export interface PortInfo {
  id: string;
  name: string;
  type: 'rj45' | 'sfp' | 'console' | 'usb' | 'power' | 'antenna';
  speed: string;
  status: 'active' | 'standby' | 'disconnected' | 'fault';
  role: string;
  ipAddress?: string;
  trafficMbps?: number;
  description: string;
  position: [number, number, number];
}

export interface InternalComponent {
  id: string;
  name: string;
  specs: string;
  temperature?: number;
  description: string;
  position: [number, number, number];
}

export interface MaterialSettings {
  roughness: number;
  metalness: number;
  transmission: number;
  ior: number;
  stealthRippleSpeed: number;
  stealthFrequency: number;
  glowIntensity: number;
  wireframe: boolean;
  autoRotate: boolean;
}

export interface NetworkState {
  wan1Status: 'online' | 'degraded' | 'offline';
  wan2Status: 'online' | 'degraded' | 'offline';
  lteBackup: boolean;
  activeServiceStatus: 'green' | 'yellow' | 'red' | 'blue'; // Green=Activated, Yellow=Unactivated, Red=No WAN, Blue=HA Standby
  latencyMs: number;
  packetLoss: number;
  bandwidthUsageGbps: number;
  activeFlows: number;
}
