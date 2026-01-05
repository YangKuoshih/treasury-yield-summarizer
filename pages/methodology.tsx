import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Database, Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MethodologyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <SiteHeader />

            <main className="flex-1 container mx-auto px-6 py-12 md:py-24">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-heading font-bold text-4xl md:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        Methodology
                    </h1>
                    <p className="text-xl text-muted-foreground mb-16 leading-relaxed">
                        Market Intelligence synthesizes institutional-grade data sources with advanced AI processing to deliver clear, actionable daily briefings.
                    </p>

                    <div className="grid gap-12">

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-primary">
                                <Database className="w-8 h-8" />
                                <h2 className="text-2xl font-bold font-heading">Data Sourcing</h2>
                            </div>
                            <Card className="glass border-white/10">
                                <CardHeader>
                                    <CardTitle>FRED API Integration</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground space-y-4">
                                    <p>
                                        All underlying economic data is sourced directly from the <strong>Federal Reserve Economic Data (FRED)</strong> API, maintained by the Federal Reserve Bank of St. Louis.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Treasury Yields:</strong> Daily Treasury Par Yield Curve Rates (DGS series).</li>
                                        <li><strong>Inflation:</strong> Consumer Price Index for All Urban Consumers (CPIAUCSL).</li>
                                        <li><strong>GDP:</strong> Real Gross Domestic Product (GDPC1).</li>
                                        <li><strong>Employment:</strong> Unemployment Rate (UNRATE) and Nonfarm Payrolls (PAYEMS).</li>
                                    </ul>
                                    <p className="text-sm italic">
                                        Data is fetched daily at 6:00 PM EST to ensure end-of-day accuracy.
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-primary">
                                <Brain className="w-8 h-8" />
                                <h2 className="text-2xl font-bold font-heading">AI Analysis</h2>
                            </div>
                            <Card className="glass border-white/10">
                                <CardHeader>
                                    <CardTitle>Claude 3.5 Sonnet Processing</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground space-y-4">
                                    <p>
                                        Raw data is processed through <strong>Anthropic's Claude 3.5 Sonnet</strong> on Amazon Bedrock. This advanced LLM is instructed to act as a senior macro strategist.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                            <h3 className="font-semibold text-white mb-2">Analysis Pipeline</h3>
                                            <ol className="list-decimal pl-5 space-y-2 text-sm">
                                                <li>Ingest raw time-series data.</li>
                                                <li>Calculate key spreads (e.g., 10Y-2Y).</li>
                                                <li>Identify trend reversals and anomalies.</li>
                                                <li>Correlate cross-market signals.</li>
                                            </ol>
                                        </div>
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                            <h3 className="font-semibold text-white mb-2">Output Guardrails</h3>
                                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                                <li>Strict factual accuracy checks.</li>
                                                <li>No financial advice or speculation.</li>
                                                <li>Focus on structural market drivers.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-primary">
                                <Lock className="w-8 h-8" />
                                <h2 className="text-2xl font-bold font-heading">Security & Privacy</h2>
                            </div>
                            <Card className="glass border-white/10">
                                <CardContent className="pt-6 text-muted-foreground">
                                    <p>
                                        We operate on a <strong>serverless architecture</strong> (AWS Lambda, DynamoDB) ensuring high availability and security. No personal user data is sold or shared with third parties. Authentication is handled securely via industry-standard protocols.
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                    </div>

                    <div className="mt-16 flex justify-center">
                        <Button asChild size="lg" className="h-12 px-8 text-lg">
                            <Link href="/dashboard">
                                Experience the Platform <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
