import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface ThreeShaderImageProps {
  imageSrc: string;
  isHovered: boolean;
}

export const ThreeShaderImage: React.FC<ThreeShaderImageProps> = ({ imageSrc, isHovered }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const hoverIntensity = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Texture & Custom Shader Material
    const loader = new THREE.TextureLoader();
    const texture = loader.load(imageSrc);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    // Custom WebGL Shader: Liquid Wave + RGB Chromatic Shift
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;

          // Wave distortion centered on cursor
          float dist = distance(uv, uMouse);
          float wave = sin(dist * 18.0 - uTime * 4.0) * 0.03 * uHover;
          vec2 distortedUv = uv + wave * (uv - uMouse);

          // Chromatic aberration (RGB Split)
          float r = texture2D(uTexture, distortedUv + vec2(0.008 * uHover, 0.0)).r;
          float g = texture2D(uTexture, distortedUv).g;
          float b = texture2D(uTexture, distortedUv - vec2(0.008 * uHover, 0.0)).b;
          float a = texture2D(uTexture, distortedUv).a;

          gl_FragColor = vec4(r, g, b, a);
        }
      `,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 3. Mouse Movement Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL Y is inverted
    };

    container.addEventListener("mousemove", handleMouseMove);

    // 4. Render Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;

      // Smooth lerp mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Smooth lerp hover intensity
      const targetHover = isHovered ? 1.0 : 0.0;
      hoverIntensity.current += (targetHover - hoverIntensity.current) * 0.08;
      material.uniforms.uHover.value = hoverIntensity.current;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // 5. Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        zIndex: 3,
        width: "82%",
        height: "94%",
        overflow: "hidden",
      }}
    />
  );
};