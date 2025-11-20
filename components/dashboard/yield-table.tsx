import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TreasuryYield } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface YieldTableProps {
  data: TreasuryYield[]
  isLoading?: boolean
}

export function YieldTable({ data, isLoading }: YieldTableProps) {
  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  return (
    <Card>
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
            {data.map((item) => (
              <TableRow key={item.seriesId}>
                <TableCell className="font-medium">{item.maturityLabel}</TableCell>
                <TableCell className="text-right font-mono">{item.value.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
