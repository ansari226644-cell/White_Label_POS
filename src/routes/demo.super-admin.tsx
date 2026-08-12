import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
    Activity,
    Building2,
    Coins,
    Monitor,
    Plus,
    ShieldCheck,
    Ban,
    ArrowUpCircle,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { DemoShell, StatCard } from "@/components/demo/DemoShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initialTenants, platformSeries, aedShort, type Tenant } from "@/lib/demo-data";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/super-admin")({
    head: () => ({
        meta: [
            { title: "Super Admin Portal Demo — MT Nexus" },
            {
                name: "description",
                content:
                    "Interactive MT Nexus super-admin demo: provision tenants, enforce outlet and till limits, set VAT templates and monitor platform analytics.",
            },
            { property: "og:title", content: "MT Nexus Super Admin Portal Demo" },
            { property: "og:description", content: "Multi-tenant provisioning, limits and platform analytics." },
        ],
    }),
    component: SuperAdmin,
});

const statusTone: Record<Tenant["status"], string> = {
    Active: "bg-success/12 text-success border-success/20",
    Trial: "bg-primary/10 text-primary border-primary/20",
    Suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

function SuperAdmin() {
    const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: "", outlets: 2, tills: 6, trn: "" });
    const [vatRate, setVatRate] = useState("5");
    const [inclusive, setInclusive] = useState(true);

    const totals = useMemo(
        () => ({
            tenants: tenants.length,
            outlets: tenants.reduce((s, t) => s + t.outlets, 0),
            tills: tenants.reduce((s, t) => s + t.tills, 0),
            orders: tenants.reduce((s, t) => s + t.monthlyOrders, 0),
        }),
        [tenants],
    );

    const toggleStatus = (id: string) => {
        setTenants((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, status: t.status === "Suspended" ? "Active" : "Suspended" } : t,
            ),
        );
        toast.success("Tenant status updated");
    };

    const upgrade = (id: string) => {
        setTenants((prev) =>
            prev.map((t) =>
                t.id === id
                    ? { ...t, plan: t.plan === "Starter" ? "Growth" : "Enterprise" }
                    : t,
            ),
        );
        toast.success("Plan upgraded");
    };

    return (
        <DemoShell
            title="SaaS Super-Admin Portal"
            subtitle="Provision and govern every supermarket tenant on the platform — limits, tax templates and live network telemetry."
            actions={
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl font-semibold">
                            <Plus className="mr-1.5 h-4 w-4" /> Create tenant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create tenant account</DialogTitle>
                            <DialogDescription>
                                Provision a new supermarket chain with enforced commercial limits.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="tname">Chain name</Label>
                                <Input
                                    id="tname"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Marina Grocers LLC"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="touts">Outlet limit</Label>
                                    <Input
                                        id="touts"
                                        type="number"
                                        min={1}
                                        value={form.outlets}
                                        onChange={(e) => setForm({ ...form, outlets: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ttills">Till limit</Label>
                                    <Input
                                        id="ttills"
                                        type="number"
                                        min={1}
                                        value={form.tills}
                                        onChange={(e) => setForm({ ...form, tills: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ttrn">TRN</Label>
                                <Input
                                    id="ttrn"
                                    value={form.trn}
                                    onChange={(e) => setForm({ ...form, trn: e.target.value })}
                                    placeholder="100000000000003"
                                />
                            </div>
                            <p className="rounded-lg bg-surface-2 p-3 text-xs text-muted-foreground">
                                Tax template applied on creation: UAE VAT {vatRate}% ·{" "}
                                {inclusive ? "inclusive" : "exclusive"} pricing · AED
                            </p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="rounded-xl"
                                onClick={() => {
                                    if (!form.name.trim()) {
                                        toast.error("Chain name is required");
                                        return;
                                    }
                                    setTenants((p) => [
                                        {
                                            id: `t-${Math.random().toString(36).slice(2, 6)}`,
                                            name: form.name,
                                            plan: "Starter",
                                            status: "Trial",
                                            outlets: form.outlets,
                                            tills: form.tills,
                                            monthlyOrders: 0,
                                            trn: form.trn || "100000000000003",
                                        },
                                        ...p,
                                    ]);
                                    setForm({ name: "", outlets: 2, tills: 6, trn: "" });
                                    setOpen(false);
                                    toast.success("Tenant provisioned", { description: "Trial environment is live." });
                                }}
                            >
                                Create tenant
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Active tenants" value={String(totals.tenants)} delta="+2 this month" icon={Building2} />
                <StatCard label="Outlets on platform" value={String(totals.outlets)} delta="+6 this month" icon={ShieldCheck} tone="success" />
                <StatCard label="Active tills" value={String(totals.tills)} delta="97% online" icon={Monitor} />
                <StatCard label="Monthly orders" value={`${(totals.orders / 1000).toFixed(0)}k`} delta="+11.2%" icon={Activity} tone="accent" />
            </div>

            <Tabs defaultValue="tenants" className="mt-8">
                <TabsList className="rounded-xl">
                    <TabsTrigger value="tenants">Tenants</TabsTrigger>
                    <TabsTrigger value="analytics">Platform analytics</TabsTrigger>
                    <TabsTrigger value="settings">Tax & currency</TabsTrigger>
                </TabsList>

                <TabsContent value="tenants" className="mt-5">
                    <div className="panel overflow-x-auto">
                        <Table className="min-w-[900px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Outlets</TableHead>
                                    <TableHead className="text-right">Tills</TableHead>
                                    <TableHead className="text-right">Monthly orders</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tenants.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <div className="font-semibold text-ink">{t.name}</div>
                                            <div className="text-xs text-muted-foreground">TRN {t.trn}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full font-semibold">
                                                {t.plan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone[t.status]}`}>
                                                {t.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">{t.outlets}</TableCell>
                                        <TableCell className="text-right tabular-nums">{t.tills}</TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {t.monthlyOrders.toLocaleString("en-AE")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-lg"
                                                    onClick={() => upgrade(t.id)}
                                                    disabled={t.plan === "Enterprise"}
                                                >
                                                    <ArrowUpCircle className="mr-1 h-3.5 w-3.5" /> Upgrade
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="rounded-lg"
                                                    onClick={() => toggleStatus(t.id)}
                                                >
                                                    <Ban className="mr-1 h-3.5 w-3.5" />
                                                    {t.status === "Suspended" ? "Reactivate" : "Suspend"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-5">
                    <div className="grid gap-5 lg:grid-cols-2">
                        <div className="panel p-6">
                            <h2 className="text-sm font-bold text-ink">Network sales volume (AED 000s)</h2>
                            <div className="mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={platformSeries}>
                                        <defs>
                                            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                                                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="t" tickLine={false} axisLine={false} fontSize={12} />
                                        <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} />
                                        <Tooltip />
                                        <Area dataKey="sales" stroke="var(--primary)" strokeWidth={2.5} fill="url(#salesFill)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="panel p-6">
                            <h2 className="text-sm font-bold text-ink">Active tills</h2>
                            <div className="mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={platformSeries}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="t" tickLine={false} axisLine={false} fontSize={12} />
                                        <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} />
                                        <Tooltip />
                                        <Bar dataKey="tills" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="panel p-6 lg:col-span-2">
                            <h2 className="text-sm font-bold text-ink">API traffic (requests / second)</h2>
                            <div className="mt-4 h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={platformSeries}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="t" tickLine={false} axisLine={false} fontSize={12} />
                                        <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} />
                                        <Tooltip />
                                        <Line dataKey="api" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="panel p-6 lg:col-span-2">
                            <h2 className="text-sm font-bold text-ink">System log</h2>
                            <ul className="mt-4 space-y-2 font-mono text-xs">
                                {[
                                    ["12:04:11", "INFO", "tenant t-005 published catalog to 4 aggregators"],
                                    ["12:03:58", "WARN", "till DEIRA-11 entered offline buffering mode"],
                                    ["12:02:40", "INFO", "VAT template UAE-5 applied to tenant t-003"],
                                    ["12:01:12", "INFO", "GRN variance alert raised · PO-4821"],
                                    ["11:59:03", "INFO", "nightly Z-report archived for 132 tills"],
                                ].map(([time, lvl, msg]) => (
                                    <li key={String(msg)} className="flex gap-3 rounded-lg bg-surface-2 px-3 py-2">
                                        <span className="text-muted-foreground">{time}</span>
                                        <span className={lvl === "WARN" ? "font-bold text-warning-foreground" : "font-bold text-primary"}>
                                            {lvl}
                                        </span>
                                        <span className="text-ink">{msg}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-5">
                    <div className="grid gap-5 lg:grid-cols-2">
                        <div className="panel p-6">
                            <h2 className="text-sm font-bold text-ink">Global tax templates</h2>
                            <div className="mt-5 space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="vat">Standard VAT rate (%)</Label>
                                    <Input id="vat" value={vatRate} onChange={(e) => setVatRate(e.target.value)} className="max-w-32" />
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-surface-2 p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-ink">Tax-inclusive shelf pricing</p>
                                        <p className="text-xs text-muted-foreground">Default display mode for new tenants.</p>
                                    </div>
                                    <Switch checked={inclusive} onCheckedChange={setInclusive} />
                                </div>
                                <div className="rounded-xl border border-border p-4 text-sm">
                                    <p className="font-semibold text-ink">Templates</p>
                                    <ul className="mt-2 space-y-1.5 text-muted-foreground">
                                        <li>UAE VAT Standard — {vatRate}%</li>
                                        <li>UAE Zero-rated — 0% (basic food, exports)</li>
                                        <li>Out of scope — exempt supplies</li>
                                    </ul>
                                </div>
                                <Button className="rounded-xl" onClick={() => toast.success("Tax template saved")}>
                                    Save template
                                </Button>
                            </div>
                        </div>
                        <div className="panel p-6">
                            <h2 className="text-sm font-bold text-ink">Regional & currency settings</h2>
                            <div className="mt-5 space-y-3 text-sm">
                                {[
                                    ["Base currency", "AED — UAE Dirham"],
                                    ["Rounding", "Nearest 0.25 AED (cash)"],
                                    ["Fiscal calendar", "January – December"],
                                    ["Timezone", "Asia/Dubai (GMT+4)"],
                                    ["Data residency", "UAE region"],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3">
                                        <span className="text-muted-foreground">{k}</span>
                                        <span className="font-semibold text-ink">{v}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-xs text-muted-foreground">
                                    <Coins className="h-4 w-4 text-primary" /> Platform-wide GMV this month:{" "}
                                    {aedShort(48620000)}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </DemoShell>
    );
}
