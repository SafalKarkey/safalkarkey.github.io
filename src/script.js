const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = themeToggle?.querySelector(".toggle-label");
const terminalOutput = document.getElementById("terminal-output");
const cursorGlow = document.getElementById("cursor-glow");
const siteHeader = document.querySelector(".site-header");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark" || savedTheme === "light") {
    body.dataset.theme = savedTheme;
}

function syncThemeUI() {
    if (!themeToggle || !themeLabel) {
        return;
    }

    const activeTheme = body.dataset.theme === "light" ? "light" : "dark";
    themeToggle.setAttribute("aria-pressed", String(activeTheme === "light"));
    themeLabel.textContent = activeTheme;
}

syncThemeUI();

themeToggle?.addEventListener("click", () => {
    const nextTheme = body.dataset.theme === "light" ? "dark" : "light";
    body.dataset.theme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    syncThemeUI();
});

function syncHeaderScrollOffset() {
    if (!siteHeader) {
        return;
    }

    const topOffset = parseFloat(window.getComputedStyle(siteHeader).top) || 0;
    const headerHeight = siteHeader.getBoundingClientRect().height;
    const totalOffset = Math.ceil(topOffset + headerHeight);
    document.documentElement.style.setProperty("--header-scroll-offset", `${totalOffset}px`);
}

syncHeaderScrollOffset();
window.addEventListener("resize", syncHeaderScrollOffset);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
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
    });
});

const revealElements = document.querySelectorAll(".reveal");
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
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

const terminalLines = [
    "$ init --profile safal",
    "> loading engineering context...",
    "> stack: web | systems | automation | ml",
    "> mode: build, ship, iterate",
    "$ status --now",
    "> ready for the next challenge",
];

function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

if (terminalOutput) {
    let lineIndex = 0;
    let charIndex = 0;
    let renderedLines = [""];
    let resetTimer;

    const renderTerminal = () => {
        const content = renderedLines
            .map((line) => `<div class="terminal-line">${escapeHtml(line)}</div>`)
            .join("");

        terminalOutput.innerHTML = `${content}<span class="terminal-cursor"></span>`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const stepTerminal = () => {
        if (resetTimer) {
            clearTimeout(resetTimer);
            resetTimer = undefined;
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
            window.setTimeout(stepTerminal, delay);
            return;
        }

        if (lineIndex < terminalLines.length - 1) {
            lineIndex += 1;
            charIndex = 0;
            renderedLines.push("");
            renderTerminal();
            window.setTimeout(stepTerminal, 340);
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
}

if (cursorGlow) {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
        cursorGlow.style.display = "none";
    } else {
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        window.addEventListener("pointermove", (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
        });

        const animateGlow = () => {
            currentX += (targetX - currentX) * 0.16;
            currentY += (targetY - currentY) * 0.16;
            cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
            window.requestAnimationFrame(animateGlow);
        };

        animateGlow();
    }
}
