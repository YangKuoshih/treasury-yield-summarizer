import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, RefreshCw, Menu } from "lucide-react";
import { CategoryCarousel } from "@/components/dashboard/category-carousel";
import { HeroMetricCard } from "@/components/dashboard/hero-metric-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { AISidebar } from "@/components/dashboard/ai-sidebar";
import { YieldCurveChart } from "@/components/dashboard/yield-curve-chart";
import { MarketRates } from "@/components/dashboard/market-rates";
import { CategoryId, CategoryData, TreasuryYield, MetricData } from "@/lib/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const CATEGORIES: { id: CategoryId; name: string }[] = [
  { id: "interest_rates", name: "Interest Rates" },
  { id: "economic_growth", name: "Economic Growth" },
  { id: "inflation", name: "Inflation & Prices" },
  { id: "employment", name: "Employment" },
  { id: "money_supply", name: "Money Supply" },
];

// Randomized mock data generator
const getRandomMockData = (category: CategoryId): CategoryData => {
  const baseData = {
    id: category,
    name: CATEGORIES.find(c => c.id === category)?.name || "",
    lastUpdated: new Date().toISOString(),
  };

  const randomChange = (Math.random() * 2 - 1).toFixed(2);
  const isPositive = parseFloat(randomChange) > 0;

  switch (category) {
    case "economic_growth":
      return {
        ...baseData,
        primaryMetric: {
          label: "Real GDP Growth",
          value: `${(2.0 + Math.random()).toFixed(1)}%`,
          change: parseFloat(randomChange),
          changeLabel: "vs previous quarter",
          unit: "Ann. Rate"
        },
        aiSummary: {
          summary: "Economic growth remains robust, driven by strong consumer spending and business investment. The latest GDP print suggests a soft landing is increasingly likely.",
          keyInsights: ["Consumer spending rose 3.0%", "Business investment up 1.5%", "Government spending contributed 0.8%"],
          marketCondition: isPositive ? "bullish" : "bearish",
          generatedAt: new Date().toISOString()
        }
      };
    case "inflation":
      return {
        ...baseData,
        primaryMetric: {
          label: "CPI (YoY)",
          value: `${(3.0 + Math.random()).toFixed(1)}%`,
          change: parseFloat(randomChange),
          changeLabel: "vs previous month"
        },
        aiSummary: {
          summary: "Inflation continues to moderate, though core services inflation remains sticky. The Fed is likely to maintain current rates until further cooling is observed.",
          keyInsights: ["Energy prices fell 1.2%", "Shelter costs rose 0.4%", "Food prices stable"],
          marketCondition: "neutral",
          generatedAt: new Date().toISOString()
        }
      };
    case "employment":
      return {
        ...baseData,
        primaryMetric: {
          label: "Unemployment Rate",
          value: `${(3.5 + Math.random() * 0.5).toFixed(1)}%`,
          change: 0,
          changeLabel: "Unchanged"
        },
        aiSummary: {
          summary: "The labor market remains tight but is showing signs of normalization. Job growth is steady, supporting the broader economic expansion.",
          keyInsights: ["Nonfarm payrolls +175k", "Wage growth +0.2% MoM", "Participation rate 62.7%"],
          marketCondition: "normal",
          generatedAt: new Date().toISOString()
        }
      };
    case "money_supply":
      return {
        ...baseData,
        primaryMetric: {
          label: "M2 Money Supply",
          value: `$${(20 + Math.random()).toFixed(1)}T`,
          change: -0.5,
          changeLabel: "YoY Change"
        },
        aiSummary: {
          summary: "Money supply contraction continues as the Fed's quantitative tightening program removes liquidity from the system.",
          keyInsights: ["M2 contracted for 12th month", "Bank deposits stable", "Velocity of money increasing"],
          marketCondition: "bearish",
          generatedAt: new Date().toISOString()
        }
      };
    default:
      return {
        ...baseData,
        primaryMetric: { label: "10-Year Treasury", value: "4.65%", change: 0.05 },
        aiSummary: {
          summary: "Treasury yields rose across the curve as markets repriced Fed rate cut expectations. The 10-year yield is approaching key resistance levels.",
          keyInsights: ["Curve inversion deepened", "Real yields rose", "Term premium increasing"],
          marketCondition: "bearish",
          generatedAt: new Date().toISOString()
        }
      };
  }
};

// Generate random yields
const generateRandomYields = (): TreasuryYield[] => {
  const maturities = ["1 Mo", "3 Mo", "6 Mo", "1 Yr", "2 Yr", "5 Yr", "10 Yr", "20 Yr", "30 Yr"];
  let baseYield = 5.25;
  return maturities.map(m => {
    const val = baseYield + (Math.random() * 0.2 - 0.1);
    baseYield -= 0.05; // Inverted curve simulation
    return { maturity: m, yield: parseFloat(val.toFixed(2)) };
  });
};

export default function DemoPage() {
  const [currentCategory, setCurrentCategory] = useState<CategoryId>("interest_rates");
  const [yields, setYields] = useState<TreasuryYield[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYield, setSelectedYield] = useState<TreasuryYield | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);

  // Initialize random data
  useEffect(() => {
    setYields(generateRandomYields());
    setCategoryData(getRandomMockData(currentCategory));
    setIsLoading(false);
  }, []);

  // Update data on category change
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCategoryData(getRandomMockData(currentCategory));
      setIsLoading(false);
    }, 300);
  }, [currentCategory]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setYields(generateRandomYields());
      setCategoryData(getRandomMockData(currentCategory));
      setIsLoading(false);
    }, 500);
  };

  // Prepare metrics for carousel
  const carouselCategories = CATEGORIES.map(cat => {
    if (cat.id === "interest_rates" && yields.length > 0) {
      const tenYear = yields.find(y => y.maturity === "10 Yr");
      return {
        ...cat,
        metric: {
          label: "10Y Yield",
          value: tenYear ? `${tenYear.yield}%` : "Loading...",
          change: 0.05
        }
      };
    }
    const mock = getRandomMockData(cat.id);
    return {
      ...cat,
      metric: mock.primaryMetric
    };
  });

  return (
    <div className="min-h-screen animated-gradient flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <h1 className="text-xl md:text-2xl font-bold hidden md:block">Demo Dashboard</h1>
              <div className="rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                Demo Mode
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
              <Button asChild>
                <Link href="/signup">Get Full Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Category Carousel */}
        <CategoryCarousel
          currentCategory={currentCategory}
          onCategoryChange={setCurrentCategory}
          categories={carouselCategories}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {currentCategory === "interest_rates" ? (
              <>
                <div className="h-[400px]">
                  <YieldCurveChart
                    data={yields}
                    date={new Date().toISOString().split('T')[0]}
                    isLoading={isLoading}
                    onSelectYield={setSelectedYield}
                  />
                </div>
                <MarketRates
                  yields={yields}
                  isLoading={isLoading}
                  onSelectYield={setSelectedYield}
                  selectedYield={selectedYield}
                />
              </>
            ) : (
              <>
                <HeroMetricCard
                  category={currentCategory}
                  metric={categoryData?.primaryMetric || getRandomMockData(currentCategory).primaryMetric}
                  date={new Date().toISOString()}
                />
                <div className="h-[400px]">
                  <TrendChart
                    data={[
                      { date: '2024-01-01', value: 2.0 + Math.random() },
                      { date: '2024-02-01', value: 2.2 + Math.random() },
                      { date: '2024-03-01', value: 2.4 + Math.random() },
                      { date: '2024-04-01', value: 2.3 + Math.random() },
                      { date: '2024-05-01', value: 2.5 + Math.random() },
                      { date: '2024-06-01', value: 2.7 + Math.random() },
                      { date: '2024-07-01', value: 2.6 + Math.random() },
                      { date: '2024-08-01', value: 2.8 + Math.random() },
                    ]}
                    category={currentCategory}
                    label={`${CATEGORIES.find(c => c.id === currentCategory)?.name} Trend`}
                  />
                </div>
              </>
            )}
          </div>

          {/* Sidebar Area (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <AISidebar
              category={currentCategory}
              summary={categoryData?.aiSummary}
              isLoading={isLoading}
              onRegenerate={handleRefresh}
            />

            <div className="glass border-white/20 p-6 rounded-xl text-center">
              <h3 className="font-semibold mb-2">Want real-time data?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sign up to access live FRED API data and personalized AI insights.
              </p>
              <Button asChild className="w-full">
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}