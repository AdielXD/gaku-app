
import React, { useRef, useEffect } from 'react';
import { ListIcon, PlusIcon } from './Icons';

export const SessionComplete: React.FC<{ onAddMore: () => void; onGoToDecks: () => void; streak: number; }> = ({ onAddMore, onGoToDecks, streak }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const container = canvas.parentElement;
        if (!container) return;

        let animationFrameId: number;

        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const colors = ['#fbbc05', '#4285f4', '#34a853', '#ea4335', '#00a884'];
        
        let confettiParticles: any[] = [];
        const particleCount = 200;

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        for (let i = 0; i < particleCount; i++) {
            confettiParticles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height - rect.height, // Start above screen
                w: random(5, 15),
                h: random(3, 10),
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: random(-7, 7),
                ySpeed: random(2, 5),
                opacity: 1,
                tilt: random(-15, 15),
                tiltAngle: 0,
                tiltAngleSpeed: random(0.05, 0.12),
            });
        }
        
        let particlesOnScreen = particleCount;

        const render = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (particlesOnScreen === 0) {
                 cancelAnimationFrame(animationFrameId);
                 return;
            }

            confettiParticles.forEach((p) => {
                if (p.opacity <= 0) return;

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.translate(p.x + p.tilt, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();

                p.y += p.ySpeed;
                p.rotation += p.rotationSpeed;
                p.tiltAngle += p.tiltAngleSpeed;
                p.tilt = Math.sin(p.tiltAngle) * 15;
                
                if (p.y > rect.height) {
                    if (p.opacity > 0) {
                        p.opacity = 0;
                        particlesOnScreen--;
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const safetyTimeout = setTimeout(() => {
             cancelAnimationFrame(animationFrameId);
        }, 8000); // Stop after 8s regardless

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(safetyTimeout);
        };

    }, []);

    return (
        <div className="session-complete">
            <div className="confetti-canvas-container">
                <canvas ref={canvasRef}></canvas>
            </div>
            <h2>Parabéns!</h2>
            <p>Você revisou todas as cartas por hoje.</p>
            {streak > 1 && <p className="streak-message">Sua ofensiva agora é de <strong>{streak} dias</strong>! 🔥</p>}
            <div className="session-complete-actions">
                <button className="btn" onClick={onGoToDecks}>
                   <ListIcon/> Ver Baralhos
                </button>
                <button className="btn btn-outline" onClick={onAddMore}>
                   <PlusIcon/> Adicionar Cartas
                </button>
            </div>
        </div>
    );
};
