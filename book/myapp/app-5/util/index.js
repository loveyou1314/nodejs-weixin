/**
 * @创建码农: pr
 * @创建日期: 2019-12-30 16:58:04
 * @最近更新: pr
 * @更新时间: 2019-12-30 16:58:04
 * @文件描述: 工具库
 */

const fs = require('fs');
const Promise = require('bluebird');
const xml2js = require('xml2js');
const temple = require('./temple');

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

// 格式化 xml 消息
function formatMessage(data) {
  const message = {};
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const item = data[key];
      const len = item.length;
      if (!(item instanceof Array) || len === 0) {
        continue;
      }

      if (len === 1) {
        const value = item[0];
        if (typeof value === 'object') {
          message[key] = formatMessage(value);
        } else {
          message[key] = (value || '').trim();
        }
      } else {
        message[key] = [];
        for (let i = 0; i < len; i++) {
          message[key].push(formatMessage(item[i]));
        }
      }
    }
  }
  return message;
}

exports.formatMessage = formatMessage;

exports.parseXMLAsync = function(xml) {
  return new Promise(function(resolve, reject) {
    xml2js.parseString(xml, { trim: true }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// 消息模板处理
exports.tpl = function(content, message) {
  console.log('消息模板处理 content：', content);
  console.log('消息模板处理 message：', message);
  let type = content.type || 'text';
  if (type === 'text' && Array.isArray(content)) {
    type = 'news';
  }

  return temple.compiled({
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
    createTime: new Date().getTime(),
    msgType: type,
    content
  });
};
