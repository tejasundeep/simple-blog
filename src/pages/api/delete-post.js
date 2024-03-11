import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
    const { slug } = req.query;
    const filePath = path.resolve(
        process.cwd(),
        "src",
        "database",
        "posts",
        `${slug}.json`
    );

    try {
        const data = await fs.readFile(filePath);
        const post = JSON.parse(data);

        // Ensure the post.image value has the relative path from the "public" folder
        const imagePath = `public${post.image}`;

        await fs.unlink(filePath);

        try {
            await fs.access(imagePath);
            await fs.unlink(imagePath);
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error(
                    `Error while trying to delete the image: ${imagePath}`,
                    err
                );
            } else {
                console.log(`Image file not found: ${imagePath}`);
            }
        }

        res.status(200).json({
            message: `${slug}.json and image were deleted`,
        });
    } catch (err) {
        if (err.code === "ENOENT") {
            res.status(404).json({ message: "File not found" });
        } else {
            res.status(500).json({
                message: `Error processing request: ${err.message}`,
            });
        }
    }
}
