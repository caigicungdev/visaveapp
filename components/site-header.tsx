'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/providers/auth-provider';
import { AuthModal } from '@/components/auth-modal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Crown } from 'lucide-react';

export function SiteHeader() {
    const { t, language } = useLanguage();
    const { user, isLoading, signOut } = useAuth();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const userMenuText = language === 'vi' ? {
        profile: 'Hồ sơ',
        premium: 'Nâng cấp Pro',
        logout: 'Đăng xuất',
    } : {
        profile: 'Profile',
        premium: 'Upgrade to Pro',
        logout: 'Log Out',
    };

    return (
        <>
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-3 sm:py-0 sm:h-24 md:h-28 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-center justify-center w-full sm:w-auto">
                        <Image
                            src="/assets/logo-vtool.png"
                            alt="V-Tool Logo"
                            width={200}
                            height={80}
                            className="w-40 h-auto sm:w-48 md:w-56 object-contain hover:scale-105 transition-transform duration-300"
                            priority
                        />
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <LanguageSwitcher />

                        {isLoading ? (
                            <div className="w-20 h-9 bg-white/5 rounded animate-pulse" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/10 hover:bg-white/5 text-xs sm:text-sm px-3 h-9 gap-2"
                                    >
                                        {user.user_metadata?.avatar_url ? (
                                            <Image
                                                src={user.user_metadata.avatar_url}
                                                alt="Avatar"
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <User className="w-4 h-4" />
                                        )}
                                        <span className="hidden sm:inline max-w-[100px] truncate">
                                            {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-white/10">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <User className="w-4 h-4 mr-2" />
                                        {userMenuText.profile}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer text-yellow-500">
                                        <Crown className="w-4 h-4 mr-2" />
                                        {userMenuText.premium}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-400"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        {userMenuText.logout}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 hover:bg-white/5 text-xs sm:text-sm px-4 sm:px-4 h-9"
                                onClick={() => setAuthModalOpen(true)}
                            >
                                {t.header.login}
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
        </>
    );
}

