'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FeatureTabs } from '@/components/feature-tabs';
import { useLanguage } from '@/components/language-provider';
import { Image, Wand2, Sparkles, Download, Zap, ShoppingBag, ChevronDown } from 'lucide-react';

export default function RemoveBackgroundPage() {
    const { language } = useLanguage();
    const [activeTab] = useState('removebg');

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

                {/* Use Cases Section */}
                <section className="py-16 bg-white/[0.02]">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                            {content.useCases.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.useCases.items.map((item, index) => {
                                const icons = [ShoppingBag, Image, Sparkles, Download, Zap, Wand2];
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
        title: "AI Background Remover",
        subtitle: "Remove image backgrounds instantly with AI. Get transparent PNG files in seconds - perfect for e-commerce, design, and social media."
    },
    whatIs: {
        title: "What is AI Background Remover?",
        paragraphs: [
            "AI Background Remover is a powerful tool that uses artificial intelligence to automatically detect and remove backgrounds from any image. Simply upload a photo and our AI will separate the subject from the background, giving you a clean transparent PNG.",
            "Unlike manual photo editing which requires hours of careful selection and masking, our AI completes the process in seconds with professional-quality results. It works on people, products, animals, objects, and more.",
            "The tool is perfect for e-commerce product photos, social media graphics, profile pictures, marketing materials, and any creative project that requires images with transparent backgrounds. No Photoshop skills needed!"
        ]
    },
    howTo: {
        title: "How to Remove Backgrounds",
        steps: [
            { title: "Upload Your Image", desc: "Click or drag-and-drop an image into the upload area. Supports JPG, PNG, and WebP formats up to 10MB." },
            { title: "AI Processing", desc: "Our AI automatically detects the subject of your image and removes the background. This usually takes 2-5 seconds." },
            { title: "Preview & Download", desc: "View the result with transparency. If satisfied, download the high-quality PNG with transparent background." }
        ]
    },
    useCases: {
        title: "Popular Use Cases",
        items: [
            { title: "E-commerce Products", desc: "Create clean, professional product photos with white or transparent backgrounds for your online store." },
            { title: "Social Media Content", desc: "Make eye-catching posts and stories by placing yourself or products on custom backgrounds." },
            { title: "Profile Pictures", desc: "Create professional headshots with clean backgrounds for LinkedIn, resumes, and business profiles." },
            { title: "Marketing Materials", desc: "Design flyers, banners, and ads by extracting subjects to place on branded backgrounds." },
            { title: "Photo Collages", desc: "Cut out people and objects to create fun collages, memes, and composite images." },
            { title: "ID & Passport Photos", desc: "Prepare photos with plain white backgrounds for official documents and applications." }
        ]
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [
            { q: "What image formats are supported?", a: "We support JPG, JPEG, PNG, and WebP formats. Images can be up to 10MB in size for free users." },
            { q: "How accurate is the AI background removal?", a: "Our AI achieves 95%+ accuracy on most images. Complex edges like hair or fine details are handled with remarkable precision." },
            { q: "Can I remove backgrounds from multiple images?", a: "Yes, you can process images one at a time. Pro users get batch processing to handle up to 50 images at once." },
            { q: "What output format will I receive?", a: "All processed images are output as PNG files with transparent backgrounds, preserving full image quality." },
            { q: "Is my image data stored on your servers?", a: "No, we process images in real-time and automatically delete all uploads within 1 hour. Your privacy is protected." },
            { q: "Can I use the Magic Eraser to remove specific objects?", a: "Yes! Switch to 'Magic Eraser' mode to manually paint over and remove unwanted objects, watermarks, or blemishes." }
        ]
    }
};

const contentVi = {
    hero: {
        title: "Xóa Nền Ảnh Bằng AI",
        subtitle: "Xóa nền ảnh tự động bằng AI. Nhận file PNG trong suốt trong vài giây - hoàn hảo cho thương mại điện tử, thiết kế và mạng xã hội."
    },
    whatIs: {
        title: "Công Cụ Xóa Nền AI Là Gì?",
        paragraphs: [
            "Công cụ Xóa Nền AI là tool mạnh mẽ sử dụng trí tuệ nhân tạo để tự động phát hiện và xóa nền từ bất kỳ ảnh nào. Chỉ cần upload ảnh và AI sẽ tách chủ thể khỏi nền, cho bạn file PNG trong suốt sạch sẽ.",
            "Khác với chỉnh sửa ảnh thủ công đòi hỏi hàng giờ chọn vùng và masking cẩn thận, AI của chúng tôi hoàn thành trong vài giây với kết quả chất lượng chuyên nghiệp. Hoạt động với người, sản phẩm, động vật, đồ vật và nhiều hơn nữa.",
            "Công cụ hoàn hảo cho ảnh sản phẩm thương mại điện tử, đồ họa mạng xã hội, ảnh đại diện, tài liệu marketing và bất kỳ dự án sáng tạo nào cần ảnh với nền trong suốt. Không cần kỹ năng Photoshop!"
        ]
    },
    howTo: {
        title: "Cách Xóa Nền Ảnh",
        steps: [
            { title: "Upload Ảnh", desc: "Nhấn hoặc kéo thả ảnh vào vùng upload. Hỗ trợ định dạng JPG, PNG và WebP đến 10MB." },
            { title: "AI Xử Lý", desc: "AI tự động phát hiện chủ thể trong ảnh và xóa nền. Thường mất 2-5 giây." },
            { title: "Xem & Tải", desc: "Xem kết quả với độ trong suốt. Nếu hài lòng, tải file PNG chất lượng cao với nền trong suốt." }
        ]
    },
    useCases: {
        title: "Trường Hợp Sử Dụng Phổ Biến",
        items: [
            { title: "Ảnh Sản Phẩm E-commerce", desc: "Tạo ảnh sản phẩm sạch, chuyên nghiệp với nền trắng hoặc trong suốt cho cửa hàng online." },
            { title: "Nội Dung Mạng Xã Hội", desc: "Tạo bài đăng và story bắt mắt bằng cách đặt bản thân hoặc sản phẩm lên nền tùy chỉnh." },
            { title: "Ảnh Đại Diện", desc: "Tạo ảnh chân dung chuyên nghiệp với nền sạch cho LinkedIn, CV và hồ sơ doanh nghiệp." },
            { title: "Tài Liệu Marketing", desc: "Thiết kế tờ rơi, banner và quảng cáo bằng cách trích xuất chủ thể để đặt lên nền thương hiệu." },
            { title: "Ảnh Ghép", desc: "Cắt người và đồ vật để tạo ảnh ghép vui, meme và ảnh kết hợp." },
            { title: "Ảnh Thẻ & Hộ Chiếu", desc: "Chuẩn bị ảnh với nền trắng trơn cho giấy tờ và hồ sơ chính thức." }
        ]
    },
    faq: {
        title: "Câu Hỏi Thường Gặp",
        items: [
            { q: "Những định dạng ảnh nào được hỗ trợ?", a: "Chúng tôi hỗ trợ định dạng JPG, JPEG, PNG và WebP. Ảnh có thể đến 10MB cho người dùng miễn phí." },
            { q: "Độ chính xác của AI xóa nền như thế nào?", a: "AI của chúng tôi đạt độ chính xác hơn 95% trên hầu hết ảnh. Các cạnh phức tạp như tóc hoặc chi tiết mịn được xử lý với độ chính xác đáng kinh ngạc." },
            { q: "Tôi có thể xóa nền nhiều ảnh không?", a: "Có, bạn có thể xử lý ảnh từng cái một. Người dùng Pro có xử lý hàng loạt đến 50 ảnh cùng lúc." },
            { q: "Tôi sẽ nhận định dạng output gì?", a: "Tất cả ảnh đã xử lý được xuất dưới dạng file PNG với nền trong suốt, giữ nguyên chất lượng ảnh đầy đủ." },
            { q: "Dữ liệu ảnh của tôi có được lưu trên server không?", a: "Không, chúng tôi xử lý ảnh theo thời gian thực và tự động xóa tất cả upload trong vòng 1 giờ. Quyền riêng tư của bạn được bảo vệ." },
            { q: "Tôi có thể dùng Magic Eraser để xóa đối tượng cụ thể không?", a: "Có! Chuyển sang chế độ 'Magic Eraser' để tô thủ công và xóa đối tượng không mong muốn, watermark hoặc khuyết điểm." }
        ]
    }
};
