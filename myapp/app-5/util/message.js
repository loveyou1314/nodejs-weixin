/**
 * @创建码农: pr
 * @创建日期: 2019-12-30 13:20:26
 * @最近更新: pr
 * @更新时间: 2019-12-30 13:20:26
 * @文件描述: 消息模块
 */
const config = require('../config/default.config');
const WeixinApi = require('./WeixinApi');
const weixinApi = new WeixinApi(config.wechat);

exports.reply = function*(next) {
  const message = this.weixin;

  // 事件推送
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log(`扫描二维码， ${message.EventKey}${message.ticket}`);
      }
      console.log(`cli：你订阅了`);
      this.body = '你订阅了';
    } else if (message.Event === 'unsubscribe') {
      console.log('cli：残忍无情，关闭订阅');
      this.body = '残忍无情，关闭订阅';
    } else if (message.Event === 'LOCATION') {
      this.body = `位置${message.Latiude}/${message.Longitude}-${message.Precision}`;
    } else if (message.Event === 'CLICK') {
      this.body = `你点击了菜单${message.EventKey}`;
    } else if (message.Event === 'SCAN') {
      console.log(`关注后扫描二维码${message.EventKey}${message.Ticket}`);
      this.body = '看到你扫描二维码了';
    } else if (message.Event === 'VIEW') {
      this.body = `你点击了链接${message.EventKey}`;
    }
  } else if (message.MsgType === 'text') {
    const content = message.Content;
    let reply = `${message.Content}`;
    if (content === '文本') {
      reply = `hi，${message.Content}\r\n我是文本，今天开心么？`;
    } else if (content === '图片') {
      const data = yield weixinApi.uploadMaterial(
        'image',
        __dirname + '/assets/ngrok.png'
      );
      reply = {
        type: 'image',
        mediaId: data.media_id
      };
    } else if (content === '图文') {
      reply = [
        {
          title: '图文消息：8年前端开发的知识点沉淀',
          description: '不知道会多少字，一直写下去吧...',
          picUrl:
            'https://user-gold-cdn.xitu.io/2019/6/18/16b69e96f212aaeb?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1',
          url: 'https://juejin.im/post/5d0878aaf265da1b83338f74'
        },
        {
          title: '图文消息：Nodejs 开发微信公众号',
          description:
            '本小书通过观看 scoot 视频课程《Node.js7天开发微信公众号》，经过学习并结合感受写下的，希望对正在学习这块知识的你能有所帮助。如果你也收益多多，请 --> star <--。若是有建议或文中有误部分请轻喷。',
          picUrl:
            'https://user-gold-cdn.xitu.io/2019/6/18/16b69e96f212aaeb?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1',
          url: 'https://juejin.im/post/5e0c686ef265da5d0c541e74'
        }
      ];
    } else if (content === '图片图文') {
      const imageData = yield weixinApi.uploadMaterial(
        'image',
        __dirname + '/assets/ngrok.png',
        {}
      );

      // 拼接图文
      const mediaParam = {
        articles: [
          {
            title: '图文1',
            thumb_media_id: imageData.media_id,
            author: 'pr',
            digest: '这是摘要',
            show_cover_pic: 1,
            content: '这是内容',
            content_source_url: 'https://github.com/'
          }
        ]
      };

      // 上传永久图文
      const mediaData = yield weixinApi.uploadMaterial('news', mediaParam, {});

      const data = yield weixinApi.fetchMaterial(
        'news',
        mediaData.media_id,
        {}
      );

      //
      const tmpArr = [];
      Array.isArray(data.news_item) &&
        data.news_item.length &&
        data.news_item.forEach(item => {
          tmpArr.push({
            title: item.title,
            description: item.digest,
            picUrl: imageData.url,
            url: item.url
          });
        });

      reply = tmpArr;
    } else if (content === '语音') {
      reply = `hi，我是语音，今天开心么？`;
    } else if (content === '视频') {
      const data = yield weixinApi.uploadMaterial(
        'video',
        __dirname + '/assets/video.mp4'
      );
      reply = {
        type: 'video',
        title: '小乌龟',
        description: '某天在水果店看到一只向上爬的小乌龟',
        mediaId: data.media_id
      };
    } else if (content === '视频') {
      const data = yield weixinApi.uploadMaterial(
        'video',
        __dirname + '/assets/video.mp4',
        {
          type: 'video',
          description: '{"title": "山海经", "introduction": "山海经描述"}'
        }
      );
      reply = {
        type: 'video',
        title: '小乌龟',
        description: '某天在水果店看到一只向上爬的小乌龟',
        mediaId: data.media_id
      };
    } else if (content === '音乐') {
      const data = yield weixinApi.uploadMaterial(
        'image',
        __dirname + '/assets/ngrok.png'
      );
      reply = {
        type: 'music',
        title: '睡前音乐',
        description: '准备入睡',
        musicUrl: 'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
        thumbMediaId: data.media_id
      };
    } else if (content === '素材总数') {
      // 素材总数
      const counts = yield weixinApi.fetchCountMaterial();
      console.log('素材总数', JSON.stringify(counts));
      if (counts.errcode) {
        reply = counts.errmsg;
      } else {
        reply = `音频${counts.voice_count}\r\n视频${counts.video_count}\r\n图片${counts.image_count}\r\n图文${counts.news_count}`;
      }
    } else if (content === '素材列表') {
      // 素材列表
      const imageList = yield weixinApi.batchMaterial('image', 0, 20);
      const newsList = yield weixinApi.batchMaterial('news', 0, 20);
      const voiceList = yield weixinApi.batchMaterial('voice', 0, 20);
      const videoList = yield weixinApi.batchMaterial('video', 0, 20);
      // const list = yield [
      //   (weixinApi.batchMaterial('image', 0, 20),
      //   weixinApi.batchMaterial('news', 0, 20),
      //   weixinApi.batchMaterial('voice', 0, 20),
      //   weixinApi.batchMaterial('video', 0, 20))
      // ];
      console.log('图片素材列表', imageList);
      console.log('图文素材列表', newsList);
      console.log('音频素材列表', voiceList);
      console.log('视频素材列表', videoList);

      let imageReply = '';
      if (imageList.errocde) {
        imageReply = imageList.errmsg;
      }
      let newsReply = '';
      if (newsList.errocde) {
        newsReply = newsList.errmsg;
      }
      let voiceReply = '';
      if (voiceList.errocde) {
        voiceReply = voiceList.errmsg;
      }
      let videoReply = '';
      if (videoList.errocde) {
        videoReply = videoList.errmsg;
      }
      reply = `${imageReply}\r\n${newsReply}\r\n${voiceReply}\r\n${videoReply}`;
    }
    this.body = reply;
  }

  yield next;
};
