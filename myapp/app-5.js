/**
 * @创建码农: pr
 * @创建日期: 2019-12-30 9:20:27
 * @最近更新: pr
 * @更新时间: 2019-12-30 9:20:27
 * @文件描述: 启动项文件
 */
const Koa = require('koa');
const weChatMiddleWare = require('./app-5/middleWare/weChat');
const config = require('./app-5/config/default.config');
const weixin = require('./app-5/util/weixin');

const app = new Koa();

// 中间件
app.use(weChatMiddleWare(config.wechat, weixin.messageReply));

app.listen(config.PORT);
console.log(`正在监听：${config.PORT}`);
