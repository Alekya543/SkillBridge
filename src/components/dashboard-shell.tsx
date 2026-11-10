import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Bell, CircleUserRound, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { BrandLockup, BrandWordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, type Role, roleMeta } from "@/lib/auth";

export function DashboardShell({
  role,
  title,
  subtitle,
  children,
  navigation = [],
  active,
  onNavigate,
  referenceLayout = false,
  showSidebarIdentity = false,
  profileLabel = "My profile",
}: {
  role: Role;
  title: string;
  subtitle: string;
  children: ReactNode;
  navigation?: { label: string; value: string; icon?: LucideIcon }[];
  active?: string;
  onNavigate?: (value: string) => void;
  referenceLayout?: boolean;
  showSidebarIdentity?: boolean;
  profileLabel?: string;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className={`${referenceLayout ? "lg:hidden" : ""} sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur`}>
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <button className="text-foreground lg:hidden" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu /></button>
          <BrandLockup />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{user?.name ?? "Member"}</p>
              <p className="text-xs text-muted-foreground">{roleMeta[role].label}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                signOut();
                navigate({ to: "/", replace: true });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {menuOpen ? <button className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" aria-label="Close navigation" onClick={() => setMenuOpen(false)} /> : null}
      <div className={`${referenceLayout ? "lg:grid-cols-[310px_minmax(0,1fr)]" : "lg:grid-cols-[235px_minmax(0,1fr)]"} mx-auto grid max-w-[1480px]`}>
        <aside className={`${menuOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-[270px] border-r border-border bg-card px-4 py-5 transition-transform lg:sticky ${referenceLayout ? "lg:top-0 lg:h-screen lg:px-7 lg:py-10" : "lg:top-[65px] lg:h-[calc(100vh-65px)]"} lg:z-20 lg:w-auto lg:translate-x-0`}>
          <div className="mb-5 flex items-center justify-between lg:hidden"><BrandLockup /><Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}><X /></Button></div>
          {referenceLayout ? <div className="mb-8 hidden lg:block"><BrandWordmark className="text-2xl" /><p className="mt-1 text-xs text-muted-foreground">Academia × Industry</p></div> : <div className="mb-5 rounded-md bg-accent p-4"><p className="font-display font-semibold">{user?.organization ?? roleMeta[role].label}</p><p className="mt-1 text-xs text-muted-foreground">{roleMeta[role].label} portal</p></div>}
          {referenceLayout && showSidebarIdentity ? <div className="mb-7 hidden border-b border-border pb-6 lg:block"><p className="font-semibold text-foreground">{user?.name ?? roleMeta[role].label}</p><p className="mt-1 text-xs text-primary">{roleMeta[role].label}</p></div> : null}
          <nav className="space-y-2">
            <Button variant="ghost" onClick={() => { onNavigate?.("dashboard"); setMenuOpen(false); }} className={`${active === "dashboard" ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground"} h-12 w-full justify-start gap-4 rounded-full px-4 text-base`}><LayoutDashboard className="h-5 w-5" /> Dashboard</Button>
            {navigation.map((item) => (
              <Button
                key={item.value}
                type="button"
                variant="ghost"
                onClick={() => {
                  onNavigate?.(item.value);
                  setMenuOpen(false);
                  document.getElementById("dashboard-top")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`${active === item.value ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground"} h-12 w-full justify-start gap-4 rounded-full px-4 text-base`}
              >
                {item.icon ? <item.icon className="h-5 w-5" /> : <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                {item.label}
              </Button>
            ))}
            <Button asChild variant="ghost" className="h-12 w-full justify-start gap-4 rounded-full px-4 text-base text-muted-foreground"><Link to="/profile"><CircleUserRound className="h-5 w-5" /> {profileLabel}</Link></Button>
            <Button variant="ghost" onClick={() => { signOut(); navigate({ to: "/", replace: true }); }} className="h-12 w-full justify-start gap-4 rounded-full px-4 text-base text-muted-foreground"><Settings className="h-5 w-5" /> Settings</Button>
          </nav>
          {!referenceLayout ? <div className="absolute bottom-5 left-4 right-4 rounded-md border border-border bg-background p-4 text-xs text-muted-foreground"><p className="font-semibold text-foreground">SkillBridge</p><p className="mt-1">Academia × Industry × Innovation</p></div> : null}
        </aside>

        <main id="dashboard-top" className={`${referenceLayout ? "sm:px-10 sm:py-10 lg:px-14" : "sm:px-6 sm:py-7"} relative min-w-0 px-4 py-5`}>
          {referenceLayout ? <Button variant="ghost" size="sm" className="absolute right-8 top-7 hidden gap-2 text-muted-foreground lg:flex" onClick={() => { signOut(); navigate({ to: "/", replace: true }); }}><LogOut className="h-4 w-4" /> Sign out</Button> : null}
          <div className={`${referenceLayout ? "mb-8" : "mb-5 rounded-md border border-border bg-card p-5 sm:p-6"}`}>
            {!referenceLayout ? <p className="text-xs font-semibold uppercase text-primary">{roleMeta[role].label} dashboard</p> : null}
            <h1 className={`${referenceLayout ? "text-3xl sm:text-4xl" : "mt-1 text-2xl sm:text-3xl"} font-bold`}>{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function StatGrid({
  stats,
}: {
  stats: { label: string; value: string; hint?: string }[];
}) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-md shadow-none">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
            {stat.hint ? <p className="mt-1 text-xs text-primary">{stat.hint}</p> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
