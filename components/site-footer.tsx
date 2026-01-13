'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { Github, Twitter, MessageCircle } from 'lucide-react';

import Image from 'next/image';

export function SiteFooter() {
    const { t } = useLanguage();

    return (
        <footer className="w-full border-t border-white/5 bg-black/20 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/assets/logo-vtool.png"
                                alt="Visave App Logo"
                                width={140}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t.footer.aboutDesc}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">{t.footer.products}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-violet-400 transition-colors">TikTok Downloader</a></li>
                            <li><a href="#" className="hover:text-violet-400 transition-colors">YouTube Summary</a></li>
                            <li><a href="#" className="hover:text-violet-400 transition-colors">Instagram Saver</a></li>
                            <li><a href="#" className="hover:text-violet-400 transition-colors">Audio Extractor</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">{t.footer.legal}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-violet-400 transition-colors">{t.footer.about}</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-violet-400 transition-colors">{t.footer.privacy}</Link></li>
                            <li><Link href="/terms-of-use" className="hover:text-violet-400 transition-colors">{t.footer.terms}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">{t.footer.contact}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="mailto:visaveapp.org@gmail.com" className="hover:text-violet-400 transition-colors">visaveapp.org@gmail.com</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-muted-foreground">
                    <p>{t.footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
}

