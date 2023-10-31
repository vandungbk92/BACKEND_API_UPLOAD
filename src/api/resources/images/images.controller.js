import path from 'path';
import Request from '../311/request/request.model';
import jwt from 'jsonwebtoken';
import { getConfig } from '../../../config/config';
import * as resquestAction from '../../utils/responseAction';
var fs = require('fs');
const config = getConfig(process.env.NODE_ENV);

function getTokenByCookie(req, userType) {
  let objCookie = {};
  if (!req.headers.cookie) return null;
  req.headers.cookie.split(/\s*;\s*/).forEach(function (pair) {
    pair = pair.split(/\s*=\s*/);
    objCookie[pair[0]] = pair.splice(1).join('=');
  });
  let jsonCookie = JSON.stringify(objCookie, null, 4);
  let token = null;

  if (userType === 'Citizen') {
    token = JSON.parse(jsonCookie)['_CITIZEN_LOGIN_'];
  }

  if (userType === 'Admin') {
    token = JSON.parse(jsonCookie)['_USER_LOGIN_'];
  }

  return token;
}

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
    const requestInfo = await Request.findOne({ files_req: fileNm }).lean();

    if (requestInfo) {
      if (requestInfo.typePublic === 2)
        return res.sendFile(path.join(process.cwd(), './uploads/files/' + fileNm));

      let tokenAdmin = getTokenByCookie(req, 'Admin');
      let tokenCitizen = getTokenByCookie(req, 'Citizen');
      let token = tokenAdmin || tokenCitizen;

      if (token && token !== 'undefined' && token.length > 15) {
        try {
          if (tokenAdmin) {
            // verifies secret and checks exp
            jwt.verify(tokenAdmin, config.secret, function (err, decoded) {
              if (err) {
                console.log(err, err.message);
                if (err.message === 'jwt expired') {
                  return res.status(401).json({
                    success: false,
                    message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
                  });
                }
                resquestAction.error(res, 401, '');
              } else {
                return res.sendFile(path.join(process.cwd(), './uploads/files/' + fileNm));
              }
            });
          } else if (tokenCitizen) {
            jwt.verify(tokenCitizen, config.secret, function (err, decoded) {
              if (err) {
                console.log(err, err.message);
                if (err.message === 'jwt expired') {
                  return res.status(401).json({
                    success: false,
                    message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
                  });
                }
                resquestAction.error(res, 401, '');
              } else {
                let decoded = jwt.verify(tokenCitizen, config.secret);
                const userId = decoded.id;
                // Trường hợp token là pakn của chính người dân đã gửi pakn đó thì cho phép truy cập api để get file
                if (requestInfo.citizen_id.toString().trim() === userId.toString().trim()) {
                  return res.sendFile(path.join(process.cwd(), './uploads/files/' + fileNm));
                } else {
                  return res.status(401).json({ success: false, message: 'Bạn không có quyền truy cập!' });
                }
              }
            });
          }
        } catch (err) {
          return res.status(401).json({ success: false, message: 'Bạn không có quyền truy cập!' });
        }
      } else {
        return res.status(401).json({ success: false, message: 'Bạn không có quyền truy cập!' });
      }
    } else {
      const isFileAnswer = await Request.findOne({ files_public: fileNm }).lean();
      if (isFileAnswer) {
        return res.sendFile(path.join(process.cwd(), './uploads/files/' + fileNm));
      } else {
        return res.status(404).json({ success: false, message: 'File không tồn tại.' });
      }
    }
  },

  async getImageByName(req, res) {
    let imgNm = req.params.imgNm;
    const requestInfo = await Request.findOne({ images_req: req.params.imgNm }).lean();

    if (requestInfo) {
      if (requestInfo.typePublic === 2)
        return res.sendFile(path.join(process.cwd(), './uploads/images/' + imgNm));

      let tokenAdmin = getTokenByCookie(req, 'Admin');
      let tokenCitizen = getTokenByCookie(req, 'Citizen');
      let token = tokenAdmin || tokenCitizen;

      if (token && token !== 'undefined' && token.length > 15) {
        try {
          if (tokenAdmin) {
            // verifies secret and checks exp
            jwt.verify(tokenAdmin, config.secret, function (err, decoded) {
              if (err) {
                console.log(err, err.message);
                if (err.message === 'jwt expired') {
                  return res.status(401).json({
                    success: false,
                    message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
                  });
                }
                resquestAction.error(res, 401, '');
              } else {
                res.sendFile(path.join(process.cwd(), './uploads/images/' + imgNm));
              }
            });
          } else if (tokenCitizen) {
            jwt.verify(tokenCitizen, config.secret, function (err, decoded) {
              if (err) {
                console.log(err, err.message);
                if (err.message === 'jwt expired') {
                  return res.status(401).json({
                    success: false,
                    message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
                  });
                }
                resquestAction.error(res, 401, '');
              } else {
                let decoded = jwt.verify(tokenCitizen, config.secret);
                const userId = decoded.id;
                // Trường hợp token là pakn của chính người dân đã gửi pakn đó thì cho phép truy cập api để get ảnh
                if (requestInfo.citizen_id.toString().trim() === userId.toString().trim()) {
                  res.sendFile(path.join(process.cwd(), './uploads/images/' + imgNm));
                } else {
                  return res.status(401).json({ success: false, message: 'Bạn không có quyền truy cập!' });
                }
              }
            });
          }
        } catch (err) {
          return res.status(401).json({ success: false, message: 'Bạn không có quyền truy cập!' });
        }
      } else {
        return res.status(401).json({ success: false, message: 'Bạn không có quyền truy cập!' });
      }
    } else {
      const isImageAnswer = await Request.findOne({ images_public: imgNm }).lean();
      if (isImageAnswer) {
        return res.sendFile(path.join(process.cwd(), './uploads/images/' + imgNm));
      } else {
        return res.status(404).json({ success: false, message: 'Hình ảnh không tồn tại.' });
      }
    }
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
        return res.status(404).send('File không tồn tại!!!');
      } else if (err) {
        // Lỗi trong quá trình xóa file
        return res.status(500).send(err);
      } else {
        // Xóa file thành công
        return res.status(200).send('Xóa file thành công!!!');
      }
    });
  },

  async deleteImageByName(req, res) {
    let imgNm = req.params.imgNm;
    let filePath = path.join(process.cwd(), './uploads/images/' + imgNm);
    fs.unlink(filePath, function (err) {
      if (err && err.code == 'ENOENT') {
        // Ảnh không tồn tại
        return res.status(404).send('Ảnh không tồn tại!!!');
      } else if (err) {
        // Lỗi trong quá trình xóa ảnh
        return res.status(500).send(err);
      } else {
        // Xóa ảnh thành công
        return res.status(200).send('Xóa ảnh thành công!!!');
      }
    });
  },
};
