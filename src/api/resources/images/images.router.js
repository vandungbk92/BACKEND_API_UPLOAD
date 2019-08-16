import express from 'express';
import imagesController from './images.controller';
import multer from 'multer'
import fs from 'fs'

// config upload image
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images')
  },
  filename: function (req, file, cb) {
    let originalFilename = file.originalname;
    cb(null, originalFilename  )
  }
})

function extFile(req, file, cb) {
  if(!file.originalname.match(/\.(jpg|png|jpeg|gif|JPG|PNG|JPEG)$/)){
    return cb(new Error('Ảnh không đúng định dạng'))
  }else{
    cb(null, true)
  }
}

let uploadImage = multer({ storage: storage, fileFilter: extFile })
function checkUploadPath(req, res, next) {
  let path = './uploads/images';
  fs.exists(path, function(exists) {
    if(exists) {
      next();
    }
    else {
      fs.mkdir(path, function(err) {
        if(err) {
          console.log('Error in folder creation');
          next();
        }
        next();
      })
    }
  })
}

// kết thúc config upload image



// config upload file
let storageFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/files')
  },
  filename: function (req, file, cb) {
    let originalFilename = file.originalname;
    cb(null, originalFilename  )
  }
})

function extFileFiles(req, file, cb) {
  if(!file.originalname.match(/\.(doc|docx|xls|xlsx|excel|pdf)$/)){
    return cb(new Error('Tệp tin không đúng định dạng'))
  }else{
    cb(null, true)
  }
}

let uploadFile = multer({ storage: storageFiles, fileFilter: extFileFiles })

function checkUploadPathFiles(req, res, next) {
  let path = './uploads/files';
  fs.exists(path, function(exists) {
    if(exists) {
      next();
    }
    else {
      fs.mkdir(path, function(err) {
        if(err) {
          console.log('Error in folder creation');
          next();
        }
        next();
      })
    }
  })
}

// kết thúc config upload Files



// config upload avatar
let storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/avatar')
  },
  filename: function (req, file, cb) {
    let originalFilename = file.originalname;
    cb(null, originalFilename  )
  }
})

let uploadAvatar = multer({ storage: storageAvatar, fileFilter: extFile })
function checkUploadPathAvatar(req, res, next) {
  let path = './uploads/avatar';
  fs.exists(path, function(exists) {
    if(exists) {
      next();
    }
    else {
      fs.mkdir(path, function(err) {
        if(err) {
          console.log('Error in folder creation');
          next();
        }
        next();
      })
    }
  })
}

// kết thúc config upload avatar


function checkUploadPathFolder(req, res, next) {
  let path = './uploads';
  fs.exists(path, function(exists) {
    if(exists) {
      next();
    }
    else {
      fs.mkdir(path, function(err) {
        if(err) {
          console.log('Error in folder creation');
          next();
        }
        next();
      })
    }
  })
}

export const imagesRouter = express.Router();

imagesRouter
  .route('/')
  .post(checkUploadPathFolder, checkUploadPathFiles, uploadFile.single('image'), imagesController.uploadImage)

imagesRouter
  .route('/image')
  .post(checkUploadPathFolder, checkUploadPath, uploadImage.single('image'), imagesController.uploadImage)

imagesRouter
  .route('/avatar')
  .post(checkUploadPathFolder, checkUploadPathAvatar, uploadAvatar.single('image'), imagesController.uploadImage)

imagesRouter.get('/:fileNm', imagesController.getFileByName)
imagesRouter.get('/image/:imgNm', imagesController.getImageByName)
imagesRouter.get('/avatar/:imgNm', imagesController.getAvatarByName)


