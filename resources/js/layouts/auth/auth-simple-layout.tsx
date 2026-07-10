import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
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
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 py-10 md:p-10">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.04),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.04),_transparent_30%)]" />
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <Link
                        href={home()}
                        className="mx-auto flex items-center gap-3 font-medium text-foreground"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
                            <AppLogoIcon className="size-6 fill-current text-[var(--foreground)] dark:text-white" />
                        </div>
                        <div className="grid text-left text-sm leading-tight">
                            <span className="font-semibold tracking-tight">
                                ADLC
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Portal layanan
                            </span>
                        </div>
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
