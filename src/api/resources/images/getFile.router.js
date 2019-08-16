import express from 'express';
import imagesController from './images.controller';
import multer from 'multer';
import fs from 'fs';

export const getFileRouter = express.Router();

getFileRouter.get('/:fileNm', imagesController.getFileByName)
getFileRouter.get('/image/:imgNm', imagesController.getImageByName)
getFileRouter.get('/avatar/:imgNm', imagesController.getAvatarByName)


