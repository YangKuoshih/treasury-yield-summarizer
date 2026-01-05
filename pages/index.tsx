import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticker } from "@/components/ui/ticker";
import { TrendingUp, Sparkles, Calendar, Activity, ArrowRight, BarChart3, Lock } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />

            <Ticker />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative border-b border-white/10">
                    <div className="container mx-auto px-6 py-24 sm:py-32">
                        <div className="max-w-4xl">
                            <h1 className="font-heading font-bold text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                                PRECISION<br />MACRO DATA.
                            </h1>
                            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl font-light mb-12 leading-relaxed">
                                Institutional-grade economic analysis powered by FRED API and Claude 3.5 Sonnet.
                                <span className="text-white block mt-2">Daily yield curve intelligence, simplified.</span>
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-none bg-white text-black hover:bg-white/90">
                                    <Link href="/dashboard">
                                        Launch Terminal <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-none border-white/20 hover:bg-white/5">
                                    <Link href="/methodology">Methodology</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Grid Lines */}
                    <div className="absolute top-0 right-0 w-1/3 h-full border-l border-white/5 hidden lg:block" />
                    <div className="absolute bottom-0 right-0 w-2/3 h-1/2 border-t border-white/5 hidden lg:block" />
                </section>

                {/* KPI Grid Section */}
                <section className="border-b border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 container mx-auto border-x border-white/10">

                        <div className="p-8 group hover:bg-white/[0.02] transition-colors relative">
                            <div className="mb-4 text-muted-foreground flex justify-between items-start">
                                <Activity className="w-6 h-6" />
                                <span className="text-xs uppercase tracking-widest opacity-50">Data Source</span>
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Federal Reserve</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Direct integration with FRED API for real-time accuracy across all treasury maturities.
                            </p>
                        </div>

                        <div className="p-8 group hover:bg-white/[0.02] transition-colors relative">
                            <div className="mb-4 text-muted-foreground flex justify-between items-start">
                                <Sparkles className="w-6 h-6" />
                                <span className="text-xs uppercase tracking-widest opacity-50">Analysis</span>
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Claude 3.5 Sonnet</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Advanced AI processing generates institutional-quality daily market summaries.
                            </p>
                        </div>

                        <div className="p-8 group hover:bg-white/[0.02] transition-colors relative">
                            <div className="mb-4 text-muted-foreground flex justify-between items-start">
                                <Calendar className="w-6 h-6" />
                                <span className="text-xs uppercase tracking-widest opacity-50">Frequency</span>
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Daily 6PM EST</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Automated batch processing ensures you have the closing snapshot every evening.
                            </p>
                        </div>

                        <div className="p-8 group hover:bg-white/[0.02] transition-colors relative">
                            <div className="mb-4 text-muted-foreground flex justify-between items-start">
                                <Button variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary">
                                    <BarChart3 className="w-6 h-6" />
                                </Button>
                                <span className="text-xs uppercase tracking-widest opacity-50">Coverage</span>
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Multi-Asset</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Treasury Yields, GDP, CPI, Employment, and Money Supply in one dashboard.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Feature Showcase */}
                <section className="py-24 border-b border-white/10">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">Deep Market <br />Visibility</h2>
                                <p className="text-lg text-muted-foreground mb-8 text-pretty">
                                    Stop checking multiple tabs. Our dashboard synthesizes complex economic signals into clear, actionable intelligence.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Inversion Detection & Analysis",
                                        "Historical Spread Comparison",
                                        "Real-time Volatility Metrics",
                                        "Exportable PDF Reports"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-lg font-medium">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="relative">
                                {/* Abstract UI Placeholder */}
                                <div className="technical-card p-6 h-[400px] flex flex-col">
                                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                                        <span className="font-mono text-sm text-yield-up">▲ YIELD CURVE INVERTED</span>
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 relative">
                                        {/* Stylized Chart Line */}
                                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                            <path d="M0,100 C100,80 200,60 300,90 S500,120 600,50"
                                                fill="none"
                                                stroke="hsl(var(--yield-up))"
                                                strokeWidth="3"
                                                className="drop-shadow-[0_0_10px_rgba(255,100,50,0.5)]"
                                            />
                                            <path d="M0,120 C100,100 200,80 300,110 S500,140 600,70"
                                                fill="none"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth="2"
                                                strokeDasharray="4 4"
                                                className="opacity-50"
                                            />
                                        </svg>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-8 pt-4 border-t border-white/10 font-mono text-xs">
                                        <div>
                                            <div className="text-muted-foreground mb-1">10Y Yield</div>
                                            <div className="text-xl">4.21%</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground mb-1">2Y Yield</div>
                                            <div className="text-xl">4.55%</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground mb-1">Spread</div>
                                            <div className="text-xl text-yield-down text-right">-0.34</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -z-10 top-10 -right-10 w-full h-full border border-white/5 bg-white/[0.01]" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
