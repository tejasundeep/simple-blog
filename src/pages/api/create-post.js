import fs from "fs";
import path from "path";
import multer from "multer";
import SeoUrl from "@/components/others/SeoUrl";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads/"),
    filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        var filetypes = /jpeg|jpg|png|webp/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(
            "Error: File upload only supports the following filetypes - " +
                filetypes
        );
    },
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        await new Promise((resolve, reject) => {
            upload.single("image")(req, res, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        const { title, category, tags, metatitle, metadesc, content } =
            req.body;
        const currentDate = new Date();
        const formattedDate = currentDate
            .toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            .replace(/\d+(st|nd|rd|th)/, "$& ");
        const filename = `${SeoUrl(title)}.json`;
        const filePath = path.join(
            process.cwd(),
            "src",
            "database",
            "posts",
            filename
        );

        if (fs.existsSync(filePath)) {
            return res
                .status(400)
                .json({ message: "Failed: Post already exists" });
        }

        const maxId = fs
            .readdirSync(path.join(process.cwd(), "src", "database", "posts"))
            .filter((file) => file !== ".gitkeep")
            .map((file) =>
                JSON.parse(
                    fs.readFileSync(
                        path.join(
                            process.cwd(),
                            "src",
                            "database",
                            "posts",
                            file
                        )
                    )
                )
            )
            .reduce((max, data) => Math.max(max, data.id), 0);

        const newPost = {
            id: maxId + 1,
            image: "/uploads/" + req.file.filename,
            title,
            date: formattedDate,
            category,
            tags,
            metatitle,
            metadesc,
            content,
        };

        fs.writeFileSync(filePath, JSON.stringify(newPost));

        return res.status(200).json({ message: "Post created successfully" });
    } catch (error) {
        res.status(500).json({
            error: `Sorry, something happened: ${error.message}`,
        });
    }
}
