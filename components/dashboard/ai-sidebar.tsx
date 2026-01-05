import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AISummary, CategoryId, NewsItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AISidebarProps {
    summary?: AISummary;
    category: CategoryId;
    isLoading: boolean;
    onRegenerate: () => void;
    newsItems?: NewsItem[];
    isLoadingNews?: boolean;
}

const CONDITION_COLORS = {
    normal: "bg-green-500/10 text-green-500 border-green-500/20",
    inverted: "bg-red-500/10 text-red-500 border-red-500/20",
    steep: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    flat: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    bullish: "bg-green-500/10 text-green-500 border-green-500/20",
    bearish: "bg-red-500/10 text-red-500 border-red-500/20",
    neutral: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function AISidebar({ summary, category, isLoading, onRegenerate, newsItems = [], isLoadingNews = false }: AISidebarProps) {
    return (
        <Card className="glass border-white/20 flex flex-col min-h-[500px] h-full overflow-hidden">
            <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <CardTitle className="text-lg font-medium">Today&apos;s AI Insights</CardTitle>
                    </div>
                    {summary && (
                        <Badge variant="outline" className={cn("capitalize", CONDITION_COLORS[summary.marketCondition])}>
                            {summary.marketCondition}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 p-0">
                <ScrollArea className="h-full px-6 pb-6">
                    {isLoading ? (
                        <div className="space-y-4 py-4">
                            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-muted rounded w-full animate-pulse" />
                            <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                        </div>
                    ) : summary ? (
                        <div className="space-y-6">
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                {summary.summary}
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-foreground">Key Observations</h4>
                                <ul className="space-y-2">
                                    {(summary.keyInsights || []).map((insight, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                            <span>{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Related News Section */}
                            {newsItems && newsItems.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-border/50">
                                    <h4 className="text-sm font-medium text-foreground">Related News</h4>
                                    <div className="space-y-2">
                                        {newsItems.map((newsItem) => (
                                            <a
                                                key={newsItem.id}
                                                href={newsItem.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                            >
                                                <p className="text-sm font-medium line-clamp-2">
                                                    {newsItem.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                    <span>{newsItem.source}</span>
                                                    <span>•</span>
                                                    <span>{new Date(newsItem.publishedAt).toLocaleDateString()}</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isLoadingNews && (
                                <div className="space-y-2 pt-4 border-t border-border/50">
                                    <h4 className="text-sm font-medium text-foreground">Related News</h4>
                                    <div className="h-4 bg-muted rounded w-full animate-pulse" />
                                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                                </div>
                            )}

                            <div className="pt-4 border-t border-border/50">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex flex-col">
                                        <span>Generated: {new Date(summary.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="text-[10px] opacity-70">Model: Claude Sonnet 4.5</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 hover:bg-transparent hover:text-primary"
                                        onClick={onRegenerate}
                                    >
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        Regenerate
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                            <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No insights available for this category.</p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={onRegenerate}>
                                Generate Analysis
                            </Button>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
