const fs = require("fs");

module.exports = {
    reactStrictMode: false,
    poweredByHeader: false,
    async redirects() {
        // Read the JSON file containing redirection rules
        const redirectsData = JSON.parse(
            fs.readFileSync("./redirects.json", "utf8")
        );

        // Map the redirection rules from the JSON data
        const redirects = redirectsData.map(
            ({ source, destination, permanent }) => ({
                source,
                destination,
                permanent,
            })
        );

        return redirects;
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Don't resolve 'fs' module on the client to prevent this error:
            // "Module not found: Can't resolve 'fs'"
            config.resolve.fallback = {
                fs: false,
            };
        }

        return config;
    },
    async rewrites() {
        return [
            {
                source: "/robots.txt",
                destination: "/api/robots",
            },
            {
                source: "/sitemap.xml",
                destination: "/api/sitemap.xml",
            },
        ];
    },
    productionBrowserSourceMaps: true,
};
