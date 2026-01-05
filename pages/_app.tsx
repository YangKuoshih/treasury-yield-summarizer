import type { AppProps } from "next/app";
import { Space_Grotesk, Manrope } from "next/font/google";
import { useEffect } from "react";
import "../styles/globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: '--font-space',
});

const manrope = Manrope({
    subsets: ["latin"],
    variable: '--font-manrope',
});

export default function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Enforce dark mode for the 'Institutional' aesthetic
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }, []);

    return (
        <div className={`${spaceGrotesk.variable} ${manrope.variable} antialiased font-sans`}>
            <Component {...pageProps} />
        </div>
    );
}
