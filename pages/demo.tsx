import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { YieldCurveChart } from "@/components/dashboard/yield-curve-chart";
import { MarketRates } from "@/components/dashboard/market-rates";
import { ArrowLeft } from "lucide-react";
import type { TreasuryYield } from "@/lib/types";

// Sample demo data
const sampleYields: TreasuryYield[] = [
  { maturity: "1 Mo", yield: 5.25 },
  { maturity: "2 Mo", yield: 5.30 },
  { maturity: "3 Mo", yield: 5.35 },
  { maturity: "6 Mo", yield: 5.40 },
  { maturity: "1 Yr", yield: 5.20 },
  { maturity: "2 Yr", yield: 4.85 },
  { maturity: "3 Yr", yield: 4.65 },
  { maturity: "5 Yr", yield: 4.55 },
  { maturity: "7 Yr", yield: 4.60 },
  { maturity: "10 Yr", yield: 4.65 },
  { maturity: "20 Yr", yield: 4.85 },
  { maturity: "30 Yr", yield: 4.90 },
];

export default function DemoPage() {
  const [isLoading] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Treasury Yield Demo</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Demo Mode
              </div>
              <Button asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Treasury Yield Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            This is a demo showing sample Treasury yield data. Sign up to access real-time data and AI analysis.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Yield Curve Chart */}
          <YieldCurveChart 
            data={sampleYields} 
            date={currentDate}
            isLoading={isLoading}
          />
          
          {/* Market Rates Table */}
          <MarketRates 
            yields={sampleYields}
            isLoading={isLoading}
          />
        </div>

        {/* Demo Notice */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Features</h3>
          <ul className="text-blue-800 space-y-1 mb-4">
            <li>• Interactive yield curve visualization</li>
            <li>• Real-time Treasury rates table</li>
            <li>• AI-powered market analysis (available in full version)</li>
            <li>• Historical trend tracking (available in full version)</li>
            <li>• Custom alerts and notifications (available in full version)</li>
          </ul>
          <Button asChild>
            <Link href="/login">
              Unlock Full Features
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}