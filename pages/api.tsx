import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApiPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
                <h1 className="font-heading font-bold text-4xl mb-4">Developer API</h1>
                <p className="text-muted-foreground max-w-lg mb-8">
                    Build your own tools with our raw data and AI insight streams.
                </p>
                <div className="bg-black/50 p-4 rounded-md font-mono text-sm mb-8 border border-white/10">
                    GET https://api.market-intel.com/v1/yields/latest
                </div>
                <Button variant="outline" disabled>
                    Request API Key (Waitlist)
                </Button>
            </main>
            <SiteFooter />
        </div>
    );
}
