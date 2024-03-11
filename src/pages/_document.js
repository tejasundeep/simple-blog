import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    let comp = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KR446NS"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    return (
        <Html lang="en">
            <Head />
            <body>
                <noscript dangerouslySetInnerHTML={{ __html: comp }}></noscript>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
