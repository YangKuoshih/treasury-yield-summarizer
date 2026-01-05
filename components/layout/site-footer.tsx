import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="py-12 bg-black border-white/10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/10 flex items-center justify-center font-heading font-bold text-white text-xs">M</div>
                    <span className="font-bold tracking-tight text-white/50">MARKET INTELLIGENCE</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    © 2025 Market Intelligence Inc. Data via St. Louis Fed.
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/api" className="hover:text-white transition-colors">API</Link>
                </div>
            </div>
        </footer>
    );
}
