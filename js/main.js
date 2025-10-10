/**
 * PORTFOLIO TERMINAL - MAIN JAVASCRIPT
 * Modern ES6+ Vanilla JavaScript
 * No jQuery, no dependencies
 */

// ============================================
// CONSTANTS & CONFIG
// ============================================
const CONFIG = {
    TYPING_SPEED: 50,
    SCROLL_OFFSET: 80,
    THEME_KEY: 'portfolio-theme',
    ANIMATION_DELAY: 100
};

// ============================================
// THEME MANAGER
// ============================================
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.attachEventListeners();
    }

    getStoredTheme() {
        return localStorage.getItem(CONFIG.THEME_KEY);
    }

    setStoredTheme(theme) {
        localStorage.setItem(CONFIG.THEME_KEY, theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.showToast(`Theme switched to ${newTheme} mode`);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }
    }

    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--accent-primary);
            color: var(--bg-primary);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-family: var(--font-mono);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    this.scrollToElement(targetElement);
                    this.highlightNavLink(anchor);
                }
            });
        });
    }

    scrollToElement(element) {
        const offsetTop = element.offsetTop - CONFIG.SCROLL_OFFSET;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    highlightNavLink(link) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        // Add active class to clicked link
        link.classList.add('active');
    }
}

// ============================================
// TYPING EFFECT
// ============================================
class TypingEffect {
    constructor(element, text, speed = CONFIG.TYPING_SPEED) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
    }

    async type() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.currentIndex < this.text.length) {
                    this.element.textContent += this.text.charAt(this.currentIndex);
                    this.currentIndex++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, this.speed);
        });
    }

    static async typeMultipleElements(elements) {
        for (const { element, text } of elements) {
            const typer = new TypingEffect(element, text);
            await typer.type();
            await this.delay(500);
        }
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// INTERSECTION OBSERVER (Animate on Scroll)
// ============================================
class ScrollAnimator {
    constructor() {
        this.options = {
            threshold: 0, // trigger as soon as element touches viewport
            rootMargin: '0px 0px -10px 0px'
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.options
            );

            this.observeElements();
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }

    observeElements() {
        const elements = document.querySelectorAll('.terminal-section');
        const isSmallScreen = window.innerWidth <= 768;

        elements.forEach((el, index) => {
            // On small screens, don't pre-hide to avoid blank frames during fast scroll
            if (!isSmallScreen) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `opacity 0.5s ease ${index * CONFIG.ANIMATION_DELAY}ms, transform 0.5s ease ${index * CONFIG.ANIMATION_DELAY}ms`;
            }
            this.observer.observe(el);
        });

        // Safety fallback: reveal any section that might remain hidden after initial load/scroll bursts
        setTimeout(() => {
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isNearViewport = rect.top < window.innerHeight + 50 && rect.bottom > -50;
                if (isNearViewport && getComputedStyle(el).opacity === '0') {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            });
        }, 800);
    }
}

// ============================================
// COMMAND LINE SIMULATOR
// ============================================
class CommandLineSimulator {
    constructor() {
        this.commands = {
            help: () => this.showHelp(),
            clear: () => this.clearTerminal(),
            about: () => this.navigateTo('#about'),
            skills: () => this.navigateTo('#skills'),
            experience: () => this.navigateTo('#experience'),
            contact: () => this.navigateTo('#contact'),
            theme: () => window.themeManager.toggle()
        };
    }

    init() {
        // Could add an interactive command line at the footer
        console.log('%c🚀 Portfolio Terminal v1.0', 'color: #00ff9f; font-size: 16px; font-weight: bold;');
        console.log('%cType "help" in console for available commands', 'color: #00d4ff;');

        // Make commands globally available for console use
        window.portfolio = {
            help: () => this.showHelp(),
            goto: (section) => this.navigateTo(section),
            theme: () => window.themeManager.toggle()
        };
    }

    showHelp() {
        console.log(`
%cAvailable Commands:
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
%cportfolio.help()     %c- Show this help
%cportfolio.goto(id)   %c- Navigate to section (e.g., '#about')
%cportfolio.theme()    %c- Toggle dark/light theme
        `,
        'color: #00ff9f; font-weight: bold; font-size: 14px;',
        'color: #6272a4;',
        'color: #50fa7b;', 'color: #a0a0a0;',
        'color: #50fa7b;', 'color: #a0a0a0;',
        'color: #50fa7b;', 'color: #a0a0a0;'
        );
    }

    navigateTo(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log(`%c✓ Navigated to ${selector}`, 'color: #50fa7b;');
        } else {
            console.log(`%c✗ Section ${selector} not found`, 'color: #ff5555;');
        }
    }

    clearTerminal() {
        console.clear();
        console.log('%c🚀 Terminal cleared', 'color: #00ff9f;');
    }
}

// ============================================
// ACTIVE SECTION HIGHLIGHTER
// ============================================
class ActiveSectionHighlighter {
    constructor() {
        this.sections = document.querySelectorAll('.terminal-section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                { threshold: 0.5 }
            );

            this.sections.forEach(section => observer.observe(section));
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                this.highlightNavLink(sectionId);
            }
        });
    }

    highlightNavLink(sectionId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.style.borderColor = 'var(--accent-primary)';
                link.style.color = 'var(--accent-primary)';
            } else {
                link.style.borderColor = 'transparent';
                link.style.color = 'var(--accent-secondary)';
            }
        });
    }
}

// ============================================
// PERFORMANCE MONITOR
// ============================================
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                        console.log(
                            `%c⚡ Page loaded in ${(loadTime / 1000).toFixed(2)}s`,
                            'color: #ffb86c; font-weight: bold;'
                        );
                    }
                }, 0);
            });
        }
    }
}

// ============================================
// EASTER EGG - Konami Code
// ============================================
class EasterEgg {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.position = 0;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === this.konamiCode[this.position]) {
                this.position++;
                if (this.position === this.konamiCode.length) {
                    this.activate();
                    this.position = 0;
                }
            } else {
                this.position = 0;
            }
        });
    }

    activate() {
        console.log('%c🎮 KONAMI CODE ACTIVATED!', 'color: #ff5555; font-size: 24px; font-weight: bold;');
        console.log('%c🚀 You found the secret! Thanks for exploring the code!', 'color: #50fa7b; font-size: 16px;');

        // Fun animation
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);

        // Add rainbow animation if not exists
        if (!document.getElementById('rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('%c🚀 Initializing Portfolio Terminal...', 'color: #00ff9f; font-size: 14px;');

        // Initialize all modules
        window.themeManager = new ThemeManager();
        new SmoothScroller();
        new ScrollAnimator();
        new ScrollToTop();
        new CommandLineSimulator().init();
        new ActiveSectionHighlighter();
        new PerformanceMonitor();
        new EasterEgg();

        // Initialize Geek Effects
        window.geekEffects = new GeekEffects();
        window.geekEffects.init();

        console.log('%c✓ Portfolio Terminal ready!', 'color: #50fa7b; font-size: 14px;');
    }
}

// Start the application
new App();

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Copy to clipboard utility
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('%c✓ Copied to clipboard!', 'color: #50fa7b;');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ============================================
// SCROLL TO TOP FUNCTIONALITY
// ============================================
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scroll-to-top');
        this.scrollThreshold = 300; // Show button after scrolling 300px
        this.init();
    }

    init() {
        if (!this.button) return;
        
        this.attachEventListeners();
        this.handleScroll(); // Check initial scroll position
    }

    attachEventListeners() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', debounce(() => {
            this.handleScroll();
        }, 10));

        // Scroll to top when button is clicked
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
    }

    handleScroll() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollY > this.scrollThreshold) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ============================================
// GEEK EFFECTS - Pure JavaScript (No CSS animations)
// ============================================

// Floating Code Particles - Pure JS Animation
class CodeParticles {
    constructor() {
        this.container = null;
        this.particles = [];
        this.symbols = [
            '.NET 9', '.NET Core', 'ASP.NET', 'C#', 'Java', 'Spring Boot', 'Spring Framework',
            'React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
            'Docker', 'Kubernetes', 'GitLab CI', 'CI/CD',
            'SQL Server', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
            'REST API', 'CQRS',
            'Entity Framework', 'Hibernate', 'Dapper', 'JPA',
            'Python', 'FastAPI', 'Django', 'Flask',
            'Git', 'Linux', 'Nginx', 'Kafka', 'SignalR',
            'Blazor', 'Razor', 'HTML5', 'CSS3', 'Sass', 'Bootstrap', 'Tailwind',
            'xUnit', 'NUnit', 'JUnit', 'Jest', 'Mocha', 'TDD',
            'OAuth', 'JWT', 'IdentityServer', 'Keycloak', 'SOLID', 'Design Patterns'
        ];
        this.particleCount = 25;
        this.animationId = null;
    }

    init() {
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'code-particles';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);

        this.createParticles();
        this.animate();

        console.log('✓ Code particles created');
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];

            // Style
            particle.style.cssText = `
                position: absolute;
                font-family: var(--font-mono);
                font-size: 20px;
                font-weight: bold;
                color: var(--accent-primary);
                text-shadow: 0 0 8px var(--accent-primary);
            `;

            // Initial position and physics
            const data = {
                element: particle,
                x: Math.random() * 100, // percentage
                y: Math.random() * 100,
                speedY: 0.01 + Math.random() * 0.02, // % per frame
                speedX: -0.01 + Math.random() * 0.02,
                opacity: 0.15 + Math.random() * 0.1 // More transparent: 0.15 to 0.25
            };

            particle.style.left = data.x + '%';
            particle.style.top = data.y + '%';
            particle.style.opacity = data.opacity;

            this.container.appendChild(particle);
            this.particles.push(data);
        }
    }

    animate() {
        this.particles.forEach(p => {
            // Update position
            p.y += p.speedY;
            p.x += p.speedX;

            // Wrap around
            if (p.y > 100) p.y = -5;
            if (p.y < -5) p.y = 100;
            if (p.x > 100) p.x = -5;
            if (p.x < -5) p.x = 100;

            // Apply to DOM
            p.element.style.top = p.y + '%';
            p.element.style.left = p.x + '%';
        });

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.particles = [];
        console.log('✓ Code particles removed');
    }
}

// Hacker Scan Line - Pure JS Animation
class HackerScan {
    constructor() {
        this.scanLine = null;
        this.animationId = null;
        this.nextScanTime = Date.now() + 2000; // First scan in 2 seconds
        this.scanDuration = 3000; // 3 seconds to cross screen
        this.scanInterval = 10000; // Scan every 10 seconds
        this.scanning = false;
    }

    init() {
        // Create scan line
        this.scanLine = document.createElement('div');
        this.scanLine.style.cssText = `
            position: fixed;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg,
                transparent 0%,
                #00ff9f 50%,
                transparent 100%);
            box-shadow: 0 0 20px #00ff9f;
            pointer-events: none;
            z-index: 9998;
            opacity: 0;
            top: -10px;
        `;
        document.body.appendChild(this.scanLine);

        this.animate();
        console.log('✓ Hacker scan initialized');
    }

    animate() {
        const now = Date.now();

        if (!this.scanning && now >= this.nextScanTime) {
            // Start a new scan
            this.scanning = true;
            this.scanStartTime = now;
        }

        if (this.scanning) {
            const elapsed = now - this.scanStartTime;
            const progress = elapsed / this.scanDuration;

            if (progress < 1) {
                // Scan in progress
                const yPos = progress * 100;
                this.scanLine.style.top = yPos + 'vh';
                this.scanLine.style.opacity = '0.7';
            } else {
                // Scan complete
                this.scanLine.style.opacity = '0';
                this.scanLine.style.top = '-10px';
                this.scanning = false;
                this.nextScanTime = now + this.scanInterval;
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.scanLine) {
            this.scanLine.remove();
            this.scanLine = null;
        }
        console.log('✓ Hacker scan removed');
    }
}

// Glitch Effect - Pure JS
class GlitchEffect {
    constructor() {
        this.element = null;
        this.originalText = '';
        this.animationId = null;
        this.nextGlitchTime = Date.now() + 2000;
        this.glitchDuration = 1000; // 1 second
        this.glitchInterval = 5000; // Every 5 seconds
        this.glitching = false;
        this.glitchChars = '!<>-_\\/[]{}—=+*^?#01▓▒░█';
    }

    init() {
        this.element = document.querySelector('.ascii-art');
        if (this.element) {
            this.originalText = this.element.textContent;
            this.animate();
            console.log('✓ Glitch effect initialized on ASCII art');
        }
    }

    animate() {
        const now = Date.now();

        if (!this.glitching && now >= this.nextGlitchTime) {
            this.glitching = true;
            this.glitchStartTime = now;
        }

        if (this.glitching) {
            const elapsed = now - this.glitchStartTime;

            if (elapsed < this.glitchDuration) {
                // Apply glitch - more intense
                if (Math.random() > 0.5) {
                    const glitched = this.originalText.split('').map(char => {
                        if (Math.random() > 0.97) { // 3% chance per character
                            return this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                        }
                        return char;
                    }).join('');
                    this.element.textContent = glitched;
                }
            } else {
                // Restore original
                this.element.textContent = this.originalText;
                this.glitching = false;
                this.nextGlitchTime = now + this.glitchInterval;
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.element) {
            this.element.textContent = this.originalText;
        }
        console.log('✓ Glitch effect removed');
    }
}

// CRT Screen Effect - Static overlay
class CRTEffect {
    constructor() {
        this.overlay = null;
    }

    init() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'crt-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            background-image: repeating-linear-gradient(
                0deg,
                rgba(0, 255, 159, 0.08) 0px,
                rgba(0, 255, 159, 0.08) 2px,
                transparent 2px,
                transparent 4px
            );
        `;
        document.body.appendChild(this.overlay);
        console.log('✓ CRT scanlines created - Top layer (z-index: 9999)');
    }

    destroy() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        console.log('✓ CRT effect removed');
    }
}

// Main Geek Effects Manager - Always Active
class GeekEffects {
    constructor() {
        this.codeParticles = null;
        this.hackerScan = null;
        this.glitchEffect = null;
        this.crtEffect = null;
    }

    init() {
        console.log('🚀 Geek Effects - Always Active');

        // Code particles disabled per user request
        // this.codeParticles = new CodeParticles();
        // this.codeParticles.init();

        // Hacker scan disabled per user request
        // this.hackerScan = new HackerScan();
        // this.hackerScan.init();

        this.glitchEffect = new GlitchEffect();
        this.glitchEffect.init();

        this.crtEffect = new CRTEffect();
        this.crtEffect.init();

        console.log('✓ Geek effects active! (glitch + CRT)');
    }
}

// Export utilities to window for console access
window.utils = {
    copy: copyToClipboard,
    debounce
};
