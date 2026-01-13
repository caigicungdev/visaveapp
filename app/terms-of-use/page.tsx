'use client';

import { useLanguage } from '@/components/language-provider';

export default function TermsOfUsePage() {
    const { t } = useLanguage();
    const p = t.pages.terms;
    const s = p.sections;

    return (
        <main className="min-h-screen bg-background pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {p.title}
                </h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.acceptance.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.acceptance.content}</p>
                        <p className="text-gray-300 leading-relaxed mt-4">{s.acceptance.content2}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.proprietary.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.proprietary.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.use.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.use.content}</p>
                        <p className="text-gray-300 leading-relaxed mt-4">{s.use.content2}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.monitoring.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.monitoring.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.thirdParty.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.thirdParty.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.disclaimer.title}</h2>
                        <p className="text-gray-300 leading-relaxed uppercase text-sm">{s.disclaimer.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.liability.title}</h2>
                        <p className="text-gray-300 leading-relaxed uppercase text-sm">{s.liability.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.indemnification.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.indemnification.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.termination.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{s.termination.content}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{s.contact.title}</h2>
                        <p className="text-gray-300 leading-relaxed">
                            {s.contact.content} <a href="mailto:visaveapp.org@gmail.com" className="text-purple-400 hover:text-purple-300">visaveapp.org@gmail.com</a>
                        </p>
                    </section>

                    <p className="text-gray-500 text-sm mt-12">
                        {p.lastUpdated}
                    </p>
                </div>
            </div>
        </main>
    );
}
