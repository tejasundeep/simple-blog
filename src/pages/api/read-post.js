import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const postsDirectory = path.join(process.cwd(), "src", "database", "posts");
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
        .map((fileName) => {
            const fileContents = fs.readFileSync(
                path.join(postsDirectory, fileName),
                "utf8"
            );
            let h2Count = 0;
            const {
                id,
                title,
                image,
                date,
                category,
                tags,
                metatitle,
                metadesc,
                content,
            } = JSON.parse(fileContents);
            const modifiedContent = content.replace(/<h2/g, () => {
                h2Count++;
                return `<h2 class="post_heading_${h2Count}"`;
            });
            return {
                id,
                title,
                image,
                date,
                category,
                tags,
                metatitle,
                metadesc,
                content: modifiedContent,
            };
        })
        .sort((a, b) => b.id - a.id);
    res.status(200).json({ posts });
}
