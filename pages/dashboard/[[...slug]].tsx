import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { RefreshCw, LogOut, Menu } from "lucide-react";
import { CategoryCarousel } from "@/components/dashboard/category-carousel";
import { HeroMetricCard } from "@/components/dashboard/hero-metric-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { AISidebar } from "@/components/dashboard/ai-sidebar";
import { YieldCurveChart } from "@/components/dashboard/yield-curve-chart";
import { MarketRates } from "@/components/dashboard/market-rates";
import { CategoryId, CategoryData, TreasuryYield, DailySnapshot, AISummary, NewsItem } from "@/lib/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const API_BASE = "https://rvscg1wvg5.execute-api.us-east-1.amazonaws.com";

const CATEGORIES: { id: CategoryId; name: string }[] = [
    { id: "interest_rates", name: "Interest Rates" },
    { id: "economic_growth", name: "Economic Growth" },
    { id: "inflation", name: "Inflation & Prices" },
    { id: "employment", name: "Employment" },
    { id: "money_supply", name: "Money Supply" },
];

// Generate static paths for all categories
export async function getStaticPaths() {
    const paths = CATEGORIES.map(cat => ({
        params: { slug: [cat.id] }
    }));

    // Also include the base /dashboard path (no slug)
    paths.push({ params: { slug: [] } });

    return {
        paths,
        fallback: false
    };
}

// This is required for static export
export async function getStaticProps() {
    return {
        props: {}
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const { slug } = router.query;
    const currentCategory = (slug?.[0] as CategoryId) || "interest_rates";

    const [snapshot, setSnapshot] = useState<DailySnapshot | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [selectedYield, setSelectedYield] = useState<TreasuryYield | null>(null);
    const [aiInsights, setAiInsights] = useState<AISummary | null>(null);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [yieldNews, setYieldNews] = useState<NewsItem[]>([]);
    const [isFetchingNews, setIsFetchingNews] = useState(false);

    const fetchSnapshot = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/todays-snapshot`, { method: "POST" });
            if (!response.ok) throw new Error("Failed to fetch snapshot data");
            const data = await response.json();

            if (data.data) {
                setSnapshot(data.data);
                setLastUpdated(new Date(data.data.updatedAt).toLocaleTimeString());
            }
        } catch (err) {
            console.error("Error fetching snapshot:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSnapshot();
    }, []);

    const handleCategoryChange = (category: CategoryId) => {
        router.push(`/dashboard/${category}`);
    };

    const fetchYieldNews = async (yieldData: TreasuryYield) => {
        setIsFetchingNews(true);
        try {
            const response = await fetch(`${API_BASE}/fetch-yield-news`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ maturity: yieldData.maturity })
            });

            if (response.ok) {
                const data = await response.json();
                setYieldNews(data.news || []);
                return data.news || [];
            }
            return [];
        } catch (err) {
            console.error('Failed to fetch yield news:', err);
            return [];
        } finally {
            setIsFetchingNews(false);
        }
    };

    const handleGenerateInsights = async (yieldData?: TreasuryYield) => {
        // Clear previous insights to show loading state effectively
        setAiInsights(null);
        setIsGeneratingInsights(true);

        // Fetch yield-specific news first if yield is selected
        let news: NewsItem[] = [];
        let newsText = "";

        try {
            if (yieldData) {
                news = await fetchYieldNews(yieldData);
                newsText = news.map((n: NewsItem) => n.title).join('. ');
            }

            const response = await fetch(`${API_BASE}/summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    yields: yields,
                    focus: yieldData || null, // Ensure explicit null if undefined
                    additionalContext: newsText ? `Recent news about ${yieldData?.maturity} Treasury: ${newsText}` : undefined
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAiInsights(data);
            } else {
                console.error("AI Analysis Failed:", await response.text());
                // Optional: Set some error state here if UI supports it
            }
        } catch (err) {
            console.error('Failed to generate insights:', err);
        } finally {
            setIsGeneratingInsights(false);
        }
    };

    // Auto-generate insights when yield is selected
    useEffect(() => {
        if (selectedYield) {
            handleGenerateInsights(selectedYield);
        }
    }, [selectedYield]);

    const currentCategoryData = snapshot?.categories[currentCategory];
    const yields = snapshot?.categories.interest_rates?.yields || [];
    const newsItems = snapshot?.categories.interest_rates?.news || [];

    // Prepare metrics for carousel
    const carouselCategories = CATEGORIES.map(cat => {
        const catData = snapshot?.categories[cat.id];
        return {
            ...cat,
            metric: catData?.primaryMetric || { label: "Loading...", value: "..." }
        };
    });

    return (
        <div className="min-h-screen animated-gradient flex flex-col">
            {/* Header */}
            <header className="glass border-b border-white/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <div className="py-4">
                                        <h2 className="text-lg font-bold mb-4">Categories</h2>
                                        <div className="space-y-2">
                                            {CATEGORIES.map(cat => (
                                                <Button
                                                    key={cat.id}
                                                    variant={currentCategory === cat.id ? "secondary" : "ghost"}
                                                    className="w-full justify-start"
                                                    onClick={() => handleCategoryChange(cat.id)}
                                                >
                                                    {cat.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <div>
                                <h1 className="text-xl md:text-2xl font-bold hidden md:block">Economic Dashboard</h1>
                                <h1 className="text-lg font-bold md:hidden">Dashboard</h1>
                                <p className="text-xs text-muted-foreground">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchSnapshot}
                                disabled={isLoading}
                                className="hidden md:flex"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/">
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden md:inline ml-2">Logout</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {/* Category Carousel */}
                <CategoryCarousel
                    currentCategory={currentCategory}
                    onCategoryChange={handleCategoryChange}
                    categories={carouselCategories}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content Area (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {currentCategory === "interest_rates" ? (
                            <>
                                <div className="h-auto min-h-[450px] mb-8">
                                    <YieldCurveChart
                                        data={yields}
                                        date={snapshot?.date || new Date().toISOString().split('T')[0]}
                                        isLoading={isLoading}
                                        onSelectYield={setSelectedYield}
                                    />
                                </div>
                                <AISidebar
                                    category={currentCategory}
                                    summary={aiInsights || undefined}
                                    isLoading={isGeneratingInsights}
                                    onRegenerate={() => handleGenerateInsights(selectedYield || undefined)}
                                    newsItems={yieldNews}
                                    isLoadingNews={isFetchingNews}
                                />
                            </>
                        ) : (
                            <>
                                {currentCategoryData && (
                                    <HeroMetricCard
                                        category={currentCategory}
                                        metric={currentCategoryData.primaryMetric}
                                        date={currentCategoryData.lastUpdated}
                                    />
                                )}
                                <div className="h-[400px]">
                                    {/* Placeholder for trend chart until historical data is available */}
                                    <div className="flex items-center justify-center h-full glass border-white/20 rounded-xl">
                                        <p className="text-muted-foreground">Historical trend data coming soon</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sidebar Area (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <MarketRates
                            yields={yields}
                            isLoading={isLoading}
                            onSelectYield={setSelectedYield}
                            selectedYield={selectedYield}
                            newsItems={yieldNews}
                            isLoadingNews={isFetchingNews}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
