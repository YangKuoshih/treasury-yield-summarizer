import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import "../styles/globals.css";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else if (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add("dark");
        }
    }, []);

    return (
        <div className={`${geistSans.className} antialiased`}>
            <Component {...pageProps} />
        </div>
    );
}
