const aws = require('aws-sdk');
const multer = require('multer');
var multerS3 = require('multer-s3-transform')
const sharp = require('sharp');

aws.config.update({
  secretAccessKey: "9NZ3aRWfK/UbwAVj8jR0sExeoAyLfUCyErFSC8aR",
  accessKeyId: "AKIAJIT3DFOCWWF55NKA",
  region: 'eu-central-1'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === "jpg") {
      cb(null, true)
  } else {
      cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
}




var upload =(name) => multer({
  storage: multerS3({
    s3: s3,
    bucket: 'quitsmokingapp',
    acl: 'public-read',
    contentType : multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [{
      id: 'original',
      key: function (req, file, cb) {
        cb(null, "original/"+name+'.jpg')
      },
      transform: function (req, file, cb) {
        cb(null, sharp().toFormat('jpeg')
        .jpeg({
          quality: 100,
          chromaSubsampling: '4:4:4',
          force: true, // <----- add this parameter
        })
     
        )
      }
    }, {
      id: 'thumbnail',
      key: function (req, file, cb) {
        cb(null, "thumbnail/"+name+'.jpg')
      },
      transform: function (req, file, cb) {
        cb(null, sharp().resize(150, 150).toFormat('jpeg')
        .jpeg({
          quality: 100,
          chromaSubsampling: '4:4:4',
          force: true, // <----- add this parameter
        }))
      }
    }]
  })
})

module.exports = upload;