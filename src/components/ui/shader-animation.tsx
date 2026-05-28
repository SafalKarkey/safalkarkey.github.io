import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    uniforms: Record<string, THREE.IUniform>;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.004;

        // Deep black base
        vec3 color = vec3(0.003, 0.005, 0.006);

        // --- Sharp grid lines (step = crisp 0/1, no blur) ---

        // Large slow grid
        vec2 g1 = uv * 3.5 + vec2(t * 0.08, -t * 0.06);
        vec2 f1 = fract(g1);
        float line1 = max(step(0.96, f1.x), step(0.96, f1.y));
        color += vec3(0.012, 0.018, 0.020) * line1;

        // Medium grid drifting opposite
        vec2 g2 = uv * 8.0 + vec2(-t * 0.12, t * 0.10);
        vec2 f2 = fract(g2);
        float line2 = max(step(0.97, f2.x), step(0.97, f2.y));
        color += vec3(0.008, 0.012, 0.014) * line2;

        // Fine static-ish grid for texture
        vec2 g3 = uv * 20.0;
        vec2 f3 = fract(g3);
        float line3 = max(step(0.985, f3.x), step(0.985, f3.y));
        color += vec3(0.005, 0.007, 0.008) * line3;

        // --- Blinking nodes at grid intersections ---
        vec2 gi = floor(g1);
        vec2 gf = fract(g1);
        float isNearCorner = step(0.94, gf.x) * step(0.94, gf.y);
        float blinkSpeed = hash(gi) * 0.3 + 0.1;
        float blinkPhase = hash(gi + vec2(13.0, 37.0));
        float blink = step(0.55, sin(t * blinkSpeed + blinkPhase * 6.28) * 0.5 + 0.5);
        float node = isNearCorner * blink;
        color += vec3(0.025, 0.035, 0.040) * node;

        // --- Diagonal trace lines (very subtle, sharp) ---
        float diag1 = fract((uv.x + uv.y) * 2.5 + t * 0.15);
        float dline1 = step(0.97, diag1);
        color += vec3(0.006, 0.009, 0.010) * dline1;

        float diag2 = fract((uv.x - uv.y) * 2.0 - t * 0.12);
        float dline2 = step(0.98, diag2);
        color += vec3(0.005, 0.007, 0.008) * dline2;

        // --- Occasional horizontal data pulses ---
        float pulseY = fract(uv.y * 2.0 + t * 0.25 + hash(vec2(floor(uv.x * 2.0), 0.0)));
        float pulse = step(0.985, pulseY) * step(0.3, hash(vec2(floor(uv.x * 6.0), floor(t * 0.1))));
        color += vec3(0.015, 0.022, 0.025) * pulse;

        // --- Vignette: crush edges to pure black ---
        float vig = 1.0 - smoothstep(0.35, 1.3, length(uv));
        color *= 0.6 + 0.4 * vig;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms: Record<string, THREE.IUniform> = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.01;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  );
}
