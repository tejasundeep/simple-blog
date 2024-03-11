import fetch from "node-fetch";
import SeoUrl from "@/components/others/SeoUrl";

export default async function NextSitemap(req, res) {
    try {
        let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST
        const response = await fetch(`${appUrl}/api/read-post`);

        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }

        const data = await response.json();
        const posts = data.posts;
        console.log(posts);

        const baseUrl =
            process.env.NEXT_PUBLIC_LOCAL_HOST

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts
          .map(
              ({ title, date }) => `
          <url>
            <loc>${baseUrl}/post/${SeoUrl(title)}</loc>
            <lastmod>${date}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
          </url>
        `
          )
          .join("")}
    </urlset>`;

        res.setHeader("Content-Type", "text/xml");
        res.write(sitemap);
        res.end();
    } catch (error) {
        res.status(500).json({
            error: `Sitemap generation failed: ${error.message}`,
        });
    }
}
