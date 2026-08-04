import * as THREE from 'three';

export const PredatorCloakShader = {
  uniforms: {
    uTime: { value: 0 },
    uRippleSpeed: { value: 2.0 },
    uFrequency: { value: 12.0 },
    uDistortion: { value: 0.35 },
    uIOR: { value: 1.15 },
    uDispersion: { value: 0.08 },
    uGlowColor: { value: new THREE.Color('#00f0ff') },
    uStealthActive: { value: 1.0 },
    uBaseTexture: { value: null }
  },

  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vViewPosition;

    uniform float uTime;
    uniform float uDistortion;
    uniform float uRippleSpeed;
    uniform float uFrequency;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      // Stealth cloaking wave displacement
      float wave = sin(pos.y * uFrequency + uTime * uRippleSpeed) * 
                 cos(pos.x * uFrequency * 0.5 + uTime * uRippleSpeed * 0.8);
      pos += normal * wave * uDistortion * 0.05;

      vPosition = pos;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform float uIOR;
    uniform float uDispersion;
    uniform vec3 uGlowColor;
    uniform float uStealthActive;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vViewPosition;

    // Hexagon pattern for stealth cloak lattice
    float hexGrid(vec2 p) {
      vec2 q = vec2(p.x * 1.7320508 + p.y, p.y * 2.0) * 8.0;
      vec2 pi = floor(q);
      vec2 pf = fract(q);
      float d = min(min(pf.x, pf.y), 1.0 - max(pf.x, pf.y));
      return smoothstep(0.0, 0.08, d);
    }

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);

      // Fresnel rim factor (stealth active edge)
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

      // Chromatic dispersion & refraction simulation
      vec3 refractR = refract(-viewDir, normal, 1.0 / (uIOR - uDispersion));
      vec3 refractG = refract(-viewDir, normal, 1.0 / uIOR);
      vec3 refractB = refract(-viewDir, normal, 1.0 / (uIOR + uDispersion));

      // Cloak distortion pattern
      float cloakPattern = sin(vPosition.y * 15.0 + uTime * 3.0) * cos(vPosition.z * 15.0 - uTime * 2.0);
      float hex = hexGrid(vUv * 3.0);

      vec3 colorR = vec3(0.05, 0.9, 1.0) * (0.5 + 0.5 * refractR.x);
      vec3 colorG = vec3(0.0, 0.4, 0.9) * (0.5 + 0.5 * refractG.y);
      vec3 colorB = vec3(0.6, 0.0, 1.0) * (0.5 + 0.5 * refractB.z);

      vec3 cloakBase = (colorR + colorG + colorB) * 0.5;

      // Hex energy lattice lines
      float energyGrid = (1.0 - hex) * 0.6;
      vec3 energyColor = uGlowColor * (energyGrid + cloakPattern * 0.2);

      // Combine refraction, energy grid, and edge glow
      vec3 finalColor = mix(cloakBase, energyColor, 0.45) + (uGlowColor * fresnel * 1.5);
      float alpha = clamp(0.25 + fresnel * 0.6 + energyGrid * 0.3, 0.2, 0.9);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

export const XRayShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00ffff') },
    uHeatColor: { value: new THREE.Color('#ff0055') }
  },

  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uHeatColor;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
      float edgeGlow = pow(rim, 2.5);

      // Internal heat map simulation based on position (CPU/SSD area heat)
      float heat = smoothstep(2.0, 0.0, length(vWorldPosition - vec3(0.0, 0.0, 0.0)));
      float pulse = 0.8 + 0.2 * sin(uTime * 4.0 + vWorldPosition.y * 10.0);

      vec3 finalColor = mix(uColor * (edgeGlow * 2.0 + 0.1), uHeatColor * heat, 0.4) * pulse;
      gl_FragColor = vec4(finalColor, clamp(edgeGlow * 0.9 + heat * 0.5 + 0.15, 0.15, 0.9));
    }
  `
};

export const CyberHologramShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00ffa6') }
  },

  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;

    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      float scanline = sin(vPosition.y * 60.0 - uTime * 8.0) * 0.5 + 0.5;
      float grid = step(0.92, fract(vUv.x * 40.0)) + step(0.92, fract(vUv.y * 20.0));
      grid = clamp(grid, 0.0, 1.0);

      vec3 col = uColor * (0.4 + 0.6 * scanline) + vec3(1.0) * grid * 0.5;
      gl_FragColor = vec4(col, 0.55 + grid * 0.3);
    }
  `
};
