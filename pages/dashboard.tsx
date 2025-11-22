import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { YieldCurveChart } from "@/components/dashboard/yield-curve-chart";
import { MarketRates } from "@/components/dashboard/market-rates";
import { AISummaryPanel } from "@/components/dashboard/ai-summary-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { RefreshCw, LogOut } from "lucide-react";
import type { TreasuryYield } from "@/lib/types";

const API_BASE = "https://rvscg1wvg5.execute-api.us-east-1.amazonaws.com";

export default function DashboardPage() {
  const [yields, setYields] = useState<TreasuryYield[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetchYields = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch(`${API_BASE}/fetch-yields`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to fetch yield data");
      
      const data = await response.json();
      setYields(data.data?.yields || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError("Failed to load Treasury yield data. Please try again.");
      console.error("Error fetching yields:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYields();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Treasury Yield Dashboard</h1>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchYields}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Yield Curve Chart */}
          <YieldCurveChart 
            data={yields} 
            date={new Date().toISOString().split('T')[0]}
            isLoading={isLoading}
          />
          
          {/* Market Rates Table */}
          <MarketRates 
            yields={yields}
            isLoading={isLoading}
          />
        </div>

        {/* AI Summary Panel */}
        <div className="mt-6">
          <AISummaryPanel yields={yields} />
        </div>
      </main>
    </div>
  );
}