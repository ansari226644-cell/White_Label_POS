import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Building2, Layers, Monitor, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

const nav = [
    { to: "/demo/super-admin", label: "Super Admin", icon: Layers },
    { to: "/demo/head-office", label: "Head Office", icon: Building2 },
    { to: "/demo/pos-till", label: "POS Till", icon: Monitor },
    { to: "/demo/aggregators", label: "Aggregator Sync", icon: Truck },
] satisfies { to: string; label: string; icon: LucideIcon }[];

export function DemoShell({
    title,
    subtitle,
    actions,
    children,
}: {
    title: string;
    subtitle: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-surface-2">
            <div className="mx-auto flex max-w-[1500px] flex-col lg:flex-row">
                <aside className="sticky top-0 z-40 border-b border-border bg-surface px-4 py-3 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
                    <Link to="/" className="inline-flex">
                        <Logo />
                    </Link>
                    <nav className="mt-4 flex gap-1.5 overflow-x-auto lg:mt-8 lg:flex-col lg:overflow-visible">
                        {nav.map((n) => (
                            <Link
                                key={n.to}
                                to={n.to}
                                activeProps={{ "data-active": "true" }}
                                className={cn(
                                    "group flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink",
                                    "data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
                                )}
                            >
                                <n.icon className="h-4 w-4" />
                                {n.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-6 hidden rounded-2xl border border-border bg-surface-2 p-4 lg:block">
                        <p className="text-xs font-semibold text-ink">Interactive demo</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            Sample data only. Every action runs locally in your browser.
                        </p>
                        <Link
                            to="/"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
                        </Link>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
                            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
                        </div>
                        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
                    </header>
                    {children}
                </main>
            </div>
        </div>
    );
}

export function StatCard({
    label,
    value,
    delta,
    icon: Icon,
    tone = "primary",
}: {
    label: string;
    value: string;
    delta?: string;
    icon?: LucideIcon;
    tone?: "primary" | "success" | "accent";
}) {
    const toneMap = {
        primary: "bg-primary text-primary-foreground shadow-primary/20",
        success: "bg-success text-success-foreground shadow-success/20",
        accent: "bg-accent text-accent-foreground shadow-accent/20",
    } as const;

    const bgMap = {
        primary: "from-primary/10 to-transparent",
        success: "from-success/10 to-transparent",
        accent: "from-accent/10 to-transparent",
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface/50 p-6 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className={cn("absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br blur-3xl transition-transform duration-500 group-hover:scale-150", bgMap[tone])} />
            <div className="relative z-10 flex items-start justify-between">
                <p className="text-[13px] font-bold tracking-wider text-muted-foreground uppercase">{label}</p>
                {Icon && (
                    <span className={cn("grid h-10 w-10 place-items-center rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6", toneMap[tone])}>
                        <Icon className="h-5 w-5" />
                    </span>
                )}
            </div>
            <p className="relative z-10 mt-5 text-3xl font-black tracking-tight text-ink">{value}</p>
            {delta && (
                <p className="relative z-10 mt-2 text-xs font-bold text-success flex items-center bg-success/10 w-max px-2 py-1 rounded-md">
                    {delta}
                </p>
            )}
        </div>
    );
}
