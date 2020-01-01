/**
 * @创建码农: pr
 * @创建日期: 2019-12-28 16:58:04
 * @最近更新: pr
 * @更新时间: 2019-12-28 16:58:04
 * @文件描述: 工具库
 */

const fs = require('fs');
const Promise = require('bluebird');

// access_token 读操作
exports.readFileAsync = (fpath, encoding) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fpath, encoding, function(err, content) {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
};

// access_token 写操作
exports.writeFileAsync = (fpath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fpath, content, function(err, content) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
