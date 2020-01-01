/**
 * @创建码农: pr
 * @创建日期: 2019-12-29 19:47:02
 * @最近更新: pr
 * @更新时间: 2019-12-29 19:47:02
 * @文件描述: 启动项文件，版本四
 */
const Koa = require('koa');
const path = require('path');
const fileAsync = require('./app-4/util/fileAsync');
const weChatMiddleWare = require('./app-4/middleWare/weChat');
const wechat_file = path.join(__dirname, './app-4/config/access-token.txt');

// 配置文件
const config = {
  wechat: {
    appID: 'wxb284d7a53fa2da16',
    appSecret: '24af419d8f6c997b5582fd46eafb377c',
    token: 'ruizhengyunpr840690384',
    getAccessToken: () => {
      // 读取文件
      return fileAsync.readFileAsync(wechat_file);
    },
    saveAccessToken: data => {
      // 写入文件
      return fileAsync.writeFileAsync(wechat_file, JSON.stringify(data));
    }
  }
};
const PORT = 1989;
const app = new Koa();

// 中间件
app.use(weChatMiddleWare(config.wechat));

app.listen(PORT);
console.log(`正在监听：${PORT}`);
