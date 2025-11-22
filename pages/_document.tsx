import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return initialProps;
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function() {
                                    const theme = localStorage.getItem('theme');
                                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                    if (theme === 'dark' || (!theme && prefersDark)) {
                                        document.documentElement.classList.add('dark');
                                    }
                                })();
                            `,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
