/**
 * @创建码农: pr
 * @创建日期: 2019-12-30 9:20:27
 * @最近更新: pr
 * @更新时间: 2019-12-30 9:20:27
 * @文件描述: 公众号校验中间件
 */

// 依赖包引入
const fs = require('fs');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const { api } = require('./constant');
const util = require('./index');

// 判断 access_token 是否过期
function AccessTokenInfo(opts) {
  this.appID = opts.appID;
  this.appSecret = opts.appSecret;
  this.getAccessToken = opts.getAccessToken;
  this.saveAccessToken = opts.saveAccessToken;
  this.fetchAccessToken();
}

// 获取 access_token，返回一个标准的 promise
AccessTokenInfo.prototype.fetchAccessToken = function() {
  const that = this;
  if (this.access_token && this.expires_in) {
    if (this.isValidAccessToken(this)) {
      return Promise.resolve(this);
    }
  }

  this.getAccessToken()
    .then(function(data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // 不合法就重新更新 access_token
        return that.updateAccessToken();
      }

      if (that.isValidAccessToken(data)) {
        //判断是否有效
        return Promise.resolve(data);
      } else {
        // 不合法就重新更新 access_token
        return that.updateAccessToken();
      }
    })
    .then(function(data) {
      // 取到合法 access_token
      that.access_token = data.access_token;
      that.expires_in = data.expires_in;
      that.saveAccessToken(data);

      return Promise.resolve(data);
    });
};

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

// 消息回复
AccessTokenInfo.prototype.reply = function() {
  const xml = util.tpl(this.body, this.weixin);
  this.status = 200;
  this.type = 'application/xml';

  console.log('xml 内容格式：', xml);
  this.body = xml;
  return;
};

// 上传文件
AccessTokenInfo.prototype.uploadMaterial = function(type, material, permanent) {
  console.log('正在上传', type, material, permanent);
  const that = this;
  let formData = {};
  let uploadUrl = api.temporary.upload;
  // 如果是永久的
  if (permanent) {
    uploadUrl = api.permanent.upload;
    formData = { ...formData, ...permanent };
  }

  if (type === 'pic') {
    uploadUrl = api.permanent.uploadimg;
  }

  if (type === 'news') {
    uploadUrl = api.permanent.uploadNews;
    // 图文是个数组，即
    formData = material;
  } else {
    formData = {
      ...formData,
      media: fs.createReadStream(material) // 创建可读流
    };
  }

  return new Promise((resolve, reject) => {
    that.fetchAccessToken().then(data => {
      let url = `${uploadUrl}access_token=${data.access_token}`;
      if (!permanent) {
        url = `${url}&TYPE=${type}`;
      } else {
        formData = {
          ...formData,
          access_token: data.access_token
        };
      }

      // options
      const options = {
        url: url,
        method: 'POST',
        json: true
      };

      // 判断是否是图文
      if (type === 'news') {
        options.body = formData;
      } else {
        options.formData = formData;
      }

      request(options)
        .then(res => {
          if (res.body) {
            resolve(res.body);
          } else {
            throw new Error('上传文件失败');
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

// 获取素材
AccessTokenInfo.prototype.fetchMaterial = function(type, mediaId, permanent) {
  let fetchUrl = api.temporary.fetch;
  if (permanent) {
    fetchUrl = api.permanent.fetch;
  }

  return new Promise((resolve, reject) => {
    this.fetchAccessToken().then(data => {
      let url = `${fetchUrl}access_token=${data.access_token}`;
      let options = {
        method: 'POST',
        url,
        json: true
      };

      if (permanent) {
        options = {
          ...options,
          body: {
            media_id: mediaId,
            access_token: data.access_token
          }
        };
      } else {
        url = `${url}&media_id=${mediaId}`;
        if (type === 'video') {
          url = url.replace('https://', 'http');
        }
      }

      if (['news', 'video'].indexOf(type) > -1) {
        request(options)
          .then(res => {
            if (res.body) {
              resolve(res.body);
            } else {
              throw new Error('获取素材失败');
            }
          })
          .catch(err => {
            reject(err);
          });
      } else {
        resolve(url);
      }
    });
  });
};

// 删除素材
AccessTokenInfo.prototype.delMaterial = function(mediaId) {
  let delUrl = api.temporary.del;
  const formData = {
    media_id: mediaId
  };

  return new Promise((resolve, reject) => {
    this.fetchAccessToken().then(data => {
      let url = `${delUrl}access_token=${data.access_token}&media_id=${mediaId}`;
      request({
        method: 'POST',
        url,
        body: formData,
        json: true
      })
        .then(res => {
          if (res.body) {
            resolve(res.body);
          } else {
            throw new Error('删除素材失败');
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

// 更新素材
AccessTokenInfo.prototype.updateMaterial = function(mediaId, material) {
  return new Promise((resolve, reject) => {
    this.fetchAccessToken().then(data => {
      let url = `${api.temporary.update}access_token=${data.access_token}&media_id=${mediaId}`;
      request({
        method: 'POST',
        url,
        body: {
          media_id: mediaId,
          ...material
        },
        json: true
      })
        .then(res => {
          if (res.body) {
            resolve(res.body);
          } else {
            throw new Error('更新素材失败');
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

// 获取素材列表
AccessTokenInfo.prototype.batchMaterial = function(
  type = 'image',
  offset = 0,
  count = 1
) {
  return new Promise((resolve, reject) => {
    this.fetchAccessToken().then(data => {
      let url = `${api.permanent.batch}access_token=${data.access_token}`;
      request({
        method: 'POST',
        url,
        body: {
          type,
          offset,
          count
        },
        json: true
      })
        .then(res => {
          if (res.body) {
            resolve(res.body);
          } else {
            throw new Error('获取素材列表失败');
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

// 获取素材总数
AccessTokenInfo.prototype.fetchCountMaterial = function() {
  return new Promise((resolve, reject) => {
    this.fetchAccessToken().then(data => {
      let url = `${api.permanent.fetchCount}access_token=${data.access_token}`;
      request({
        method: 'GET',
        url,
        json: true
      })
        .then(res => {
          if (res.body) {
            resolve(res.body);
          } else {
            throw new Error('获取素材总数失败');
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

module.exports = AccessTokenInfo;
