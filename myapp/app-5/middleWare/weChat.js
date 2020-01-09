/**
 * @创建码农: pr
 * @创建日期: 2019-12-30 9:20:27
 * @最近更新: pr
 * @更新时间: 2019-12-30 9:20:27
 * @文件描述: 公众号校验中间件
 */

// 依赖包引入
const sha1 = require('sha1');
const rawBody = require('raw-body');
const util = require('../util');
const WeixinApi = require('../util/WeixinApi');

// 中间件
module.exports = function(opts, handler) {
  const weixinApi = new WeixinApi(opts);

  return function*(next) {
    const token = opts.token;
    const signature = this.query.signature;
    const nonce = this.query.nonce;
    const timestamp = this.query.timestamp;
    const echostr = this.query.echostr;
    const str = [token, timestamp, nonce].sort().join('');
    const sha = sha1(str);

    /**
     * GET 验证开发者身份
     * POST
     */
    if (sha !== signature) {
      this.body = '❌';
      return false;
    }
    if (this.method === 'GET') {
      this.body = echostr + '';
    } else if (this.method === 'POST') {
      // 依赖包 raw-body 可以把 this 上的 request 对象（http 模块中的 request 对象），拼写它的数据，最终拿到一个 buffer 的 XML
      const data = yield rawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      });

      const content = yield util.parseXMLAsync(data);

      // 获取消息后，将控制权交给业务
      this.weixin = util.formatMessage(content.xml);

      // 处理消息
      yield handler.call(this, next);

      weixinApi.reply.call(this);
    }
  };
};
