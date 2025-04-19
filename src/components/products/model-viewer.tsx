// components/products/model-viewer.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

interface ModelViewerProps {
  modelUrl: string;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load model based on file extension
    const fileExtension = modelUrl.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'gltf' || fileExtension === 'glb') {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          scene.add(gltf.scene);
          
          // Center model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Adjust camera
          const maxDim = Math.max(size.x, size.y, size.z);
          camera.position.set(0, size.y / 2, maxDim * 2);
          camera.lookAt(center);
          
          // Adjust controls
          controls.target.copy(center);
          controls.update();
        },
        undefined,
        (error) => {
          console.error('Error loading GLTF model:', error);
        }
      );
    } else if (fileExtension === 'obj') {
      const loader = new OBJLoader();
      loader.load(
        modelUrl,
        (obj) => {
          scene.add(obj);
          
          // Center model
          const box = new THREE.Box3().setFromObject(obj);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Adjust camera
          const maxDim = Math.max(size.x, size.y, size.z);
          camera.position.set(0, size.y / 2, maxDim * 2);
          camera.lookAt(center);
          
          // Adjust controls
          controls.target.copy(center);
          controls.update();
        },
        undefined,
        (error) => {
          console.error('Error loading OBJ model:', error);
        }
      );
    } else {
      // Handle unsupported format
      const message = document.createElement('div');
      message.style.position = 'absolute';
      message.style.top = '50%';
      message.style.left = '50%';
      message.style.transform = 'translate(-50%, -50%)';
      message.style.color = '#666';
      message.textContent = 'Unsupported 3D model format';
      containerRef.current.appendChild(message);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [modelUrl]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]" />
  );
}