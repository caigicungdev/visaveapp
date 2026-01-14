'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FeatureTabs } from '@/components/feature-tabs';
import { useLanguage } from '@/components/language-provider';
import { Check, Download, Zap, Shield, Smartphone, Globe, ChevronDown } from 'lucide-react';
import type { Metadata } from 'next';

export default function TikTokDownloaderPage() {
    const { t, language } = useLanguage();
    const [activeTab] = useState('download');

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
                        <FeatureTabs activeTab={activeTab} onTabChange={() => { }} />
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

                {/* Benefits Section */}
                <section className="py-16 bg-white/[0.02]">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                            {content.benefits.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.benefits.items.map((item, index) => {
                                const icons = [Download, Zap, Shield, Smartphone, Globe, Check];
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

                {/* Supported Platforms */}
                <section className="py-16 bg-white/[0.02]">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                            {content.platforms.title}
                        </h2>
                        <p className="text-slate-400 mb-8">{content.platforms.desc}</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {content.platforms.list.map((platform, index) => (
                                <span key={index} className="px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                                    {platform}
                                </span>
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
        title: "TikTok Video Downloader - No Watermark",
        subtitle: "Download TikTok videos in HD quality without the TikTok watermark. Fast, free, and works on all devices."
    },
    whatIs: {
        title: "What is TikTok Video Downloader?",
        paragraphs: [
            "TikTok Video Downloader is a free online tool that allows you to save TikTok videos directly to your device without the annoying TikTok watermark. Whether you want to repost content, create compilations, or simply save your favorite videos for offline viewing, our tool makes it easy.",
            "Unlike other downloaders that leave the TikTok logo on your videos, ViSave uses advanced processing to deliver clean, watermark-free videos in their original HD quality. The process is completely automated - just paste the link and download.",
            "Our service works on all platforms including iPhone, Android, Windows, and Mac. No app installation required - everything runs in your browser for maximum convenience and privacy."
        ]
    },
    howTo: {
        title: "How to Download TikTok Videos Without Watermark",
        steps: [
            { title: "Copy the TikTok Video Link", desc: "Open the TikTok app or website, find the video you want to download, tap the Share button, and select 'Copy Link'." },
            { title: "Paste the Link Above", desc: "Return to this page and paste the copied TikTok URL into the input field above." },
            { title: "Click 'Start Processing'", desc: "Our servers will fetch the video, remove the watermark, and prepare multiple quality options for you." },
            { title: "Choose Your Format", desc: "Select your preferred video quality (HD 1080p, 720p) or download as MP3 audio." },
            { title: "Download & Enjoy", desc: "Click the download button and the video will be saved to your device instantly." }
        ]
    },
    benefits: {
        title: "Why Use Our TikTok Downloader?",
        items: [
            { title: "No Watermark", desc: "Download TikTok videos completely clean without the TikTok logo or username overlay." },
            { title: "Lightning Fast", desc: "Our optimized servers process videos in under 3 seconds. No waiting around." },
            { title: "100% Free & Safe", desc: "No hidden fees, no registration required. We don't store your data or download history." },
            { title: "Works on All Devices", desc: "iPhone, Android, iPad, Windows, Mac - if you have a browser, you can download." },
            { title: "HD Quality", desc: "Get the original video quality up to 1080p. No compression or quality loss." },
            { title: "MP3 Extraction", desc: "Want just the audio? Extract the soundtrack as high-quality MP3 with one click." }
        ]
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [
            { q: "Is it legal to download TikTok videos?", a: "Downloading TikTok videos for personal use is generally acceptable. However, you should not redistribute copyrighted content without permission from the original creator." },
            { q: "Why can't I download some videos?", a: "Some TikTok creators set their videos to 'private' or restrict downloads. Our tool respects these privacy settings and cannot bypass them." },
            { q: "Does this work on iPhone/iOS?", a: "Yes! Our downloader works perfectly on Safari for iPhone and iPad. The video will be saved to your Photos app or Files." },
            { q: "Is there a limit to how many videos I can download?", a: "Free users can download up to 3 videos per day. Create a free account to increase your daily limit." },
            { q: "Can I download TikTok slideshows (photo videos)?", a: "Yes! For TikTok photo slideshows, use our dedicated 'Slideshow Downloader' tab to save all images individually." },
            { q: "What video formats are supported?", a: "We support MP4 (video) and MP3 (audio only). MP4 is compatible with virtually all devices and video players." }
        ]
    },
    platforms: {
        title: "Supported Platforms",
        desc: "Download videos from TikTok and these other popular platforms:",
        list: ["TikTok", "TikTok Lite", "Douyin (Chinese TikTok)", "Instagram Reels", "YouTube Shorts", "Facebook Videos"]
    }
};

// Vietnamese Content  
const contentVi = {
    hero: {
        title: "Tải Video TikTok - Không Logo",
        subtitle: "Tải video TikTok chất lượng HD không dính watermark. Nhanh, miễn phí, hoạt động trên mọi thiết bị."
    },
    whatIs: {
        title: "Công Cụ Tải Video TikTok Là Gì?",
        paragraphs: [
            "Công cụ Tải Video TikTok là dịch vụ trực tuyến miễn phí giúp bạn lưu video TikTok về thiết bị mà không dính logo TikTok phiền phức. Dù bạn muốn đăng lại video, tạo video tổng hợp, hay đơn giản là lưu video yêu thích để xem offline, công cụ của chúng tôi giúp bạn thực hiện dễ dàng.",
            "Khác với các công cụ khác để lại logo TikTok trên video, ViSave sử dụng công nghệ xử lý tiên tiến để mang đến video sạch, không watermark với chất lượng HD gốc. Quy trình hoàn toàn tự động - chỉ cần dán link và tải xuống.",
            "Dịch vụ hoạt động trên tất cả nền tảng bao gồm iPhone, Android, Windows và Mac. Không cần cài đặt ứng dụng - mọi thứ chạy trên trình duyệt để đảm bảo tiện lợi và bảo mật tối đa."
        ]
    },
    howTo: {
        title: "Cách Tải Video TikTok Không Logo",
        steps: [
            { title: "Copy Link Video TikTok", desc: "Mở ứng dụng TikTok, tìm video muốn tải, nhấn nút Chia sẻ và chọn 'Sao chép liên kết'." },
            { title: "Dán Link Vào Ô Trên", desc: "Quay lại trang này và dán link TikTok vào ô nhập liệu phía trên." },
            { title: "Nhấn 'Bắt Đầu Xử Lý'", desc: "Server của chúng tôi sẽ lấy video, xóa watermark và chuẩn bị nhiều lựa chọn chất lượng cho bạn." },
            { title: "Chọn Định Dạng", desc: "Chọn chất lượng video mong muốn (HD 1080p, 720p) hoặc tải dạng MP3 âm thanh." },
            { title: "Tải Về & Thưởng Thức", desc: "Nhấn nút tải xuống và video sẽ được lưu vào thiết bị ngay lập tức." }
        ]
    },
    benefits: {
        title: "Tại Sao Chọn Công Cụ Của Chúng Tôi?",
        items: [
            { title: "Không Logo", desc: "Tải video TikTok hoàn toàn sạch, không dính logo TikTok hay ID người dùng." },
            { title: "Siêu Nhanh", desc: "Server tối ưu xử lý video trong vòng 3 giây. Không phải chờ đợi." },
            { title: "Miễn Phí & An Toàn", desc: "Không phí ẩn, không cần đăng ký. Chúng tôi không lưu dữ liệu hay lịch sử tải." },
            { title: "Mọi Thiết Bị", desc: "iPhone, Android, iPad, Windows, Mac - có trình duyệt là tải được." },
            { title: "Chất Lượng HD", desc: "Nhận video chất lượng gốc lên đến 1080p. Không nén hay giảm chất lượng." },
            { title: "Tách MP3", desc: "Chỉ muốn lấy nhạc? Trích xuất âm thanh thành MP3 chất lượng cao chỉ với một cú nhấp." }
        ]
    },
    faq: {
        title: "Câu Hỏi Thường Gặp",
        items: [
            { q: "Tải video TikTok có hợp pháp không?", a: "Tải video TikTok để sử dụng cá nhân thường được chấp nhận. Tuy nhiên, bạn không nên phân phối lại nội dung có bản quyền mà không có sự cho phép của người tạo gốc." },
            { q: "Tại sao tôi không tải được một số video?", a: "Một số nhà sáng tạo TikTok đặt video ở chế độ 'riêng tư' hoặc hạn chế tải xuống. Công cụ của chúng tôi tôn trọng các cài đặt quyền riêng tư này." },
            { q: "Có hoạt động trên iPhone không?", a: "Có! Công cụ hoạt động hoàn hảo trên Safari cho iPhone và iPad. Video sẽ được lưu vào ứng dụng Ảnh hoặc Tệp." },
            { q: "Có giới hạn số video tải không?", a: "Người dùng miễn phí có thể tải tối đa 3 video mỗi ngày. Tạo tài khoản miễn phí để tăng giới hạn hàng ngày." },
            { q: "Tôi có thể tải TikTok slideshow (video ảnh) không?", a: "Được! Với TikTok slideshow, sử dụng tab 'Tải Ảnh Slideshow' để lưu tất cả ảnh riêng lẻ." },
            { q: "Hỗ trợ định dạng video nào?", a: "Chúng tôi hỗ trợ MP4 (video) và MP3 (chỉ âm thanh). MP4 tương thích với hầu hết các thiết bị và trình phát video." }
        ]
    },
    platforms: {
        title: "Nền Tảng Hỗ Trợ",
        desc: "Tải video từ TikTok và các nền tảng phổ biến khác:",
        list: ["TikTok", "TikTok Lite", "Douyin (TikTok Trung Quốc)", "Instagram Reels", "YouTube Shorts", "Facebook Videos"]
    }
};
