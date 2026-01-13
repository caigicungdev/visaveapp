'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Upload, Download, Loader2, ImageIcon, RefreshCw, Eraser, Wand2 } from 'lucide-react';
import { CanvasMask } from './canvas-mask';
import { CompareSlider } from './compare-slider';

type ProcessingMode = 'bg' | 'watermark' | null;

interface BackgroundRemovalProps {
    onStateChange: (hasResult: boolean) => void;
}

export function BackgroundRemoval({ onStateChange }: BackgroundRemovalProps) {
    const { t } = useLanguage();
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [showModeModal, setShowModeModal] = useState(false);
    const [mode, setMode] = useState<ProcessingMode>(null);
    const [showCanvas, setShowCanvas] = useState(false);

    // @ts-ignore - Dynamic access
    const removebgT = t.features?.removebg || {};

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processImage = async (file: File, selectedMode: ProcessingMode, maskBlob?: Blob) => {
        if (!selectedMode) return;

        setError(null);
        setIsProcessing(true);
        // Don't generate URL if already exists (for canvas flow)
        if (!originalImage) setOriginalImage(URL.createObjectURL(file));
        setResultImage(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            // Allow 'file' for bg removal backward compat, or use 'image' everywhere?
            // Backend BG removal expects 'file'. Inpainting expects 'image' and 'mask'.
            if (selectedMode === 'bg') {
                formData.append('file', file); // BG removal uses 'file'
            }

            if (selectedMode === 'watermark' && maskBlob) {
                formData.append('mask', maskBlob, 'mask.png');
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const endpoint = selectedMode === 'bg' ? '/api/v1/remove-bg' : '/api/v1/inpainting/remove-object';

            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to process image');
            }

            const blob = await response.blob();
            const resultUrl = URL.createObjectURL(blob);
            setResultImage(resultUrl);
            setShowCanvas(false);
            onStateChange(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error processing image');
            onStateChange(false);
        } finally {
            setIsProcessing(false);
            setPendingFile(null);
        }
    };

    const handleFileSelected = (file: File) => {
        setPendingFile(file);
        setOriginalImage(URL.createObjectURL(file));
        setShowModeModal(true);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelected(file);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelected(file);
        }
    };

    const handleModeSelect = (selectedMode: ProcessingMode) => {
        setMode(selectedMode);
        setShowModeModal(false);

        if (pendingFile) {
            if (selectedMode === 'bg') {
                processImage(pendingFile, 'bg');
            } else if (selectedMode === 'watermark') {
                setShowCanvas(true);
            }
        }
    };

    const handleCanvasProcess = (maskBlob: Blob) => {
        if (pendingFile && mode === 'watermark') {
            processImage(pendingFile, 'watermark', maskBlob);
        }
    };

    const handleReset = () => {
        setOriginalImage(null);
        setResultImage(null);
        setError(null);
        setPendingFile(null);
        setMode(null);
        setShowCanvas(false);
        onStateChange(false);
    };

    const handleDownload = () => {
        if (resultImage) {
            const link = document.createElement('a');
            link.href = resultImage;
            link.download = mode === 'watermark' ? 'cleaned_image.png' : 'processed_image.png';
            link.click();
        }
    };

    // Show result view
    if (resultImage) {
        return (
            <div className="space-y-6">
                {/* Visualizer */}
                {mode === 'watermark' && originalImage ? (
                    <div className="h-64 sm:h-96 w-full">
                        <CompareSlider
                            original={originalImage}
                            modified={resultImage}
                            className="h-full"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative rounded-xl overflow-hidden bg-secondary/30 border border-border/50">
                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                Original
                            </div>
                            <img
                                src={originalImage!}
                                alt="Original"
                                className="w-full h-48 sm:h-64 object-contain"
                            />
                        </div>
                        <div className="relative rounded-xl overflow-hidden border border-border/50"
                            style={{ background: 'repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 50%/20px 20px' }}>
                            <div className="absolute top-2 left-2 bg-violet-600 text-white text-xs px-2 py-1 rounded">
                                Result
                            </div>
                            <img
                                src={resultImage}
                                alt="Result"
                                className="w-full h-48 sm:h-64 object-contain"
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleDownload}
                        className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-purple-600 
                                   hover:from-violet-500 hover:to-purple-500
                                   shadow-lg shadow-violet-500/25"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        {removebgT.download || 'Download PNG'}
                    </Button>
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        className="flex-1 h-12 border-white/10 hover:bg-white/5"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        {removebgT.uploadNew || 'Upload New Image'}
                    </Button>
                </div>
            </div>
        );
    }

    // Show Canvas for Watermark/Object Removal
    if (showCanvas && originalImage) {
        return (
            <div className="space-y-4">
                <div className="w-full h-[60vh]">
                    <CanvasMask
                        imageUrl={originalImage}
                        onProcess={handleCanvasProcess}
                        onCancel={handleReset}
                        isProcessing={isProcessing}
                    />
                </div>
                <Button
                    onClick={handleReset}
                    variant="ghost"
                    className="w-full"
                    disabled={isProcessing}
                >
                    Cancel
                </Button>
            </div>
        )
    }

    // Show upload/processing view
    return (
        <>
            <div className="space-y-4">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-xl p-8 sm:p-12
                        transition-all duration-300 cursor-pointer
                        flex flex-col items-center justify-center gap-4
                        ${isDragging
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-white/20 hover:border-violet-400/50 hover:bg-white/5'
                        }
                        ${isProcessing ? 'pointer-events-none opacity-60' : ''}
                    `}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isProcessing}
                    />

                    {isProcessing ? (
                        <>
                            <Loader2 className="w-12 h-12 text-violet-400 animate-spin" />
                            <p className="text-lg font-medium text-foreground">
                                {removebgT.processing || 'Processing...'}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="p-4 rounded-full bg-violet-500/20">
                                {isDragging ? (
                                    <ImageIcon className="w-10 h-10 text-violet-400" />
                                ) : (
                                    <Upload className="w-10 h-10 text-violet-400" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-medium text-foreground">
                                    {removebgT.dropzone || 'Drop image here or click to upload'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {removebgT.formats || 'Supports JPG, PNG, WebP'}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}
            </div>

            {/* Mode Selection Modal */}
            <Dialog open={showModeModal} onOpenChange={setShowModeModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{removebgT.chooseMode || 'Choose Processing Mode'}</DialogTitle>
                        <DialogDescription>
                            {removebgT.formats || 'Select how you want to process your image'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                        <button
                            onClick={() => handleModeSelect('bg')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border/50 
                                       hover:border-violet-500 hover:bg-violet-500/10 transition-all duration-200"
                        >
                            <div className="p-3 rounded-full bg-violet-500/20">
                                <Eraser className="w-8 h-8 text-violet-400" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">{removebgT.removeBgOption || 'Remove Background'}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {removebgT.removeBgDesc || 'Make background transparent'}
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleModeSelect('watermark')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border/50 
                                       hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200"
                        >
                            <div className="p-3 rounded-full bg-blue-500/20">
                                <Wand2 className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">{removebgT.removeWatermarkOption || 'Magic Eraser'}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {removebgT.removeWatermarkDesc || 'Manually remove objects'}
                                </p>
                            </div>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
