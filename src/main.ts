import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
    createIcons,
    Sparkles,
    Mail,
    MessageCircle,
    MapPin,
    FolderOpen,
    ArrowUpRight,
    Briefcase,
    GraduationCap,
    Terminal,
    Award,
    Layers,
    Sun,
    Moon
} from 'lucide';

class PortfolioController {
    private lenis: Lenis | null = null;

    constructor() {
        this.initIcons();
        this.initSmoothScroll();
        this.initTheme();
        this.setcurrentYear();
    }

    private initIcons() {
        createIcons({
            icons: {
                Sparkles,
                Mail,
                MessageCircle,
                MapPin,
                FolderOpen,
                ArrowUpRight,
                Briefcase,
                GraduationCap,
                Terminal,
                Award,
                Layers,
                Sun,
                Moon
            }
        });
    }

    private initSmoothScroll() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
        });

        const raf = (time: number) => {
            this.lenis?.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
    }

    private initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', (e: MouseEvent) => {
            const isDark = document.documentElement.classList.contains('dark');
            
            const toggleTheme = () => {
                if (isDark) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                }
            };

            // Circular View Transition if supported
            if ((document as any).startViewTransition) {
                const rect = themeToggle.getBoundingClientRect();
                const x = e.clientX || rect.left + rect.width / 2;
                const y = e.clientY || rect.top + rect.height / 2;
                
                document.documentElement.style.setProperty('--x', `${x}px`);
                document.documentElement.style.setProperty('--y', `${y}px`);

                (document as any).startViewTransition(() => {
                    toggleTheme();
                });
            } else {
                toggleTheme();
            }
        });
    }

    private setcurrentYear() {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear().toString();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioController();
});