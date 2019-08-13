import express from 'express';
import { imagesRouter } from './resources/images/images.router';


export const restRouter = express.Router();
restRouter.use('/files', imagesRouter);






