const path = require('path')
const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        const path = `./uploads/${req.params.id}`
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)
      },
      filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage,
    limits: {
    fileSize: 1000000
    },
    fileFilter(req,file,cb) {
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
        return cb(new Error('unsupported image format'))
    }
    cb(undefined,true)
    }})

module.exports = upload