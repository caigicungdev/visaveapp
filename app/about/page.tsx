'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';

export default function AboutPage() {
    const { t } = useLanguage();
    const p = t.pages.about;

    return (
        <main className="min-h-screen bg-background pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {p.title}
                </h1>

                <div className="prose prose-invert prose-lg max-w-none">
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/assets/logo-vtool.png"
                            alt="ViSaveApp Logo"
                            width={280}
                            height={112}
                            className="object-contain"
                        />
                    </div>

                    <p className="text-gray-300 leading-relaxed text-lg">
                        {p.intro}
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">{p.toolsTitle}</h2>

                    <div className="grid gap-6 mt-6">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-purple-400 mb-2">{p.tools.downloader.title}</h3>
                            <p className="text-gray-300">{p.tools.downloader.desc}</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-purple-400 mb-2">{p.tools.summarizer.title}</h3>
                            <p className="text-gray-300">{p.tools.summarizer.desc}</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-purple-400 mb-2">{p.tools.analytics.title}</h3>
                            <p className="text-gray-300">{p.tools.analytics.desc}</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-purple-400 mb-2">{p.tools.audio.title}</h3>
                            <p className="text-gray-300">{p.tools.audio.desc}</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-purple-400 mb-2">{p.tools.removebg.title}</h3>
                            <p className="text-gray-300">{p.tools.removebg.desc}</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">{p.whyTitle}</h2>

                    <ul className="text-gray-300 space-y-3">
                        {p.whyItems.map((item, idx) => (
                            <li key={idx}>
                                {item.icon} <strong>{item.title}</strong> {item.desc}
                            </li>
                        ))}
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">{p.contactTitle}</h2>
                    <p className="text-gray-300">
                        {p.contactText}{' '}
                        <a href="mailto:visaveapp.org@gmail.com" className="text-purple-400 hover:text-purple-300">
                            visaveapp.org@gmail.com
                        </a>
                    </p>

                    <p className="text-gray-500 text-sm mt-12 text-center">
                        {p.copyright}
                    </p>
                </div>
            </div>
        </main>
    );
}
