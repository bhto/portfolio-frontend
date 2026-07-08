import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import emailjs from '@emailjs/browser';
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
    Moon,
    X,
    Send
} from 'lucide';

class PortfolioController {
    private lenis: Lenis | null = null;

    constructor() {
        this.initIcons();
        this.initSmoothScroll();
        this.initTheme();
        this.setcurrentYear();
        this.initContactModal();
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
                Moon,
                X,
                Send
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

    private initContactModal() {
        const connectBtn = document.getElementById('connect-btn');
        const modal = document.getElementById('contact-modal');
        const backdrop = document.getElementById('modal-backdrop');
        const closeBtn = document.getElementById('modal-close');
        const form = document.getElementById('contact-form') as HTMLFormElement;
        const errorZone = document.getElementById('modal-error-zone');

        const stateDefault = document.getElementById('btn-state-default');
        const stateLoading = document.getElementById('btn-state-loading');
        const stateSuccess = document.getElementById('btn-state-success');

        if (!connectBtn || !modal || !form) return;

        // Initialize EmailJS with client-side rate limiting/throttle configurations
        emailjs.init({
            publicKey: import.meta.env.VITE_EMAIL_PUBLIC_KEY,
            limitRate: {
                id: 'contact-form',
                throttle: 10000 // 10s throttle
            }
        });

        let lastSubmitTime = 0;
        const THROTTLE_DELAY = 10000; // 10s throttle between emails

        const openModal = (e: Event) => {
            e.preventDefault();
            form.reset();
            if (errorZone) {
                errorZone.classList.add('hidden');
            }
            modal.classList.add('active');
        };

        const closeModal = () => {
            modal.classList.remove('active');
        };

        connectBtn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Client-side throttle check to avoid email spam/cascades
            const now = Date.now();
            if (now - lastSubmitTime < THROTTLE_DELAY) {
                const waitTime = Math.ceil((THROTTLE_DELAY - (now - lastSubmitTime)) / 1000);
                if (errorZone) {
                    errorZone.textContent = `Veuillez patienter ${waitTime} seconde(s) avant d'envoyer un autre message.`;
                    errorZone.classList.remove('hidden');
                }
                return;
            }

            const nameInput = document.getElementById('form-name') as HTMLInputElement;
            const emailInput = document.getElementById('form-email') as HTMLInputElement;
            const subjectInput = document.getElementById('form-subject') as HTMLInputElement;
            const messageInput = document.getElementById('form-message') as HTMLTextAreaElement;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) return;

            // Form inputs to disable
            const formElements = form.querySelectorAll('input, textarea, button') as NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>;

            // Disable all fields
            formElements.forEach(el => el.disabled = true);
            if (closeBtn) (closeBtn as HTMLButtonElement).disabled = true;

            // Hide error banner and show loading state
            if (errorZone) errorZone.classList.add('hidden');
            if (stateDefault) stateDefault.classList.add('hidden');
            if (stateLoading) stateLoading.classList.remove('hidden');

            try {
                // Concatenate subject and message
                const concatenatedMessage = `Sujet : ${subject || "Sans sujet"}\n\nMessage :\n${message}`;

                const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
                const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;

                // Send email using EmailJS send mode
                await emailjs.send(serviceId, templateId, {
                    name: name,
                    email: email,
                    message: concatenatedMessage
                });

                // Update throttle timestamp on success
                lastSubmitTime = Date.now();

                // Reply to sender
                fetch('https://berenger-backend.vercel.app/send-mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                }).catch(() => {
                    // Ignore all errors silently as requested
                });

                // Show success state
                if (stateLoading) stateLoading.classList.add('hidden');
                if (stateSuccess) stateSuccess.classList.remove('hidden');

                // Clear the form
                form.reset();

                // Wait 2 seconds, then reset state and close modal
                setTimeout(() => {
                    closeModal();
                    // Re-enable and reset button
                    formElements.forEach(el => el.disabled = false);
                    if (closeBtn) (closeBtn as HTMLButtonElement).disabled = false;
                    if (stateSuccess) stateSuccess.classList.add('hidden');
                    if (stateDefault) stateDefault.classList.remove('hidden');
                }, 2000);

            } catch (error: any) {
                // Show error message
                if (errorZone) {
                    errorZone.textContent = error.message || 'Une erreur est survenue. Veuillez réessayer.';
                    errorZone.classList.remove('hidden');
                }

                // Re-enable all fields and restore default button state
                formElements.forEach(el => el.disabled = false);
                if (closeBtn) (closeBtn as HTMLButtonElement).disabled = false;
                if (stateLoading) stateLoading.classList.add('hidden');
                if (stateDefault) stateDefault.classList.remove('hidden');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioController();
});