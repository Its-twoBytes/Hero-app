
import React, { useEffect, useState } from 'react';

const ConfettiPiece: React.FC<{ initialX: number, initialY: number, color: string }> = ({ initialX, initialY, color }) => {
    const [style, setStyle] = useState({
        left: `${initialX}vw`,
        top: `${initialY}vh`,
        transform: 'rotate(0deg)',
        opacity: 1,
        backgroundColor: color,
    });

    useEffect(() => {
        const xEnd = initialX + (Math.random() * 200 - 100);
        const yEnd = initialY + (Math.random() * 50 + 50);
        const rotation = Math.random() * 360;

        setTimeout(() => {
            setStyle(prev => ({
                ...prev,
                left: `${xEnd}px`,
                top: `${yEnd}vh`,
                transform: `rotate(${rotation}deg)`,
                opacity: 0,
            }));
        }, 100);
    }, [initialX, initialY]);

    return <div className="absolute w-3 h-3 transition-all duration-[3000ms] ease-out" style={style}></div>;
};

const Confetti: React.FC<{ active: boolean }> = ({ active }) => {
    if (!active) return null;

    const colors = ['#fde68a', '#4ade80', '#60a5fa', '#f87171', '#a78bfa'];
    const pieces = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[i % colors.length],
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {pieces.map(p => <ConfettiPiece key={p.id} initialX={p.x} initialY={p.y} color={p.color} />)}
        </div>
    );
};

export default Confetti;
