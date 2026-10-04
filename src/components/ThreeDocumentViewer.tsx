import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { SourceType } from '../types/scholarship';

interface ThreeDocumentViewerProps {
  sourceCount: number;
  activeSources: { id: string; type: SourceType; title: string }[];
  isAnalyzing: boolean;
  hasConflicts: boolean;
  isCompleted: boolean;
  analysisStage?: string;
  onSelectSource?: (sourceType: SourceType) => void;
}

export const ThreeDocumentViewer: React.FC<ThreeDocumentViewerProps> = ({
  sourceCount,
  activeSources,
  isAnalyzing,
  hasConflicts,
  isCompleted,
  analysisStage,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'stack' | 'compare' | 'audit'>('stack');

  // Keep references to Three.js objects for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const documentsGroupRef = useRef<THREE.Group | null>(null);
  const coreNodeRef = useRef<THREE.Group | null>(null);
  const connectingLinesRef = useRef<THREE.LineSegments | null>(null);
  const cardsMeshListRef = useRef<{ mesh: THREE.Mesh; type: SourceType; title: string; basePos: THREE.Vector3; targetPos: THREE.Vector3; targetRot: THREE.Euler }[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Mouse interaction
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Soft fog for realistic document depth
    scene.fog = new THREE.FogExp2(0x080a0f, 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.5, 10);
    rimLight.position.set(0, 0, 2);
    scene.add(rimLight);

    // 5. Main Document Group
    const docsGroup = new THREE.Group();
    scene.add(docsGroup);
    documentsGroupRef.current = docsGroup;

    // 6. Central Verification Core (InfoGuard emblem & energy rings)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);
    coreNodeRef.current = coreGroup;

    // Verification Gyroscope Rings
    const ringGeo1 = new THREE.TorusGeometry(0.55, 0.015, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(0.75, 0.012, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.5;
    coreGroup.add(ring2);

    // Center Core Node (Octahedron diamond)
    const octaGeo = new THREE.OctahedronGeometry(0.22, 1);
    const octaMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
    });
    const coreGem = new THREE.Mesh(octaGeo, octaMat);
    coreGroup.add(coreGem);

    // Ground Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(12, 12);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    ground.receiveShadow = true;
    scene.add(ground);

    // Mouse events for parallax tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = x * 0.4;
      mousePos.current.targetY = y * 0.3;
    };

    const handleMouseLeave = () => {
      mousePos.current.targetX = 0;
      mousePos.current.targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && rendererRef.current && cameraRef.current) {
          rendererRef.current.setSize(newW, newH);
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      if (cameraRef.current) {
        cameraRef.current.position.x = mousePos.current.x * 0.8;
        cameraRef.current.position.y = 1.2 + mousePos.current.y * 0.6;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Rotate verification core
      if (coreGroup) {
        ring1.rotation.y = elapsedTime * 0.6;
        ring1.rotation.x = elapsedTime * 0.3;
        ring2.rotation.y = -elapsedTime * 0.4;
        ring2.rotation.z = elapsedTime * 0.2;
        coreGem.rotation.y = elapsedTime * 0.8;
        coreGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05;
      }

      // Animate document cards toward target positions/rotations
      cardsMeshListRef.current.forEach((item, index) => {
        const floatOffset = Math.sin(elapsedTime * 2 + index * 1.2) * 0.02;

        item.mesh.position.x += (item.targetPos.x - item.mesh.position.x) * 0.08;
        item.mesh.position.y += (item.targetPos.y + floatOffset - item.mesh.position.y) * 0.08;
        item.mesh.position.z += (item.targetPos.z - item.mesh.position.z) * 0.08;

        item.mesh.rotation.x += (item.targetRot.x - item.mesh.rotation.x) * 0.08;
        item.mesh.rotation.y += (item.targetRot.y - item.mesh.rotation.y) * 0.08;
        item.mesh.rotation.z += (item.targetRot.z - item.mesh.rotation.z) * 0.08;
      });

      // Update connecting beam lines during analysis
      if (connectingLinesRef.current && cardsMeshListRef.current.length > 0) {
        const positions = connectingLinesRef.current.geometry.attributes.position.array as Float32Array;
        let lineIdx = 0;
        const center = coreGroup.position;

        cardsMeshListRef.current.forEach((item) => {
          if (lineIdx + 5 < positions.length) {
            positions[lineIdx++] = item.mesh.position.x;
            positions[lineIdx++] = item.mesh.position.y;
            positions[lineIdx++] = item.mesh.position.z;
            positions[lineIdx++] = center.x;
            positions[lineIdx++] = center.y;
            positions[lineIdx++] = center.z;
          }
        });
        connectingLinesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Helper to create a procedural texture representing an official document sheet
  const createDocumentTexture = (type: SourceType, title: string, isHighlighted: boolean, isVerified: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Background paper sheet
    ctx.fillStyle = isHighlighted ? '#1c1917' : isVerified ? '#061a14' : '#0c111a';
    ctx.fillRect(0, 0, 512, 700);

    // Subtle paper gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 700);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 700);

    // Border
    ctx.strokeStyle = isHighlighted ? '#f59e0b' : isVerified ? '#10b981' : '#38bdf8';
    ctx.lineWidth = isHighlighted || isVerified ? 6 : 3;
    ctx.strokeRect(4, 4, 504, 692);

    // Header badge
    const badgeColors: Record<SourceType, string> = {
      website: '#0ea5e9',
      notification: '#10b981',
      faq: '#6366f1',
      form: '#f59e0b',
      instructions: '#8b5cf6',
    };
    ctx.fillStyle = badgeColors[type] || '#38bdf8';
    ctx.fillRect(24, 24, 160, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(type.toUpperCase(), 36, 48);

    // Seal icon / watermark
    ctx.beginPath();
    ctx.arc(430, 48, 20, 0, Math.PI * 2);
    ctx.strokeStyle = isHighlighted ? '#f59e0b' : '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Document Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(title.slice(0, 28), 24, 100);

    // Simulated paragraph lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let y = 140; y < 620; y += 22) {
      const lineLen = Math.random() > 0.2 ? 460 : 320;
      ctx.fillRect(24, y, lineLen, 5);
    }

    // Official Stamp / Footer
    ctx.fillStyle = isHighlighted ? 'rgba(245, 158, 11, 0.4)' : isVerified ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.3)';
    ctx.fillRect(24, 630, 464, 44);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    const stampText = isHighlighted
      ? '⚠ STATUS: REQUIREMENT CONFLICT DETECTED'
      : isVerified
      ? '✓ STATUS: AUDIT CONSENSUS VERIFIED'
      : 'OFFICIAL DOCUMENT RECORD • AUDITED';
    ctx.fillText(stampText, 40, 658);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  };

  // Rebuild 3D documents whenever active sources or states change
  useEffect(() => {
    const docsGroup = documentsGroupRef.current;
    const scene = sceneRef.current;
    if (!docsGroup || !scene) return;

    // Clear existing mesh cards
    while (docsGroup.children.length > 0) {
      const obj = docsGroup.children[0];
      docsGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }
    cardsMeshListRef.current = [];

    // Remove existing connecting lines
    if (connectingLinesRef.current) {
      scene.remove(connectingLinesRef.current);
      connectingLinesRef.current.geometry.dispose();
      (connectingLinesRef.current.material as THREE.Material).dispose();
      connectingLinesRef.current = null;
    }

    // Default template sources if user has 0 sources yet
    const effectiveSources =
      activeSources.length > 0
        ? activeSources
        : [
            { id: 'placeholder-1', type: 'website' as SourceType, title: 'Official Website' },
            { id: 'placeholder-2', type: 'notification' as SourceType, title: 'Gazette Circular' },
            { id: 'placeholder-3', type: 'faq' as SourceType, title: 'Advisory FAQ' },
          ];

    const cardCount = effectiveSources.length;
    const cardWidth = 1.6;
    const cardHeight = 2.2;
    const cardThickness = 0.02;

    const linePoints: number[] = [];

    effectiveSources.forEach((src, idx) => {
      const isCardConflict = hasConflicts && (src.type === 'website' || src.type === 'notification' || src.type === 'form');
      const isCardVerified = isCompleted && !isCardConflict;

      const texture = createDocumentTexture(src.type, src.title, isCardConflict, isCardVerified);

      const frontMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.35,
        metalness: 0.15,
        bumpScale: 0.02,
      });

      const edgeMat = new THREE.MeshStandardMaterial({
        color: isCardConflict ? 0xf59e0b : 0x1e293b,
        roughness: 0.8,
      });

      const materials = [
        edgeMat,
        edgeMat,
        edgeMat,
        edgeMat,
        frontMat,
        edgeMat,
      ];

      const geometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness);
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Calculate initial layout positions based on viewMode / state
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      let rotX = 0;
      let rotY = 0;
      let rotZ = 0;

      if (viewMode === 'stack') {
        const step = (idx - (cardCount - 1) / 2);
        targetX = step * 0.38;
        targetY = step * 0.12;
        targetZ = -step * 0.45;
        rotY = -0.32 + step * 0.08;
        rotX = 0.12;
        rotZ = -step * 0.04;

        if (isAnalyzing) {
          const angle = (idx / cardCount) * Math.PI * 2;
          const radius = 1.7;
          targetX = Math.cos(angle) * radius;
          targetZ = Math.sin(angle) * radius;
          targetY = Math.sin(idx * 1.5) * 0.3;
          rotY = -angle + Math.PI / 2;
          rotX = 0.1;
        } else if (isCompleted) {
          targetX = (idx - (cardCount - 1) / 2) * 0.22;
          targetY = (idx - (cardCount - 1) / 2) * 0.06;
          targetZ = -idx * 0.25;
          rotY = -0.15;
          rotX = 0.08;
        }
      } else if (viewMode === 'compare') {
        const colWidth = 1.7;
        targetX = (idx - (cardCount - 1) / 2) * colWidth;
        targetY = 0;
        targetZ = 0;
        rotY = 0;
        rotX = 0;
      } else {
        const angle = (idx / cardCount) * Math.PI * 1.4 - 0.7 * Math.PI;
        targetX = Math.sin(angle) * 1.8;
        targetZ = (1 - Math.cos(angle)) * 0.8;
        rotY = -angle * 0.7;
      }

      mesh.position.set(targetX, targetY - 2, targetZ);
      docsGroup.add(mesh);

      cardsMeshListRef.current.push({
        mesh,
        type: src.type,
        title: src.title,
        basePos: new THREE.Vector3(targetX, targetY, targetZ),
        targetPos: new THREE.Vector3(targetX, targetY, targetZ),
        targetRot: new THREE.Euler(rotX, rotY, rotZ),
      });

      linePoints.push(targetX, targetY, targetZ, 0, 0, 0);
    });

    if (isAnalyzing || hasConflicts) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: hasConflicts ? 0xf59e0b : 0x38bdf8,
        transparent: true,
        opacity: isAnalyzing ? 0.75 : 0.35,
        blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);
      connectingLinesRef.current = lines;
    }
  }, [sourceCount, activeSources, viewMode, isAnalyzing, hasConflicts, isCompleted]);

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-surface-900/90 via-surface-950/80 to-surface-950 border border-slate-800/80 shadow-2xl flex flex-col">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            3D Source Inspector • {activeSources.length} {activeSources.length === 1 ? 'Source' : 'Sources'} Layered
          </span>
        </div>

        <div className="flex items-center bg-slate-900/80 backdrop-blur-md rounded-lg p-1 border border-slate-800 pointer-events-auto shadow-md">
          <button
            onClick={() => setViewMode('stack')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
              viewMode === 'stack' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stack
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
              viewMode === 'compare' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Spread
          </button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="absolute inset-x-4 bottom-14 pointer-events-none flex justify-center">
          <div className="bg-surface-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-brand-500/40 shadow-glow-brand flex items-center space-x-3 text-brand-300 text-xs font-medium animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            <span>{analysisStage || 'Aligning official sources & comparing requirements...'}</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto bg-slate-900/70 backdrop-blur px-3 py-1 rounded-full border border-slate-800/60">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
            <span>Website</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Notification</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
            <span>FAQ</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>Form</span>
          </span>
        </div>

        <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
          Move cursor to tilt perspective
        </div>
      </div>
    </div>
  );
};
