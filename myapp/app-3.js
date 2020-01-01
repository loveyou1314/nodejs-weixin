/**
 * @创建码农: pr
 * @创建日期: 2019-12-28 19:47:02
 * @最近更新: pr
 * @更新时间: 2019-12-28 19:47:02
 * @文件描述: 启动项文件，版本三
 */
const Koa = require('koa');
const path = require('path');
const util = require('./app-3/util');
const weChatMiddleWare = require('./app-3/weChat');
const wechat_file = path.join(__dirname, './app-3/config/access-token.txt');

// 配置文件
const config = {
  wechat: {
    appID: 'wxb284d7a53fa2da16',
    appSecret: '24af419d8f6c997b5582fd46eafb377c',
    token: 'ruizhengyunpr840690384',
    getAccessToken: () => {
      return util.readFileAsync(wechat_file);
    },
    saveAccessToken: data => {
      data = JSON.stringify(data);
      return util.writeFileAsync(wechat_file, data);
    }
  }
};
const PORT = 1989;
const app = new Koa();

// 中间件
app.use(weChatMiddleWare(config.wechat));

app.listen(PORT);
console.log(`正在监听：${PORT}`);
