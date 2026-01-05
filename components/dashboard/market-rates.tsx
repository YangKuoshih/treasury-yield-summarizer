"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Newspaper, ExternalLink } from "lucide-react"
import type { TreasuryYield, NewsItem } from "@/lib/types"

interface MarketRatesProps {
    yields: TreasuryYield[]
    isLoading: boolean
    onSelectYield?: (yieldData: TreasuryYield) => void
    selectedYield?: TreasuryYield | null
    newsItems?: NewsItem[]
    isLoadingNews?: boolean
}

export function MarketRates({ yields, isLoading, onSelectYield, selectedYield, newsItems = [], isLoadingNews = false }: MarketRatesProps) {
    const hasNews = newsItems && newsItems.length > 0;
    // Always show news section if a yield is selected, regardless of news availability
    const showNewsSection = !!selectedYield;

    return (
        <Card className="h-full glass border-white/20">
            <CardHeader>
                <CardTitle>Market Rates</CardTitle>
                <CardDescription>Current Treasury yields by maturity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Maturity</TableHead>
                            <TableHead className="text-right">Yield</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : yields.length > 0 ? (
                            yields.map((item) => (
                                <TableRow
                                    key={item.maturity}
                                    className={`cursor-pointer hover:bg-muted/50 ${selectedYield?.maturity === item.maturity ? 'bg-primary/10' : ''}`}
                                    onClick={() => onSelectYield?.(item)}
                                >
                                    <TableCell className="font-medium">{item.maturity}</TableCell>
                                    <TableCell className="text-right">{item.yield.toFixed(2)}%</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* News Feed Section */}
                {showNewsSection && (
                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-3">
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold">Recent News</h3>
                        </div>

                        {isLoadingNews ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                ))}
                            </div>
                        ) : hasNews ? (
                            <div className="space-y-3">
                                {newsItems.slice(0, 3).map((news) => (
                                    <a
                                        key={news.id}
                                        href={news.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group hover:bg-muted/50 p-2 rounded-md transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                                                    {news.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {news.source}
                                                </p>
                                            </div>
                                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-1" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent news available</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
