import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryId, TimeSeriesPoint } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TrendChartProps {
    data: TimeSeriesPoint[];
    category: CategoryId;
    label: string;
    description?: string;
}

const CATEGORY_COLORS = {
    interest_rates: "hsl(var(--chart-1))",
    economic_growth: "hsl(var(--chart-2))",
    inflation: "hsl(var(--chart-3))",
    employment: "hsl(var(--chart-4))",
    money_supply: "hsl(var(--chart-5))",
};

export function TrendChart({ data, category, label, description }: TrendChartProps) {
    const color = CATEGORY_COLORS[category];

    return (
        <Card className="glass border-white/20 h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">{label}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                                className="text-xs text-muted-foreground"
                                minTickGap={30}
                            />
                            <YAxis
                                tickLine={false}
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={`url(#color-${category})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
