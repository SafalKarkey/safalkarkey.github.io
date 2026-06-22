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

const RADAR_BLIPS = [
    { label: "SIEM", x: 72, y: 34 },
    { label: "VAPT", x: 30, y: 28 },
    { label: "Wazuh", x: 64, y: 70 },
    { label: "K8s", x: 38, y: 64 },
    { label: "AWS", x: 80, y: 58 },
    { label: "Terraform", x: 22, y: 52 },
];

const TAGS = [
    "VAPT", "SOC", "SIEM", "Wazuh", "DevOps", "DevSecOps", "CI/CD",
    "GitHub Actions", "Terraform", "AWS", "VPC", "EC2", "RDS", "DynamoDB",
    "ECS", "IAM", "S3", "CloudFront", "Route53", "CloudWatch", "Inspector",
    "GuardDuty", "Security Hub", "AWS WAF", "Lambda", "API Gateway", "Docker",
    "Kubernetes", "Docker Swarm", "Networking", "Infrastructure", "Virtualization",
    "Linux", "Linux Administration", "Nginx", "DNS", "Reverse Proxy", "SSL/TLS",
    "Bash", "Monitoring", "Incident Response", "CTF", "OSINT", "Node.js", "React",
    "PostgreSQL", "JavaScript", "Git",
];

function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function Tag({ label }) {
    const [display, setDisplay] = useState(label);
    const intervalRef = useRef(null);
    const isHovering = useRef(false);

    const clear = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const onEnter = useCallback(() => {
        isHovering.current = true;
        clear();
        let iteration = 0;
        intervalRef.current = window.setInterval(() => {
            if (!isHovering.current) return;
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
            }
        }, 28);
    }, [label, clear]);

    const onLeave = useCallback(() => {
        isHovering.current = false;
        clear();
        setDisplay(label);
    }, [label, clear]);

    useEffect(() => () => clear(), [clear]);

    return (
        <span onMouseEnter={onEnter} onMouseLeave={onLeave} onFocus={onEnter} onBlur={onLeave}>
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
    const [brandDisplayText, setBrandDisplayText] = useState(BRAND_TEXT);
    const [isBrandScrambling, setIsBrandScrambling] = useState(false);
    const [introNameDisplay, setIntroNameDisplay] = useState("");
    const [introTitleDisplay, setIntroTitleDisplay] = useState("");
    const [introPhase, setIntroPhase] = useState("active");
    const [scrollProgress, setScrollProgress] = useState(0);

    const siteHeaderRef = useRef(null);
    const terminalOutputRef = useRef(null);
    const brandScrambleIntervalRef = useRef(null);
    const cursorGlowRef = useRef(null);
    const radarRef = useRef(null);

    const stopBrandScramble = useCallback(() => {
        if (brandScrambleIntervalRef.current) {
            clearInterval(brandScrambleIntervalRef.current);
            brandScrambleIntervalRef.current = null;
        }

        setIsBrandScrambling(false);
    }, []);

    const startBrandScramble = useCallback(() => {
        stopBrandScramble();
        setIsBrandScrambling(true);

        let iteration = 0;
        brandScrambleIntervalRef.current = window.setInterval(() => {
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
            }
        }, 32);
    }, [stopBrandScramble]);

    const resetBrandText = useCallback(() => {
        stopBrandScramble();
        setBrandDisplayText(BRAND_TEXT);
    }, [stopBrandScramble]);

    useEffect(() => {
        const timers = [];
        const intervals = [];
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

        return () => {
            timers.forEach((timer) => clearTimeout(timer));
            intervals.forEach((interval) => clearInterval(interval));
        };
    }, []);

    useEffect(() => {
        const isIntroActive = introPhase !== "done";
        document.body.classList.toggle("intro-active", isIntroActive);

        return () => {
            document.body.classList.remove("intro-active");
        };
    }, [introPhase]);

    useEffect(() => {
        document.body.dataset.theme = theme;
        window.localStorage.setItem("portfolio-theme", theme);
    }, [theme]);

    useEffect(() => {
        return () => {
            if (brandScrambleIntervalRef.current) {
                clearInterval(brandScrambleIntervalRef.current);
                brandScrambleIntervalRef.current = null;
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

    useEffect(() => {
        const header = siteHeaderRef.current;
        if (!header) {
            return undefined;
        }

        const syncHeaderScrollOffset = () => {
            const topOffset = parseFloat(window.getComputedStyle(header).top) || 0;
            const headerHeight = header.getBoundingClientRect().height;
            const totalOffset = Math.ceil(topOffset + headerHeight);
            document.documentElement.style.setProperty("--header-scroll-offset", `${totalOffset}px`);
        };

        syncHeaderScrollOffset();
        window.addEventListener("resize", syncHeaderScrollOffset);

        return () => {
            window.removeEventListener("resize", syncHeaderScrollOffset);
        };
    }, []);

    useEffect(() => {
        const header = siteHeaderRef.current;
        if (!header) {
            return undefined;
        }

        const mobileMediaQuery = window.matchMedia("(max-width: 1100px)");
        let lastScrollY = window.scrollY;
        let rafId = null;

        const setHeaderHidden = (shouldHide) => {
            header.classList.toggle("mobile-header-hidden", shouldHide);
        };

        const syncHeaderVisibility = () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;
            const nearTop = currentScrollY < 28;

            if (!mobileMediaQuery.matches || nearTop || scrollDelta < -6) {
                setHeaderHidden(false);
            } else if (scrollDelta > 6) {
                setHeaderHidden(true);
            }

            lastScrollY = currentScrollY;
            rafId = null;
        };

        const onScroll = () => {
            if (rafId !== null) {
                return;
            }

            rafId = window.requestAnimationFrame(syncHeaderVisibility);
        };

        const onViewportChange = () => {
            if (!mobileMediaQuery.matches) {
                setHeaderHidden(false);
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onViewportChange);
        if (typeof mobileMediaQuery.addEventListener === "function") {
            mobileMediaQuery.addEventListener("change", onViewportChange);
        } else {
            mobileMediaQuery.addListener(onViewportChange);
        }

        onViewportChange();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onViewportChange);
            if (typeof mobileMediaQuery.removeEventListener === "function") {
                mobileMediaQuery.removeEventListener("change", onViewportChange);
            } else {
                mobileMediaQuery.removeListener(onViewportChange);
            }
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
            setHeaderHidden(false);
        };
    }, []);

    useEffect(() => {
        const anchorHandlers = [];
        const anchors = document.querySelectorAll('a[href^="#"]');

        anchors.forEach((anchor) => {
            const handler = (event) => {
                const targetId = anchor.getAttribute("href");
                if (!targetId || targetId === "#") {
                    return;
                }

                const targetElement = document.querySelector(targetId);
                if (!targetElement) {
                    return;
                }

                event.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            };

            anchor.addEventListener("click", handler);
            anchorHandlers.push([anchor, handler]);
        });

        return () => {
            anchorHandlers.forEach(([anchor, handler]) => {
                anchor.removeEventListener("click", handler);
            });
        };
    }, []);

    useEffect(() => {
        const revealElements = document.querySelectorAll(".reveal");
        if (revealElements.length === 0) {
            return undefined;
        }

        if ("IntersectionObserver" in window) {
            const revealObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-visible");
                            revealObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.14 }
            );

            revealElements.forEach((element) => revealObserver.observe(element));

            return () => {
                revealObserver.disconnect();
            };
        }

        revealElements.forEach((element) => element.classList.add("is-visible"));
        return undefined;
    }, []);

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

    // Cursor-following signal glow + scroll progress.
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        const glow = cursorGlowRef.current;
        if (prefersReducedMotion || isTouch || !glow) {
            return undefined;
        }

        let rafId = null;
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        const onPointerMove = (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
            if (rafId === null) {
                rafId = window.requestAnimationFrame(tick);
            }
        };

        const tick = () => {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;
            glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
            if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
                rafId = window.requestAnimationFrame(tick);
            } else {
                rafId = null;
            }
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
            setScrollProgress(Math.min(1, Math.max(0, progress)));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Radar: blips ping brighter near the cursor.
    useEffect(() => {
        const radar = radarRef.current;
        if (!radar) {
            return undefined;
        }
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            return undefined;
        }

        const blips = Array.from(radar.querySelectorAll(".radar-blip"));
        let rafId = null;
        let pointerX = null;
        let pointerY = null;

        const onMove = (event) => {
            const rect = radar.getBoundingClientRect();
            pointerX = event.clientX - rect.left;
            pointerY = event.clientY - rect.top;
            if (rafId === null) {
                rafId = window.requestAnimationFrame(update);
            }
        };

        const onLeave = () => {
            pointerX = null;
            pointerY = null;
            blips.forEach((blip) => blip.style.setProperty("--ping", "0"));
        };

        const update = () => {
            if (pointerX === null) {
                rafId = null;
                return;
            }
            const rect = radar.getBoundingClientRect();
            const radius = rect.width / 2;
            for (const blip of blips) {
                const bx = (parseFloat(blip.style.getPropertyValue("--bx")) / 100) * rect.width;
                const by = (parseFloat(blip.style.getPropertyValue("--by")) / 100) * rect.height;
                const dist = Math.hypot(pointerX - bx, pointerY - by);
                const ping = Math.max(0, 1 - dist / (radius * 0.55));
                blip.style.setProperty("--ping", ping.toFixed(2));
            }
            rafId = null;
        };

        radar.addEventListener("pointermove", onMove, { passive: true });
        radar.addEventListener("pointerleave", onLeave, { passive: true });
        return () => {
            radar.removeEventListener("pointermove", onMove);
            radar.removeEventListener("pointerleave", onLeave);
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, []);

    // A quiet greeting for the curious — replaces the old devtools/contextmenu blocking.
    useEffect(() => {
        const log = window.console.log?.bind(window.console);
        if (!log) return undefined;
        log("%c hehe hello there. just a little easter egg ", "color:#6ee7c7;font-family:monospace;font-size:12px");
        return undefined;
    }, []);

    const nextTheme = theme === "light" ? "dark" : "light";

    return (
        <>
            <div className="scroll-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${scrollProgress})` }} />
            </div>

            {introPhase !== "done" && (
                <div className={`intro-overlay${introPhase === "exiting" ? " is-exiting" : ""}`}>
                    <div className="intro-grain" aria-hidden="true"></div>
                    <div className="intro-modal">
                        <p className="intro-kicker">Booting profile</p>
                        <h1 className="intro-name">{introNameDisplay}</h1>
                        <p className="intro-title">
                            {introTitleDisplay}
                            <span className="intro-cursor" aria-hidden="true"></span>
                        </p>
                    </div>
                </div>
            )}

            <div className="ambient" aria-hidden="true">
                <div className="aurora"></div>
                <div className="aurora aurora--warm"></div>
                <div className="ambient-grain"></div>
                <div className="cursor-glow" ref={cursorGlowRef}></div>
            </div>

            <div className={`portfolio-shell${introPhase === "done" ? " is-ready" : ""}`}>
                <header className="site-header shell-grid" ref={siteHeaderRef}>
                    <a
                        href="#home"
                        className={`brand cell${isBrandScrambling ? " is-scrambling" : ""}`}
                        aria-label={BRAND_TEXT}
                        onMouseEnter={startBrandScramble}
                        onMouseLeave={resetBrandText}
                        onFocus={startBrandScramble}
                        onBlur={resetBrandText}
                    >
                        <span className="brand-label">{brandDisplayText}</span>
                    </a>
                    <nav className="cell nav-links" aria-label="Primary navigation">
                        <a href="#about">About</a>
                        <a href="#skills">Capabilities</a>
                        <a href="#experience">Experience</a>
                        <a href="#projects">Projects</a>
                        <a href="#education">Education</a>
                        <a href="#recognition">Recognition</a>
                        <a href="#contact">Contact</a>
                    </nav>
                    <div className="cell header-tools">
                        <button
                            id="theme-toggle"
                            className="theme-toggle"
                            type="button"
                            aria-label="Toggle theme mode"
                            aria-pressed={theme === "light"}
                            onClick={() => setTheme(nextTheme)}
                        >
                            <span className="toggle-track">
                                <span className="toggle-thumb"></span>
                            </span>
                            <span className="toggle-label">{theme}</span>
                        </button>
                    </div>
                </header>

                <main className="site-main" id="home">
                <section className="hero shell-grid reveal">
                    <div className="cell hero-intro">
                        <p className="kicker">SecOps · DevOps · Security Engineering</p>
                        <h1>Security Engineer</h1>
                        <p className="lede normal-case">
                            I reduce risk through proactive detection, practical hardening, and measurable
                            operational improvements — working across VAPT, SOC, SIEM tuning, and DevOps
                            security integration.
                        </p>
                        <div className="hero-actions">
                            <a className="btn btn-primary" href="#experience">Explore Experience</a>
                            <a className="btn" href="/assets/Resume.pdf" download>Download Resume</a>
                        </div>
                        <ul className="quick-facts normal-case">
                            <li><span>Email</span> <a href="mailto:contact@safalkarki7.com.np">contact@safalkarki7.com.np</a></li>
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

                    <div className="cell hero-visual">
                        <div className="radar" ref={radarRef} aria-hidden="true">
                            <div className="radar-rings"></div>
                            <div className="radar-grid"></div>
                            <div className="radar-sweep"></div>
                            <div className="radar-blips">
                                {RADAR_BLIPS.map((blip) => (
                                    <span
                                        key={blip.label}
                                        className="radar-blip"
                                        style={{ "--bx": `${blip.x}%`, "--by": `${blip.y}%`, "--ping": 0 }}
                                    >
                                        <span className="radar-blip-dot"></span>
                                        <span className="radar-blip-label">{blip.label}</span>
                                    </span>
                                ))}
                            </div>
                            <div className="radar-core"></div>
                            <p className="radar-readout normal-case">
                                <span className="dot" /> live · signal over noise
                            </p>
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
                </section>

                <section id="about" className="shell-grid reveal">
                    <div className="cell section-heading">
                        <p className="kicker">About</p>
                        <h2>How I work</h2>
                    </div>
                    <div className="cell section-copy normal-case">
                        <p>
                            I am currently oriented toward Security Engineering with a SecOps-first mindset. I focus on reducing
                            risk through proactive detection, practical hardening, and measurable operational improvements.
                        </p>
                        <p>
                            My workflow combines SOC operations, SIEM-driven analysis, VAPT-informed remediation, and DevOps
                            collaboration so that security becomes part of everyday engineering delivery.
                        </p>
                    </div>
                    <div className="cell section-links">
                        <a href="https://github.com/SafalKarkey" target="_blank" rel="noopener noreferrer">GitHub -&gt;</a>
                        <a href="https://www.linkedin.com/in/safal-karki/" target="_blank" rel="noopener noreferrer">LinkedIn -&gt;</a>
                        <a href="https://x.com/safalkarkey" target="_blank" rel="noopener noreferrer">X / Twitter -&gt;</a>
                    </div>
                </section>

                <section id="skills" className="shell-grid reveal">
                    <div className="cell section-heading">
                        <p className="kicker">Capabilities</p>
                        <h2>Security, cloud, and platform stack</h2>
                    </div>
                    <div className="cell skill-grid">
                        <SpotlightCard as="article" className="feature-card">
                            <h3>Security Operations and VAPT</h3>
                            <p className="normal-case">
                                Threat-informed assessment and remediation across servers, web applications, and APIs.
                            </p>
                        </SpotlightCard>
                        <SpotlightCard as="article" className="feature-card">
                            <h3>SOC, SIEM, and Wazuh</h3>
                            <p className="normal-case">
                                Alert triage, log correlation, detection tuning, and operational monitoring using SIEM platforms.
                            </p>
                        </SpotlightCard>
                        <SpotlightCard as="article" className="feature-card">
                            <h3>Linux and Platform Administration</h3>
                            <p className="normal-case">
                                Linux server administration, access control, package management, and web/database server hosting.
                            </p>
                        </SpotlightCard>
                        <SpotlightCard as="article" className="feature-card">
                            <h3>Networking and Infrastructure</h3>
                            <p className="normal-case">
                                Networking, virtualization, DNS, Nginx reverse proxy, SSL/TLS, and secure service exposure.
                            </p>
                        </SpotlightCard>
                        <SpotlightCard as="article" className="feature-card">
                            <h3>Containers and Orchestration</h3>
                            <p className="normal-case">
                                Docker containerization, image security scanning, Kubernetes operations, and Docker Swarm.
                            </p>
                        </SpotlightCard>
                        <SpotlightCard as="article" className="feature-card">
                            <h3>Cloud, IaC, and CI/CD</h3>
                            <p className="normal-case">
                                AWS platform services, Terraform for IaC, and GitHub Actions based delivery pipelines.
                            </p>
                        </SpotlightCard>
                    </div>
                    <div className="cell tags-wrap">
                        {TAGS.map((tag) => <Tag key={tag} label={tag} />)}
                    </div>
                </section>

                <section id="experience" className="shell-grid reveal">
                    <div className="cell section-heading">
                        <p className="kicker">Experience</p>
                        <h2>Professional timeline</h2>
                    </div>
                    <div className="cell timeline">
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
                    <div className="cell timeline-note normal-case">
                        <p>
                            Regularly conducting VAPT across projects and infrastructures, Monitoring through SIEM, Incident Response.
                        </p>
                        <p>Hands-on experience with Networking, virtualization, Linux/server
                        administration, secure application hosting, and containerized deployments. </p>
                    </div>
                </section>

                <section id="projects" className="shell-grid reveal">
                    <div className="cell section-heading">
                        <p className="kicker">Projects</p>
                        <h2>Selected work</h2>
                    </div>
                    <div className="cell projects-grid">
                        <SpotlightCard as="article" className="project-card">
                            <div className="project-media">
                                <img src="/assets/projects/hand.png" alt="Virtual Hand Simulation preview" />
                            </div>
                            <div className="project-body">
                                <h3>Virtual Hand Simulation</h3>
                                <p className="normal-case">
                                    Unity + C# based VR simulation with hardware input stream integration via Node.js.
                                </p>
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
                                <p className="normal-case">
                                    A web game built around local context, showcasing gameplay logic and frontend execution.
                                </p>
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
                                <p className="normal-case">
                                    Team-built simulation and vision-driven robotics project transitioning from model to physical
                                    behavior.
                                </p>
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
                                <p className="normal-case">
                                    Data-driven exploration of Nepal's 2021 census using layered visual storytelling.
                                </p>
                                <div className="project-links">
                                    <a href="https://safalkarkey.github.io/Census-Visualization/" target="_blank" rel="noopener noreferrer">Website -&gt;</a>
                                </div>
                            </div>
                        </SpotlightCard>
                    </div>
                    <div className="cell project-note normal-case">
                        Built with a balance of experimentation and practical delivery across software, simulation, and data
                        visualization.
                    </div>
                </section>

                <section id="education" className="shell-grid reveal">
                    <div className="cell section-heading">
                        <p className="kicker">Education</p>
                        <h2>Academic timeline</h2>
                    </div>
                    <div className="cell timeline">
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
                    <div className="cell timeline-note normal-case">
                        Strong core in engineering fundamentals, signal processing context, and applied software problem solving.
                    </div>
                </section>

                <section id="recognition" className="shell-grid reveal">
                    <div className="cell section-heading">
                        <p className="kicker">Recognition</p>
                        <h2>Security acknowledgements</h2>
                    </div>
                    <div className="cell section-copy normal-case">
                        <p>
                            Listed as a Proton Mail Security Contributor for helping improve Proton Mail security through
                            responsible disclosure.
                        </p>
                    </div>
                    <div className="cell section-links">
                        <a href="https://proton.me/blog/protonmail-security-contributors" target="_blank" rel="noopener noreferrer">
                            Proton Mail Security Contributors -&gt;
                        </a>
                    </div>
                </section>

                <section id="contact" className="shell-grid reveal">
                    <div className="cell section-heading">
                        <p className="kicker">Contact</p>
                        <h2>Let&apos;s build something useful</h2>
                    </div>
                    <div className="cell contact-copy normal-case">
                        <p>
                            If you are hiring, collaborating, or exploring an idea that needs disciplined engineering execution,
                            reach out directly.
                        </p>
                        <a className="btn btn-primary" href="mailto:contact@safalkarki7.com.np">Send Email</a>
                    </div>
                    <div className="cell contact-links">
                        <a href="mailto:contact@safalkarki7.com.np">contact@safalkarki7.com.np</a>
                        <a href="https://github.com/SafalKarkey" target="_blank" rel="noopener noreferrer">GitHub -&gt;</a>
                        <a href="https://www.linkedin.com/in/safal-karki/" target="_blank" rel="noopener noreferrer">LinkedIn -&gt;</a>
                        <a href="https://x.com/safalkarkey" target="_blank" rel="noopener noreferrer">X / Twitter -&gt;</a>
                    </div>
                </section>
                </main>

                <footer className="site-footer shell-grid">
                    <p className="cell">Safal Karki</p>
                    <p className="cell normal-case">Security Engineering · SecOps · DevOps</p>
                    <p className="cell">© 2026</p>
                </footer>
            </div>
        </>
    );
}

export default App;
