import { useCallback, useEffect, useRef, useState } from "react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ScrambleText } from "@/components/ui/scramble-text";

const terminalLines = [
    "$ init --profile safal",
    "> loading security engineering context...",
    "> stack: secops | devops | security engineering",
    "> capabilities: vapt | soc | siem | wazuh",
    "$ status --now",
    "> securing systems and delivery pipelines",
];
const BRAND_TEXT = "Safal Karki";
const INTRO_TITLE = "Security Engineer";
const HACKER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-_";

// Each blip carries a sweep-delay so its glow peaks exactly when the
// rotating radar sweep passes its angular position (4.5s per revolution).
const RADAR_BLIPS = [
    { label: "SIEM", x: 74, y: 32, delay: "-3.84s" },
    { label: "PENTESTING", x: 28, y: 30, delay: "-0.6s" },
    { label: "SYSTEMS ENGINEERING", x: 24, y: 60, delay: "-1.39s" },
    { label: "SOC", x: 72, y: 66, delay: "-2.93s" },
    { label: "THREAT HUNTING", x: 20, y: 40, delay: "-0.9s" },
];

const TAG_GROUPS = [
    {
        label: "Security Ops",
        tags: ["VAPT", "SOC", "SIEM", "Wazuh", "DevSecOps", "Incident Response", "Monitoring", "CTF", "OSINT"],
    },
    {
        label: "Cloud · AWS",
        tags: [
            "AWS", "VPC", "EC2", "RDS", "DynamoDB", "ECS", "IAM", "S3", "CloudFront",
            "Route53", "CloudWatch", "Inspector", "GuardDuty", "Security Hub", "AWS WAF",
            "Lambda", "API Gateway",
        ],
    },
    {
        label: "DevOps · IaC",
        tags: ["DevOps", "CI/CD", "GitHub Actions", "Terraform", "Docker", "Kubernetes", "Docker Swarm"],
    },
    {
        label: "Infrastructure · Linux",
        tags: [
            "Networking", "Infrastructure", "Virtualization", "Linux", "Linux Administration",
            "Nginx", "DNS", "Reverse Proxy", "SSL/TLS", "Bash",
        ],
    },
    {
        label: "Languages · Frameworks",
        tags: ["Node.js", "React", "PostgreSQL", "JavaScript", "Git"],
    },
];

const SECTIONS = [
    { id: "home", code: "HOME", label: "Home", kicker: "Personnel File" },
    { id: "stats", code: "STATS", label: "About", kicker: "Operator Profile" },
    { id: "inv", code: "INV", label: "Capabilities", kicker: "Equipment Inventory" },
    { id: "data", code: "DATA", label: "Experience", kicker: "Service Record" },
    { id: "map", code: "MAP", label: "Projects", kicker: "Cleared Locations" },
    { id: "edu", code: "EDU", label: "Education", kicker: "Training Log" },
    { id: "log", code: "LOG", label: "Recognition", kicker: "Commendations" },
    { id: "comm", code: "COMM", label: "Contact", kicker: "Radio Comms" },
];

function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function Tag({ label }) {
    const [display, setDisplay] = useState(label);
    const rafRef = useRef(null);
    const isHovering = useRef(false);
    const [canScramble] = useState(() => {
        if (typeof window === "undefined" || !window.matchMedia) return false;
        return window.matchMedia("(hover: hover)").matches;
    });

    const clear = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    const onEnter = useCallback(() => {
        isHovering.current = true;
        clear();
        let iteration = 0;
        let last = 0;
        // requestAnimationFrame (not setInterval) — pauses when the tab is hidden and
        // matches ScrambleText. A 28ms time-gate preserves the original scramble cadence.
        const step = (now) => {
            if (!isHovering.current) return;
            if (last === 0) last = now;
            if (now - last >= 28) {
                last = now;
                setDisplay(
                    label
                        .split("")
                        .map((character, index) => {
                            if (character === " ") return " ";
                            if (index < iteration) return label[index];
                            return HACKER_GLYPHS[Math.floor(Math.random() * HACKER_GLYPHS.length)];
                        })
                        .join("")
                );
                iteration += 0.5;
                if (iteration >= label.length) {
                    clear();
                    setDisplay(label);
                    return;
                }
            }
            rafRef.current = window.requestAnimationFrame(step);
        };
        rafRef.current = window.requestAnimationFrame(step);
    }, [label, clear]);

    const onLeave = useCallback(() => {
        isHovering.current = false;
        clear();
        setDisplay(label);
    }, [label, clear]);

    useEffect(() => () => clear(), [clear]);

    return (
        <span onMouseEnter={canScramble ? onEnter : undefined} onMouseLeave={canScramble ? onLeave : undefined}>
            {display}
        </span>
    );
}

function App() {
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") {
            return "dark";
        }

        const savedTheme = window.localStorage.getItem("portfolio-theme");
        return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
    });
    const [activeSection, setActiveSection] = useState("home");
    const [isTuning, setIsTuning] = useState(false);
    const [brandDisplayText, setBrandDisplayText] = useState(BRAND_TEXT);
    const [isBrandScrambling, setIsBrandScrambling] = useState(false);
    const [introNameDisplay, setIntroNameDisplay] = useState("");
    const [introTitleDisplay, setIntroTitleDisplay] = useState("");
    const [introPhase, setIntroPhase] = useState("active");

    const terminalOutputRef = useRef(null);
    const brandScrambleRafRef = useRef(null);
    const tuneTimerRef = useRef(null);
    const tabsRef = useRef(null);
    const screenBodyRef = useRef(null);
    const introSkipRef = useRef(null);
    const introOverlayRef = useRef(null);
    const crtSurfaceRef = useRef(null);

    const skipIntro = useCallback(() => {
        introSkipRef.current?.();
    }, []);

    const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
    const activeMeta = SECTIONS[activeIndex];

    const stopBrandScramble = useCallback(() => {
        if (brandScrambleRafRef.current) {
            cancelAnimationFrame(brandScrambleRafRef.current);
            brandScrambleRafRef.current = null;
        }

        setIsBrandScrambling(false);
    }, []);

    const startBrandScramble = useCallback(() => {
        stopBrandScramble();
        setIsBrandScrambling(true);

        let iteration = 0;
        let last = 0;
        // requestAnimationFrame (not setInterval) — pauses when the tab is hidden and
        // matches the Tag scramble. A 32ms time-gate preserves the original cadence.
        const step = (now) => {
            if (last === 0) last = now;
            if (now - last >= 32) {
                last = now;
                setBrandDisplayText(
                    BRAND_TEXT.split("")
                        .map((character, index) => {
                            if (character === " ") {
                                return " ";
                            }

                            if (index < iteration) {
                                return BRAND_TEXT[index];
                            }

                            const randomIndex = Math.floor(Math.random() * HACKER_GLYPHS.length);
                            return HACKER_GLYPHS[randomIndex];
                        })
                        .join("")
                );
                iteration += 0.4;
                if (iteration >= BRAND_TEXT.length) {
                    stopBrandScramble();
                    setBrandDisplayText(BRAND_TEXT);
                    return;
                }
            }
            brandScrambleRafRef.current = window.requestAnimationFrame(step);
        };
        brandScrambleRafRef.current = window.requestAnimationFrame(step);
    }, [stopBrandScramble]);

    const resetBrandText = useCallback(() => {
        stopBrandScramble();
        setBrandDisplayText(BRAND_TEXT);
    }, [stopBrandScramble]);

    // Boot intro — power-on the terminal.
    useEffect(() => {
        const timers = [];
        const intervals = [];
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Resolve the intro immediately: clear pending timers/intervals, reveal the final
        // text, and power on. Wired to a click / Escape / Enter skip (see skipIntro) plus a
        // safety net so a stalled timer never traps the user behind the overlay.
        const finishIntro = () => {
            timers.forEach((timer) => clearTimeout(timer));
            intervals.forEach((interval) => clearInterval(interval));
            setIntroNameDisplay(BRAND_TEXT);
            setIntroTitleDisplay(INTRO_TITLE);
            setIntroPhase("done");
        };
        introSkipRef.current = finishIntro;

        const scrambleText = (targetText, setter, onComplete) => {
            let iteration = 0;
            const step = prefersReducedMotion ? 1 : 0.34;
            const tick = prefersReducedMotion ? 14 : 30;
            const intervalId = window.setInterval(() => {
                setter(
                    targetText
                        .split("")
                        .map((character, index) => {
                            if (character === " ") {
                                return " ";
                            }

                            if (index < iteration) {
                                return targetText[index];
                            }

                            const randomIndex = Math.floor(Math.random() * HACKER_GLYPHS.length);
                            return HACKER_GLYPHS[randomIndex];
                        })
                        .join("")
                );

                iteration += step;
                if (iteration >= targetText.length) {
                    clearInterval(intervalId);
                    setter(targetText);
                    onComplete?.();
                }
            }, tick);

            intervals.push(intervalId);
        };

        scrambleText(BRAND_TEXT, setIntroNameDisplay, () => {
            const titleTimer = window.setTimeout(() => {
                scrambleText(INTRO_TITLE, setIntroTitleDisplay, () => {
                    const exitTimer = window.setTimeout(() => {
                        setIntroPhase("exiting");
                    }, prefersReducedMotion ? 80 : 320);
                    const doneTimer = window.setTimeout(() => {
                        setIntroPhase("done");
                    }, prefersReducedMotion ? 200 : 900);

                    timers.push(exitTimer, doneTimer);
                });
            }, prefersReducedMotion ? 40 : 120);

            timers.push(titleTimer);
        });

        // Safety net: never hold the user on the boot overlay longer than 4s, even if a
        // scramble timer stalls or the tab was backgrounded mid-boot.
        const safetyTimer = window.setTimeout(finishIntro, 4000);
        timers.push(safetyTimer);

        return () => {
            timers.forEach((timer) => clearTimeout(timer));
            intervals.forEach((interval) => clearInterval(interval));
            introSkipRef.current = null;
        };
    }, []);

    useEffect(() => {
        const isIntroActive = introPhase !== "done";
        document.body.classList.toggle("intro-active", isIntroActive);

        return () => {
            document.body.classList.remove("intro-active");
        };
    }, [introPhase]);

    // Keyboard dismiss for the boot intro (click is handled on the overlay itself).
    useEffect(() => {
        if (introPhase === "done") return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape" || event.key === "Enter") {
                event.preventDefault();
                skipIntro();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [introPhase, skipIntro]);

    // Move focus to the boot overlay while it's active so keyboard/AT users land on a
    // dismissible target instead of tabbing through the hidden app behind it.
    useEffect(() => {
        if (introPhase !== "done") {
            introOverlayRef.current?.focus();
        }
    }, [introPhase]);

    useEffect(() => {
        document.body.dataset.theme = theme;
        window.localStorage.setItem("portfolio-theme", theme);
    }, [theme]);

    useEffect(() => {
        return () => {
            if (brandScrambleRafRef.current) {
                cancelAnimationFrame(brandScrambleRafRef.current);
                brandScrambleRafRef.current = null;
            }
            if (tuneTimerRef.current) {
                clearTimeout(tuneTimerRef.current);
                tuneTimerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const loadAnimationTimer = window.setTimeout(() => {
            startBrandScramble();
        }, 120);

        return () => {
            clearTimeout(loadAnimationTimer);
        };
    }, [startBrandScramble]);

    const selectSection = useCallback((id) => {
        if (id === activeSection) return;
        const newIndex = SECTIONS.findIndex((s) => s.id === id);
        const direction = newIndex > activeIndex ? "up" : "down";
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (tuneTimerRef.current) {
            clearTimeout(tuneTimerRef.current);
            tuneTimerRef.current = null;
        }

        // Direction drives the channel-in entrance (up = new panel from below,
        // down = from above). The CRT flicker/static/roll runs concurrently via
        // is-tuning to mask the channel swap — the full CRT retune.
        document.documentElement.dataset.tuneDir = direction;
        setActiveSection(id);
        if (!prefersReducedMotion) {
            setIsTuning(true);
            tuneTimerRef.current = window.setTimeout(() => {
                setIsTuning(false);
                tuneTimerRef.current = null;
            }, 520);
        }
    }, [activeSection, activeIndex]);

    const cycleSection = useCallback((direction) => {
        const next = (activeIndex + direction + SECTIONS.length) % SECTIONS.length;
        selectSection(SECTIONS[next].id);
    }, [activeIndex, selectSection]);

    // Keyboard tuning — arrows + number keys.
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.defaultPrevented) return;
            const target = event.target;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return;
            }

            if (event.metaKey || event.ctrlKey || event.altKey) return;

            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                cycleSection(1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                cycleSection(-1);
            } else if (/^[1-8]$/.test(event.key)) {
                event.preventDefault();
                selectSection(SECTIONS[Number(event.key) - 1].id);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [cycleSection, selectSection]);

    // Touch swipe on the CRT changes channels (mobile): swipe left → next, right → prev.
    // Only horizontal-dominant swipes fire so vertical scrolling the panel still works.
    useEffect(() => {
        const el = crtSurfaceRef.current;
        if (!el) return;
        let startX = 0;
        let startY = 0;
        const onStart = (event) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        };
        const onEnd = (event) => {
            const touch = event.changedTouches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                cycleSection(dx < 0 ? 1 : -1);
            }
        };
        el.addEventListener("touchstart", onStart, { passive: true });
        el.addEventListener("touchend", onEnd, { passive: true });
        return () => {
            el.removeEventListener("touchstart", onStart);
            el.removeEventListener("touchend", onEnd);
        };
    }, [cycleSection]);

    // Keep the active tab in view (mobile horizontal strip) and reset the
    // screen scroll to the top whenever the channel changes.
    useEffect(() => {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        const nav = tabsRef.current;
        const active = nav?.querySelector(".tab.is-active");
        if (nav && active) {
            const navRect = nav.getBoundingClientRect();
            const tabRect = active.getBoundingClientRect();
            const offset = tabRect.left - navRect.left - (nav.clientWidth - tabRect.width) / 2;
            nav.scrollTo({ left: nav.scrollLeft + offset, behavior });
        }
        if (screenBodyRef.current) {
            screenBodyRef.current.scrollTo({ top: 0, behavior });
        }
    }, [activeSection]);

    // Live terminal feed inside the HOME screen.
    useEffect(() => {
        const terminalElement = terminalOutputRef.current;
        if (!terminalElement) {
            return undefined;
        }

        let lineIndex = 0;
        let charIndex = 0;
        let renderedLines = [""];
        let typeTimer;
        let resetTimer;
        let isCancelled = false;

        const renderTerminal = () => {
            const content = renderedLines
                .map((line) => `<div class="terminal-line">${escapeHtml(line)}</div>`)
                .join("");

            terminalElement.innerHTML = `${content}<span class="terminal-cursor"></span>`;
            terminalElement.scrollTop = terminalElement.scrollHeight;
        };

        const stepTerminal = () => {
            if (isCancelled) {
                return;
            }

            const currentTarget = terminalLines[lineIndex];
            if (!currentTarget) {
                return;
            }

            if (charIndex <= currentTarget.length) {
                renderedLines[renderedLines.length - 1] = currentTarget.slice(0, charIndex);
                charIndex += 1;
                renderTerminal();
                const delay = 24 + Math.floor(Math.random() * 26);
                typeTimer = window.setTimeout(stepTerminal, delay);
                return;
            }

            if (lineIndex < terminalLines.length - 1) {
                lineIndex += 1;
                charIndex = 0;
                renderedLines.push("");
                renderTerminal();
                typeTimer = window.setTimeout(stepTerminal, 340);
                return;
            }

            resetTimer = window.setTimeout(() => {
                lineIndex = 0;
                charIndex = 0;
                renderedLines = [""];
                renderTerminal();
                stepTerminal();
            }, 2000);
        };

        renderTerminal();
        stepTerminal();

        return () => {
            isCancelled = true;
            if (typeTimer) {
                clearTimeout(typeTimer);
            }
            if (resetTimer) {
                clearTimeout(resetTimer);
            }
        };
    }, []);

    // A quiet greeting for the curious.
    useEffect(() => {
        const log = window.console.log?.bind(window.console);
        if (!log) return undefined;
        log("%c PDT-3000 // signal established. say hello. ", "color:#6ee7c7;font-family:monospace;font-size:12px");
        return undefined;
    }, []);

    const nextTheme = theme === "light" ? "dark" : "light";

    const renderPanel = (id) => {
        switch (id) {
            case "home":
                return (
                    <div className="panel panel--home">
                        <div className="home-text">
                            <p className="kicker">SecOps · DevOps · Security Engineering</p>
                            <h2 className="panel-title">Security Engineer</h2>
                            <p className="lede normal-case">
                                I reduce risk through proactive detection, practical hardening, and measurable
                                operational improvements — working across VAPT, SOC, SIEM tuning, and DevOps
                                security integration.
                            </p>
                            <p className="home-contact">
                                <span>Email</span>
                                <a href="mailto:contact@safalkarki7.com.np">contact@safalkarki7.com.np</a>
                            </p>
                            <div className="hero-actions">
                                <button className="btn btn-primary" type="button" onClick={() => selectSection("data")}>
                                    Explore Experience
                                </button>
                                <a className="btn" href="/assets/Resume.pdf" download>Download Resume</a>
                            </div>
                            <ul className="quick-facts normal-case">
                                <li><span>Location</span> Nepal</li>
                                <li>
                                    <span>Signal</span>
                                    <ScrambleText
                                        quotes={[
                                            "He who has a why to live can bear almost any how. — Nietzsche",
                                            "The happiness of your life depends upon the quality of your thoughts. — Marcus Aurelius",
                                            "In a time of deceit telling the truth is a revolutionary act. — Orwell",
                                            "What does not kill me, makes me stronger. — Nietzsche",
                                            "Waste no more time arguing about what a good man should be. Be one. — Marcus Aurelius",
                                            "Freedom is the freedom to say that two plus two make four. — Orwell"
                                        ]}
                                        cycleDuration={5000}
                                        transitionDuration={1500}
                                    />
                                </li>
                            </ul>
                        </div>

                        <div className="home-visual">
                            <div className="radar" aria-hidden="true">
                                <div className="radar-rings"></div>
                                <div className="radar-grid"></div>
                                <div className="radar-sweep"></div>
                                <div className="radar-blips">
                                    {RADAR_BLIPS.map((blip) => (
                                        <span
                                            key={blip.label}
                                            className="radar-blip"
                                            style={{ "--bx": `${blip.x}%`, "--by": `${blip.y}%`, "--delay": blip.delay }}
                                        >
                                            <span className="radar-blip-dot"></span>
                                            <span className="radar-blip-label">{blip.label}</span>
                                        </span>
                                    ))}
                                </div>
                                <div className="radar-core"></div>
                            </div>

                            <div className="terminal-panel" aria-label="Live engineering feed">
                                <div className="terminal-top">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <p>session.log</p>
                                </div>
                                <pre id="terminal-output" ref={terminalOutputRef} className="terminal-output normal-case"></pre>
                            </div>
                        </div>
                    </div>
                );
            case "stats":
                return (
                    <div className="panel panel--stats">
                        <header className="panel-head">
                            <h2 className="panel-title">How I work</h2>
                        </header>
                        <div className="stats-grid">
                            <article className="stat-block">
                                <p className="stat-label">Orientation</p>
                                <p className="stat-value">SecOps-first</p>
                                <p className="stat-note normal-case">Security Engineering · proactive detection · hardening · measurable improvement.</p>
                            </article>
                            <article className="stat-block">
                                <p className="stat-label">Workflow</p>
                                <p className="stat-value">SOC · SIEM · VAPT</p>
                                <p className="stat-note normal-case">Alert triage, log correlation, detection tuning, threat-informed remediation.</p>
                            </article>
                            <article className="stat-block">
                                <p className="stat-label">Delivery</p>
                                <p className="stat-value">DevOps integration</p>
                                <p className="stat-note normal-case">Security folded into everyday engineering, not bolted on after.</p>
                            </article>
                        </div>
                        <div className="panel-copy normal-case">
                            <p>
                                I am currently oriented toward Security Engineering with a SecOps-first mindset. I focus on reducing
                                risk through proactive detection, practical hardening, and measurable operational improvements.
                            </p>
                            <p>
                                My workflow combines SOC operations, SIEM-driven analysis, VAPT-informed remediation, and DevOps
                                collaboration so that security becomes part of everyday engineering delivery.
                            </p>
                        </div>
                        <div className="panel-links">
                            <a href="https://github.com/SafalKarkey" target="_blank" rel="noopener noreferrer">GitHub -&gt;</a>
                            <a href="https://www.linkedin.com/in/safal-karki/" target="_blank" rel="noopener noreferrer">LinkedIn -&gt;</a>
                            <a href="https://x.com/safalkarkey" target="_blank" rel="noopener noreferrer">X / Twitter -&gt;</a>
                        </div>
                    </div>
                );
            case "inv":
                return (
                    <div className="panel panel--inv">
                        <header className="panel-head">
                            <h2 className="panel-title">Security, cloud, and platform stack</h2>
                        </header>
                        <div className="skill-grid">
                            <SpotlightCard as="article" className="feature-card">
                                <h3>Security Operations and VAPT</h3>
                                <p className="normal-case">Threat-informed assessment and remediation across servers, web applications, and APIs.</p>
                            </SpotlightCard>
                            <SpotlightCard as="article" className="feature-card">
                                <h3>SOC, SIEM, and Wazuh</h3>
                                <p className="normal-case">Alert triage, log correlation, detection tuning, and operational monitoring using SIEM platforms.</p>
                            </SpotlightCard>
                            <SpotlightCard as="article" className="feature-card">
                                <h3>Linux and Platform Administration</h3>
                                <p className="normal-case">Linux server administration, access control, package management, and web/database server hosting.</p>
                            </SpotlightCard>
                            <SpotlightCard as="article" className="feature-card">
                                <h3>Networking and Infrastructure</h3>
                                <p className="normal-case">Networking, virtualization, DNS, Nginx reverse proxy, SSL/TLS, and secure service exposure.</p>
                            </SpotlightCard>
                            <SpotlightCard as="article" className="feature-card">
                                <h3>Containers and Orchestration</h3>
                                <p className="normal-case">Docker containerization, image security scanning, Kubernetes operations, and Docker Swarm.</p>
                            </SpotlightCard>
                            <SpotlightCard as="article" className="feature-card">
                                <h3>Cloud, IaC, and CI/CD</h3>
                                <p className="normal-case">AWS platform services, Terraform for IaC, and GitHub Actions based delivery pipelines.</p>
                            </SpotlightCard>
                        </div>
                        <div className="tag-groups">
                            {TAG_GROUPS.map((group) => (
                                <div className="tag-group" key={group.label}>
                                    <p className="tag-group-label">{group.label}</p>
                                    <div className="tags-wrap">
                                        {group.tags.map((tag) => <Tag key={tag} label={tag} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "data":
                return (
                    <div className="panel panel--data">
                        <header className="panel-head">
                            <h2 className="panel-title">Professional timeline</h2>
                        </header>
                        <div className="timeline">
                            <article className="timeline-item">
                                <p>Aug 2025 - Present</p>
                                <h3>Associate Software Engineer (SecOps)</h3>
                                <p className="normal-case">Leapfrog Technology, Inc. | Kathmandu, Bagmati, Nepal</p>
                            </article>
                            <article className="timeline-item">
                                <p>Jun 2025 - Aug 2025</p>
                                <h3>DevOps and SecOps Fellow (Internship)</h3>
                                <p className="normal-case">Leapfrog Technology, Inc. | Kathmandu, Bagmati, Nepal</p>
                            </article>
                        </div>
                        <div className="panel-note normal-case">
                            <p>
                                Regularly conducting VAPT across projects and infrastructures, Monitoring through SIEM, Incident Response.
                            </p>
                            <p>Hands-on experience with Networking, virtualization, Linux/server administration, secure application hosting, and containerized deployments.</p>
                        </div>
                    </div>
                );
            case "map":
                return (
                    <div className="panel panel--map">
                        <header className="panel-head">
                            <h2 className="panel-title">Selected work</h2>
                        </header>
                        <div className="projects-grid">
                            <SpotlightCard as="article" className="project-card">
                                <div className="project-media">
                                    <img src="/assets/projects/hand.png" alt="Virtual Hand Simulation preview" />
                                </div>
                                <div className="project-body">
                                    <h3>Virtual Hand Simulation</h3>
                                    <p className="normal-case">Unity + C# based VR simulation with hardware input stream integration via Node.js.</p>
                                    <div className="project-links">
                                        <a href="https://github.com/SafalKarkey/VHand" target="_blank" rel="noopener noreferrer">Code -&gt;</a>
                                    </div>
                                </div>
                            </SpotlightCard>
                            <SpotlightCard as="article" className="project-card">
                                <div className="project-media">
                                    <img src="/assets/projects/flappy.png" alt="Flappy-NP project preview" />
                                </div>
                                <div className="project-body">
                                    <h3>Flappy-NP</h3>
                                    <p className="normal-case">A web game built around local context, showcasing gameplay logic and frontend execution.</p>
                                    <div className="project-links">
                                        <a href="https://safalkarkey.github.io/flappy-np/" target="_blank" rel="noopener noreferrer">Live -&gt;</a>
                                        <a href="https://github.com/SafalKarkey/flappy-np" target="_blank" rel="noopener noreferrer">Code -&gt;</a>
                                    </div>
                                </div>
                            </SpotlightCard>
                            <SpotlightCard as="article" className="project-card">
                                <div className="project-media">
                                    <img src="/assets/projects/robot.png" alt="Humanoid Robot project preview" />
                                </div>
                                <div className="project-body">
                                    <h3>Humanoid Robot</h3>
                                    <p className="normal-case">Team-built simulation and vision-driven robotics project transitioning from model to physical behavior.</p>
                                    <div className="project-links">
                                        <a href="https://www.youtube.com/watch?v=2A26gmyEhpI" target="_blank" rel="noopener noreferrer">Demo -&gt;</a>
                                    </div>
                                </div>
                            </SpotlightCard>
                            <SpotlightCard as="article" className="project-card">
                                <div className="project-media">
                                    <img src="/assets/projects/census.png" alt="Census Data Visualization preview" />
                                </div>
                                <div className="project-body">
                                    <h3>Census Visualization</h3>
                                    <p className="normal-case">Data-driven exploration of Nepal's 2021 census using layered visual storytelling.</p>
                                    <div className="project-links">
                                        <a href="https://safalkarkey.github.io/Census-Visualization/" target="_blank" rel="noopener noreferrer">Website -&gt;</a>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </div>
                        <p className="panel-note normal-case">Built with a balance of experimentation and practical delivery across software, simulation, and data visualization.</p>
                    </div>
                );
            case "edu":
                return (
                    <div className="panel panel--edu">
                        <header className="panel-head">
                            <h2 className="panel-title">Academic timeline</h2>
                        </header>
                        <div className="timeline">
                            <article className="timeline-item">
                                <p>2021 - 2025</p>
                                <h3>Bachelor in Electronics, Communication and Information Engineering</h3>
                                <p className="normal-case">Thapathali Campus, Institute of Engineering, Tribhuvan University</p>
                            </article>
                            <article className="timeline-item">
                                <p>2018 - 2020</p>
                                <h3>+2 Science (Physics Stream)</h3>
                            </article>
                        </div>
                        <p className="panel-note normal-case">Strong core in engineering fundamentals, signal processing context, and applied software problem solving.</p>
                    </div>
                );
            case "log":
                return (
                    <div className="panel panel--log">
                        <header className="panel-head">
                            <h2 className="panel-title">Security acknowledgements</h2>
                        </header>
                        <div className="log-entry">
                            <p className="log-stamp">ACK // PROTON MAIL</p>
                            <div className="panel-copy normal-case">
                                <p>
                                    Listed as a Proton Mail Security Contributor for helping improve Proton Mail security through
                                    responsible disclosure.
                                </p>
                            </div>
                            <div className="panel-links">
                                <a href="https://proton.me/blog/protonmail-security-contributors" target="_blank" rel="noopener noreferrer">
                                    Proton Mail Security Contributors -&gt;
                                </a>
                            </div>
                        </div>
                    </div>
                );
            case "comm":
                return (
                    <div className="panel panel--comm">
                        <header className="panel-head">
                            <h2 className="panel-title">Let&apos;s build something useful</h2>
                        </header>
                        <div className="panel-copy normal-case">
                            <p>
                                If you are hiring, collaborating, or exploring an idea that needs disciplined engineering execution,
                                reach out directly.
                            </p>
                            <a className="btn btn-primary" href="mailto:contact@safalkarki7.com.np">Send Email</a>
                        </div>
                        <div className="panel-links panel-links--comm">
                            <a href="mailto:contact@safalkarki7.com.np">contact@safalkarki7.com.np</a>
                            <a href="https://github.com/SafalKarkey" target="_blank" rel="noopener noreferrer">GitHub -&gt;</a>
                            <a href="https://www.linkedin.com/in/safal-karki/" target="_blank" rel="noopener noreferrer">LinkedIn -&gt;</a>
                            <a href="https://x.com/safalkarkey" target="_blank" rel="noopener noreferrer">X / Twitter -&gt;</a>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {introPhase !== "done" && (
                <div
                    className={`intro-overlay${introPhase === "exiting" ? " is-exiting" : ""}`}
                    onClick={skipIntro}
                    role="dialog"
                    aria-label="Boot intro — click or press Escape to skip"
                    tabIndex={-1}
                    ref={introOverlayRef}
                >
                    <div className="intro-grain" aria-hidden="true"></div>
                    <div className="intro-modal">
                        <p className="intro-kicker">PDT-3000 // booting</p>
                        <h1 className="intro-name">{introNameDisplay}</h1>
                        <p className="intro-title">
                            {introTitleDisplay}
                            <span className="intro-cursor" aria-hidden="true"></span>
                        </p>
                        <p className="intro-skip">click or esc to skip</p>
                    </div>
                </div>
            )}

            <div className="desk" aria-hidden="true">
                <div className="desk-grain"></div>
            </div>

            <div className={`pipboy${introPhase === "done" ? " is-on" : ""}`} inert={introPhase !== "done"}>
                <div className="pipboy-frame">
                    {/* Left control chassis */}
                    <aside className="chassis" aria-label="Terminal controls">
                        <div className="chassis-plate chassis-top">
                            <button
                                type="button"
                                className={`chassis-brand${isBrandScrambling ? " is-scrambling" : ""}`}
                                aria-label={BRAND_TEXT}
                                onMouseEnter={startBrandScramble}
                                onMouseLeave={resetBrandText}
                                onFocus={startBrandScramble}
                                onBlur={resetBrandText}
                                onClick={() => selectSection("home")}
                            >
                                <span className="brand-label">{brandDisplayText}</span>
                            </button>
                            <p className="chassis-serial">PDT-3000 · PERSONAL DATA TERMINAL</p>
                        </div>

                        <nav className="chassis-plate chassis-tabs" aria-label="Section channels" ref={tabsRef}>
                            {SECTIONS.map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    className={`tab${activeSection === section.id ? " is-active" : ""}`}
                                    aria-pressed={activeSection === section.id}
                                    onClick={() => selectSection(section.id)}
                                >
                                    <span className="tab-code">{section.code}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="chassis-plate chassis-dial">
                            <button
                                type="button"
                                className="scroll-wheel"
                                aria-label="Tune to next channel"
                                onClick={() => cycleSection(1)}
                            >
                                <span className="scroll-wheel-inner" style={{ transform: `rotate(${activeIndex * 45}deg)` }}>
                                    <span className="scroll-notch" />
                                    <span className="scroll-notch" />
                                    <span className="scroll-notch" />
                                    <span className="scroll-notch" />
                                </span>
                                <span className="scroll-wheel-readout">
                                    {String(activeIndex + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}
                                </span>
                            </button>

                            <div className="radio-dial" aria-hidden="true">
                                <div className="radio-lamp" />
                                <div className="radio-vents">
                                    <span /><span /><span /><span /><span />
                                </div>
                                <p className="radio-freq">{activeMeta.code} · {activeMeta.kicker}</p>
                            </div>

                            <button
                                id="theme-toggle"
                                type="button"
                                className="theme-toggle"
                                aria-label="Toggle theme mode"
                                aria-pressed={theme === "light"}
                                onClick={() => setTheme(nextTheme)}
                            >
                                <span className="toggle-track">
                                    <span className="toggle-thumb"></span>
                                </span>
                                <span className="toggle-label">{theme === "light" ? "LGT" : "DRK"}</span>
                            </button>
                        </div>
                    </aside>

                    {/* CRT screen */}
                    <section className="crt" aria-label="Terminal display">
                        <div className="crt-bezel">
                            <div className={`crt-surface${isTuning ? " is-tuning" : ""}`} ref={crtSurfaceRef}>
                                <div className="crt-scanlines" aria-hidden="true"></div>
                                <div className="crt-vignette" aria-hidden="true"></div>
                                <div className="crt-static" aria-hidden="true"></div>
                                <div className="crt-roll" aria-hidden="true"></div>

                                <div className="crt-statusbar">
                                    <span className="crt-status-center">{activeMeta.code} · {activeMeta.label}</span>
                                    <span className="crt-status-right">SIG ██████&nbsp;98%</span>
                                </div>

                                <div className="crt-body" ref={screenBodyRef}>
                                    {SECTIONS.map((section) => (
                                        <div
                                            key={section.id}
                                            className={`screen-panel${activeSection === section.id ? " is-active" : ""}`}
                                            hidden={activeSection !== section.id}
                                            aria-hidden={activeSection !== section.id}
                                        >
                                            {renderPanel(section.id)}
                                        </div>
                                    ))}
                                </div>

                                <div className="crt-statusbar crt-statusbar--bottom">
                                    <span>PDT-3000</span>
                                    <span className="crt-hint">use ◀ ▶ or the scroll wheel to tune</span>
                                    <span>© 2026</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default App;
