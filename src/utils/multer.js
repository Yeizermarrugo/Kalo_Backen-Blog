const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('../../uploads'));
  },
  filename: (req, file, cb) => {
    const timestamp = Math.floor(Date.now() / 1000); // Obtener el tiempo en segundos
    cb(null, timestamp + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage });

exports.upload = upload;