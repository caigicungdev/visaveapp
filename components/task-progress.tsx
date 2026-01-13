'use client';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { TaskStatus } from '@/types';
import { useLanguage } from '@/components/language-provider';

interface TaskProgressProps {
    status: TaskStatus;
    progress: number;
    isConnected: boolean;
}

export function TaskProgress({ status, progress, isConnected }: TaskProgressProps) {
    const { t } = useLanguage();

    const statusConfig = {
        pending: {
            label: t.common.pending,
            icon: Clock,
            color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        },
        processing: {
            label: t.common.processing,
            icon: Loader2,
            color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        },
        completed: {
            label: t.common.completed,
            icon: CheckCircle2,
            color: 'bg-green-500/20 text-green-400 border-green-500/30',
        },
        failed: {
            label: t.task.failed,
            icon: XCircle,
            color: 'bg-red-500/20 text-red-400 border-red-500/30',
        },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    const isAnimated = status === 'processing';

    return (
        <div className="space-y-4 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color.split(' ')[0]}`}>
                        <Icon className={`h-5 w-5 ${isAnimated ? 'animate-spin' : ''} ${config.color.split(' ')[1]}`} />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">Task Status</p>
                        <p className="text-sm text-muted-foreground">
                            {isConnected ? 'Real-time updates active' : 'Connecting...'}
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className={`${config.color} border`}>
                    {config.label}
                </Badge>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{progress}%</span>
                </div>
                <div className="relative">
                    <Progress
                        value={progress}
                        className="h-2 bg-secondary"
                    />
                    {isAnimated && progress < 100 && (
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                            style={{ width: '100%' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
