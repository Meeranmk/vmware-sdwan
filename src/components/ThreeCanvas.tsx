import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { SDWan640Model } from './ModelBuilder';
import { createStudioLighting, createShaderMaterials, applyCameraPreset, performRaycast } from './canvasHelpers';
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
  const containerRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<SDWan640Model | null>(null);
  const predatorShaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const xrayShaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const hologramShaderRef = useRef<THREE.ShaderMaterial | null>(null);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(6, 4, 8));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const isMouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const modelRotation = useRef({ x: 0.3, y: 0.6 });
  const raycaster = useRef(new THREE.Raycaster());
  const mouseVec = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c12);
    scene.fog = new THREE.FogExp2(0x0a0c12, 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 4, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    createStudioLighting(scene);

    const sdwanModel = new SDWan640Model();
    scene.add(sdwanModel.group);
    modelRef.current = sdwanModel;

    const { predatorMat, xrayMat, holoMat } = createShaderMaterials();
    predatorShaderRef.current = predatorMat;
    xrayShaderRef.current = xrayMat;
    hologramShaderRef.current = holoMat;

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (predatorShaderRef.current) {
        predatorShaderRef.current.uniforms.uTime.value = elapsedTime;
        predatorShaderRef.current.uniforms.uRippleSpeed.value = materialSettings.stealthRippleSpeed;
        predatorShaderRef.current.uniforms.uFrequency.value = materialSettings.stealthFrequency;
        predatorShaderRef.current.uniforms.uIOR.value = materialSettings.ior;
      }
      if (xrayShaderRef.current) xrayShaderRef.current.uniforms.uTime.value = elapsedTime;
      if (hologramShaderRef.current) hologramShaderRef.current.uniforms.uTime.value = elapsedTime;

      if (modelRef.current && materialSettings.autoRotate && !isMouseDown.current) {
        modelRotation.current.y += 0.005;
      }

      if (modelRef.current) {
        modelRef.current.group.rotation.x = THREE.MathUtils.lerp(modelRef.current.group.rotation.x, modelRotation.current.x, 0.1);
        modelRef.current.group.rotation.y = THREE.MathUtils.lerp(modelRef.current.group.rotation.y, modelRotation.current.y, 0.1);
      }

      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, 0.05);
        currentCamLook.current.lerp(targetCamLook.current, 0.05);
        cameraRef.current.lookAt(currentCamLook.current);
      }

      renderer.render(scene, camera);
    };
    animate();

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
      rendererRef.current?.domElement?.remove();
    };
  }, []);

  useEffect(() => {
    modelRef.current?.setExplodedFactor(explodeFactor);
  }, [explodeFactor]);

  useEffect(() => {
    modelRef.current?.updateServiceLed(serviceLedStatus);
  }, [serviceLedStatus]);

  useEffect(() => {
    if (modelRef.current) {
      let mat: THREE.ShaderMaterial | undefined = undefined;
      if (materialMode === 'predator') mat = predatorShaderRef.current || undefined;
      if (materialMode === 'xray') mat = xrayShaderRef.current || undefined;
      if (materialMode === 'hologram') mat = hologramShaderRef.current || undefined;
      modelRef.current.setMaterialMode(materialMode, mat);
    }
  }, [materialMode]);

  useEffect(() => {
    applyCameraPreset(cameraPreset, targetCamPos.current, targetCamLook.current, modelRotation);
  }, [cameraPreset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMouseDown.current) {
      const deltaX = e.clientX - mousePos.current.x;
      const deltaY = e.clientY - mousePos.current.y;
      modelRotation.current.y += deltaX * 0.008;
      modelRotation.current.x += deltaY * 0.008;
      modelRotation.current.x = Math.max(-1.4, Math.min(1.4, modelRotation.current.x));
      mousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      const hit = performRaycast(e, containerRef.current, cameraRef.current, modelRef.current, raycaster.current, mouseVec.current);
      if (hit?.userData?.type === 'port') {
        const port = hit.userData.portData as PortInfo;
        setHoveredItem(`${port.name} (${port.speed})`);
        setTooltipPos({ x: e.clientX + 15, y: e.clientY - 30 });
      } else if (hit?.userData?.type === 'internal') {
        const comp = hit.userData.componentData as InternalComponent;
        setHoveredItem(`${comp.name}`);
        setTooltipPos({ x: e.clientX + 15, y: e.clientY - 30 });
      } else {
        setHoveredItem(null);
      }
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const hit = performRaycast(e, containerRef.current, cameraRef.current, modelRef.current, raycaster.current, mouseVec.current);
    if (hit?.userData?.type === 'port') {
      soundEngine.playPortInspect();
      onSelectPort(hit.userData.portData as PortInfo);
    } else if (hit?.userData?.type === 'internal') {
      soundEngine.playClick();
      onSelectComponent(hit.userData.componentData as InternalComponent);
    }
  };

  const tooltipStyle = useMemo<React.CSSProperties>(
    () => ({ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }),
    [tooltipPos.x, tooltipPos.y]
  );

  return (
    <button
      type="button"
      ref={containerRef}
      aria-label="Interactive 3D SD-WAN Canvas"
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden block border-0 p-0 m-0 text-left bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-400/50"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => (isMouseDown.current = false)}
      onMouseLeave={() => (isMouseDown.current = false)}
      onClick={handleClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && e.preventDefault()}
      onWheel={e => cameraRef.current && targetCamPos.current.multiplyScalar(1 + e.deltaY * 0.0005)}
    >
      {hoveredItem && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-1.5 bg-slate-900/90 text-cyan-400 text-xs font-mono rounded-lg border border-cyan-500/30 shadow-xl backdrop-blur-md transition-[opacity] duration-75"
          style={tooltipStyle}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{hoveredItem}</span>
          </div>
        </div>
      )}
    </button>
  );
};
