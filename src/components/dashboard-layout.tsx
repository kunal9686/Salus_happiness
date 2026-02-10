"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  BookHeart,
  Bot,
  LogOut,
  PanelLeft,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, useUser } from "@/firebase";
import { Skeleton } from "./ui/skeleton";

const navItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/journal", label: "Journal", icon: BookHeart },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
  { href: "/inspire", label: "Inspire", icon: Sparkles },
  { href: "/community", label: "Community", icon: Users },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    if (auth) {
      auth.signOut().then(() => {
        router.push('/login');
      });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-primary"
          >
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
            <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
            <path d="M12 12v-2" />
          </svg>
          <h2 className="text-xl font-headline font-semibold text-foreground">Salus</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-sidebar-accent w-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/user/40/40"} alt={user?.displayName ?? "user"} />
                        <AvatarFallback>{user?.displayName?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                     <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-medium">{user?.displayName ?? 'User'}</span>
                        <span className="text-xs text-muted-foreground">{user?.email ?? 'user@example.com'}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link href="/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};


const AppHeader = ({ pageTitle }: { pageTitle: string }) => {
    const { isMobile } = useSidebar();
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
            {isMobile && <SidebarTrigger><PanelLeft /></SidebarTrigger>}
            <h1 className="text-xl font-semibold font-headline">{pageTitle}</h1>
        </header>
    )
}

export function DashboardLayout({
  children,
  pageTitle,
}: {
  children: ReactNode;
  pageTitle: string;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
       if(pathname !== '/login' && pathname !== '/signup') {
         router.replace('/login');
       }
    }
  }, [isUserLoading, user, router, pathname]);

  if (isUserLoading || !user) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
         <div className="flex flex-col items-center gap-4">
           <Skeleton className="h-12 w-12 rounded-full" />
           <div className="space-y-2">
             <Skeleton className="h-4 w-[250px]" />
             <Skeleton className="h-4 w-[200px]" />
           </div>
         </div>
       </div>
    )
  }

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <AppHeader pageTitle={pageTitle} />
            {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
