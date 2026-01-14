'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FeatureTabs } from '@/components/feature-tabs';
import { useLanguage } from '@/components/language-provider';
import { Music, Mic, Headphones, Volume2, Scissors, Wand2, ChevronDown } from 'lucide-react';

const tabRoutes: Record<string, string> = {
    download: '/tiktok-downloader',
    summary: '/youtube-summary',
    spy: '/video-spy',
    slideshow: '/slideshow-downloader',
    audio: '/vocal-remover',
    removebg: '/remove-background',
};

export default function VocalRemoverPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('audio');

    const handleTabChange = (tab: string) => {
        if (tab !== activeTab && tabRoutes[tab]) {
            router.push(tabRoutes[tab]);
        }
    };

    const content = language === 'vi' ? contentVi : contentEn;

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-violet-500/30 font-sans">
            <SiteHeader />

            <main className="flex-1 pt-24 sm:pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-4 pb-12 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-8 space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 leading-tight">
                            {content.hero.title}
                        </h1>
                        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                            {content.hero.subtitle}
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto relative mb-16">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-50 pointer-events-none" />
                        <FeatureTabs activeTab={activeTab} onTabChange={handleTabChange} />
                    </div>
                </section>

                {/* What is Section */}
                <section className="py-16 bg-white/[0.02]">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                            {content.whatIs.title}
                        </h2>
                        <div className="prose prose-invert prose-lg max-w-none">
                            {content.whatIs.paragraphs.map((p, i) => (
                                <p key={i} className="text-slate-300 leading-relaxed mb-4">{p}</p>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How to Use Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                            {content.howTo.title}
                        </h2>
                        <div className="space-y-6">
                            {content.howTo.steps.map((step, index) => (
                                <div key={index} className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                                        <p className="text-slate-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white/[0.02]">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                            {content.features.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.features.items.map((item, index) => {
                                const icons = [Music, Mic, Headphones, Volume2, Scissors, Wand2];
                                const Icon = icons[index % icons.length];
                                return (
                                    <div key={index} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <Icon className="w-8 h-8 text-violet-400 mb-4" />
                                        <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                                        <p className="text-slate-400 text-sm">{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                            {content.faq.title}
                        </h2>
                        <div className="space-y-4">
                            {content.faq.items.map((item, index) => (
                                <details
                                    key={index}
                                    className="group p-6 rounded-2xl bg-white/5 border border-white/10 open:bg-white/10 transition-colors"
                                >
                                    <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-white">
                                        {item.q}
                                        <span className="group-open:rotate-180 transition-transform duration-300">
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        </span>
                                    </summary>
                                    <p className="mt-4 text-slate-400 leading-relaxed">
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}

const contentEn = {
    hero: {
        title: "Vocal Remover & Audio Extractor",
        subtitle: "Extract audio from videos, separate vocals from instrumentals, and convert videos to MP3. AI-powered audio processing."
    },
    whatIs: {
        title: "What is Vocal Remover & Audio Extractor?",
        paragraphs: [
            "Our Vocal Remover & Audio Extractor is an AI-powered tool that processes audio in multiple ways. Extract the audio track from any video, separate singing vocals from background music, or convert video content into high-quality MP3 files.",
            "The vocal separation technology uses machine learning to isolate human voices from instrumental tracks. This is perfect for creating karaoke versions of songs, remixing tracks, or studying musical arrangements without vocals in the way.",
            "Whether you're a content creator needing background music, a musician wanting to practice with isolated instruments, or just someone who wants to save a song from a TikTok video - our tool handles all these use cases with professional-quality results."
        ]
    },
    howTo: {
        title: "How to Extract & Process Audio",
        steps: [
            { title: "Choose Your Source", desc: "Paste a video URL from TikTok, YouTube, Instagram, or other supported platforms into the input field." },
            { title: "Select Processing Mode", desc: "Choose whether you want to extract full audio, remove vocals, or isolate vocals only." },
            { title: "Start Processing", desc: "Click the processing button and wait while our AI analyzes and processes the audio tracks." },
            { title: "Download Your Audio", desc: "Preview the results and download your processed audio in MP3 format (320kbps quality)." }
        ]
    },
    features: {
        title: "Audio Processing Features",
        items: [
            { title: "Extract Audio from Video", desc: "Pull the complete audio track from any video. Perfect for saving songs, podcasts, or speeches." },
            { title: "AI Vocal Removal", desc: "Separate vocals from music using AI. Get instrumental versions for karaoke or remixing." },
            { title: "Vocal Isolation", desc: "Extract only the vocals from a song. Great for studying singing techniques or creating acapella samples." },
            { title: "High Quality MP3", desc: "Download audio in 320kbps MP3 format - the highest quality for standard audio files." },
            { title: "Multiple Sources", desc: "Works with TikTok, YouTube, Instagram, Facebook, and other major video platforms." },
            { title: "Fast AI Processing", desc: "Advanced AI processes audio in real-time. Most files are ready in under 30 seconds." }
        ]
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [
            { q: "How good is the vocal removal quality?", a: "Our AI achieves studio-quality separation for most commercial music. Complex tracks with overlapping frequencies may have some artifacts, but results are generally excellent." },
            { q: "What audio quality can I expect?", a: "We output MP3 files at 320kbps, which is CD-quality audio. The quality is limited only by the source video's original audio." },
            { q: "Can I use this for karaoke?", a: "Absolutely! The vocal removal feature is perfect for creating karaoke backing tracks from any song." },
            { q: "Does this work with any language?", a: "Yes, our AI can separate vocals regardless of language. It works on the audio frequencies, not the words themselves." },
            { q: "Is there a maximum video length?", a: "Free users can process videos up to 10 minutes. Pro users can process content up to 2 hours in length." },
            { q: "Can I extract audio from private videos?", a: "No, our tool only works with publicly accessible video content. Private or restricted videos cannot be processed." }
        ]
    }
};

const contentVi = {
    hero: {
        title: "Tách Vocal & Trích Xuất Âm Thanh",
        subtitle: "Trích xuất âm thanh từ video, tách giọng hát khỏi nhạc nền, và chuyển đổi video sang MP3. Xử lý âm thanh bằng AI."
    },
    whatIs: {
        title: "Tách Vocal & Trích Xuất Âm Thanh Là Gì?",
        paragraphs: [
            "Công cụ Tách Vocal & Trích Xuất Âm Thanh là tool AI xử lý âm thanh đa cách. Trích xuất track âm thanh từ bất kỳ video nào, tách giọng hát khỏi nhạc nền, hoặc chuyển đổi nội dung video thành file MP3 chất lượng cao.",
            "Công nghệ tách vocal sử dụng machine learning để cô lập giọng hát con người khỏi track nhạc cụ. Hoàn hảo để tạo phiên bản karaoke của bài hát, remix track, hoặc nghiên cứu cấu trúc âm nhạc mà không bị giọng hát che lấp.",
            "Dù bạn là nhà sáng tạo nội dung cần nhạc nền, nhạc sĩ muốn luyện tập với nhạc cụ được cô lập, hay chỉ là người muốn lưu bài hát từ video TikTok - công cụ của chúng tôi xử lý tất cả với kết quả chất lượng chuyên nghiệp."
        ]
    },
    howTo: {
        title: "Cách Trích Xuất & Xử Lý Âm Thanh",
        steps: [
            { title: "Chọn Nguồn", desc: "Dán URL video từ TikTok, YouTube, Instagram hoặc các nền tảng được hỗ trợ khác vào ô nhập liệu." },
            { title: "Chọn Chế Độ Xử Lý", desc: "Chọn xem bạn muốn trích xuất âm thanh đầy đủ, xóa vocal, hay chỉ cô lập vocal." },
            { title: "Bắt Đầu Xử Lý", desc: "Nhấn nút xử lý và đợi AI phân tích và xử lý các track âm thanh." },
            { title: "Tải Âm Thanh", desc: "Nghe thử kết quả và tải âm thanh đã xử lý ở định dạng MP3 (chất lượng 320kbps)." }
        ]
    },
    features: {
        title: "Tính Năng Xử Lý Âm Thanh",
        items: [
            { title: "Trích Xuất Âm Thanh Từ Video", desc: "Lấy track âm thanh đầy đủ từ bất kỳ video nào. Hoàn hảo để lưu nhạc, podcast hoặc bài phát biểu." },
            { title: "Xóa Vocal Bằng AI", desc: "Tách giọng hát khỏi nhạc bằng AI. Nhận phiên bản instrumental cho karaoke hoặc remix." },
            { title: "Cô Lập Vocal", desc: "Chỉ trích xuất giọng hát từ bài hát. Tuyệt vời để nghiên cứu kỹ thuật hát hoặc tạo sample acapella." },
            { title: "MP3 Chất Lượng Cao", desc: "Tải âm thanh ở định dạng MP3 320kbps - chất lượng cao nhất cho file âm thanh tiêu chuẩn." },
            { title: "Đa Nguồn", desc: "Hoạt động với TikTok, YouTube, Instagram, Facebook và các nền tảng video lớn khác." },
            { title: "Xử Lý AI Nhanh", desc: "AI tiên tiến xử lý âm thanh theo thời gian thực. Hầu hết file sẵn sàng trong dưới 30 giây." }
        ]
    },
    faq: {
        title: "Câu Hỏi Thường Gặp",
        items: [
            { q: "Chất lượng xóa vocal tốt đến mức nào?", a: "AI của chúng tôi đạt chất lượng tách như studio cho hầu hết nhạc thương mại. Track phức tạp với tần số chồng chéo có thể có một số artifact, nhưng kết quả thường xuất sắc." },
            { q: "Tôi có thể mong đợi chất lượng âm thanh gì?", a: "Chúng tôi xuất file MP3 ở 320kbps, đây là chất lượng âm thanh CD. Chất lượng chỉ bị giới hạn bởi âm thanh gốc của video nguồn." },
            { q: "Tôi có thể dùng cho karaoke không?", a: "Chắc chắn! Tính năng xóa vocal hoàn hảo để tạo nhạc nền karaoke từ bất kỳ bài hát nào." },
            { q: "Có hoạt động với mọi ngôn ngữ không?", a: "Có, AI của chúng tôi có thể tách vocal bất kể ngôn ngữ. Nó hoạt động dựa trên tần số âm thanh, không phải từ ngữ." },
            { q: "Có độ dài video tối đa không?", a: "Người dùng miễn phí có thể xử lý video đến 10 phút. Người dùng Pro có thể xử lý nội dung đến 2 giờ." },
            { q: "Tôi có thể trích xuất âm thanh từ video riêng tư không?", a: "Không, công cụ chỉ hoạt động với nội dung video có thể truy cập công khai. Video riêng tư hoặc bị hạn chế không thể xử lý." }
        ]
    }
};
