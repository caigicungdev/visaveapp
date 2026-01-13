'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        // Load saved language from localStorage
        const saved = localStorage.getItem('language') as Language;
        if (saved && (saved === 'en' || saved === 'vi')) {
            setLanguage(saved);
            return;
        }

        // Auto-detect language from browser settings
        if (typeof navigator !== 'undefined') {
            const browserLang = navigator.language || (navigator as any).userLanguage || '';
            // Check if Vietnamese (vi, vi-VN, vi-vn)
            if (browserLang.toLowerCase().startsWith('vi')) {
                setLanguage('vi');
                localStorage.setItem('language', 'vi');
            } else {
                // Default to English
                setLanguage('en');
                localStorage.setItem('language', 'en');
            }
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage: handleSetLanguage,
            t: translations[language]
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
