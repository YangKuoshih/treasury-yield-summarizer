"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import type { TreasuryYield } from "@/lib/types"

interface MarketRatesProps {
    yields: TreasuryYield[]
    isLoading: boolean
}

export function MarketRates({ yields, isLoading }: MarketRatesProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Market Rates</CardTitle>
                <CardDescription>Current Treasury yields by maturity</CardDescription>
            </CardHeader>
            <CardContent>
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
                                <TableRow key={item.maturity}>
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
            </CardContent>
        </Card>
    )
}
