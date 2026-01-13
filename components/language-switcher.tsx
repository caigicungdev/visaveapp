'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex bg-secondary/50 rounded-lg p-1 border border-border/50">
            <Button
                variant={language === 'en' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className={`h-8 px-3 text-xs font-medium ${language === 'en' ? 'bg-background shadow-sm' : ''}`}
            >
                EN
            </Button>
            <Button
                variant={language === 'vi' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('vi')}
                className={`h-8 px-3 text-xs font-medium ${language === 'vi' ? 'bg-background shadow-sm' : ''}`}
            >
                VI
            </Button>
        </div>
    );
}
