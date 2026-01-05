import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
                <h1 className="font-heading font-bold text-4xl mb-4">Research Reports</h1>
                <p className="text-muted-foreground max-w-lg mb-8">
                    Download PDF summaries and weekly recap documents.
                    <br /><span className="text-sm opacity-50 block mt-2">(Feature enabled for Enterprise subscribers)</span>
                </p>
                <Button asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </main>
            <SiteFooter />
        </div>
    );
}
