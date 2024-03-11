import Head from "next/head";
import Script from "next/script";
import KeywordExtractor from "@/components/others/keyword_extractor";

/**
 * It takes in the title, description, image and metadesc as props and returns the meta tags for the
 * page
 * @returns The return statement is used to return a value from a function.
 */
let MetaHead = ({ title, description, image, metatitle, metadesc }) => {
    let MAX_CHARACTERS = 250;
    let keywords = KeywordExtractor(description);
    let appUrl = process.env.NEXT_PUBLIC_DOMAIN

    // Extract the first paragraph using a regular expression
    let firstParagraph = description && description.match(/<p>.*?<\/p>/)?.[0];

    /* Truncating the description to full stop near 250 characters. */
    let fullStopIndex = firstParagraph?.indexOf(".", MAX_CHARACTERS);
    let endIndex =
        fullStopIndex === -1 ? firstParagraph?.length - 1 : fullStopIndex + 1;
    let truncatedContent = firstParagraph
        ? firstParagraph.slice(0, endIndex).replace(/<\/?p>/g, "")
        : description;
        
    let capitalTitle = metatitle ? metatitle[0].toUpperCase() + metatitle.slice(1) : title[0].toUpperCase() + title.slice(1);

    let metadescription = metadesc ? metadesc : truncatedContent;

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": appUrl,
                name: "Simple Blog",
                url: appUrl,
                legalName: "Blockforce India Private Limited",
                foundingDate: "2021",
                founders: [
                    {
                        "@type": "Person",
                        name: "Rahul Agarwal and Vijay Varma",
                    },
                ],
                sameAs: [
                    "https://twitter.com/simple-blog",
                    "https://www.facebook.com/simple-blog",
                    "https://www.linkedin.com/company/simple-blog/",
                    "https://t.me/Simple Blogofficial",
                    "https://www.instagram.com/simple-blog/",
                    "https://simple-blog.medium.com/",
                    "https://play.google.com/store/apps/details?id=in.simple-blog.app",
                ],
                logo: {
                    "@type": "ImageObject",
                    "@id": appUrl,
                    url: "logo.svg",
                    caption: "Simple Blog",
                },
                image: {
                    "@id": appUrl,
                },
            },
            {
                "@type": "WebSite",
                "@id": appUrl,
                url: appUrl,
                name: "Simple Blog",
                publisher: {
                    "@id": appUrl,
                },
            },
            {
                "@type": "ImageObject",
                "@id": appUrl,
                url: appUrl + "/og-image.png",
                width: 200,
                height: 200,
            },
            {
                "@type": "WebPage",
                "@id": appUrl,
                url: appUrl,
                inLanguage: "en",
                name: "Simple Blog",
                description:
                    "Write articles with freedom",
                isPartOf: {
                    "@id": appUrl,
                },
                about: {
                    "@id": "https://simple-blog.vercel.app/about-us",
                },
                primaryImageOfPage: {
                    "@id": appUrl,
                },
            },
            {
                "@type": "Table",
                about: "Top news Today",
            },
        ],
    };

    return (
        <>
            <Head>
                <title>{capitalTitle}</title>
                <meta charSet="utf-8" />
                <meta name="description" content={metadescription} />
                <meta name="keywords" content={keywords.join(", ")} />
                <meta name="author" content="Simple Blog" />
                <meta name="copyright" content="Simple Blog" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
                <meta name="revisit-after" content="1 days" />
                <meta name="theme-color" content="#ffffff" />

                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content={image ? appUrl + image : `${appUrl}/og-image.png`}
                />
                <meta property="og:image:width" content="200" />
                <meta property="og:image:height" content="200" />
                <meta property="og:description" content={metadescription} />
                <meta property="og:title" content={capitalTitle} />
                <meta property="og:url" content={`${appUrl}`} />
                <meta property="twitter:title" content={capitalTitle} />
                <meta property="twitter:site" content="Simple Blog" />
                <meta
                    property="twitter:image"
                    content={image ? appUrl + image : `${appUrl}/og-image.png`}
                />
                <meta
                    property="twitter:image:src"
                    content={image ? appUrl + image : `${appUrl}/og-image.png`}
                />
                <meta property="twitter:card" content="summary_large_image" />

                <meta name="apple-mobile-web-app-title" content="Simple Blog" />
                <meta name="application-name" content="Simple Blog" />
                <meta name="msapplication-TileColor" content="#da532c" />

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="shortcut icon" href={`${appUrl}/small-logo.svg`} />
                <link rel="canonical" href={`${appUrl}`} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>
            <Script
                id="gtm-script"
                dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-KR446NS');`
                }}
            />
        </>
        
    );
};

export default MetaHead;
