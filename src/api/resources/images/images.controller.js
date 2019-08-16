import path from 'path';
import fs from 'fs';

const sharp = require('sharp');
import { CONSTANTS } from '../../constant/constant';

var sizeOf = require('image-size');

export default {
  async uploadImage(req, res) {
    try {
      const { filename } = req.file;
      let fileNameAfterResize = 'image-' + filename
      let properties = sizeOf(CONSTANTS.IMAGE_PATH + filename);
      const imageHeight = properties.height;

      await sharp(CONSTANTS.IMAGE_PATH + filename)
        .rotate()
        .resize(null, imageHeight > 960 ? 960 : null)
        .toFile(CONSTANTS.IMAGE_PATH + fileNameAfterResize)
        .then(async (new_file_info) => {
          fs.unlink(CONSTANTS.IMAGE_PATH + filename, (err) => {
            if (err) {
              console.log('err', err);
              throw err;
            }
          });
          return res.status(200).send({ success: true, image_id: fileNameAfterResize });
        })
        .catch(function(err) {
          return res.status(404).json({
            success: false,
            message: 'Không thể tải ảnh lên, vui lòng kiểm tra và thử lại',
          });
        });

    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async getFileByName(req, res) {
    let fileNm = req.params.fileNm;
    return res.sendFile(path.join(process.cwd(), './uploads/files/' + fileNm));
  },

  async getImageByName(req, res) {
    let imgNm = req.params.imgNm;
    return res.sendFile(path.join(process.cwd(), './uploads/images/' + imgNm));
  },

  async getAvatarByName(req, res) {
    let imgNm = req.params.imgNm;
    return res.sendFile(path.join(process.cwd(), './uploads/avatar/' + imgNm));
  },

};
