import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- Procedural VIP Assets ---

const createStudioEnvironment = (renderer) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 60;
  ctx.fillRect(256, 0, 512, 128); 
  ctx.fillRect(64, 128, 64, 256); 
  ctx.fillRect(896, 128, 64, 256); 

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  
  texture.dispose();
  pmremGenerator.dispose();
  return envMap;
};

const createPremiumMeshTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e2e8f0'; 
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 16) {
    for (let x = 0; x < 512; x += 16) {
      const offsetX = (y / 16) % 2 === 0 ? 0 : 8;
      
      ctx.beginPath();
      ctx.arc(x + offsetX, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#111111'; 
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + offsetX + 1, y + 1, 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; 
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
};

// VIP Easing: Smooth start, swift middle, buttery soft stop
const easeInOutQuint = (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

const canCreateWebGlContext = () => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!context) {
      return false;
    }

    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

export default function VipPlayingCube() {
  const mountRef = useRef(null);
  const frameRef = useRef(0);
  const [isWebGlUnavailable, setIsWebGlUnavailable] = useState(false);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    if (!canCreateWebGlContext()) {
      setIsWebGlUnavailable(true);
      return undefined;
    }

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setIsWebGlUnavailable(true);
      return undefined;
    }

    setIsWebGlUnavailable(false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountNode.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.margin = '0 auto';

    scene.environment = createStudioEnvironment(renderer);

    // --- 2. Interaction & Physics (OrbitControls) ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; 
    controls.enablePan = false; 
    controls.enableDamping = true; 
    controls.dampingFactor = 0.04;
    controls.autoRotate = true; 
    controls.autoRotateSpeed = 4.5; 
    controls.target.set(0, 0, 0);

    // --- 3. Studio Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4); 
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 2.2); 
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    // --- 4. Premium VIP Materials ---
    const meshTexture = createPremiumMeshTexture();
    const materials = [
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.05, clearcoat: 1.0, envMapIntensity: 1.5 }), 
      new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9, metalness: 0.8, roughness: 0.25, clearcoat: 0.2, envMapIntensity: 1.2 }), 
      new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.6, roughness: 0.4, map: meshTexture, bumpMap: meshTexture, bumpScale: 0.02 }), 
      new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, metalness: 0.0, roughness: 0.8 }) 
    ];

    // --- 5. Cube Construction ---
    const tumbleGroup = new THREE.Group(); 
    const cubeEngine = new THREE.Group(); 
    const pivot = new THREE.Group(); 
    
    tumbleGroup.add(cubeEngine);
    cubeEngine.add(pivot);
    scene.add(tumbleGroup);

    const boxSize = 0.6;
    const gap = 0.02;
    const offset = boxSize + gap;
    const geometry = new RoundedBoxGeometry(boxSize, boxSize, boxSize, 5, 0.04);
    
    const blocks = [];

    // Create the 26 outer blocks 
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;

          let matIndex = 0;
          const posSum = Math.abs(x) + Math.abs(y) + Math.abs(z);
          if (posSum === 3) matIndex = 0;
          else if (posSum === 2) matIndex = 1;
          else if (x === 0 && z === 0) matIndex = 3;
          else matIndex = 2;

          const mesh = new THREE.Mesh(geometry, materials[matIndex]);
          mesh.position.set(x * offset, y * offset, z * offset);
          
          cubeEngine.add(mesh);
          blocks.push(mesh);
        }
      }
    }

    // --- 6. Resize Logic (Massively Increased Size) ---
    const updateViewport = () => {
      const width = mountNode.clientWidth || 1;
      const height = mountNode.clientHeight || 1;
      renderer.setSize(width, height, false);

      const compact = width < 640;
      const tablet = width < 1024;

      camera.fov = compact ? 44 : tablet ? 40 : 38;
      camera.aspect = width / height;
      
      // Brought the camera much closer
      camera.position.set(
        compact ? 4.0 : tablet ? 3.8 : 3.5,
        compact ? 3.0 : 2.8,
        compact ? 5.5 : tablet ? 5.0 : 4.5
      );
      camera.updateProjectionMatrix();

      // Scaled up the entire cube object massively
      tumbleGroup.scale.setScalar(compact ? 1.4 : tablet ? 1.55 : 1.75);
      };

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => updateViewport()) : null;
    resizeObserver?.observe(mountNode);
    window.addEventListener('resize', updateViewport);
    updateViewport();

    // --- 7. Rubik's Mechanics Engine ---
    const clock = new THREE.Clock();
    let animState = {
      isAnimating: false,
      progress: 0,
      axis: 'x',
      direction: 1,
      layerOffset: 0,
      activeBlocks: [],
      pauseTimer: 0.4, 
      duration: 0.55   
    };

    const axes = ['x', 'y', 'z'];
    const offsets = [-offset, 0, offset];

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1); 

      // 1. Orbit controls handles the smooth momentum drag and base Y-rotation
      controls.update();

      // 2. TumbleGroup continuously rotates on X/Z for floating tumble
      tumbleGroup.rotation.x += delta * 0.2;
      tumbleGroup.rotation.z += delta * 0.15;

      // 3. Slice Animation Engine
      if (!animState.isAnimating) {
        if (animState.pauseTimer > 0) {
          animState.pauseTimer -= delta;
        } else {
          animState.axis = axes[Math.floor(Math.random() * 3)];
          animState.layerOffset = offsets[Math.floor(Math.random() * 3)];
          animState.direction = Math.random() > 0.5 ? 1 : -1;
          animState.activeBlocks = blocks.filter(b => Math.abs(b.position[animState.axis] - animState.layerOffset) < 0.1);
          
          animState.activeBlocks.forEach(b => pivot.attach(b));
          animState.progress = 0;
          animState.isAnimating = true;
        }
      } else {
        animState.progress += delta / animState.duration;

        if (animState.progress >= 1.0) {
          pivot.rotation[animState.axis] = animState.direction * (Math.PI / 2);
          
          animState.activeBlocks.forEach(b => {
            cubeEngine.attach(b);
            b.position.x = Math.round(b.position.x / offset) * offset;
            b.position.y = Math.round(b.position.y / offset) * offset;
            b.position.z = Math.round(b.position.z / offset) * offset;
            
            const euler = new THREE.Euler().setFromQuaternion(b.quaternion);
            euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
            euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
            euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
            b.quaternion.setFromEuler(euler);
          });

          pivot.rotation.set(0, 0, 0);
          animState.isAnimating = false;
          animState.pauseTimer = 0.25 + Math.random() * 0.35; 
        } else {
          const ease = easeInOutQuint(animState.progress);
          pivot.rotation[animState.axis] = ease * animState.direction * (Math.PI / 2);
        }
      }

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    // --- 8. Cleanup ---
    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateViewport);
      controls.dispose();
      geometry.dispose();
      materials.forEach(mat => mat.dispose());
      meshTexture.dispose();
      renderer.dispose();
      
      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-[760px] items-center justify-center overflow-hidden rounded-[2.4rem] bg-transparent cursor-grab active:cursor-grabbing touch-action-none aspect-[1/1] min-h-[320px] max-h-[42rem] sm:min-h-[360px] sm:aspect-[6/5] md:min-h-[430px] md:aspect-[5/4] lg:min-h-[500px] lg:aspect-[5/6] xl:min-h-[580px] xl:aspect-[1/1]">
      <div ref={mountRef} className="absolute inset-0 flex h-full w-full items-center justify-center" />
      {isWebGlUnavailable ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-56 w-56 rotate-[-10deg] grid-cols-3 gap-2 rounded-[2rem] bg-white/10 p-3 shadow-[0_28px_80px_rgba(8,66,153,0.16)] backdrop-blur sm:h-72 sm:w-72">
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className="rounded-[1rem] border border-white/60 bg-[linear-gradient(145deg,#ffffff,#dbe7f5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_26px_rgba(8,41,89,0.12)]"
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
