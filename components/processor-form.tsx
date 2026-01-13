'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TaskType } from '@/types';
import { createTask, ProcessOptions } from '@/lib/api';
import { FormatSelector, FormatOption } from '@/components/format-selector';
import { Loader2, Link2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

interface ProcessorFormProps {
    featureType: TaskType;
    placeholder?: string;
    onTaskCreated: (taskId: string, url: string) => void;
    showFormatSelector?: boolean;
}

export function ProcessorForm({
    featureType,
    placeholder = 'Paste your video URL here...',
    onTaskCreated,
    showFormatSelector = false,
}: ProcessorFormProps) {
    const { t } = useLanguage();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const validateUrl = (): boolean => {
        if (!url.trim()) {
            setError(t.validation.required);
            return false;
        }

        try {
            new URL(url);
            return true;
        } catch {
            setError(t.validation.invalid);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateUrl()) return;

        // For download feature, show format selector
        if (showFormatSelector) {
            setShowModal(true);
            return;
        }

        // For other features, process directly
        await processTask();
    };

    const processTask = async (options?: ProcessOptions) => {
        setIsLoading(true);
        setError(null);
        const currentUrl = url.trim();

        try {
            const response = await createTask(featureType, currentUrl, options);
            onTaskCreated(response.task_id, currentUrl);
            setUrl('');
            setShowModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : t.common.error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormatConfirm = async (format: FormatOption) => {
        const options: ProcessOptions = {
            format: format.format,
            quality: format.label,
            ytdlpFormat: format.ytdlpFormat,
            audioBitrate: format.id.includes('320') ? '320' : format.id.includes('128') ? '128' : undefined,
            separation: format.separation,
        };

        await processTask(options);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Link2 className="h-5 w-5" />
                    </div>
                    <Input
                        type="url"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            setError(null);
                        }}
                        placeholder={placeholder}
                        className="h-14 pl-12 pr-4 text-base bg-secondary/50 border-border/50 
                       focus:border-primary/50 focus:ring-2 focus:ring-primary/20 
                       placeholder:text-muted-foreground/60 rounded-xl
                       transition-all duration-200"
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="w-full h-12 text-base font-semibold rounded-xl
                     bg-gradient-to-r from-violet-600 to-purple-600 
                     hover:from-violet-500 hover:to-purple-500
                     shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                     transition-all duration-300 ease-out
                     disabled:opacity-50 disabled:cursor-not-allowed
                     disabled:shadow-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t.common.processing}
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            {t.controls.startProcessing}
                        </>
                    )}
                </Button>
            </form>

            <FormatSelector
                open={showModal}
                onOpenChange={setShowModal}
                onConfirm={handleFormatConfirm}
                isLoading={isLoading}
                url={url}
            />
        </>
    );
}
