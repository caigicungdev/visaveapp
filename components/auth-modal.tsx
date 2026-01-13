'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useLanguage } from '@/components/language-provider';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Chrome } from 'lucide-react';

interface AuthModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, isConfigured } = useAuth();
    const { language } = useLanguage();

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const t = language === 'vi' ? {
        title: mode === 'login' ? 'Đăng nhập' : 'Đăng ký',
        description: mode === 'login'
            ? 'Đăng nhập để lưu lịch sử và mở khóa tính năng Pro'
            : 'Tạo tài khoản để bắt đầu',
        email: 'Email',
        password: 'Mật khẩu',
        submit: mode === 'login' ? 'Đăng nhập' : 'Đăng ký',
        orContinueWith: 'Hoặc tiếp tục với',
        google: 'Google',
        switchMode: mode === 'login'
            ? 'Chưa có tài khoản? Đăng ký'
            : 'Đã có tài khoản? Đăng nhập',
        notConfigured: 'Supabase chưa được cấu hình. Vui lòng thêm biến môi trường.',
        successSignup: 'Kiểm tra email để xác nhận tài khoản!',
    } : {
        title: mode === 'login' ? 'Log In' : 'Sign Up',
        description: mode === 'login'
            ? 'Log in to save history and unlock Pro features'
            : 'Create an account to get started',
        email: 'Email',
        password: 'Password',
        submit: mode === 'login' ? 'Log In' : 'Sign Up',
        orContinueWith: 'Or continue with',
        google: 'Google',
        switchMode: mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in',
        notConfigured: 'Supabase not configured. Please add environment variables.',
        successSignup: 'Check your email to confirm your account!',
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error } = await signInWithEmail(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    onOpenChange(false);
                }
            } else {
                const { error } = await signUpWithEmail(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess(t.successSignup);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        await signInWithGoogle();
        // Google OAuth redirects, so loading state will persist until redirect
    };

    if (!isConfigured) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-white/10">
                    <DialogHeader>
                        <DialogTitle>{t.title}</DialogTitle>
                        <DialogDescription className="text-yellow-500">
                            {t.notConfigured}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-xl">{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t.email}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{t.password}</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    {success && (
                        <p className="text-green-400 text-sm">{success}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Mail className="w-4 h-4 mr-2" />
                        )}
                        {t.submit}
                    </Button>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            {t.orContinueWith}
                        </span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full border-white/10 hover:bg-white/5"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <Chrome className="w-4 h-4 mr-2" />
                    {t.google}
                </Button>

                <button
                    type="button"
                    onClick={() => {
                        setMode(mode === 'login' ? 'signup' : 'login');
                        setError(null);
                        setSuccess(null);
                    }}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                    {t.switchMode}
                </button>
            </DialogContent>
        </Dialog>
    );
}
