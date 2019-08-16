import express from 'express';
import { imagesRouter } from './resources/images/images.router';
import { getFileRouter } from './resources/images/getFile.router';


export const restRouter = express.Router();
restRouter.use('/files', imagesRouter);
restRouter.use('/get-files', getFileRouter);






