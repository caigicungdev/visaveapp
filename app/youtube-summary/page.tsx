'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FeatureTabs } from '@/components/feature-tabs';
import { useLanguage } from '@/components/language-provider';
import { Brain, Clock, FileText, Sparkles, BookOpen, Languages, ChevronDown } from 'lucide-react';

const tabRoutes: Record<string, string> = {
    download: '/tiktok-downloader',
    summary: '/youtube-summary',
    spy: '/video-spy',
    slideshow: '/slideshow-downloader',
    audio: '/vocal-remover',
    removebg: '/remove-background',
};

export default function YouTubeSummaryPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('summary');

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

                    {/* Tool Interface */}
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

                {/* Use Cases Section */}
                <section className="py-16 bg-white/[0.02]">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                            {content.useCases.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.useCases.items.map((item, index) => {
                                const icons = [Brain, Clock, FileText, Sparkles, BookOpen, Languages];
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

// English Content
const contentEn = {
    hero: {
        title: "YouTube Video Summarizer - AI Powered",
        subtitle: "Transform long YouTube videos into concise, readable summaries using advanced AI. Save hours of watching time."
    },
    whatIs: {
        title: "What is YouTube Video Summarizer?",
        paragraphs: [
            "YouTube Video Summarizer is an AI-powered tool that automatically extracts the key points and main ideas from any YouTube video. Instead of watching a 30-minute tutorial or lecture, you can read a 2-minute summary that captures all the essential information.",
            "Our AI uses advanced natural language processing to analyze video transcripts, identify important topics, and generate coherent summaries. The technology understands context, can distinguish between main points and supporting details, and organizes information in a logical structure.",
            "Whether you're a student researching topics, a professional catching up on industry content, or just someone who wants to quickly understand what a video is about before committing to watch it - our summarizer helps you consume content more efficiently."
        ]
    },
    howTo: {
        title: "How to Summarize YouTube Videos",
        steps: [
            { title: "Find Your YouTube Video", desc: "Go to YouTube and find the video you want to summarize. Works with tutorials, lectures, podcasts, interviews, and more." },
            { title: "Copy the Video URL", desc: "Click the share button or copy the URL from your browser's address bar." },
            { title: "Paste and Process", desc: "Paste the YouTube link into the input field above and click 'Start Processing'." },
            { title: "Wait for AI Analysis", desc: "Our AI will fetch the transcript, analyze the content, and generate a comprehensive summary. This usually takes 10-30 seconds." },
            { title: "Read and Use Your Summary", desc: "Review the AI-generated summary. You can copy it, share it, or use it for notes and research." }
        ]
    },
    useCases: {
        title: "Who Uses AI Video Summarization?",
        items: [
            { title: "Students & Researchers", desc: "Quickly digest educational content, lectures, and documentary videos for academic work." },
            { title: "Busy Professionals", desc: "Stay updated on industry trends and thought leadership without spending hours watching videos." },
            { title: "Content Creators", desc: "Research competitor videos and trending topics efficiently to inform your content strategy." },
            { title: "Language Learners", desc: "Get text summaries of foreign language videos to improve comprehension and build vocabulary." },
            { title: "Journalists & Writers", desc: "Extract quotes and key information from interview videos for articles and reports." },
            { title: "Podcast Listeners", desc: "Preview long podcast episodes with summaries to decide which ones are worth your time." }
        ]
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [
            { q: "How accurate are the AI summaries?", a: "Our AI summaries capture 90%+ of key points accurately. However, for complex technical or nuanced content, we recommend verifying critical information against the original video." },
            { q: "What languages are supported?", a: "We support videos with English, Vietnamese, Spanish, French, German, Portuguese, and many other languages that have YouTube auto-captions or manual subtitles." },
            { q: "What's the maximum video length?", a: "Free users can summarize videos up to 20 minutes. Pro users can summarize videos up to 4 hours long." },
            { q: "Can I summarize private or unlisted videos?", a: "No, our tool can only access publicly available YouTube videos. Private and some unlisted videos cannot be processed." },
            { q: "How is this different from YouTube chapters?", a: "YouTube chapters just mark timestamps. Our AI actually reads and understands the content to generate a written summary you can read in minutes." },
            { q: "Can I customize the summary length?", a: "Pro users can choose between brief (100 words), standard (300 words), and detailed (500+ words) summary lengths." }
        ]
    }
};

// Vietnamese Content
const contentVi = {
    hero: {
        title: "Tóm Tắt Video YouTube - AI",
        subtitle: "Biến video YouTube dài thành bản tóm tắt ngắn gọn, dễ đọc bằng AI tiên tiến. Tiết kiệm hàng giờ xem video."
    },
    whatIs: {
        title: "Công Cụ Tóm Tắt Video YouTube Là Gì?",
        paragraphs: [
            "Công cụ Tóm Tắt Video YouTube là tool AI tự động trích xuất các điểm chính và ý tưởng quan trọng từ bất kỳ video YouTube nào. Thay vì xem tutorial hay bài giảng 30 phút, bạn có thể đọc bản tóm tắt 2 phút chứa tất cả thông tin thiết yếu.",
            "AI của chúng tôi sử dụng công nghệ xử lý ngôn ngữ tự nhiên tiên tiến để phân tích transcript video, xác định các chủ đề quan trọng và tạo bản tóm tắt mạch lạc. Công nghệ hiểu ngữ cảnh, phân biệt giữa điểm chính và chi tiết phụ, và sắp xếp thông tin theo cấu trúc logic.",
            "Dù bạn là sinh viên nghiên cứu đề tài, chuyên gia cập nhật nội dung ngành, hay chỉ là người muốn nhanh chóng hiểu video nói về gì trước khi quyết định xem - công cụ tóm tắt giúp bạn tiêu thụ nội dung hiệu quả hơn."
        ]
    },
    howTo: {
        title: "Cách Tóm Tắt Video YouTube",
        steps: [
            { title: "Tìm Video YouTube", desc: "Vào YouTube và tìm video bạn muốn tóm tắt. Hoạt động với tutorial, bài giảng, podcast, phỏng vấn và nhiều hơn nữa." },
            { title: "Copy URL Video", desc: "Nhấn nút chia sẻ hoặc copy URL từ thanh địa chỉ trình duyệt." },
            { title: "Dán và Xử Lý", desc: "Dán link YouTube vào ô nhập liệu phía trên và nhấn 'Bắt đầu Xử lý'." },
            { title: "Chờ AI Phân Tích", desc: "AI sẽ lấy transcript, phân tích nội dung và tạo bản tóm tắt toàn diện. Thường mất 10-30 giây." },
            { title: "Đọc và Sử Dụng", desc: "Xem lại bản tóm tắt AI tạo. Bạn có thể copy, chia sẻ hoặc dùng để ghi chú và nghiên cứu." }
        ]
    },
    useCases: {
        title: "Ai Sử Dụng Tóm Tắt Video AI?",
        items: [
            { title: "Sinh Viên & Nghiên Cứu", desc: "Nhanh chóng tiêu hóa nội dung giáo dục, bài giảng và video tài liệu cho công việc học thuật." },
            { title: "Chuyên Gia Bận Rộn", desc: "Cập nhật xu hướng ngành và nội dung chuyên môn mà không mất hàng giờ xem video." },
            { title: "Nhà Sáng Tạo Nội Dung", desc: "Nghiên cứu video đối thủ và chủ đề trending hiệu quả để định hình chiến lược nội dung." },
            { title: "Người Học Ngôn Ngữ", desc: "Nhận bản tóm tắt văn bản của video ngoại ngữ để cải thiện khả năng hiểu và xây dựng từ vựng." },
            { title: "Nhà Báo & Tác Giả", desc: "Trích xuất trích dẫn và thông tin chính từ video phỏng vấn cho bài viết và báo cáo." },
            { title: "Người Nghe Podcast", desc: "Xem trước các tập podcast dài bằng bản tóm tắt để quyết định tập nào đáng nghe." }
        ]
    },
    faq: {
        title: "Câu Hỏi Thường Gặp",
        items: [
            { q: "Bản tóm tắt AI chính xác đến mức nào?", a: "Bản tóm tắt AI của chúng tôi nắm bắt hơn 90% các điểm chính một cách chính xác. Tuy nhiên, với nội dung kỹ thuật phức tạp hoặc tinh tế, chúng tôi khuyên bạn nên xác minh thông tin quan trọng với video gốc." },
            { q: "Hỗ trợ những ngôn ngữ nào?", a: "Chúng tôi hỗ trợ video có phụ đề tiếng Anh, Việt, Tây Ban Nha, Pháp, Đức, Bồ Đào Nha và nhiều ngôn ngữ khác có phụ đề tự động YouTube." },
            { q: "Độ dài video tối đa là bao nhiêu?", a: "Người dùng miễn phí có thể tóm tắt video đến 20 phút. Người dùng Pro có thể tóm tắt video đến 4 giờ." },
            { q: "Có thể tóm tắt video riêng tư không?", a: "Không, công cụ chỉ có thể truy cập video YouTube công khai. Video riêng tư và một số video không công khai không thể xử lý." },
            { q: "Khác gì với YouTube chapters?", a: "YouTube chapters chỉ đánh dấu các mốc thời gian. AI của chúng tôi thực sự đọc và hiểu nội dung để tạo bản tóm tắt văn bản bạn có thể đọc trong vài phút." },
            { q: "Tôi có thể tùy chỉnh độ dài tóm tắt không?", a: "Người dùng Pro có thể chọn giữa các độ dài: ngắn gọn (100 từ), tiêu chuẩn (300 từ) và chi tiết (500+ từ)." }
        ]
    }
};
