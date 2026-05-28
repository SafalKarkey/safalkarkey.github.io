'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate } from 'framer-motion';

// Type definitions
interface ResponsiveImage {
    src: string;
    alt?: string;
    srcSet?: string;
}

interface AnimationConfig {
    preview?: boolean;
    scale: number;
    speed: number;
}

interface NoiseConfig {
    opacity: number;
    scale: number;
}

interface ShadowOverlayProps {
    type?: 'preset' | 'custom';
    presetIndex?: number;
    customImage?: ResponsiveImage;
    sizing?: 'fill' | 'stretch';
    color?: string;
    animation?: AnimationConfig;
    noise?: NoiseConfig;
    style?: CSSProperties;
    className?: string;
    title?: React.ReactNode;
}

function mapRange(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number,
    toHigh: number
): number {
    if (fromLow === fromHigh) {
        return toLow;
    }
    const percentage = (value - fromLow) / (fromHigh - fromLow);
    return toLow + percentage * (toHigh - toLow);
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

const useInstanceId = (): string => {
    const id = useId();
    const cleanId = id.replace(/:/g, "");
    const instanceId = `shadowoverlay-${cleanId}`;
    return instanceId;
};

export function Component({
    sizing = 'fill',
    color = 'rgba(255, 230, 199, 0.65)',
    animation,
    noise,
    style,
    className,
    title
}: ShadowOverlayProps) {
    const id = useInstanceId();
    const animationEnabled = animation && animation.scale > 0;

    const feTurbulenceRef = useRef<SVGFETurbulenceElement>(null);
    const feDisp1Ref = useRef<SVGFEDisplacementMapElement>(null);
    const feDisp2Ref = useRef<SVGFEDisplacementMapElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);

    const displacementScale = animation ? mapRange(animation.scale, 1, 100, 50, 200) : 0;

    useEffect(() => {
        if (!animationEnabled) return;

        const speedMult = Math.max(0.15, (animation?.speed ?? 40) / 40);

        // Color cycle: red -> white -> blue -> red (smooth loop)
        // Decoupled from displacement speed for independent tuning
        const colorDuration = 30; // seconds for full loop; increase to slow down

        const colors = [
            [255, 90, 90, 0.55],      // red
            [255, 255, 255, 0.6],     // white
            [90, 140, 255, 0.55],     // blue
            [255, 90, 90, 0.55],      // red (loop seam — invisible snap)
        ];

        const colorAnim = animate(0, 3, {
            duration: colorDuration,
            repeat: Infinity,
            ease: "linear",
            onUpdate: (v: number) => {
                const idx = Math.floor(v);
                const t = v - idx;
                const c1 = colors[idx];
                const c2 = colors[idx + 1] || colors[0];
                const r = lerp(c1[0], c2[0], t);
                const g = lerp(c1[1], c2[1], t);
                const b = lerp(c1[2], c2[2], t);
                const a = lerp(c1[3], c2[3], t);
                if (shadowRef.current) {
                    shadowRef.current.style.backgroundColor = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`;
                }
            }
        });

        // Displacement breathing — slow, fluid swell
        const anim1 = animate(displacementScale * 0.5, displacementScale * 1.35, {
            duration: 5.5 / speedMult,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            onUpdate: (v: number) => {
                feDisp1Ref.current?.setAttribute("scale", v.toFixed(2));
            }
        });

        const anim2 = animate(displacementScale * 0.4, displacementScale * 1.1, {
            duration: 7.2 / speedMult,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1.2,
            onUpdate: (v: number) => {
                feDisp2Ref.current?.setAttribute("scale", v.toFixed(2));
            }
        });

        return () => {
            anim1.stop();
            anim2.stop();
            colorAnim.stop();
        };
    }, [animationEnabled, animation, displacementScale]);

    const maskSize = sizing === "stretch" ? "100% 100%" : "cover";

    return (
        <div
            className={className}
            style={{
                overflow: "hidden",
                position: "relative",
                width: "100%",
                height: "100%",
                ...style
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: -displacementScale,
                    filter: animationEnabled ? `url(#${id})` : "none"
                }}
            >
                {animationEnabled && (
                    <svg style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", opacity: 0 }}>
                        <defs>
                            <filter id={id}>
                                <feTurbulence
                                    ref={feTurbulenceRef}
                                    result="undulation"
                                    numOctaves="2"
                                    baseFrequency={`${mapRange(animation?.scale ?? 50, 0, 100, 0.003, 0.014)},${mapRange(animation?.scale ?? 50, 0, 100, 0.005, 0.028)}`}
                                    seed="0"
                                    type="fractalNoise"
                                    stitchTiles="stitch"
                                />
                                <feColorMatrix
                                    in="undulation"
                                    type="hueRotate"
                                    values="180"
                                    result="rotated"
                                />
                                <feColorMatrix
                                    in="rotated"
                                    result="circulation"
                                    type="matrix"
                                    values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                                />
                                <feDisplacementMap
                                    ref={feDisp1Ref}
                                    in="SourceGraphic"
                                    in2="circulation"
                                    scale={displacementScale}
                                    result="dist"
                                />
                                <feDisplacementMap
                                    ref={feDisp2Ref}
                                    in="dist"
                                    in2="undulation"
                                    scale={Math.round(displacementScale * 0.6)}
                                    result="output"
                                />
                            </filter>
                        </defs>
                    </svg>
                )}
                <div
                    ref={shadowRef}
                    style={{
                        backgroundColor: color,
                        maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
                        maskSize: maskSize,
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
                        WebkitMaskSize: maskSize,
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        width: "100%",
                        height: "100%"
                    }}
                />
            </div>

            {title != null && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        zIndex: 10
                    }}
                >
                    {title !== undefined ? title : (
                        <h1 className="md:text-7xl text-6xl lg:text-8xl font-bold text-center text-foreground relative z-20">
                            Etheral Shadows
                        </h1>
                    )}
                </div>
            )}

            {noise && noise.opacity > 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
                        backgroundSize: noise.scale * 200,
                        backgroundRepeat: "repeat",
                        opacity: noise.opacity / 2
                    }}
                />
            )}
        </div>
    );
}
