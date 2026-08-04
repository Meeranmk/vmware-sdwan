import * as THREE from 'three';
import { PortInfo, InternalComponent } from '../types';

export const PORTS_DATA: PortInfo[] = [
  {
    id: 'ge1',
    name: 'GE1 (LAN / WAN)',
    type: 'rj45',
    speed: '1 Gbps RJ45 Copper',
    status: 'active',
    role: 'LAN Gateway (192.168.1.1/24)',
    ipAddress: '192.168.1.1',
    trafficMbps: 240,
    description: 'Gigabit Ethernet Copper Port 1. Multi-role interface for local corporate LAN subnet or secondary WAN uplink.',
    position: [-2.1, 0, -1.9]
  },
  {
    id: 'ge2',
    name: 'GE2 (LAN)',
    type: 'rj45',
    speed: '1 Gbps RJ45 Copper',
    status: 'active',
    role: 'Local LAN Switch Port',
    ipAddress: '192.168.2.1',
    trafficMbps: 180,
    description: 'Gigabit Ethernet Copper Port 2. Assigned for local branch switch trunking with 802.1Q VLAN support.',
    position: [-1.5, 0, -1.9]
  },
  {
    id: 'ge3',
    name: 'GE3 (WAN 1 - Primary)',
    type: 'rj45',
    speed: '1 Gbps RJ45 Copper',
    status: 'active',
    role: 'Primary Internet WAN Uplink',
    ipAddress: '203.0.113.45',
    trafficMbps: 650,
    description: 'Default primary WAN Uplink interface connected to Fiber ISP. Supports Dynamic Multipath Optimization (DMPO) overlay tunnels.',
    position: [-0.9, 0, -1.9]
  },
  {
    id: 'ge4',
    name: 'GE4 (WAN 2 - Secondary)',
    type: 'rj45',
    speed: '1 Gbps RJ45 Copper',
    status: 'active',
    role: 'Secondary Broadband WAN Uplink',
    ipAddress: '198.51.100.88',
    trafficMbps: 420,
    description: 'Secondary WAN Broadband interface with automatic DMPO sub-second failover and packet steering.',
    position: [-0.3, 0, -1.9]
  },
  {
    id: 'ge5',
    name: 'GE5 (LAN / HA Sync)',
    type: 'rj45',
    speed: '1 Gbps RJ45 Copper',
    status: 'standby',
    role: 'High Availability Heartbeat',
    ipAddress: '169.254.10.1',
    trafficMbps: 12,
    description: 'Dedicated HA sync link for redundant dual Edge 640 deployment with stateful session mirroring.',
    position: [0.3, 0, -1.9]
  },
  {
    id: 'ge6',
    name: 'GE6 (Routed LAN)',
    type: 'rj45',
    speed: '1 Gbps RJ45 Copper',
    status: 'active',
    role: 'Guest / IoT Isolated Segment',
    ipAddress: '172.16.50.1',
    trafficMbps: 95,
    description: 'Isolated guest network interface with cloud security firewall policies applied.',
    position: [0.9, 0, -1.9]
  },
  {
    id: 'sfp1',
    name: 'SFP+ 1 (10GbE WAN)',
    type: 'sfp',
    speed: '10 Gbps SFP+ Optical',
    status: 'active',
    role: 'High-Speed Metro Ethernet / MPLS',
    ipAddress: '10.250.0.14',
    trafficMbps: 2800,
    description: '10 Gigabit SFP+ Optical Transceiver slot for high-density core WAN backhaul or MPLS direct circuit.',
    position: [1.6, 0, -1.9]
  },
  {
    id: 'sfp2',
    name: 'SFP+ 2 (10GbE LAN)',
    type: 'sfp',
    speed: '10 Gbps SFP+ Optical',
    status: 'standby',
    role: 'Core Switch Fiber Trunk',
    ipAddress: '10.250.1.1',
    trafficMbps: 0,
    description: '10 Gigabit SFP+ Optical Transceiver slot configured for 10G fiber LAN trunking to core switch stacks.',
    position: [2.2, 0, -1.9]
  },
  {
    id: 'console',
    name: 'Micro-USB Console',
    type: 'console',
    speed: '115200 Baud UART',
    status: 'active',
    role: 'Out-of-Band BIOS & CLI Access',
    description: 'Micro-USB serial console port for local out-of-band management, zero-touch provisioning debugging, and recovery console.',
    position: [2.8, 0, -1.9]
  },
  {
    id: 'usb1',
    name: 'USB 3.0 (Left)',
    type: 'usb',
    speed: '5 Gbps USB 3.0',
    status: 'active',
    role: 'External LTE Dongle / Storage',
    description: 'USB 3.0 SuperSpeed port supporting external 4G/5G cellular modems or USB flash provisioning drives.',
    position: [-2.7, 0, -1.9]
  },
  {
    id: 'power',
    name: '12V DC Locking Power',
    type: 'power',
    speed: '12V / 5A (60W Peak)',
    status: 'active',
    role: 'AC-DC Power Supply Input',
    description: 'Threaded locking 12V DC power receptacle preventing accidental cable disconnects in high-vibration rack deployments.',
    position: [3.3, 0, -1.9]
  },
  {
    id: 'antenna_left',
    name: 'Wi-Fi / LTE Antenna 1',
    type: 'antenna',
    speed: 'Dual-Band 2.4/5GHz + LTE',
    status: 'active',
    role: 'Wireless Transceiver Array',
    description: 'RP-SMA threaded brass post with 5dBi omnidirectional dipole antenna supporting Wi-Fi 6 & cellular fallback.',
    position: [-3.3, 0.6, -1.8]
  },
  {
    id: 'antenna_right',
    name: 'Wi-Fi / LTE Antenna 2',
    type: 'antenna',
    speed: 'Dual-Band 2.4/5GHz + LTE',
    status: 'active',
    role: 'Wireless Transceiver Array',
    description: 'RP-SMA threaded brass post with 5dBi omnidirectional dipole antenna supporting MIMO spatial diversity.',
    position: [3.3, 0.6, -1.8]
  }
];

export const INTERNAL_COMPONENTS: InternalComponent[] = [
  {
    id: 'cpu',
    name: 'Intel Atom C-3000 x86 SoC',
    specs: '8 Cores, QuickAssist Tech, 2.2GHz',
    temperature: 46,
    description: 'High-performance x86 enterprise network processor with hardware crypto acceleration for DMPO IPsec tunnels.',
    position: [0, 0.4, 0]
  },
  {
    id: 'heatsink',
    name: 'Anodized Heatsink & Heatpipes',
    specs: 'Passive Aluminum & Copper Stack',
    temperature: 44,
    description: 'Fanless acoustic-silent extruded aluminum thermal heatsink providing 24/7 continuous branch operation.',
    position: [0, 0.65, 0]
  },
  {
    id: 'ssd',
    name: 'M.2 SATA SSD Drive',
    specs: '240GB Enterprise Industrial NVMe/SATA',
    temperature: 38,
    description: 'Onboard industrial SSD storing VMware SD-WAN Edge OS, local traffic logs, cache, and VeloCloud Orchestrator configs.',
    position: [-1.8, 0.35, 0.8]
  },
  {
    id: 'ram',
    name: 'Dual DDR4 SODIMM Memory',
    specs: '16GB ECC DDR4-2400MHz',
    temperature: 41,
    description: 'ECC system memory providing multi-tenant packet buffers, deep packet inspection (DPI) tables, and routing engine RAM.',
    position: [1.8, 0.35, 0.5]
  },
  {
    id: 'pcb',
    name: 'Enterprise Motherboard PCB',
    specs: '8-Layer Heavy Copper Fiberglass PCB',
    temperature: 37,
    description: 'Multi-layer system board housing Ethernet PHY switches, power regulators, clock generators, and firmware chips.',
    position: [0, 0.1, 0]
  }
];

export class SDWan640Model {
  public group: THREE.Group;
  public topCoverGroup: THREE.Group;
  public internalGroup: THREE.Group;
  public portsGroup: THREE.Group;
  public ledsGroup: THREE.Group;
  public serviceLedMesh: THREE.Mesh | null = null;
  public serviceLedLight: THREE.PointLight | null = null;
  public portLedLights: THREE.PointLight[] = [];

  // Interactive meshes array for Raycasting
  public raycastMeshes: THREE.Mesh[] = [];

  // Materials map for dynamic mode updates
  private materials: { [key: string]: THREE.Material } = {};
  public currentMaterialMode: string = 'default';

  constructor() {
    this.group = new THREE.Group();
    this.topCoverGroup = new THREE.Group();
    this.internalGroup = new THREE.Group();
    this.portsGroup = new THREE.Group();
    this.ledsGroup = new THREE.Group();

    this.group.add(this.topCoverGroup);
    this.group.add(this.internalGroup);
    this.group.add(this.portsGroup);
    this.group.add(this.ledsGroup);

    this.initMaterials();
    this.buildModel();
  }

  private initMaterials() {
    // Factory Pure White / Arctic White Enterprise Chassis
    this.materials.chassisMatte = new THREE.MeshStandardMaterial({
      color: 0xf0f4f8,
      roughness: 0.35,
      metalness: 0.15,
      envMapIntensity: 1.2
    });

    // Front Acrylic Bezel (Sleek Glossy Ice White Accent)
    this.materials.bezelGloss = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    // Silver Metal Accents (Side Grills, RJ45 Cages, SFP Latches)
    this.materials.metalSilver = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.25,
      metalness: 0.85
    });

    // Gold Pins & Antenna Rings
    this.materials.gold = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.85
    });

    // Motherboard PCB (Dark Forest / Black PCB)
    this.materials.pcbBoard = new THREE.MeshStandardMaterial({
      color: 0x0b2818,
      roughness: 0.6,
      metalness: 0.3
    });

    // Heatsink Anodized Dark Metal
    this.materials.heatsink = new THREE.MeshStandardMaterial({
      color: 0x222630,
      roughness: 0.35,
      metalness: 0.85
    });

    // Blue Accents (Console port insulator, USB 3.0 insulator)
    this.materials.blueAccent = new THREE.MeshStandardMaterial({
      color: 0x0070f3,
      roughness: 0.3,
      metalness: 0.5
    });

    // VMware / Dell Logo Plate
    this.materials.logoPlate = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.8
    });

    // Service Status LED (Initial Active Green)
    this.materials.serviceLed = new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00ff66,
      emissiveIntensity: 1.5,
      roughness: 0.2
    });

    // Link Amber/Green Port LEDs
    this.materials.portLedActive = new THREE.MeshStandardMaterial({
      color: 0x00ff44,
      emissive: 0x00ff44,
      emissiveIntensity: 1.2
    });
  }

  private buildModel() {
    // Dimensions of Edge 640 Chassis: W=7.2 (x: -3.6 to +3.6), H=1.4 (y: -0.7 to +0.7), D=4.0 (z: -2.0 to +2.0)
    const width = 7.2;
    const height = 1.2;
    const depth = 4.0;

    // 1. BOTTOM CHASSIS BASE
    const baseGeo = new THREE.BoxGeometry(width, 0.2, depth);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.chassisMatte);
    baseMesh.position.y = -0.5;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);

    // Rubber Feet (4 corners)
    const feetPositions: [number, number, number][] = [
      [-3.1, -0.65, -1.6],
      [3.1, -0.65, -1.6],
      [-3.1, -0.65, 1.6],
      [3.1, -0.65, 1.6]
    ];
    feetPositions.forEach(pos => {
      const footGeo = new THREE.CylinderGeometry(0.25, 0.22, 0.1, 16);
      const footMesh = new THREE.Mesh(footGeo, new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.9 }));
      footMesh.position.set(...pos);
      this.group.add(footMesh);
    });

    // 2. TOP COVER (Lifts in exploded view)
    const lidGeo = new THREE.BoxGeometry(width, 0.15, depth);
    const lidMesh = new THREE.Mesh(lidGeo, this.materials.chassisMatte);
    lidMesh.position.y = 0.55;
    lidMesh.castShadow = true;
    this.topCoverGroup.add(lidMesh);

    // Top Cover Embossed VMware SD-WAN Logo Bar
    const logoBarGeo = new THREE.BoxGeometry(3.5, 0.02, 0.8);
    const logoBarMesh = new THREE.Mesh(logoBarGeo, this.materials.bezelGloss);
    logoBarMesh.position.set(0, 0.64, 0.5);
    this.topCoverGroup.add(logoBarMesh);

    // Text Badge representation (VMware SD-WAN Edge 640 emblem)
    const textPlateGeo = new THREE.BoxGeometry(2.8, 0.01, 0.4);
    const textPlateMesh = new THREE.Mesh(textPlateGeo, this.materials.logoPlate);
    textPlateMesh.position.set(0, 0.655, 0.5);
    this.topCoverGroup.add(textPlateMesh);

    // 3. FRONT BEZEL PANEL (z = +2.0)
    const frontBezelGeo = new THREE.BoxGeometry(width, 1.0, 0.15);
    const frontBezelMesh = new THREE.Mesh(frontBezelGeo, this.materials.bezelGloss);
    frontBezelMesh.position.set(0, 0.05, 1.95);
    this.group.add(frontBezelMesh);

    // Front Side Ventilation Vents (Left & Right)
    for (let i = 0; i < 6; i++) {
      const ventGeo = new THREE.BoxGeometry(0.04, 0.7, 0.05);
      // Left vents
      const ventL = new THREE.Mesh(ventGeo, this.materials.metalSilver);
      ventL.position.set(-3.2 + i * 0.08, 0.05, 1.98);
      this.group.add(ventL);

      // Right vents
      const ventR = new THREE.Mesh(ventGeo, this.materials.metalSilver);
      ventR.position.set(2.8 + i * 0.08, 0.05, 1.98);
      this.group.add(ventR);
    }

    // FRONT SERVICE INDICATOR LED (Center-Right glowing indicator)
    const serviceLedGeo = new THREE.SphereGeometry(0.12, 16, 16);
    this.serviceLedMesh = new THREE.Mesh(serviceLedGeo, this.materials.serviceLed);
    this.serviceLedMesh.position.set(1.5, 0.1, 2.0);
    this.ledsGroup.add(this.serviceLedMesh);

    // Service LED Point Light
    this.serviceLedLight = new THREE.PointLight(0x00ff66, 2.0, 3.0);
    this.serviceLedLight.position.set(1.5, 0.1, 2.1);
    this.ledsGroup.add(this.serviceLedLight);

    // Front Power & WAN Status Small LEDs
    const smallLedColors = [0x00ff44, 0x0088ff, 0xffbb00];
    smallLedColors.forEach((col, idx) => {
      const smLedGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 12);
      smLedGeo.rotateX(Math.PI / 2);
      const smLedMat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.2 });
      const smLedMesh = new THREE.Mesh(smLedGeo, smLedMat);
      smLedMesh.position.set(-1.8 + idx * 0.25, 0.1, 2.01);
      this.ledsGroup.add(smLedMesh);
    });

    // 4. REAR PANEL (z = -2.0) - Ports & Connectors
    const rearFaceGeo = new THREE.BoxGeometry(width, 1.0, 0.1);
    const rearFaceMesh = new THREE.Mesh(rearFaceGeo, this.materials.chassisMatte);
    rearFaceMesh.position.set(0, 0.05, -1.95);
    this.group.add(rearFaceMesh);

    // Build all interactive ports from PORTS_DATA
    PORTS_DATA.forEach(port => {
      const portMeshGroup = new THREE.Group();
      portMeshGroup.position.set(...port.position);

      let portBodyMesh: THREE.Mesh;

      if (port.type === 'rj45') {
        // 1GbE RJ45 Metallic Housing
        const rjGeo = new THREE.BoxGeometry(0.48, 0.42, 0.45);
        portBodyMesh = new THREE.Mesh(rjGeo, this.materials.metalSilver);

        // Inner RJ45 opening cavity
        const cavityGeo = new THREE.BoxGeometry(0.36, 0.32, 0.4);
        const cavityMesh = new THREE.Mesh(cavityGeo, new THREE.MeshBasicMaterial({ color: 0x0a0c10 }));
        cavityMesh.position.z = -0.05;
        portMeshGroup.add(cavityMesh);

        // Gold Pins inside RJ45
        for (let p = 0; p < 8; p++) {
          const pinGeo = new THREE.BoxGeometry(0.02, 0.15, 0.15);
          const pinMesh = new THREE.Mesh(pinGeo, this.materials.gold);
          pinMesh.position.set(-0.14 + p * 0.04, 0.08, -0.1);
          portMeshGroup.add(pinMesh);
        }

        // Port Speed/Link LEDs (top corners of RJ45)
        const portLedGeo = new THREE.BoxGeometry(0.06, 0.04, 0.05);
        const ledGreen = new THREE.Mesh(portLedGeo, this.materials.portLedActive);
        ledGreen.position.set(-0.18, 0.18, -0.21);
        const ledAmber = new THREE.Mesh(portLedGeo, new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1.0 }));
        ledAmber.position.set(0.18, 0.18, -0.21);
        portMeshGroup.add(ledGreen);
        portMeshGroup.add(ledAmber);

      } else if (port.type === 'sfp') {
        // 10GbE SFP+ Metallic Cage
        const sfpGeo = new THREE.BoxGeometry(0.52, 0.45, 0.6);
        portBodyMesh = new THREE.Mesh(sfpGeo, this.materials.metalSilver);

        // SFP Transceiver inserted partially
        const transGeo = new THREE.BoxGeometry(0.44, 0.38, 0.4);
        const transMesh = new THREE.Mesh(transGeo, new THREE.MeshStandardMaterial({ color: 0x444b58, metalness: 0.9, roughness: 0.2 }));
        transMesh.position.z = -0.15;
        portMeshGroup.add(transMesh);

        // SFP Pull Latch Ring
        const latchGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
        const latchMesh = new THREE.Mesh(latchGeo, this.materials.blueAccent);
        latchMesh.position.set(0, -0.1, -0.32);
        portMeshGroup.add(latchMesh);

      } else if (port.type === 'console') {
        // Micro-USB Console Port
        const conGeo = new THREE.BoxGeometry(0.35, 0.25, 0.3);
        portBodyMesh = new THREE.Mesh(conGeo, this.materials.metalSilver);

        const conInner = new THREE.BoxGeometry(0.25, 0.12, 0.2);
        const conInnerMesh = new THREE.Mesh(conInner, this.materials.blueAccent);
        conInnerMesh.position.z = -0.06;
        portMeshGroup.add(conInnerMesh);

      } else if (port.type === 'usb') {
        // USB 3.0 Type-A Port
        const usbGeo = new THREE.BoxGeometry(0.45, 0.35, 0.35);
        portBodyMesh = new THREE.Mesh(usbGeo, this.materials.metalSilver);

        const usbTongue = new THREE.BoxGeometry(0.32, 0.06, 0.2);
        const usbTongueMesh = new THREE.Mesh(usbTongue, this.materials.blueAccent);
        usbTongueMesh.position.set(0, 0.08, -0.05);
        portMeshGroup.add(usbTongueMesh);

      } else if (port.type === 'power') {
        // 12V DC Locking Power Receptacle
        const pwrGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.4, 16);
        pwrGeo.rotateX(Math.PI / 2);
        portBodyMesh = new THREE.Mesh(pwrGeo, this.materials.metalSilver);

        // Threaded Locking Collar
        const collarGeo = new THREE.TorusGeometry(0.24, 0.03, 8, 16);
        const collarMesh = new THREE.Mesh(collarGeo, this.materials.chassisMatte);
        collarMesh.position.z = -0.15;
        portMeshGroup.add(collarMesh);

      } else {
        // Antenna RP-SMA Connector + Dipole Antenna Stick
        const smaGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
        smaGeo.rotateX(Math.PI / 2);
        portBodyMesh = new THREE.Mesh(smaGeo, this.materials.gold);

        // Rubberized Antenna Stick
        const antStickGeo = new THREE.CylinderGeometry(0.1, 0.06, 1.4, 12);
        const antStickMesh = new THREE.Mesh(antStickGeo, new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.6 }));
        antStickMesh.position.set(0, 0.6, -0.1);
        antStickMesh.rotation.z = port.id === 'antenna_left' ? -0.2 : 0.2;
        portMeshGroup.add(antStickMesh);
      }

      portMeshGroup.add(portBodyMesh);

      // Attach metadata to portBodyMesh for raycasting
      portBodyMesh.userData = {
        type: 'port',
        portData: port
      };
      this.raycastMeshes.push(portBodyMesh);
      this.portsGroup.add(portMeshGroup);
    });

    // 5. INTERNAL PCB & COMPONENTS (Inside Chassis - Visible in Exploded / X-Ray / Cloak mode)
    // Motherboard PCB
    const pcbGeo = new THREE.BoxGeometry(6.8, 0.08, 3.6);
    const pcbMesh = new THREE.Mesh(pcbGeo, this.materials.pcbBoard);
    pcbMesh.position.set(0, 0.05, 0);
    pcbMesh.userData = {
      type: 'internal',
      componentData: INTERNAL_COMPONENTS.find(c => c.id === 'pcb')
    };
    this.raycastMeshes.push(pcbMesh);
    this.internalGroup.add(pcbMesh);

    // Heatsink & CPU
    const cpuGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const cpuMesh = new THREE.Mesh(cpuGeo, this.materials.metalSilver);
    cpuMesh.position.set(0, 0.14, 0);
    this.internalGroup.add(cpuMesh);

    // Anodized Aluminum Heatsink Fins Stack
    const hsGroup = new THREE.Group();
    hsGroup.position.set(0, 0.35, 0);
    for (let f = 0; f < 12; f++) {
      const finGeo = new THREE.BoxGeometry(1.6, 0.35, 0.06);
      const finMesh = new THREE.Mesh(finGeo, this.materials.heatsink);
      finMesh.position.z = -0.7 + f * 0.12;
      hsGroup.add(finMesh);
    }
    // Main Heatsink bounding hit box for raycasting
    const hsHitGeo = new THREE.BoxGeometry(1.7, 0.4, 1.6);
    const hsHitMesh = new THREE.Mesh(hsHitGeo, new THREE.MeshBasicMaterial({ visible: false }));
    hsHitMesh.position.set(0, 0.35, 0);
    hsHitMesh.userData = {
      type: 'internal',
      componentData: INTERNAL_COMPONENTS.find(c => c.id === 'heatsink')
    };
    this.raycastMeshes.push(hsHitMesh);
    this.internalGroup.add(hsHitMesh);
    this.internalGroup.add(hsGroup);

    // M.2 SSD Stick
    const ssdGeo = new THREE.BoxGeometry(1.4, 0.05, 0.4);
    const ssdMesh = new THREE.Mesh(ssdGeo, new THREE.MeshStandardMaterial({ color: 0x1c2b20, roughness: 0.5 }));
    ssdMesh.position.set(-1.8, 0.15, 0.8);
    ssdMesh.userData = {
      type: 'internal',
      componentData: INTERNAL_COMPONENTS.find(c => c.id === 'ssd')
    };
    this.raycastMeshes.push(ssdMesh);
    this.internalGroup.add(ssdMesh);

    // Memory SODIMM Modules
    for (let r = 0; r < 2; r++) {
      const ramGeo = new THREE.BoxGeometry(1.2, 0.2, 0.05);
      const ramMesh = new THREE.Mesh(ramGeo, new THREE.MeshStandardMaterial({ color: 0x111e15, roughness: 0.5 }));
      ramMesh.position.set(1.8, 0.18 + r * 0.08, 0.5);
      ramMesh.userData = {
        type: 'internal',
        componentData: INTERNAL_COMPONENTS.find(c => c.id === 'ram')
      };
      this.raycastMeshes.push(ramMesh);
      this.internalGroup.add(ramMesh);
    }
  }

  // Update Exploded View translation
  public setExplodedFactor(factor: number) {
    // factor from 0.0 (assembled) to 1.0 (fully exploded)
    this.topCoverGroup.position.y = factor * 2.2;
    this.internalGroup.position.y = factor * 0.8;
    this.portsGroup.position.z = -factor * 0.6;
  }

  // Dynamic Service LED status color update (Green, Yellow, Red, Blue)
  public updateServiceLed(status: 'green' | 'yellow' | 'red' | 'blue') {
    let colorHex = 0x00ff66;
    if (status === 'yellow') colorHex = 0xffcc00;
    if (status === 'red') colorHex = 0xff0044;
    if (status === 'blue') colorHex = 0x00aeff;

    if (this.serviceLedMesh && this.serviceLedMesh.material) {
      (this.serviceLedMesh.material as THREE.MeshStandardMaterial).color.setHex(colorHex);
      (this.serviceLedMesh.material as THREE.MeshStandardMaterial).emissive.setHex(colorHex);
    }
    if (this.serviceLedLight) {
      this.serviceLedLight.color.setHex(colorHex);
    }
  }

  // Set active Material Mode (Default, Predator Cloak, X-Ray, Carbon, Gold, Hologram)
  public setMaterialMode(mode: string, customShaderMat?: THREE.ShaderMaterial) {
    this.currentMaterialMode = mode;

    this.group.traverse(child => {
      if (child instanceof THREE.Mesh && child.material) {
        // Skip LED meshes so LEDs keep glowing
        if (child === this.serviceLedMesh || child.userData?.type === 'port_led') return;

        if (mode === 'predator' && customShaderMat) {
          child.material = customShaderMat;
        } else if (mode === 'xray') {
          child.material = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.75
          });
        } else if (mode === 'hologram') {
          child.material = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            wireframe: false,
            transparent: true,
            opacity: 0.45
          });
        } else if (mode === 'carbon') {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x111215,
            roughness: 0.2,
            metalness: 0.8
          });
        } else if (mode === 'gold') {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xe6b800,
            roughness: 0.25,
            metalness: 0.95,
            envMapIntensity: 2.0
          });
        } else {
          // Restore default material
          if (child.userData?.type === 'port') {
            child.material = this.materials.metalSilver;
          } else if (child.userData?.type === 'internal') {
            child.material = this.materials.pcbBoard;
          } else {
            child.material = this.materials.chassisMatte;
          }
        }
      }
    });
  }
}
