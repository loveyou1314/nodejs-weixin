/**
 * @创建码农: pr
 * @创建日期: 2019-12-29 19:47:02
 * @最近更新: pr
 * @更新时间: 2019-12-29 19:47:02
 * @文件描述: 公众号校验中间件
 */

// 依赖包引入
const sha1 = require('sha1');
const rawBody = require('raw-body');
const fileAsync = require('../util/fileAsync');
const AccessTokenInfo = require('../util/AccessTokenInfo');

// 中间件
module.exports = function(opts) {
  const accessTokenInfo = new AccessTokenInfo(opts);

  return function*(next) {
    console.log('query', this.query);

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
      console.log('不是来源于微信');
      this.body = '不是来源于微信';
      return false;
    }
    if (this.method === 'GET') {
      console.log('来源于微信');
      this.body = echostr + '';
    } else if (this.method === 'POST') {
      // 依赖包 raw-body 可以把 this 上的 request 对象（http 模块中的 request 对象），拼写它的数据，最终拿到一个 buffer 的 XML
      const data = yield rawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      });

      const content = yield fileAsync.parseXMLAsync(data);
      const message = fileAsync.formatMessage(content.xml);
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          const now = new Date().getTime();
          this.status = 200;
          this.type = 'application/xml';
          // 文本模板，后面可以把这块业务抽离处理
          this.body = `<xml>
            <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
            <CreateTime>${now}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${`你好，${message.FromUserName}，欢迎来到本公众号。`}]]></Content>
            <MsgId>1234567890123456</MsgId>
          </xml>`;
          console.log('xml', this.body);
          return;
        }
      }
    }
  };
};
