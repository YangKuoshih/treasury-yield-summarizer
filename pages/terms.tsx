import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-6 py-24 max-w-3xl">
                <h1 className="font-heading font-bold text-3xl mb-8">Terms of Service</h1>
                <div className="prose prose-invert">
                    <p>By using Market Intelligence, you agree to these terms.</p>
                    <h3>Usage</h3>
                    <p>This data is for informational purposes only and does not constitute financial advice.</p>
                    <h3>Liability</h3>
                    <p>We are not liable for any trading decisions made based on this data.</p>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
