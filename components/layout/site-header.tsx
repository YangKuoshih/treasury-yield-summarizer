import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
    return (
        <header className="border-b border-white/10 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-heading font-bold text-white text-lg">M</div>
                    <span className="font-heading font-bold text-lg tracking-tight">MARKET INTELLIGENCE</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/markets" className="hover:text-primary transition-colors">Markets</Link>
                    <Link href="/analytics" className="hover:text-primary transition-colors">Analytics</Link>
                    <Link href="/reports" className="hover:text-primary transition-colors">Reports</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-primary text-muted-foreground transition-colors">Log In</Link>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-none h-9 px-6 font-medium">
                        <Link href="/signup">Get Access</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
