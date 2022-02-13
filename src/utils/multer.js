const path = require('path')
const fs = require('fs')
const multer = require('multer')
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')

AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'us-east-1'
});

const s3 = new AWS.S3();

const upload = multer({
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('unsupported image format'))
        }
        cb(undefined,true)
    },
    storage: multerS3({
        s3,
        bucket: (req, file, cb) => {
            let bucketName = null
            if (req.params.id) {
              bucketName = `studentregister/${req.params.id}`
             }
             cb(null, bucketName)
         },
        key: function (req, file, cb) {
            cb(null, Date.now()+path.extname(file.originalname))
          }
    }),
    limits: {
        fileSize: 1000000
    }
});

async function emptyS3Directory(bucket, dir) {
    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

async function emptyDirectory(BUCKET, filename){
    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
}


module.exports = {upload,emptyS3Directory,emptyDirectory}