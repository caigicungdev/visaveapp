'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HowItWorks } from '@/components/how-it-works';
import { FeaturesGrid } from '@/components/features-grid';
import { FAQSection } from '@/components/faq-section';
import { FeatureTabs } from '@/components/feature-tabs';
import { useLanguage } from '@/components/language-provider';

export default function Home() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('download');

    // Safe dynamic title access
    // @ts-ignore
    const heroTitle = t.home.titles?.[activeTab] || t.home.title;

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-violet-500/30 font-sans">
            <SiteHeader />

            <main className="flex-1 pt-32 sm:pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-4 pb-12 sm:pb-20 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 space-y-3 sm:space-y-6">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight">
                            {heroTitle}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                            {t.home.subtitle}
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto relative">
                        {/* Glow effect behind tabs */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-50 pointer-events-none" />
                        <FeatureTabs activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>
                </section>

                <HowItWorks />
                <FeaturesGrid />
                <FAQSection />
            </main>

            <SiteFooter />
        </div>
    );
}
