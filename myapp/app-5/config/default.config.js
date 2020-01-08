/**
 * @创建码农: pr
 * @创建日期: 2019-12-30 13:14:03
 * @最近更新: pr
 * @更新时间: 2019-12-30 13:14:03
 * @文件描述: 默认配置
 */

const path = require('path');
const util = require('../util');
const wechat_file = path.join(__dirname, './access-token.txt');

// 配置文件
const config = {
  wechat: {
    appID: 'wxb284d7a53fa2da16',
    appSecret: '24af419d8f6c997b5582fd46eafb377c',
    token: 'ruizhengyunpr840690384',
    getAccessToken: () => {
      // 读取文件
      return util.readFileAsync(wechat_file);
    },
    saveAccessToken: data => {
      // 写入文件
      return util.writeFileAsync(wechat_file, JSON.stringify(data));
    }
  },
  PORT: 1989
};

module.exports = config;
