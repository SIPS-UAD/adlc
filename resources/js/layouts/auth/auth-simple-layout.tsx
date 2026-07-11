import { Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-10 md:p-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_34%),linear-gradient(180deg,_#eff6ff_0%,_#dbeafe_52%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_34%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#111827_100%)]">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.2),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.22),_transparent_28%)] opacity-80 dark:bg-[linear-gradient(135deg,_rgba(255,255,255,0.04),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.16),_transparent_28%)]" />
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <Link
                        href={home()}
                        className="mx-auto flex items-center justify-center rounded-3xl border border-primary/20 bg-primary p-4 shadow-sm backdrop-blur dark:border-primary/30"
                    >
                        <img
                            src="/images/logo-adlc-uad.svg"
                            alt="ADLC UAD"
                            className="h-10 w-auto max-w-[180px] object-contain"
                        />
                    </Link>

                    <Card className="rounded-3xl border-border/60 bg-card/95 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.35)] backdrop-blur">
                        <CardHeader className="px-8 pt-8 text-center sm:px-10">
                            <CardTitle className="text-2xl tracking-tight">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-sm leading-6">
                                {description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-6 sm:px-10">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
