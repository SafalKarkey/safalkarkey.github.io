'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
    quotes: string[];
    className?: string;
    scrambleChars?: string;
    cycleDuration?: number;
    transitionDuration?: number;
}

export function ScrambleText({
    quotes,
    className = '',
    scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=',
    cycleDuration = 8000,
    transitionDuration = 1200
}: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState(quotes[0] || '');
    const [isScrambling, setIsScrambling] = useState(false);
    const quoteIndex = useRef(0);
    const rafRef = useRef<number>(0);
    const cycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (quotes.length <= 1) return;

        const startNextCycle = () => {
            quoteIndex.current = (quoteIndex.current + 1) % quotes.length;
            scrambleTo(quotes[quoteIndex.current]);
        };

        const scheduleNext = () => {
            cycleTimer.current = setTimeout(startNextCycle, cycleDuration);
        };

        // kick off the first cycle after initial display
        scheduleNext();

        return () => {
            if (cycleTimer.current) clearTimeout(cycleTimer.current);
            cancelAnimationFrame(rafRef.current);
        };
    }, [quotes, cycleDuration]);

    function scrambleTo(target: string) {
        cancelAnimationFrame(rafRef.current);
        setIsScrambling(true);

        const len = target.length;
        // Track which positions are resolved
        const resolved = new Uint8Array(len); // 0 = scrambled, 1 = resolved
        // Randomize the order positions get resolved
        const order = Array.from({ length: len }, (_, i) => i);
        // Shuffle order so characters resolve in random positions
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }
        // How many frames to fully resolve (fast!)
        const totalFrames = 20;
        // Characters to resolve per frame (at least 1)
        const perFrame = Math.max(1, Math.ceil(len / totalFrames));

        let frame = 0;
        const startTime = performance.now();

        function tick(now: number) {
            const elapsed = now - startTime;
            // Use time-based progress for smooth pacing
            const progress = Math.min(elapsed / transitionDuration, 1);
            const charsToResolve = Math.floor(progress * len);

            // Mark positions resolved up to charsToResolve in random order
            let resolvedCount = 0;
            for (let i = 0; i < len; i++) {
                if (resolved[i]) resolvedCount++;
            }
            while (resolvedCount < charsToResolve && resolvedCount < len) {
                const idx = order[resolvedCount];
                resolved[idx] = 1;
                resolvedCount++;
            }

            const text = target
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    if (resolved[i]) return target[i];
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                })
                .join('');

            setDisplayText(text);

            if (resolvedCount < len) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setDisplayText(target);
                setIsScrambling(false);
                // Schedule next quote AFTER this transition finishes
                cycleTimer.current = setTimeout(() => {
                    quoteIndex.current = (quoteIndex.current + 1) % quotes.length;
                    scrambleTo(quotes[quoteIndex.current]);
                }, cycleDuration);
            }
        }

        rafRef.current = requestAnimationFrame(tick);
    }

    return (
        <span className={`${className} ${isScrambling ? 'is-scrambling' : ''}`}>
            {displayText}
        </span>
    );
}
