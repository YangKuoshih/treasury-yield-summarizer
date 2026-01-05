import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-6 py-24 max-w-3xl">
                <h1 className="font-heading font-bold text-3xl mb-8">Privacy Policy</h1>
                <div className="prose prose-invert">
                    <p>Your privacy is important to us. Market Intelligence Inc. collects only the data necessary to provide our services.</p>
                    <h3>Data Collection</h3>
                    <p>We may collect email addresses and usage data to improve our analytics offerings.</p>
                    <h3>Third Parties</h3>
                    <p>We do not sell data to third parties.</p>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
