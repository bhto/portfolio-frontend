// src/main.ts

class PortfolioController {
    private canvas: HTMLCanvasElement | null;

    constructor() {
        this.canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
        this.init();
    }

    private init(): void {
        console.log("Bento Portfolio initialisé sous TypeScript.");
        this.setupBackgroundAnimation();
    }

    private setupBackgroundAnimation(): void {
        if (!this.canvas) return;
        
        // Logique ou initialisation de Three.js / WebGL pour votre arrière-plan
        // Exemple basique : ajustement automatique du ratio lors du redimensionnement
        window.addEventListener('resize', () => {
            if (this.canvas) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        });
    }
}

// Lancement à la complétion du DOM
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioController();
});