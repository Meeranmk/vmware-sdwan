import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { SDWan640Model } from './ModelBuilder';
import { PredatorCloakShader, XRayShader, CyberHologramShader } from './Shaders';
import { CameraPreset, MaterialMode, MaterialSettings, PortInfo, InternalComponent } from '../types';
import { soundEngine } from '../utils/audio';

interface ThreeCanvasProps {
  materialMode: MaterialMode;
  materialSettings: MaterialSettings;
  cameraPreset: CameraPreset;
  explodeFactor: number;
  serviceLedStatus: 'green' | 'yellow' | 'red' | 'blue';
  onSelectPort: (port: PortInfo) => void;
  onSelectComponent: (component: InternalComponent) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  materialMode,
  materialSettings,
  cameraPreset,
  explodeFactor,
  serviceLedStatus,
  onSelectPort,
  onSelectComponent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<SDWan640Model | null>(null);
  const predatorShaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const xrayShaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const hologramShaderRef = useRef<THREE.ShaderMaterial | null>(null);

  // Hovered item tooltip state
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera target animation state
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(6, 4, 8));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Mouse Orbit Control state
  const isMouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const modelRotation = useRef({ x: 0.3, y: 0.6 });
  const raycaster = useRef(new THREE.Raycaster());
  const mouseVec = useRef(new THREE.Vector2());

  // Setup Three.js Engine
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c12);
    scene.fog = new THREE.FogExp2(0x0a0c12, 0.035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 4, 8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff00aa, 1.5);
    rimLight.position.set(0, -5, -6);
    scene.add(rimLight);

    // Floor Reflection Grid
    const gridHelper = new THREE.GridHelper(24, 48, 0x00f0ff, 0x1a2336);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    // Floor shadow catcher plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(30, 30);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.21;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. Instantiate Model & Custom Shaders
    const sdwanModel = new SDWan640Model();
    scene.add(sdwanModel.group);
    modelRef.current = sdwanModel;

    // Create Predator Shader Material
    const predatorMat = new THREE.ShaderMaterial({
      vertexShader: PredatorCloakShader.vertexShader,
      fragmentShader: PredatorCloakShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(PredatorCloakShader.uniforms),
      transparent: true,
      side: THREE.DoubleSide
    });
    predatorShaderRef.current = predatorMat;

    // Create XRay Shader Material
    const xrayMat = new THREE.ShaderMaterial({
      vertexShader: XRayShader.vertexShader,
      fragmentShader: XRayShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(XRayShader.uniforms),
      transparent: true,
      side: THREE.DoubleSide
    });
    xrayShaderRef.current = xrayMat;

    // Create Cyber Hologram Shader
    const holoMat = new THREE.ShaderMaterial({
      vertexShader: CyberHologramShader.vertexShader,
      fragmentShader: CyberHologramShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(CyberHologramShader.uniforms),
      transparent: true,
      side: THREE.DoubleSide
    });
    hologramShaderRef.current = holoMat;

    // 6. Animation Frame Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update Shader Uniforms
      if (predatorShaderRef.current) {
        predatorShaderRef.current.uniforms.uTime.value = elapsedTime;
        predatorShaderRef.current.uniforms.uRippleSpeed.value = materialSettings.stealthRippleSpeed;
        predatorShaderRef.current.uniforms.uFrequency.value = materialSettings.stealthFrequency;
        predatorShaderRef.current.uniforms.uIOR.value = materialSettings.ior;
      }
      if (xrayShaderRef.current) {
        xrayShaderRef.current.uniforms.uTime.value = elapsedTime;
      }
      if (hologramShaderRef.current) {
        hologramShaderRef.current.uniforms.uTime.value = elapsedTime;
      }

      // Model Auto Rotation
      if (modelRef.current && materialSettings.autoRotate && !isMouseDown.current) {
        modelRotation.current.y += 0.005;
      }

      if (modelRef.current) {
        modelRef.current.group.rotation.x = THREE.MathUtils.lerp(modelRef.current.group.rotation.x, modelRotation.current.x, 0.1);
        modelRef.current.group.rotation.y = THREE.MathUtils.lerp(modelRef.current.group.rotation.y, modelRotation.current.y, 0.1);
      }

      // Smooth Camera Animation to Target
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, 0.05);
        currentCamLook.current.lerp(targetCamLook.current, 0.05);
        cameraRef.current.lookAt(currentCamLook.current);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, []);

  // Update Exploded View Factor
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setExplodedFactor(explodeFactor);
    }
  }, [explodeFactor]);

  // Update Service LED color
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.updateServiceLed(serviceLedStatus);
    }
  }, [serviceLedStatus]);

  // Update Material Mode
  useEffect(() => {
    if (modelRef.current) {
      let mat: THREE.ShaderMaterial | undefined = undefined;
      if (materialMode === 'predator') mat = predatorShaderRef.current || undefined;
      if (materialMode === 'xray') mat = xrayShaderRef.current || undefined;
      if (materialMode === 'hologram') mat = hologramShaderRef.current || undefined;

      modelRef.current.setMaterialMode(materialMode, mat);
    }
  }, [materialMode]);

  // Handle Camera Presets
  useEffect(() => {
    switch (cameraPreset) {
      case 'front':
        targetCamPos.current.set(0, 0.5, 6.5);
        targetCamLook.current.set(0, 0, 0);
        modelRotation.current = { x: 0, y: 0 };
        break;
      case 'rear':
        targetCamPos.current.set(0, 0.5, -6.5);
        targetCamLook.current.set(0, 0, 0);
        modelRotation.current = { x: 0, y: Math.PI };
        break;
      case 'top':
        targetCamPos.current.set(0, 8, 0.1);
        targetCamLook.current.set(0, 0, 0);
        modelRotation.current = { x: 0, y: 0 };
        break;
      case 'ports':
        targetCamPos.current.set(1.5, 1.2, -4.5);
        targetCamLook.current.set(0.5, 0, -1.9);
        modelRotation.current = { x: -0.2, y: Math.PI - 0.3 };
        break;
      case 'exploded':
        targetCamPos.current.set(6, 6, 7);
        targetCamLook.current.set(0, 1, 0);
        break;
      case 'overview':
      default:
        targetCamPos.current.set(6, 4, 8);
        targetCamLook.current.set(0, 0, 0);
        modelRotation.current = { x: 0.3, y: 0.6 };
        break;
    }
  }, [cameraPreset]);

  // Mouse Drag Orbit & Raycasting Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseVec.current.set(x, y);

    if (isMouseDown.current) {
      const deltaX = e.clientX - mousePos.current.x;
      const deltaY = e.clientY - mousePos.current.y;
      modelRotation.current.y += deltaX * 0.008;
      modelRotation.current.x += deltaY * 0.008;
      // Clamp pitch rotation
      modelRotation.current.x = Math.max(-1.4, Math.min(1.4, modelRotation.current.x));
      mousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      // Raycasting for Hover Tooltip
      if (cameraRef.current && modelRef.current) {
        raycaster.current.setFromCamera(mouseVec.current, cameraRef.current);
        const intersects = raycaster.current.intersectObjects(modelRef.current.raycastMeshes);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData?.type === 'port') {
            const port = hit.userData.portData as PortInfo;
            setHoveredItem(`${port.name} (${port.speed})`);
            setTooltipPos({ x: e.clientX + 15, y: e.clientY - 30 });
          } else if (hit.userData?.type === 'internal') {
            const comp = hit.userData.componentData as InternalComponent;
            setHoveredItem(`${comp.name}`);
            setTooltipPos({ x: e.clientX + 15, y: e.clientY - 30 });
          }
        } else {
          setHoveredItem(null);
        }
      }
    }
  }, []);

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!cameraRef.current || !modelRef.current) return;
    raycaster.current.setFromCamera(mouseVec.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(modelRef.current.raycastMeshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData?.type === 'port') {
        const port = hit.userData.portData as PortInfo;
        soundEngine.playPortInspect();
        onSelectPort(port);
      } else if (hit.userData?.type === 'internal') {
        const comp = hit.userData.componentData as InternalComponent;
        soundEngine.playClick();
        onSelectComponent(comp);
      }
    }
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.005;
    targetCamPos.current.multiplyScalar(1 + zoomDelta * 0.1);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onWheel={handleWheel}
    >
      {/* Floating Hover Tooltip */}
      {hoveredItem && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-1.5 bg-slate-900/90 text-cyan-400 text-xs font-mono rounded-lg border border-cyan-500/30 shadow-xl backdrop-blur-md transition-all duration-75"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{hoveredItem}</span>
          </div>
        </div>
      )}
    </div>
  );
};
