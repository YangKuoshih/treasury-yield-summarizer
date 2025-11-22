import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendingUp, BarChart3, Sparkles, Shield } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b">
                <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                            Treasury Yield Intelligence
                        </h1>
                        <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                            Real-time U.S. Treasury yield analysis powered by AI. Track yield curves, analyze trends, and get intelligent summaries from the Federal Reserve Economic Data.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <ThemeToggle />
                            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="/login">Get Started</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-primary/20 hover:bg-primary/5 bg-transparent"
                            >
                                <Link href="/demo">View Demo</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                            Professional Treasury Analysis
                        </h2>
                        <p className="mt-4 text-pretty text-lg text-muted-foreground">
                            Everything you need to monitor and understand Treasury yield movements
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <TrendingUp className="h-10 w-10 text-primary" />
                                <CardTitle className="mt-4">Real-Time Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Live Treasury yield data from FRED API updated throughout the trading day
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-10 w-10 text-primary" />
                                <CardTitle className="mt-4">Interactive Charts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Visualize yield curves and historical trends with professional charting tools
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Sparkles className="h-10 w-10 text-primary" />
                                <CardTitle className="mt-4">AI Summaries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Get intelligent analysis powered by AWS Bedrock Claude AI for market insights
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="h-10 w-10 text-primary" />
                                <CardTitle className="mt-4">Secure Access</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Enterprise-grade security with encrypted authentication and AWS infrastructure
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                            Start Analyzing Treasury Yields Today
                        </h2>
                        <p className="mt-4 text-pretty text-lg text-muted-foreground">
                            Join financial professionals using our platform for Treasury market intelligence
                        </p>
                        <div className="mt-10">
                            <Button asChild size="lg">
                                <Link href="/login">Create Account</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>Treasury Yield Summarizer - Powered by FRED API and AWS Bedrock</p>
                        <p className="mt-2">Data provided by Federal Reserve Bank of St. Louis</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
