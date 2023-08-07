import path from 'path';
var fs = require('fs');

export default {
  async uploadImage(req, res) {
    try {
      const { filename } = req.file;
      return res.json({ filename: filename });
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

  async deleteFileByName(req, res) {
    let fileNm = req.params.fileNm;
    let filePath = path.join(process.cwd(), './uploads/files/' + fileNm);
    fs.unlink(filePath, function (err) {
      if (err && err.code == 'ENOENT') {
        // File không tồn tại
        return res.status(404).send("File không tồn tại!!!");
      } else if (err) {
        // Lỗi trong quá trình xóa file
        return res.status(500).send(err);
      } else {
        // Xóa file thành công
        return res.status(200).send("Xóa file thành công!!!");
      }
    });
  },

  async deleteImageByName(req, res) {
    let imgNm = req.params.imgNm;
    let filePath = path.join(process.cwd(), './uploads/images/' + imgNm);
    fs.unlink(filePath, function (err) {
      if (err && err.code == 'ENOENT') {
        // Ảnh không tồn tại
        return res.status(404).send("Ảnh không tồn tại!!!");
      } else if (err) {
        // Lỗi trong quá trình xóa ảnh
        return res.status(500).send(err);
      } else {
        // Xóa ảnh thành công
        return res.status(200).send("Xóa ảnh thành công!!!");
      }
    });
  },
};
