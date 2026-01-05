import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryId, MetricData } from "@/lib/types";

interface HeroMetricCardProps {
    category: CategoryId;
    metric: MetricData;
    date: string;
}

const CATEGORY_ACCENTS = {
    interest_rates: "text-chart-1",
    economic_growth: "text-chart-2",
    inflation: "text-chart-3",
    employment: "text-chart-4",
    money_supply: "text-chart-5",
};

export function HeroMetricCard({ category, metric, date }: HeroMetricCardProps) {
    const accentColor = CATEGORY_ACCENTS[category];
    const isPositive = metric.change && metric.change > 0;
    const isNegative = metric.change && metric.change < 0;
    const isNeutral = !metric.change || metric.change === 0;

    return (
        <Card className="glass border-white/20 overflow-hidden relative">
            <div className={cn(
                "absolute top-0 left-0 w-1 h-full",
                category === 'interest_rates' ? "bg-chart-1" :
                    category === 'economic_growth' ? "bg-chart-2" :
                        category === 'inflation' ? "bg-chart-3" :
                            category === 'employment' ? "bg-chart-4" :
                                "bg-chart-5"
            )} />

            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            {metric.label}
                        </h2>
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                                {metric.value}
                                {metric.unit && <span className="text-2xl md:text-3xl ml-1 font-normal text-muted-foreground">{metric.unit}</span>}
                            </span>

                            {metric.change !== undefined && (
                                <div className={cn(
                                    "flex items-center px-2.5 py-1 rounded-full text-sm font-medium border",
                                    isPositive ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                        isNegative ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                            "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                )}>
                                    {isPositive && <ArrowUpRight className="w-4 h-4 mr-1" />}
                                    {isNegative && <ArrowDownRight className="w-4 h-4 mr-1" />}
                                    {isNeutral && <Minus className="w-4 h-4 mr-1" />}
                                    {Math.abs(metric.change)}%
                                </div>
                            )}
                        </div>

                        {metric.changeLabel && (
                            <p className="text-sm text-muted-foreground mt-2">
                                {metric.changeLabel}
                            </p>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">As of</div>
                        <div className="text-sm font-medium text-foreground">
                            {new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
