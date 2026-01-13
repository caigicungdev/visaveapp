'use client';

import { useLanguage } from '@/components/language-provider';

export default function PrivacyPolicyPage() {
    const { t } = useLanguage();
    const p = t.pages.privacy;
    const s = p.sections;

    return (
        <main className="min-h-screen bg-background pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {p.title}
                </h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.visitors.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.visitors.content}</p>
                        <p className="text-gray-300 leading-relaxed mt-4">{s.visitors.content2}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.security.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.security.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.ads.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.ads.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.links.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.links.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.adsense.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.adsense.content}</p>
                        <p className="text-gray-300 leading-relaxed mt-4">{s.adsense.content2}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.protection.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.protection.content}</p>
                        <p className="text-gray-300 leading-relaxed mt-4">{s.protection.content2}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.cookies.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.cookies.content}</p>
                        <p className="text-gray-300 leading-relaxed mt-4">{s.cookies.content2}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.changes.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.changes.content}</p>
                    </section>

                    <p className="text-gray-500 text-sm mt-12">
                        {p.lastUpdated}
                    </p>
                </div>
            </div>
        </main>
    );
}
