'use client';

import { useLanguage } from '@/components/language-provider';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
    const { t } = useLanguage();

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                    {t.faq.title}
                </h2>

                <div className="space-y-4">
                    {t.faq.items.map((item, index) => (
                        <details
                            key={index}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 open:bg-white/10 transition-colors"
                        >
                            <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-white">
                                {item.q}
                                <span className="group-open:rotate-180 transition-transform duration-300">
                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                </span>
                            </summary>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
