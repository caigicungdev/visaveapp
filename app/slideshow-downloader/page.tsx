'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FeatureTabs } from '@/components/feature-tabs';
import { useLanguage } from '@/components/language-provider';
import { Images, Download, Sparkles, Layers, Smartphone, Zap, ChevronDown } from 'lucide-react';

export default function SlideshowDownloaderPage() {
    const { language } = useLanguage();
    const [activeTab] = useState('slideshow');

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

                {/* Features Section */}
                <section className="py-16 bg-white/[0.02]">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                            {content.features.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.features.items.map((item, index) => {
                                const icons = [Images, Download, Sparkles, Layers, Smartphone, Zap];
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
        title: "TikTok Slideshow Downloader",
        subtitle: "Download all images from TikTok photo slideshows in HD quality without watermarks. Save entire photo sets instantly."
    },
    whatIs: {
        title: "What is TikTok Slideshow Downloader?",
        paragraphs: [
            "TikTok Slideshow Downloader is a specialized tool designed to extract and save all individual images from TikTok photo carousel posts. When creators post multiple photos as a slideshow video, our tool separates each image and lets you download them in their original HD quality.",
            "Unlike regular video downloaders that save the slideshow as a video file, our tool extracts the actual source images. This means you get crisp, high-resolution photos without compression artifacts or watermarks.",
            "The tool is perfect for saving aesthetic photo dumps, meme collections, outfit inspirations, recipe cards, or any multi-image TikTok content. Download the entire set with one click or select specific images you want."
        ]
    },
    howTo: {
        title: "How to Download TikTok Slideshow Images",
        steps: [
            { title: "Find a TikTok Slideshow", desc: "Open TikTok and find a photo slideshow post (these show multiple images that users can swipe through)." },
            { title: "Copy the Link", desc: "Tap the Share button and select 'Copy Link' to copy the TikTok URL." },
            { title: "Paste the URL", desc: "Return to this page and paste the copied link into the input field above." },
            { title: "Download Images", desc: "Click 'Start Processing' and wait for all images to be extracted. Download them individually or as a ZIP file." }
        ]
    },
    features: {
        title: "Key Features",
        items: [
            { title: "Extract All Photos", desc: "Automatically detect and extract every image from a TikTok slideshow, no matter how many photos are included." },
            { title: "No Watermarks", desc: "Download clean images without the TikTok logo or username overlay that appears on videos." },
            { title: "Original Quality", desc: "Get images in their original upload resolution, typically 1080p or higher for quality content." },
            { title: "Batch Download", desc: "Download all images at once as a ZIP file, saving time compared to saving each photo manually." },
            { title: "Works on All Devices", desc: "Use directly in your browser on iPhone, Android, or desktop. No app installation required." },
            { title: "Fast Processing", desc: "Our servers extract images in seconds, even from slideshows with 10+ photos." }
        ]
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [
            { q: "Can I download slideshows from any TikTok account?", a: "Yes, as long as the account is public. Private account slideshows cannot be accessed by our tool." },
            { q: "What image format will I receive?", a: "Images are downloaded in their original format, typically JPEG or PNG, depending on how the creator uploaded them." },
            { q: "Is there a limit on how many images I can download?", a: "Free users can download up to 5 slideshows per day. Pro users have unlimited downloads." },
            { q: "Can I download the slideshow as a video instead?", a: "Yes! If you prefer the video format with music, use our regular 'Video Downloader' tab instead." },
            { q: "Why are some images lower quality than others?", a: "Image quality depends on the original upload. We always provide the highest resolution available from TikTok's servers." },
            { q: "Can I select specific images to download?", a: "Yes, after processing you can preview all images and choose to download individual ones or the entire set." }
        ]
    }
};

const contentVi = {
    hero: {
        title: "Tải Ảnh TikTok Slideshow",
        subtitle: "Tải tất cả ảnh từ bài đăng slideshow TikTok chất lượng HD không watermark. Lưu trọn bộ ảnh ngay lập tức."
    },
    whatIs: {
        title: "Công Cụ Tải Ảnh Slideshow Là Gì?",
        paragraphs: [
            "Công cụ Tải Ảnh TikTok Slideshow là công cụ chuyên biệt được thiết kế để trích xuất và lưu tất cả ảnh riêng lẻ từ các bài đăng carousel ảnh trên TikTok. Khi nhà sáng tạo đăng nhiều ảnh dưới dạng video slideshow, công cụ của chúng tôi tách từng ảnh và cho phép bạn tải về với chất lượng HD gốc.",
            "Khác với các công cụ tải video thông thường lưu slideshow dưới dạng file video, công cụ của chúng tôi trích xuất ảnh nguồn thực tế. Điều này có nghĩa bạn nhận được ảnh sắc nét, độ phân giải cao mà không bị nén hoặc dính watermark.",
            "Công cụ hoàn hảo để lưu các bộ ảnh thẩm mỹ, bộ sưu tập meme, cảm hứng outfit, card công thức món ăn hoặc bất kỳ nội dung TikTok đa ảnh nào. Tải toàn bộ với một cú nhấp hoặc chọn ảnh cụ thể bạn muốn."
        ]
    },
    howTo: {
        title: "Cách Tải Ảnh Slideshow TikTok",
        steps: [
            { title: "Tìm TikTok Slideshow", desc: "Mở TikTok và tìm bài đăng slideshow ảnh (những bài hiển thị nhiều ảnh mà người dùng có thể vuốt qua)." },
            { title: "Copy Link", desc: "Nhấn nút Chia sẻ và chọn 'Sao chép liên kết' để copy URL TikTok." },
            { title: "Dán URL", desc: "Quay lại trang này và dán link đã copy vào ô nhập liệu phía trên." },
            { title: "Tải Ảnh", desc: "Nhấn 'Bắt đầu Xử lý' và đợi tất cả ảnh được trích xuất. Tải riêng lẻ hoặc dưới dạng file ZIP." }
        ]
    },
    features: {
        title: "Tính Năng Chính",
        items: [
            { title: "Trích Xuất Tất Cả Ảnh", desc: "Tự động phát hiện và trích xuất mọi ảnh từ slideshow TikTok, không giới hạn số lượng ảnh." },
            { title: "Không Watermark", desc: "Tải ảnh sạch không dính logo TikTok hay tên người dùng như trên video." },
            { title: "Chất Lượng Gốc", desc: "Nhận ảnh với độ phân giải gốc khi upload, thường là 1080p hoặc cao hơn cho nội dung chất lượng." },
            { title: "Tải Hàng Loạt", desc: "Tải tất cả ảnh cùng lúc dưới dạng file ZIP, tiết kiệm thời gian so với lưu từng ảnh thủ công." },
            { title: "Mọi Thiết Bị", desc: "Sử dụng trực tiếp trên trình duyệt iPhone, Android hoặc máy tính. Không cần cài ứng dụng." },
            { title: "Xử Lý Nhanh", desc: "Server của chúng tôi trích xuất ảnh trong vài giây, kể cả slideshow có hơn 10 ảnh." }
        ]
    },
    faq: {
        title: "Câu Hỏi Thường Gặp",
        items: [
            { q: "Tôi có thể tải slideshow từ bất kỳ tài khoản TikTok nào không?", a: "Có, miễn là tài khoản công khai. Slideshow từ tài khoản riêng tư không thể truy cập bằng công cụ của chúng tôi." },
            { q: "Tôi sẽ nhận định dạng ảnh gì?", a: "Ảnh được tải về ở định dạng gốc, thường là JPEG hoặc PNG, tùy thuộc vào cách nhà sáng tạo upload." },
            { q: "Có giới hạn số ảnh tôi có thể tải không?", a: "Người dùng miễn phí có thể tải tối đa 5 slideshow mỗi ngày. Người dùng Pro không giới hạn." },
            { q: "Tôi có thể tải slideshow dạng video thay vì ảnh không?", a: "Có! Nếu bạn thích định dạng video có nhạc, sử dụng tab 'Tải Video' thông thường." },
            { q: "Tại sao một số ảnh chất lượng thấp hơn ảnh khác?", a: "Chất lượng ảnh phụ thuộc vào bản upload gốc. Chúng tôi luôn cung cấp độ phân giải cao nhất có sẵn từ server TikTok." },
            { q: "Tôi có thể chọn ảnh cụ thể để tải không?", a: "Có, sau khi xử lý bạn có thể xem trước tất cả ảnh và chọn tải riêng lẻ hoặc toàn bộ." }
        ]
    }
};
