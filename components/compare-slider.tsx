'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface CompareSliderProps {
    original: string;
    modified: string;
    className?: string;
}

export function CompareSlider({ original, modified, className = '' }: CompareSliderProps) {
    const [sliderParams, setSliderParams] = useState({ position: 50, isDragging: false });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDrag = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderParams(prev => ({ ...prev, position: percent }));
    }, []);

    const handleMouseDown = useCallback(() => {
        setSliderParams(prev => ({ ...prev, isDragging: true }));
    }, []);

    const handleMouseUp = useCallback(() => {
        setSliderParams(prev => ({ ...prev, isDragging: false }));
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (sliderParams.isDragging) {
            handleDrag(e.clientX);
        }
    }, [sliderParams.isDragging, handleDrag]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (sliderParams.isDragging) {
            handleDrag(e.touches[0].clientX);
        }
    }, [sliderParams.isDragging, handleDrag]);

    useEffect(() => {
        if (sliderParams.isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [sliderParams.isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden select-none touch-none rounded-xl border border-white/10 bg-black/20 ${className}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* Modified Image (Background) */}
            <img
                src={modified}
                alt="Modified"
                className="w-full h-full object-contain pointer-events-none"
            />

            {/* Original Image (Foreground - Clipped) */}
            <div
                className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderParams.position}% 0 0)` }}
            >
                <img
                    src={original}
                    alt="Original"
                    className="w-full h-full object-contain"
                />

                {/* Visual Label for Original */}
                <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    Original
                </div>
            </div>

            {/* Visual Label for Modified */}
            <div className="absolute top-4 right-4 bg-violet-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                Result
            </div>


            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
                style={{ left: `${sliderParams.position}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ChevronsLeftRight className="w-5 h-5 text-violet-600" />
                </div>
            </div>
        </div>
    );
}
