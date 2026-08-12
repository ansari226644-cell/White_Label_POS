import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <span className={cn("inline-flex items-center gap-2.5", className)}>
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-[var(--shadow-soft)]">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/35 to-transparent" />
                <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" aria-hidden="true">
                    <path
                        d="M4 18V7l8 5 8-5v11"
                        stroke="currentColor"
                        className="text-primary-foreground"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="text-[1.05rem] font-extrabold tracking-tight text-ink">
                MT&nbsp;Nexus
            </span>
        </span>
    );
}
