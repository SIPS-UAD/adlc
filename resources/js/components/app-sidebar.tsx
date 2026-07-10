import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    DollarSign,
    FileText,
    FolderOpen,
    LayoutGrid,
    Users,
    Award,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth } from '@/types';
import type { NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Surat Pengantar', href: '/admin/surat-pengantar', icon: FileText },
    { title: 'Surat Keterangan', href: '/admin/surat-keterangan', icon: BookOpen },
    { title: 'Dokumen', href: '/admin/dokumen', icon: FolderOpen },
    { title: 'Keuangan', href: '/admin/keuangan', icon: DollarSign },
    { title: 'Skor ADEPT', href: '/admin/adept/sessions', icon: Award },
    { title: 'Manajemen User', href: '/admin/users', icon: Users },
];

const applicantNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/portal/dashboard', icon: LayoutGrid },
    { title: 'Surat Saya', href: '/portal/surat', icon: FileText },
    { title: 'Dokumen', href: '/portal/dokumen', icon: FolderOpen },
    { title: 'Nilai ADEPT', href: '/portal/nilai-adept', icon: Award },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user?.role === 'admin';
    const homeHref = isAdmin ? '/admin/dashboard' : '/portal/dashboard';
    const navItems = isAdmin ? adminNavItems : applicantNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
