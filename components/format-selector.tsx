'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Music, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

export interface FormatOption {
    id: string;
    label: string;
    quality: string;
    format: 'video' | 'audio';
    ytdlpFormat: string;
    separation?: 'vocals' | 'instrumental' | 'drum' | 'bass' | 'other';
}

const VIDEO_FORMATS: FormatOption[] = [
    { id: 'video-1080', label: '1080p (.mp4)', quality: 'Auto', format: 'video', ytdlpFormat: 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/best' },
    { id: 'video-720', label: '720p (.mp4)', quality: 'Auto', format: 'video', ytdlpFormat: 'bestvideo[height<=720]+bestaudio/best[height<=720]/best' },
    { id: 'video-360', label: '360p (.mp4)', quality: 'Auto', format: 'video', ytdlpFormat: 'bestvideo[height<=360]+bestaudio/best[height<=360]/best' },
    { id: 'video-240', label: '240p (.mp4)', quality: 'Auto', format: 'video', ytdlpFormat: 'bestvideo[height<=240]+bestaudio/best[height<=240]/best' },
    { id: 'video-144', label: '144p (.mp4)', quality: 'Auto', format: 'video', ytdlpFormat: 'bestvideo[height<=144]+bestaudio/best[height<=144]/best' },
];

const AUDIO_FORMATS: FormatOption[] = [
    { id: 'audio-320', label: 'MP3 - Original (320kbps)', quality: 'High', format: 'audio', ytdlpFormat: 'bestaudio' },
];

interface FormatSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (format: FormatOption) => void;
    isLoading?: boolean;
    url: string;
}

export function FormatSelector({ open, onOpenChange, onConfirm, isLoading, url }: FormatSelectorProps) {
    const { t } = useLanguage();
    const [selectedTab, setSelectedTab] = useState<'video' | 'audio'>('video');
    const [selectedFormat, setSelectedFormat] = useState<string>('video-1080');

    // Check if URL is TikTok
    const isTikTok = (url || '').toLowerCase().includes('tiktok.com');

    const handleConfirm = () => {
        const allFormats = [...VIDEO_FORMATS, ...AUDIO_FORMATS];
        const format = allFormats.find(f => f.id === selectedFormat);
        if (format) {
            onConfirm(format);
        }
    };

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab as 'video' | 'audio');
        // Set default selection for each tab
        if (tab === 'video') {
            setSelectedFormat('video-1080');
        } else {
            setSelectedFormat('audio-320');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg bg-card border-border/50 max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-lg sm:text-xl font-semibold">{t.formatSelector.title}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {t.formatSelector.desc}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0">
                    <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className={`grid w-full ${isTikTok ? 'grid-cols-1' : 'grid-cols-2'} bg-secondary/50`}>
                            <TabsTrigger
                                value="video"
                                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-sm"
                            >
                                <Video className="w-4 h-4 mr-2" />
                                {t.formatSelector.video}
                            </TabsTrigger>
                            {!isTikTok && (
                                <TabsTrigger
                                    value="audio"
                                    className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-sm"
                                >
                                    <Music className="w-4 h-4 mr-2" />
                                    {t.formatSelector.audio}
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="video" className="mt-4">
                            <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="space-y-2">
                                {VIDEO_FORMATS.map((format) => (
                                    <div
                                        key={format.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
                                            ${selectedFormat === format.id
                                                ? 'border-violet-500 bg-violet-500/10'
                                                : 'border-border/50 hover:border-border'}`}
                                        onClick={() => setSelectedFormat(format.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value={format.id} id={format.id} />
                                            <Label htmlFor={format.id} className="font-medium cursor-pointer text-sm sm:text-base">
                                                {format.label}
                                            </Label>
                                        </div>
                                        <span className="text-xs sm:text-sm text-muted-foreground">{format.quality}</span>
                                    </div>
                                ))}
                            </RadioGroup>
                        </TabsContent>

                        <TabsContent value="audio" className="mt-4">
                            <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="space-y-2">
                                {AUDIO_FORMATS.map((format) => (
                                    <div
                                        key={format.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
                                            ${selectedFormat === format.id
                                                ? 'border-violet-500 bg-violet-500/10'
                                                : 'border-border/50 hover:border-border'}`}
                                        onClick={() => setSelectedFormat(format.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value={format.id} id={format.id} />
                                            <Label htmlFor={format.id} className="font-medium cursor-pointer text-sm sm:text-base">
                                                {format.label}
                                            </Label>
                                        </div>
                                        <span className="text-xs sm:text-sm text-muted-foreground">{format.quality}</span>
                                    </div>
                                ))}
                            </RadioGroup>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="flex-shrink-0 mt-4 flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="w-full sm:w-auto order-2 sm:order-1"
                    >
                        {t.common.cancel}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t.common.processing}
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                {t.controls.startProcessing}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
