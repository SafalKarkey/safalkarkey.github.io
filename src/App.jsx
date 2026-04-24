import { useCallback, useEffect, useRef, useState } from "react";

const terminalLines = [
    "$ init --profile safal",
    "> loading security engineering context...",
    "> stack: secops | devops | security engineering",
    "> capabilities: vapt | soc | siem | wazuh",
    "$ status --now",
    "> securing systems and delivery pipelines",
];
const BRAND_TEXT = "Safal Karki";
const HACKER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-_";

function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
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

    const siteHeaderRef = useRef(null);
    const terminalOutputRef = useRef(null);
    const cursorGlowRef = useRef(null);
    const brandScrambleIntervalRef = useRef(null);

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

    useEffect(() => {
        const cursorGlow = cursorGlowRef.current;
        if (!cursorGlow) {
            return undefined;
        }

        const finePointer = window.matchMedia("(pointer: fine)").matches;
        if (!finePointer) {
            cursorGlow.style.display = "none";
            return undefined;
        }

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;
        let animationFrameId;

        const onPointerMove = (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
        };

        const animateGlow = () => {
            currentX += (targetX - currentX) * 0.16;
            currentY += (targetY - currentY) * 0.16;
            cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
            animationFrameId = window.requestAnimationFrame(animateGlow);
        };

        window.addEventListener("pointermove", onPointerMove);
        animateGlow();

        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    useEffect(() => {
        const devtoolsKeySet = new Set(["i", "j", "c", "k"]);

        const blockDevtoolsShortcuts = (event) => {
            const key = event.key.toLowerCase();
            const usesCommandOrControl = event.ctrlKey || event.metaKey;
            const isF12 = key === "f12";
            const isDevtoolsChord = usesCommandOrControl && event.shiftKey && devtoolsKeySet.has(key);
            const isViewSource = usesCommandOrControl && key === "u";
            const isMacAltChord = event.metaKey && event.altKey && devtoolsKeySet.has(key);

            if (isF12 || isDevtoolsChord || isViewSource || isMacAltChord) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        const blockContextMenu = (event) => {
            event.preventDefault();
        };

        window.addEventListener("keydown", blockDevtoolsShortcuts, true);
        window.addEventListener("contextmenu", blockContextMenu);

        return () => {
            window.removeEventListener("keydown", blockDevtoolsShortcuts, true);
            window.removeEventListener("contextmenu", blockContextMenu);
        };
    }, []);

    const nextTheme = theme === "light" ? "dark" : "light";

    return (
        <>
            <div className="ambient" aria-hidden="true">
                <div className="ambient-noise"></div>
                <div className="ambient-scanlines"></div>
                <div id="cursor-glow" className="cursor-glow" ref={cursorGlowRef}></div>
            </div>

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
                        <p className="kicker">Security Engineer | SecOps and DevOps</p>
                        <h1>Security Engineer</h1>
                        <p className="lede normal-case">
                            I currently work in SecOps engineering with hands-on experience in offensive/defensive operations, monitoring,
                            hardening, and secure delivery. My focus is maintaining systems in an observable and secure way at scale.
                        </p>
                        <div className="hero-actions">
                            <a className="btn btn-primary" href="#experience">Explore Experience</a>
                            <a className="btn" href="/assets/Resume.pdf" download>Download Resume</a>
                        </div>
                        <ul className="quick-facts normal-case">
                            <li><span>Email</span> <a href="mailto:contact@safalkarki7.com.np">contact@safalkarki7.com.np</a></li>
                            <li><span>Location</span> Kathmandu, Nepal</li>
                            <li><span>Status</span>Forging the shield, sharpening the sword</li>
                        </ul>
                    </div>

                    <div className="cell hero-visual">
                        <div className="profile-panel">
                            <img src="/assets/backsafal.jpg" alt="Safal Karki portrait" />
                            <div>
                                <p className="panel-title">Current Focus</p>
                                <p className="normal-case">
                                    SecOps, VAPT-informed remediation, SOC workflows, SIEM tuning, and DevOps security
                                    integration.
                                </p>
                            </div>
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
                        <article className="feature-card">
                            <h3>Security Operations and VAPT</h3>
                            <p className="normal-case">
                                Threat-informed assessment and remediation across servers, web applications, and APIs.
                            </p>
                        </article>
                        <article className="feature-card">
                            <h3>SOC, SIEM, and Wazuh</h3>
                            <p className="normal-case">
                                Alert triage, log correlation, detection tuning, and operational monitoring using SIEM platforms.
                            </p>
                        </article>
                        <article className="feature-card">
                            <h3>Linux and Platform Administration</h3>
                            <p className="normal-case">
                                Linux server administration, access control, package management, and web/database server hosting.
                            </p>
                        </article>
                        <article className="feature-card">
                            <h3>Networking and Infrastructure</h3>
                            <p className="normal-case">
                                Networking, virtualization, DNS, Nginx reverse proxy, SSL/TLS, and secure service exposure.
                            </p>
                        </article>
                        <article className="feature-card">
                            <h3>Containers and Orchestration</h3>
                            <p className="normal-case">
                                Docker containerization, image security scanning, Kubernetes operations, and Docker Swarm.
                            </p>
                        </article>
                        <article className="feature-card">
                            <h3>Cloud, IaC, and CI/CD</h3>
                            <p className="normal-case">
                                AWS platform services, Terraform for IaC, and GitHub Actions based delivery pipelines.
                            </p>
                        </article>
                    </div>
                    <div className="cell tags-wrap">
                        <span>VAPT</span>
                        <span>SOC</span>
                        <span>SIEM</span>
                        <span>Wazuh</span>
                        <span>DevOps</span>
                        <span>DevSecOps</span>
                        <span>CI/CD</span>
                        <span>GitHub Actions</span>
                        <span>Terraform</span>
                        <span>AWS</span>
                        <span>VPC</span>
                        <span>EC2</span>
                        <span>RDS</span>
                        <span>DynamoDB</span>
                        <span>ECS</span>
                        <span>IAM</span>
                        <span>S3</span>
                        <span>CloudFront</span>
                        <span>Route53</span>
                        <span>CloudWatch</span>
                        <span>Inspector</span>
                        <span>GuardDuty</span>
                        <span>Security Hub</span>
                        <span>AWS WAF</span>
                        <span>Lambda</span>
                        <span>API Gateway</span>
                        <span>Docker</span>
                        <span>Kubernetes</span>
                        <span>Docker Swarm</span>
                        <span>Networking</span>
                        <span>Infrastructure</span>
                        <span>Virtualization</span>
                        <span>Linux</span>
                        <span>Linux Administration</span>
                        <span>Nginx</span>
                        <span>DNS</span>
                        <span>Reverse Proxy</span>
                        <span>SSL/TLS</span>
                        <span>Bash</span>
                        <span>Monitoring</span>
                        <span>Incident Response</span>
                        <span>CTF</span>
                        <span>OSINT</span>
                        <span>Node.js</span>
                        <span>React</span>
                        <span>PostgreSQL</span>
                        <span>JavaScript</span>
                        <span>Git</span>
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
                        <article className="project-card">
                            <img src="/assets/projects/hand.png" alt="Virtual Hand Simulation preview" />
                            <div className="project-body">
                                <h3>Virtual Hand Simulation</h3>
                                <p className="normal-case">
                                    Unity + C# based VR simulation with hardware input stream integration via Node.js.
                                </p>
                                <div className="project-links">
                                    <a href="https://github.com/SafalKarkey/VHand" target="_blank" rel="noopener noreferrer">Code -&gt;</a>
                                </div>
                            </div>
                        </article>

                        <article className="project-card">
                            <img src="/assets/projects/flappy.png" alt="Flappy-NP project preview" />
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
                        </article>

                        <article className="project-card">
                            <img src="/assets/projects/robot.png" alt="Humanoid Robot project preview" />
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
                        </article>

                        <article className="project-card">
                            <img src="/assets/projects/census.png" alt="Census Data Visualization preview" />
                            <div className="project-body">
                                <h3>Census Visualization</h3>
                                <p className="normal-case">
                                    Data-driven exploration of Nepal's 2021 census using layered visual storytelling.
                                </p>
                                <div className="project-links">
                                    <a href="https://safalkarkey.github.io/Census-Visualization/" target="_blank" rel="noopener noreferrer">Website -&gt;</a>
                                </div>
                            </div>
                        </article>
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
                <p className="cell normal-case">Security Engineering - SecOps - DevOps</p>
                <p className="cell">(c) 2026</p>
            </footer>
        </>
    );
}

export default App;
