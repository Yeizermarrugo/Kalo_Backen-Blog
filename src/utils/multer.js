const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve('uploads'));
//   },
//   filename: (req, file, cb) => {
//     const timestamp = Math.floor(Date.now() / 1000); // Obtener el tiempo en segundos
//     cb(null, timestamp + '-' + file.originalname.replace(/\s+/g, '_'));
//   }
// });

// const upload = multer({ storage });

// exports.upload = upload;


const multerPublicationsPhotos = multer({
  dest: 'uploads/publications/photos/',
  limits: {
    fileSize: 1048576, // 1 Mb
  },
  fileFilter: (request, file, cb) => {

    request.on('aborted', () => {
      file.stream.on('end', () => {
        cb(new Error('Cancel Photo Upload'), false)
      })
      file.stream.emit('end')
    })
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  }
})

module.exports = {
  multerPublicationsPhotos
}