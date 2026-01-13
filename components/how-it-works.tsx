'use client';

import { useLanguage } from '@/components/language-provider';
import { Clipboard, Settings2, Download, ArrowRight } from 'lucide-react';

export function HowItWorks() {
    const { t } = useLanguage();

    const icons = [Clipboard, Settings2, Download];

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        {t.howItWorks.title}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t.howItWorks.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {t.howItWorks.steps.map((step, index) => {
                        const Icon = icons[index];
                        return (
                            <div key={index} className="relative group">
                                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
                                    <div className="w-16 h-16 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-8 h-8 text-violet-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-sm">
                                            {index + 1}
                                        </span>
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                                {/* Arrow connector for desktop */}
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-white/20 transform translate-x-1/2">
                                        <ArrowRight className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
