// 参数定义
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
  accessToken: `${prefix}token?grant_type=client_credential`,
  temporary: {
    upload: `${prefix}media/upload?`, // 新增临时素材
    fetch: `${prefix}media/get?` // 获取临时素材
  },
  permanent: {
    upload: `${prefix}material/add_material?`, // 新增永久素材
    fetch: `${prefix}material/get_material?`, // 获取永久素材
    batch: `${prefix}material/batchget_material?`, // 获取素材列表
    fetchCount: `${prefix}material/get_materialcount?`, // 获取素材总数
    del: `${prefix}material/del_material?`, // 删除永久素材
    update: `${prefix}material/update_news?`, // 更新永久素材
    uploadNews: `${prefix}material/add_news?`, // 新增永久图文素材
    uploadimg: `${prefix}media/uploadimg` // 图文消息
  }
};

exports = module.exports = {
  prefix,
  api
};
