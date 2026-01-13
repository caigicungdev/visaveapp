'use client';

import { TaskResult, DownloadResult, SummaryResult, SpyResult, SlideshowResult, AudioResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/components/language-provider';
import {
    Download,
    FileVideo,
    FileAudio,
    Clock,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Hash,
    User,
    Calendar,
    FileText,
    Images,
    ThumbsUp,
    Mic,
    Music,
    Sparkles
} from 'lucide-react';

interface ResultDisplayProps {
    result: TaskResult;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Download Result Component
function DownloadResultDisplay({ result }: { result: DownloadResult }) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="rounded-xl overflow-hidden bg-black/60 border border-border/50">
                <video
                    controls
                    className="w-full h-auto max-h-[400px]"
                    src={result.download_url}
                    poster={result.thumbnail_url}
                >
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-3 rounded-lg bg-violet-500/20 shrink-0">
                        <FileVideo className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">
                            {result.filename}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {formatFileSize(result.file_size)}
                        </p>
                    </div>
                </div>

                <Button
                    asChild
                    className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-violet-600 to-purple-600 
                     hover:from-violet-500 hover:to-purple-500
                     shadow-lg shadow-violet-500/25"
                >
                    <a href={result.download_url} download={result.filename}>
                        <Download className="w-4 h-4 mr-2" />
                        {t.common.download}
                    </a>
                </Button>
            </div>
        </div>
    );
}

// Summary Result Component
function SummaryResultDisplay({ result }: { result: SummaryResult }) {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <FileText className="w-3 h-3 mr-1" />
                    {result.word_count} {t.results.words}
                </Badge>
                {result.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                        <Hash className="w-3 h-3 mr-1" />
                        {topic}
                    </Badge>
                ))}
            </div>

            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-amber-500 text-sm">{t.common.pro}</p>
                            <p className="text-xs text-amber-500/80">{t.common.loginReq}</p>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
                        Login
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                    <div className="prose prose-invert prose-sm max-w-none break-words overflow-hidden
                          prose-headings:text-foreground prose-p:text-muted-foreground
                          prose-strong:text-foreground prose-ul:text-muted-foreground
                          prose-li:text-muted-foreground">
                        <ReactMarkdown>{result.markdown}</ReactMarkdown>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Spy Result Component
function SpyResultDisplay({ result }: { result: SpyResult }) {
    const { t } = useLanguage();

    const stats = [
        { icon: Eye, label: t.results.views, value: formatNumber(result.view_count), color: 'text-blue-400' },
        { icon: Heart, label: t.results.likes, value: formatNumber(result.like_count), color: 'text-red-400' },
        { icon: MessageCircle, label: t.results.comments, value: formatNumber(result.comment_count), color: 'text-green-400' },
        { icon: Share2, label: t.results.shares, value: formatNumber(result.share_count || 0), color: 'text-violet-400' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-secondary shrink-0">
                    <img
                        src={result.thumbnail_url}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <Badge className="mb-2 bg-secondary">{result.platform}</Badge>
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                        {result.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 shrink-0" />
                            <span className="truncate">{result.author}</span>
                        </div>
                        {result.publish_date && (
                            <div className="flex items-center gap-1.5">
                                <span className="hidden sm:inline mx-1">•</span>
                                <Calendar className="w-4 h-4 shrink-0" />
                                <span>{result.publish_date}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((stat, index) => (
                    <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4 text-center">
                            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                            <p className="text-xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground line-clamp-4">{result.description}</p>
                </CardContent>
            </Card>

            {result.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="bg-secondary/50 text-muted-foreground border-border/50"
                        >
                            #{tag}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

// Slideshow Result Component
function SlideshowResultDisplay({ result }: { result: SlideshowResult }) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
                {result.images.slice(0, 6).map((image, index) => (
                    <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden bg-secondary relative"
                    >
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {index === 5 && result.images.length > 6 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white font-bold">+{result.images.length - 6}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-3 rounded-lg bg-pink-500/20 shrink-0">
                        <Images className="w-6 h-6 text-pink-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{result.filename}</p>
                        <p className="text-sm text-muted-foreground">{result.images.length} images</p>
                    </div>
                </div>

                <Button
                    asChild
                    className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-pink-600 to-rose-600 
                     hover:from-pink-500 hover:to-rose-500
                     shadow-lg shadow-pink-500/25"
                >
                    <a href={result.download_url} download={result.filename}>
                        <Download className="w-4 h-4 mr-2" />
                        {t.common.download}
                    </a>
                </Button>
            </div>
        </div>
    );
}

// Audio Result Component
function AudioResultDisplay({ result }: { result: AudioResult }) {
    const { t } = useLanguage();

    const tracks = [
        {
            title: "Full Audio",
            url: result.download_url,
            filename: result.filename,
            icon: FileAudio,
            color: "text-emerald-400",
            bg: "bg-emerald-500/20",
            gradient: "from-emerald-600 to-teal-600",
            hover: "hover:from-emerald-500 hover:to-teal-500",
            shadow: "shadow-emerald-500/25"
        },
        ...(result.vocals_url ? [{
            title: "Vocals Only", // TODO: Add to dictionary if needed, or keep generic English for technical terms
            url: result.vocals_url,
            filename: result.vocals_filename || "vocals.mp3",
            icon: Mic,
            color: "text-blue-400",
            bg: "bg-blue-500/20",
            gradient: "from-blue-600 to-cyan-600",
            hover: "hover:from-blue-500 hover:to-cyan-500",
            shadow: "shadow-blue-500/25"
        }] : []),
        ...(result.instrumental_url ? [{
            title: "Instrumental (Beat)",
            url: result.instrumental_url,
            filename: result.instrumental_filename || "instrumental.mp3",
            icon: Music,
            color: "text-violet-400",
            bg: "bg-violet-500/20",
            gradient: "from-violet-600 to-purple-600",
            hover: "hover:from-violet-500 hover:to-purple-500",
            shadow: "shadow-violet-500/25"
        }] : [])
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>{formatFileSize(result.file_size)}</span>
                <span>•</span>
                <span>{formatDuration(result.duration)}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs">
                    {result.format.toUpperCase()}
                </Badge>
            </div>

            {tracks.map((track, index) => (
                <div key={index} className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                        {track.title}
                    </h4>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/50">
                        <audio
                            controls
                            className="w-full mb-4 h-10"
                            src={track.url}
                        >
                            Your browser does not support the audio element.
                        </audio>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg ${track.bg}`}>
                                    <track.icon className={`w-5 h-5 ${track.color}`} />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                        {track.filename}
                                    </p>
                                </div>
                            </div>

                            <Button
                                asChild
                                className={`bg-gradient-to-r ${track.gradient} ${track.hover} shadow-lg ${track.shadow}`}
                            >
                                <a href={track.url} download={track.filename}>
                                    <Download className="w-4 h-4 mr-2" />
                                    {t.common.download}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Main Result Display Component
export function ResultDisplay({ result }: ResultDisplayProps) {
    switch (result.type) {
        case 'download':
            return <DownloadResultDisplay result={result} />;
        case 'summary':
            return <SummaryResultDisplay result={result} />;
        case 'spy':
            return <SpyResultDisplay result={result} />;
        case 'slideshow':
            return <SlideshowResultDisplay result={result} />;
        case 'audio':
            return <AudioResultDisplay result={result} />;
        default:
            return (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="pt-6">
                        <pre className="text-sm text-muted-foreground overflow-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            );
    }
}
