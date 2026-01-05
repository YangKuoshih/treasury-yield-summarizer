import { useRef, useEffect } from "react";
import {
    TrendingUp,
    BarChart3,
    ShoppingCart,
    Briefcase,
    Banknote,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryId, MetricData } from "@/lib/types";

interface CategoryCarouselProps {
    currentCategory: CategoryId;
    onCategoryChange: (category: CategoryId) => void;
    categories: {
        id: CategoryId;
        name: string;
        metric: MetricData;
    }[];
}

const CATEGORY_ICONS = {
    interest_rates: TrendingUp,
    economic_growth: BarChart3,
    inflation: ShoppingCart,
    employment: Briefcase,
    money_supply: Banknote,
};

const CATEGORY_COLORS = {
    interest_rates: "text-chart-1 border-chart-1/50 bg-chart-1/10",
    economic_growth: "text-chart-2 border-chart-2/50 bg-chart-2/10",
    inflation: "text-chart-3 border-chart-3/50 bg-chart-3/10",
    employment: "text-chart-4 border-chart-4/50 bg-chart-4/10",
    money_supply: "text-chart-5 border-chart-5/50 bg-chart-5/10",
};

export function CategoryCarousel({
    currentCategory,
    onCategoryChange,
    categories
}: CategoryCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Scroll active category into view on mount/change
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeElement = scrollContainerRef.current.querySelector(`[data-category="${currentCategory}"]`);
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentCategory]);

    return (
        <div className="relative w-full group">
            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 md:overflow-visible"
            >
                {categories.map((category) => {
                    const Icon = CATEGORY_ICONS[category.id];
                    const isActive = currentCategory === category.id;
                    const colorClass = CATEGORY_COLORS[category.id];

                    return (
                        <button
                            key={category.id}
                            data-category={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={cn(
                                "flex-none w-[200px] md:w-auto snap-center text-left transition-all duration-300",
                                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
                            )}
                        >
                            <Card
                                className={cn(
                                    "h-full transition-all duration-300 border hover:border-primary/50",
                                    isActive
                                        ? `glass ring-1 ring-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.3)] ${colorClass.split(' ')[1]}`
                                        : "glass bg-card/50 hover:bg-card/80 border-border/50"
                                )}
                            >
                                <CardContent className="p-4 flex flex-col justify-between h-[110px]">
                                    <div className="flex justify-between items-start">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isActive ? colorClass : "bg-muted text-muted-foreground"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {isActive && (
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </div>

                                    <div>
                                        <h3 className={cn(
                                            "text-xs font-medium uppercase tracking-wider mb-1",
                                            isActive ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {category.name}
                                        </h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold tracking-tight">
                                                {category.metric.value}
                                                {category.metric.unit && <span className="text-sm ml-0.5 font-normal text-muted-foreground">{category.metric.unit}</span>}
                                            </span>
                                            {category.metric.change !== undefined && (
                                                <span className={cn(
                                                    "text-xs font-medium",
                                                    category.metric.change > 0 ? "text-green-500" : "text-red-500"
                                                )}>
                                                    {category.metric.change > 0 ? "+" : ""}{category.metric.change.toFixed(3)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </button>
                    );
                })}
            </div>

            {/* Gradient fade for scroll indication on mobile */}
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
            <div className="absolute left-0 top-0 bottom-4 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none md:hidden" />
        </div>
    );
}
