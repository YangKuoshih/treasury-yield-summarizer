import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`${geistSans.className} antialiased`}>
                <Component {...pageProps} />
            </body>
        </html>
    );
}
