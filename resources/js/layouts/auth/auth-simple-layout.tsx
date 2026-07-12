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
        <div className="relative flex min-h-svh flex-col items-center justify-center px-6 py-10 md:p-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_34%),linear-gradient(180deg,#eff6ff_0%,#dbeafe_52%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_34%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#111827_100%)]">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.22),transparent_28%)] opacity-80 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.16),transparent_28%)]" />
            <div className="w-full max-w-md z-10">
                <div className="flex flex-col gap-4">
                    <Link
                        href={home()}
                        className="flex w-full items-center justify-center rounded-3xl border border-primary/20 bg-primary p-2 shadow-sm backdrop-blur dark:border-primary/30"
                    >
                        <img
                            src="/images/logo-adlc-uad.svg"
                            alt="ADLC UAD"
                            className="h-16 w-auto object-contain"
                        />
                    </Link>

                    <Card className="rounded-3xl border-border/60 bg-card/95 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.35)] backdrop-blur">
                        <CardHeader className="px-6 pt-6 text-center sm:px-8">
                            <CardTitle className="text-2xl tracking-tight">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                                {description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-4 sm:px-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
