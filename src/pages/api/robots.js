export default function handler(req, res) {
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST
    res.setHeader("Content-Type", "text/plain");
    res.write("User-agent: *\n");
    res.write("Disallow: \n");
    res.write(`Sitemap: ${appUrl}`);
    res.end();
}
