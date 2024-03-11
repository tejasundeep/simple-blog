import fs from 'fs';
import path from 'path';
import SeoUrl from '@/components/others/SeoUrl';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).single('image');

const multerMiddleware = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, function (err) {
            if (err) reject(err);
            resolve();
        });
    });
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    await multerMiddleware(req, res);

    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method Not Allowed' });

    const { slug } = req.query;
    const postsDirectory = path.join(process.cwd(), 'src', 'database', 'posts');
    const oldPostFilePath = path.join(postsDirectory, `${slug}.json`);
    const newPostFilePath = path.join(postsDirectory, `${SeoUrl(req.body.title)}.json`);
    const imageData = req.file ? { image: `/uploads/${req.file.filename}` } : {};
    const data = {
        ...JSON.parse(fs.readFileSync(oldPostFilePath, 'utf-8')),
        ...req.body,
        ...imageData,
    };

    // If a new image is uploaded, delete the old image
    if (req.file) {
        const oldImageData = JSON.parse(fs.readFileSync(oldPostFilePath, 'utf-8')).image;
        const oldImageFullPath = path.join(process.cwd(), 'public', oldImageData);

        if (oldImageData && fs.existsSync(oldImageFullPath)) {
            fs.unlinkSync(oldImageFullPath);
        }
    }

    fs.renameSync(oldPostFilePath, newPostFilePath);
    fs.writeFileSync(newPostFilePath, JSON.stringify(data));
    res.status(200).json({ message: `Post "${slug}" updated successfully` });
};
