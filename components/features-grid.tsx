'use client';

import { useLanguage } from '@/components/language-provider';
import { ShieldCheck, Zap, Layers, FileVideo, Coins, MonitorSmartphone } from 'lucide-react';

export function FeaturesGrid() {
    const { t } = useLanguage();

    const icons = [
        MonitorSmartphone,  // No Waterfall
        Zap,                // AI Powered
        Layers,             // Fast Speed
        FileVideo,          // Multiple Formats
        ShieldCheck,        // Secure
        Coins               // Free
    ];

    const gradients = [
        'from-blue-500/20 to-cyan-500/20 text-blue-400',
        'from-purple-500/20 to-pink-500/20 text-purple-400',
        'from-amber-500/20 to-orange-500/20 text-amber-400',
        'from-emerald-500/20 to-teal-500/20 text-emerald-400',
        'from-rose-500/20 to-red-500/20 text-rose-400',
        'from-indigo-500/20 to-violet-500/20 text-indigo-400',
    ];

    return (
        <section className="py-20 bg-black/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t.benefits.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {t.benefits.items.map((item, index) => {
                        const Icon = icons[index];
                        const gradient = gradients[index];
                        return (
                            <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
