/**
 * @创建码农: pr
 * @创建日期: 2019-12-30 10:18:31
 * @最近更新: pr
 * @更新时间: 2019-12-30 10:18:31
 * @文件描述: 被动回复用户消息
 * https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Passive_user_reply_message.html
 */
const ejs = require('ejs');
const heredoc = require('heredoc');

const tpl = heredoc(function() {
  /*
  <xml>
    <%# 开发者微信号 %>
    <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
    <%# 发送方帐号，一个 OpenId %>
    <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
    <%# 消息创建时间（整型）%>
    <CreateTime><%= createTime %></CreateTime>
    <%# 消息类型 %>
    <MsgType><![CDATA[<%= msgType %>]]></MsgType>
    <% if (msgType === 'text') { %>
    <%# 文本消息%>
    <Content><![CDATA[<%= content %>]]></Content>
    <% } else if (msgType === 'image') { %>
    <%# 图片消息%>
    <Image>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
    </Image>
    <% } else if (msgType === 'voice') { %>
    <%# 语音消息%>
    <Voice>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
    </Voice>
    <% } else if (msgType === 'video') { %>
    <%# 视频消息%>
    <Video>
      <MediaId><![CDATA[<%= content.mediaId%>]></MediaId>
      <Title><![CDATA[<%= content.title%>]]></Title>
      <Description><![CDATA[<%= content.description%>]]></Description>
    </Video>
    <% } else if (msgType === 'music') { %>
    <%# 音乐消息%>
    <Music>
      <Title><![CDATA[<%= content.title %>]]></Title>
      <Description><![CDATA[<%= content.description %>]]></Description>
      <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
      <HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
    </Music>
    <% } else if (msgType === 'news') { %>
    <%# 图文消息%>
    <ArticleCount><%= content.length %></ArticleCount>
      <Articles>
      <% content.forEach(function(item){ %>
        <item>
          <Title><![CDATA[<%= item.title %>]]></Title>
          <Description><![CDATA[<%= item.description %>]]></Description>
          <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
          <Url><![CDATA[<%= item.url %>]]></Url>
        </item>
      <% }) %>
    </Articles>
    <% } %>
  </xml>
*/
});

const compiled = ejs.compile(tpl);
exports = module.exports = {
  compiled: compiled
};
