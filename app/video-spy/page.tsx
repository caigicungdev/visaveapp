'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FeatureTabs } from '@/components/feature-tabs';
import { useLanguage } from '@/components/language-provider';
import { Search, TrendingUp, Eye, Hash, BarChart3, Target, ChevronDown } from 'lucide-react';

const tabRoutes: Record<string, string> = {
    download: '/tiktok-downloader',
    summary: '/youtube-summary',
    spy: '/video-spy',
    slideshow: '/slideshow-downloader',
    audio: '/vocal-remover',
    removebg: '/remove-background',
};

export default function VideoSpyPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('spy');

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

                {/* What You'll Discover Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                            {content.discover.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.discover.items.map((item, index) => {
                                const icons = [Eye, Hash, TrendingUp, BarChart3, Target, Search];
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

                {/* How to Use Section */}
                <section className="py-16 bg-white/[0.02]">
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
        title: "Video Analytics & Spy Tool",
        subtitle: "Reveal hidden metadata, SEO tags, and engagement metrics of any viral video. Understand what makes content successful."
    },
    whatIs: {
        title: "What is the Video Spy Tool?",
        paragraphs: [
            "The Video Spy Tool is a powerful analytics platform that extracts hidden metadata and performance metrics from TikTok, YouTube, and Instagram videos. It reveals information that isn't visible to regular viewers, giving you insights into why certain videos go viral.",
            "Content creators, marketers, and social media managers use this tool to analyze competitor content, discover trending hashtags, and understand audience engagement patterns. By studying successful videos, you can reverse-engineer their strategies and apply them to your own content.",
            "Our tool extracts data directly from platform APIs and video metadata, providing accurate information about views, likes, comments, shares, hashtags, music usage, posting times, and more. All data is presented in an easy-to-understand format."
        ]
    },
    discover: {
        title: "What Data Can You Extract?",
        items: [
            { title: "View & Engagement Stats", desc: "See exact view counts, like ratios, comment counts, and share numbers for any public video." },
            { title: "Hashtag Analysis", desc: "Discover all hashtags used, including hidden ones. See which tags drive the most engagement." },
            { title: "Trend Detection", desc: "Identify trending sounds, effects, and content formats before they peak." },
            { title: "Performance Metrics", desc: "Calculate engagement rates, view-to-like ratios, and other key performance indicators." },
            { title: "Competitor Insights", desc: "Analyze your competitors' best-performing content and posting strategies." },
            { title: "SEO Keywords", desc: "Extract title keywords, descriptions, and metadata used for video discoverability." }
        ]
    },
    howTo: {
        title: "How to Analyze Any Video",
        steps: [
            { title: "Find a Video to Analyze", desc: "Go to TikTok, YouTube, or Instagram and find a video you want to study. This could be a competitor's viral post or a trending video in your niche." },
            { title: "Copy the Video Link", desc: "Share the video and copy its URL. Make sure it's a public video." },
            { title: "Paste and Analyze", desc: "Paste the video URL into the input field above and click 'Start Processing'." },
            { title: "Review the Data", desc: "Our system will extract all available metadata and present it in a clean, organized dashboard." }
        ]
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [
            { q: "Is it legal to use the Video Spy tool?", a: "Yes, we only access publicly available data. We don't bypass any privacy settings or access private accounts." },
            { q: "How accurate is the data?", a: "We fetch data directly from platform APIs and video metadata. Numbers are accurate at the moment of analysis but may update as videos gain more engagement." },
            { q: "Can I analyze private videos?", a: "No, our tool only works with public videos. Private or restricted content cannot be analyzed." },
            { q: "Which platforms are supported?", a: "We currently support TikTok, YouTube (including Shorts), Instagram Reels, and Facebook Videos." },
            { q: "Can I export the analytics data?", a: "Pro users can export analytics data as CSV or JSON for use in spreadsheets and custom reports." },
            { q: "How often is the data updated?", a: "Each analysis fetches fresh data at the moment you make the request. For tracking over time, Pro users can set up automated monitoring." }
        ]
    }
};

// Vietnamese Content
const contentVi = {
    hero: {
        title: "Phân Tích & Soi Video",
        subtitle: "Khám phá metadata ẩn, thẻ SEO và chỉ số tương tác của video viral. Hiểu điều gì làm nội dung thành công."
    },
    whatIs: {
        title: "Công Cụ Soi Video Là Gì?",
        paragraphs: [
            "Công cụ Soi Video là nền tảng phân tích mạnh mẽ trích xuất metadata ẩn và chỉ số hiệu suất từ video TikTok, YouTube và Instagram. Nó tiết lộ thông tin không hiển thị với người xem thông thường, giúp bạn hiểu tại sao một số video trở nên viral.",
            "Nhà sáng tạo nội dung, marketer và quản lý mạng xã hội sử dụng công cụ này để phân tích nội dung đối thủ, khám phá hashtag trending và hiểu mô hình tương tác của khán giả. Bằng cách nghiên cứu video thành công, bạn có thể phân tích ngược chiến lược của họ.",
            "Công cụ của chúng tôi trích xuất dữ liệu trực tiếp từ API nền tảng và metadata video, cung cấp thông tin chính xác về lượt xem, like, comment, share, hashtag, nhạc sử dụng, thời gian đăng và nhiều hơn nữa."
        ]
    },
    discover: {
        title: "Bạn Có Thể Trích Xuất Dữ Liệu Gì?",
        items: [
            { title: "Thống Kê Lượt Xem & Tương Tác", desc: "Xem số lượt xem chính xác, tỷ lệ like, số comment và lượt share của bất kỳ video công khai nào." },
            { title: "Phân Tích Hashtag", desc: "Khám phá tất cả hashtag được sử dụng, kể cả hashtag ẩn. Xem tag nào mang lại nhiều tương tác nhất." },
            { title: "Phát Hiện Trend", desc: "Nhận diện âm thanh, hiệu ứng và định dạng nội dung trending trước khi chúng đạt đỉnh." },
            { title: "Chỉ Số Hiệu Suất", desc: "Tính tỷ lệ tương tác, tỷ lệ lượt xem/like và các KPI quan trọng khác." },
            { title: "Insight Đối Thủ", desc: "Phân tích nội dung hiệu quả nhất của đối thủ và chiến lược đăng bài của họ." },
            { title: "Từ Khóa SEO", desc: "Trích xuất từ khóa tiêu đề, mô tả và metadata được sử dụng cho khả năng khám phá video." }
        ]
    },
    howTo: {
        title: "Cách Phân Tích Bất Kỳ Video Nào",
        steps: [
            { title: "Tìm Video Cần Phân Tích", desc: "Vào TikTok, YouTube hoặc Instagram và tìm video bạn muốn nghiên cứu. Có thể là bài viral của đối thủ hoặc video trending trong lĩnh vực của bạn." },
            { title: "Copy Link Video", desc: "Chia sẻ video và copy URL của nó. Đảm bảo đó là video công khai." },
            { title: "Dán và Phân Tích", desc: "Dán URL video vào ô nhập liệu phía trên và nhấn 'Bắt đầu Xử lý'." },
            { title: "Xem Xét Dữ Liệu", desc: "Hệ thống sẽ trích xuất tất cả metadata có sẵn và trình bày trong dashboard gọn gàng, có tổ chức." }
        ]
    },
    faq: {
        title: "Câu Hỏi Thường Gặp",
        items: [
            { q: "Sử dụng công cụ Soi Video có hợp pháp không?", a: "Có, chúng tôi chỉ truy cập dữ liệu công khai. Chúng tôi không bỏ qua bất kỳ cài đặt quyền riêng tư nào hoặc truy cập tài khoản riêng tư." },
            { q: "Dữ liệu chính xác đến mức nào?", a: "Chúng tôi lấy dữ liệu trực tiếp từ API nền tảng và metadata video. Số liệu chính xác tại thời điểm phân tích nhưng có thể cập nhật khi video có thêm tương tác." },
            { q: "Tôi có thể phân tích video riêng tư không?", a: "Không, công cụ chỉ hoạt động với video công khai. Nội dung riêng tư hoặc bị hạn chế không thể phân tích." },
            { q: "Những nền tảng nào được hỗ trợ?", a: "Chúng tôi hiện hỗ trợ TikTok, YouTube (bao gồm Shorts), Instagram Reels và Facebook Videos." },
            { q: "Tôi có thể xuất dữ liệu phân tích không?", a: "Người dùng Pro có thể xuất dữ liệu phân tích dưới dạng CSV hoặc JSON để sử dụng trong bảng tính và báo cáo tùy chỉnh." },
            { q: "Dữ liệu được cập nhật thường xuyên như thế nào?", a: "Mỗi phân tích lấy dữ liệu mới tại thời điểm bạn yêu cầu. Để theo dõi theo thời gian, người dùng Pro có thể thiết lập giám sát tự động." }
        ]
    }
};
