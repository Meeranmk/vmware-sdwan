import * as THREE from 'three';
import { CameraPreset } from '../types';
import { SDWan640Model } from './ModelBuilder';
import { PredatorCloakShader, XRayShader, CyberHologramShader } from './Shaders';

export function createStudioLighting(scene: THREE.Scene) {
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

  const gridHelper = new THREE.GridHelper(24, 48, 0x00f0ff, 0x1a2336);
  gridHelper.position.y = -1.2;
  scene.add(gridHelper);

  const shadowPlaneGeo = new THREE.PlaneGeometry(30, 30);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.4 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -1.21;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);
}

export function createShaderMaterials() {
  const predatorMat = new THREE.ShaderMaterial({
    vertexShader: PredatorCloakShader.vertexShader,
    fragmentShader: PredatorCloakShader.fragmentShader,
    uniforms: THREE.UniformsUtils.clone(PredatorCloakShader.uniforms),
    transparent: true,
    side: THREE.DoubleSide
  });

  const xrayMat = new THREE.ShaderMaterial({
    vertexShader: XRayShader.vertexShader,
    fragmentShader: XRayShader.fragmentShader,
    uniforms: THREE.UniformsUtils.clone(XRayShader.uniforms),
    transparent: true,
    side: THREE.DoubleSide
  });

  const holoMat = new THREE.ShaderMaterial({
    vertexShader: CyberHologramShader.vertexShader,
    fragmentShader: CyberHologramShader.fragmentShader,
    uniforms: THREE.UniformsUtils.clone(CyberHologramShader.uniforms),
    transparent: true,
    side: THREE.DoubleSide
  });

  return { predatorMat, xrayMat, holoMat };
}

export function applyCameraPreset(
  cameraPreset: CameraPreset,
  targetCamPos: THREE.Vector3,
  targetCamLook: THREE.Vector3,
  modelRotation: { current: { x: number; y: number } }
) {
  switch (cameraPreset) {
    case 'front':
      targetCamPos.set(0, 0.5, 6.5);
      targetCamLook.set(0, 0, 0);
      modelRotation.current = { x: 0, y: 0 };
      break;
    case 'rear':
      targetCamPos.set(0, 0.5, -6.5);
      targetCamLook.set(0, 0, 0);
      modelRotation.current = { x: 0, y: Math.PI };
      break;
    case 'top':
      targetCamPos.set(0, 8, 0.1);
      targetCamLook.set(0, 0, 0);
      modelRotation.current = { x: 0, y: 0 };
      break;
    case 'ports':
      targetCamPos.set(1.5, 1.2, -4.5);
      targetCamLook.set(0.5, 0, -1.9);
      modelRotation.current = { x: -0.2, y: Math.PI - 0.3 };
      break;
    case 'exploded':
      targetCamPos.set(6, 6, 7);
      targetCamLook.set(0, 1, 0);
      break;
    case 'overview':
    default:
      targetCamPos.set(6, 4, 8);
      targetCamLook.set(0, 0, 0);
      modelRotation.current = { x: 0.3, y: 0.6 };
      break;
  }
}

export function performRaycast(
  e: React.MouseEvent,
  container: HTMLElement | null,
  camera: THREE.PerspectiveCamera | null,
  model: SDWan640Model | null,
  raycaster: THREE.Raycaster,
  mouseVec: THREE.Vector2
): THREE.Object3D | null {
  if (!container || !camera || !model) return null;
  const rect = container.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  mouseVec.set(x, y);

  raycaster.setFromCamera(mouseVec, camera);
  const intersects = raycaster.intersectObjects(model.raycastMeshes);
  return intersects.length > 0 ? intersects[0].object : null;
}
