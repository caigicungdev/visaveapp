'use client';

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Eraser, Trash2, Brush, Play, Hand } from 'lucide-react';

interface CanvasMaskProps {
    imageUrl: string;
    onProcess: (maskBlob: Blob) => void;
    onCancel: () => void;
    isProcessing?: boolean;
}

export const CanvasMask = forwardRef<any, CanvasMaskProps>(({ imageUrl, onProcess, onCancel, isProcessing }, ref) => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null); // Offscreen mask canvas
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(20);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [mode, setMode] = useState<'draw' | 'pan'>('draw');

    // @ts-ignore
    const removebgT = t.features?.removebg || {};

    // Initialize canvas on image load
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const container = containerRef.current;
        if (!container || !canvasRef.current || !maskCanvasRef.current) return;

        // Set dimensions to match natural image size for high quality mask
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        canvasRef.current.width = width;
        canvasRef.current.height = height;
        maskCanvasRef.current.width = width;
        maskCanvasRef.current.height = height;

        // Initialize mask canvas with black background
        const maskCtx = maskCanvasRef.current.getContext('2d');
        if (maskCtx) {
            maskCtx.fillStyle = '#000000';
            maskCtx.fillRect(0, 0, width, height);
        }

        setImageLoaded(true);
    };

    const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (isProcessing || mode === 'pan') return;
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.beginPath();
        const maskCtx = maskCanvasRef.current?.getContext('2d');
        if (maskCtx) maskCtx.beginPath();
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || mode === 'pan') return;
        // e.preventDefault(); // Prevent scroll on touch - Handled by touch-none class

        const { x, y } = getMousePos(e);
        const ctx = canvasRef.current?.getContext('2d');
        const maskCtx = maskCanvasRef.current?.getContext('2d');

        if (ctx && maskCtx) {
            // Draw on UI canvas (Red semi-transparent)
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);

            // Draw on Mask canvas (White solid)
            maskCtx.lineWidth = brushSize;
            maskCtx.lineCap = 'round';
            maskCtx.lineJoin = 'round';
            maskCtx.strokeStyle = '#FFFFFF';
            maskCtx.lineTo(x, y);
            maskCtx.stroke();
            maskCtx.beginPath();
            maskCtx.moveTo(x, y);
        }
    };

    const handleClear = () => {
        const ctx = canvasRef.current?.getContext('2d');
        const maskCtx = maskCanvasRef.current?.getContext('2d');
        const canvas = canvasRef.current;

        if (ctx && maskCtx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            maskCtx.fillStyle = '#000000';
            maskCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleProcess = () => {
        if (maskCanvasRef.current) {
            maskCanvasRef.current.toBlob((blob) => {
                if (blob) onProcess(blob);
            }, 'image/png');
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full relative">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 flex justify-center"
            >
                {/* Image Reference */}
                <img
                    src={imageUrl}
                    onLoad={handleImageLoad}
                    alt="Mask Ref"
                    className="max-h-[60vh] object-contain select-none"
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                />

                {/* Drawing Layer */}
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className={`absolute top-0 left-0 w-full h-full ${mode === 'draw'
                            ? 'cursor-crosshair touch-none'
                            : 'cursor-grab pointer-events-none'
                        }`}
                />
            </div>

            {/* Hidden Mask Canvas */}
            <canvas ref={maskCanvasRef} className="hidden" />

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Mode Toggle */}
                <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                    <Button
                        variant={mode === 'draw' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setMode('draw')}
                        className={`h-8 w-8 p-0 ${mode === 'draw' ? 'bg-violet-500/20 text-violet-300' : ''}`}
                        title="Draw (Brush)"
                    >
                        <Brush className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={mode === 'pan' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setMode('pan')}
                        className={`h-8 w-8 p-0 ${mode === 'pan' ? 'bg-blue-500/20 text-blue-300' : ''}`}
                        title="Pan (Scroll)"
                    >
                        <Hand className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm whitespace-nowrap text-foreground">{removebgT.brushSize || 'Brush Size'}</span>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        disabled={mode === 'pan'}
                        className="w-full sm:w-32 accent-violet-500"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
                    <Button
                        variant="ghost"
                        onClick={handleClear}
                        className="flex-1 sm:flex-none text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {removebgT.clearMask || 'Clear Mask'}
                    </Button>
                    <Button
                        disabled={isProcessing}
                        onClick={handleProcess}
                        className="flex-1 sm:flex-none bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                    >
                        {isProcessing ? (
                            <span className="animate-spin mr-2">⏳</span>
                        ) : (
                            <Play className="w-4 h-4 mr-2 fill-current" />
                        )}
                        {removebgT.removeObject || 'Remove Object'}
                    </Button>
                </div>
            </div>
        </div>
    );
});

CanvasMask.displayName = 'CanvasMask';
