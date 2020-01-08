/**
 * @创建码农: pr
 * @创建日期: 2019-12-27 19:47:02
 * @最近更新: pr
 * @更新时间: 2019-12-27 19:47:02
 * @文件描述: 公众号校验中间件
 */

const sha1 = require('sha1');

// 中间件
module.exports = function(opts) {
  return function*(next) {
    console.log('query', this.query);

    const token = opts.token;
    const signature = this.query.signature;
    const nonce = this.query.nonce;
    const timestamp = this.query.timestamp;
    const echostr = this.query.echostr;
    const str = [token, timestamp, nonce].sort().join('');
    const sha = sha1(str);

    if (sha === signature) {
      console.log('来源于微信');
      this.body = echostr + '';
    } else {
      console.log('不是来源于微信');
      this.body = '不是来源于微信';
    }
  };
};
