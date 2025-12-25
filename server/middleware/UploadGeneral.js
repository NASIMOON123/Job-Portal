// // General upload config (no fileFilter)
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = 'uploads/';
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const generalUpload = multer({ storage });
// export default generalUpload;
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${req.user.userId}-${Date.now()}-${file.originalname}`)
});

const generalUpload = multer({ storage });

export default generalUpload;
