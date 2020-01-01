/**
 * @创建码农: pr
 * @创建日期: 2019-12-28 19:47:02
 * @最近更新: pr
 * @更新时间: 2019-12-28 19:47:02
 * @文件描述: 公众号校验中间件
 */

// 依赖包引入
const sha1 = require('sha1');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

// 参数定义
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
  accessToken: `${prefix}token?grant_type=client_credential`
};

// 判断 access_token 是否过期
function AccessTokenInfo(opts) {
  const that = this;
  this.appID = opts.appID;
  this.appSecret = opts.appSecret;
  this.getAccessToken = opts.getAccessToken;
  this.saveAccessToken = opts.saveAccessToken;

  that
    .getAccessToken()
    .then(function(data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // 不合法就重新更新 access_token
        return that.updateAccessToken();
      }

      if (that.isValidAccessToken(data)) {
        //判断是否有效
        // Promise.resolve(data);
        // 取到合法 access_token
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;
        that.saveAccessToken(data);
      } else {
        // 不合法就重新更新 access_token
        return that.updateAccessToken();
      }
    })
    // .then(function(data) {});
}

// 验证 access_token 是否有效
AccessTokenInfo.prototype.isValidAccessToken = function(data) {
  if (!data || !data.access_token || !data.expires_in) {
    return false;
  }

  const now = new Date().getTime();
  if (now < data.expires_in) {
    return true;
  }
  return false;
};

// 更新 access_token
AccessTokenInfo.prototype.updateAccessToken = function() {
  const url = `${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`;
  return new Promise((resolve, reject) => {
    request({
      url,
      json: true
    }).then(res => {
      const data = res.body;
      const now = new Date().getTime();

      // 缩短 20 秒（算上网络请求时间）
      const expires_in = now + (data.expires_in - 20) * 1000;

      data.expires_in = expires_in;
      resolve(data);
    });
  });
};

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

    if (sha === signature) {
      this.body = echostr + '';
    } else {
      this.body = 'wrong';
    }
  };
};
