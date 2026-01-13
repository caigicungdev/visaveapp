'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { ProcessorForm } from '@/components/processor-form';
import { TaskProgress } from '@/components/task-progress';
import { ResultDisplay } from '@/components/result-display';
import { FormatSelector, FormatOption } from '@/components/format-selector';
import { BackgroundRemoval } from '@/components/background-removal';
import { useTaskStatus } from '@/hooks/useTaskStatus';
import { createTask, ProcessOptions } from '@/lib/api';
import { FeatureConfig } from '@/types';
import { useLanguage } from '@/components/language-provider';
import {
    Download,
    Brain,
    Eye,
    Images,
    Scissors,
    Eraser,
    AlertCircle,
    ArrowLeft,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Static configuration for features (icons, endpoints)
const featuresConfig = [
    {
        id: 'download',
        endpoint: '/api/process',
        icon: 'download',
    },
    {
        id: 'summary',
        endpoint: '/api/process',
        icon: 'brain',
    },
    {
        id: 'spy',
        endpoint: '/api/process',
        icon: 'eye',
    },
    {
        id: 'slideshow',
        endpoint: '/api/process',
        icon: 'images',
    },
    {
        id: 'audio',
        endpoint: '/api/process',
        icon: 'scissors',
    },
    {
        id: 'removebg',
        endpoint: '/api/v1/remove-bg',
        icon: 'eraser',
    },
];

const iconMap = {
    download: Download,
    brain: Brain,
    eye: Eye,
    images: Images,
    scissors: Scissors,
    eraser: Eraser,
};

interface FeaturePanelProps {
    feature: FeatureConfig;
    onStateChange: (hasResult: boolean) => void;
}

function FeaturePanel({ feature, onStateChange }: FeaturePanelProps) {
    const { t } = useLanguage();
    const [taskId, setTaskId] = useState<string | null>(null);
    const [lastUrl, setLastUrl] = useState<string>('');
    const [showFormatModal, setShowFormatModal] = useState(false);
    const [isReprocessing, setIsReprocessing] = useState(false);
    const { status, progress, result, error, isConnected } = useTaskStatus(taskId);

    // Notify parent about state change (result presence)
    useEffect(() => {
        onStateChange(!!result);
    }, [result, onStateChange]);

    // Cleanup when unmounting or switching tasks
    useEffect(() => {
        return () => onStateChange(false);
    }, [onStateChange]);

    const handleTaskCreated = (id: string, url?: string) => {
        setTaskId(id);
        if (url) setLastUrl(url);
    };

    const handleReset = () => {
        setTaskId(null);
        setLastUrl('');
        onStateChange(false);
    };

    const handleChangeFormat = () => {
        // Keep the last URL but open the format modal
        setShowFormatModal(true);
    };

    const handleFormatConfirm = async (format: FormatOption) => {
        if (!lastUrl) return;

        setIsReprocessing(true);
        try {
            const options: ProcessOptions = {
                format: format.format,
                quality: format.label,
                ytdlpFormat: format.ytdlpFormat,
                audioBitrate: format.id.includes('320') ? '320' : format.id.includes('128') ? '128' : undefined,
                separation: format.separation, // Pass separation option
            };

            const response = await createTask(feature.id, lastUrl, options);
            setTaskId(response.task_id);
            setShowFormatModal(false);
        } catch (err) {
            console.error('Failed to reprocess:', err);
        } finally {
            setIsReprocessing(false);
        }
    };

    // Special handling for removebg feature - it has its own component
    if (feature.id === 'removebg') {
        return <BackgroundRemoval onStateChange={onStateChange} />;
    }

    // Show form if no task is active
    if (!taskId) {
        return (
            <ProcessorForm
                featureType={feature.id}
                placeholder={feature.placeholder}
                onTaskCreated={(id, url) => handleTaskCreated(id, url)}
                showFormatSelector={feature.id === 'download'}
            />
        );
    }

    // Show error state
    if (status === 'failed' && error) {
        return (
            <div className="space-y-4">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-destructive">{t.task.failed}</p>
                            <p className="text-sm text-muted-foreground mt-1">{error}</p>
                        </div>
                    </div>
                </div>
                <Button variant="outline" onClick={handleReset} className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.common.tryAgain}
                </Button>
            </div>
        );
    }

    // Show progress while processing
    if (status && status !== 'completed') {
        return (
            <div className="space-y-4">
                <TaskProgress status={status} progress={progress} isConnected={isConnected} />
                <Button variant="outline" onClick={handleReset} className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.task.cancel}
                </Button>
            </div>
        );
    }

    // Show result when completed
    if (status === 'completed' && result) {
        return (
            <>
                <div className="space-y-4">
                    <ResultDisplay result={result} />
                    <div className="flex flex-col gap-3">
                        <Button variant="outline" onClick={handleReset} className="w-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t.controls.processAnother}
                        </Button>
                        {feature.id === 'download' && (
                            <Button
                                variant="outline"
                                onClick={handleChangeFormat}
                                className="w-full border-blue-500/50 hover:bg-blue-500/10 text-blue-400"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                {t.controls.changeFormat}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Format modal for re-processing */}
                <FormatSelector
                    open={showFormatModal}
                    onOpenChange={setShowFormatModal}
                    onConfirm={handleFormatConfirm}
                    isLoading={isReprocessing}
                    url={lastUrl}
                />
            </>
        );
    }

    // Loading initial state
    return (
        <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">{t.common.loading}</div>
        </div>
    );
}

interface FeatureTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function FeatureTabs({ activeTab, onTabChange }: FeatureTabsProps) {
    const { t } = useLanguage();
    const [pendingTab, setPendingTab] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [hasActiveResult, setHasActiveResult] = useState(false);

    // Build complete features array with translations
    const features: FeatureConfig[] = featuresConfig.map(config => {
        // Safe access to translation keys based on id
        // @ts-ignore - Dynamic key access
        const f = t.features[config.id as any];
        return {
            ...config,
            id: config.id as any, // Cast to avoid intersection issues
            label: f?.label || config.id,
            description: f?.desc || '',
            placeholder: f?.placeholder || '',
        };
    });

    const handleTabChange = (value: string) => {
        if (activeTab === value) return;

        if (hasActiveResult) {
            setPendingTab(value);
            setShowConfirm(true);
        } else {
            onTabChange(value);
        }
    };

    const confirmSwitch = () => {
        if (pendingTab) {
            onTabChange(pendingTab);
            setHasActiveResult(false);
            setPendingTab(null);
        }
        setShowConfirm(false);
    };

    // Tab button component for reuse
    const TabButton = ({ feature, index, isMobile = false }: { feature: FeatureConfig; index: number; isMobile?: boolean }) => {
        const Icon = iconMap[feature.icon as keyof typeof iconMap];
        const isActive = activeTab === feature.id;

        return (
            <button
                onClick={() => handleTabChange(feature.id)}
                style={!isMobile ? { animationDelay: `${index * 100}ms` } : undefined}
                className={`
                    ${isMobile ? 'w-full' : 'flex-1 min-w-[140px] max-w-full sm:max-w-[180px]'}
                    h-auto ${isMobile ? 'py-3.5 px-3' : 'py-5 px-5'} rounded-xl sm:rounded-2xl 
                    border backdrop-blur-md
                    transition-all duration-300 ease-out
                    group cursor-pointer
                    ${!isMobile ? 'animate-in fade-in slide-in-from-bottom-3 fill-mode-both' : ''}
                    ${isActive
                        ? 'bg-gradient-to-br from-violet-600 to-purple-700 border-violet-400/50 text-white shadow-xl shadow-violet-500/30 scale-[1.02]'
                        : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:from-white/10 hover:to-white/5 hover:border-white/20'
                    }
                `}
            >
                <div className={`flex ${isMobile ? 'flex-row items-center gap-2.5' : 'flex-col items-center gap-3'}`}>
                    <div className={`
                        ${isMobile ? 'p-2' : 'p-3'} rounded-lg sm:rounded-xl 
                        transition-all duration-300
                        ${isActive
                            ? 'bg-white/20'
                            : 'bg-white/5 group-hover:bg-white/10'
                        }
                    `}>
                        <Icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} transition-transform duration-300`} />
                    </div>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold whitespace-normal ${isMobile ? 'text-left' : 'text-center'} leading-tight`}>
                        {feature.label}
                    </span>
                </div>
            </button>
        );
    };

    return (
        <>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {/* Mobile Grid - hidden on sm and up */}
                <div className="sm:hidden mb-5">
                    {/* All 6 tabs in 3x2 grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <TabButton key={feature.id} feature={feature} index={index} isMobile />
                        ))}
                    </div>
                </div>

                {/* Desktop TabsList - hidden on mobile */}
                <TabsList className="hidden sm:flex w-full h-auto bg-transparent p-0 gap-4 flex-row flex-wrap justify-center mb-10">
                    {features.map((feature, index) => {
                        const Icon = iconMap[feature.icon as keyof typeof iconMap];
                        return (
                            <TabsTrigger
                                key={feature.id}
                                value={feature.id}
                                style={{ animationDelay: `${index * 100}ms` }}
                                className="
                                flex-1 min-w-[140px] max-w-full sm:max-w-[180px] 
                                h-auto py-5 px-5 rounded-2xl 
                                border border-white/10 backdrop-blur-md
                                bg-gradient-to-br from-white/5 to-white/[0.02]
                                hover:from-white/10 hover:to-white/5
                                hover:border-white/20
                                hover:scale-[1.02] hover:-translate-y-0.5
                                data-[state=active]:bg-gradient-to-br 
                                data-[state=active]:from-violet-600 
                                data-[state=active]:to-purple-700
                                data-[state=active]:border-violet-400/50
                                data-[state=active]:text-white
                                data-[state=active]:shadow-2xl
                                data-[state=active]:shadow-violet-500/30
                                data-[state=active]:scale-[1.03]
                                data-[state=active]:-translate-y-1
                                transition-all duration-300 ease-out
                                group cursor-pointer
                                animate-in fade-in slide-in-from-bottom-3 fill-mode-both
                                "
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="
                                        p-3 rounded-xl 
                                        bg-white/5 
                                        group-hover:bg-white/10
                                        group-data-[state=active]:bg-white/20 
                                        transition-all duration-300
                                        group-hover:scale-110
                                        group-data-[state=active]:scale-110
                                        group-data-[state=active]:rotate-3
                                    ">
                                        <Icon className="w-6 h-6 transition-transform duration-300" />
                                    </div>
                                    <span className="text-sm font-semibold whitespace-normal text-center leading-tight tracking-wide">
                                        {feature.label}
                                    </span>
                                </div>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {features.map((feature) => (
                    <TabsContent key={feature.id} value={feature.id} className="mt-4 sm:mt-6">
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                            <CardHeader className="pb-3 sm:pb-6">
                                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                                    {feature.label}
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <FeaturePanel feature={feature} onStateChange={setHasActiveResult} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="sm:max-w-md bg-card border-border/50">
                    <DialogHeader>
                        <DialogTitle>{t.controls.switchFeature}</DialogTitle>
                        <DialogDescription>
                            {t.controls.switchWarning}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>
                            {t.common.cancel}
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={confirmSwitch}
                        >
                            {t.controls.confirmSwitch}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
