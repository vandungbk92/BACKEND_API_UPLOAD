import express from 'express';
import imagesController from './images.controller';
import multer from 'multer';
import fs from 'fs';

export const getFileRouter = express.Router();

getFileRouter.get('/:fileNm', imagesController.getFileByName)
getFileRouter.delete('/:fileNm', imagesController.deleteFileByName)
getFileRouter.get('/image/:imgNm', imagesController.getImageByName)
getFileRouter.delete('/image/:imgNm', imagesController.deleteImageByName)
getFileRouter.get('/avatar/:imgNm', imagesController.getAvatarByName)


