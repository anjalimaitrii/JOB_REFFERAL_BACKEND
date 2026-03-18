import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Check file type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images Only!'));
    }
}

// Init upload
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});
