import { Base } from '../../../resource/utils/base.js'
import { handleTime } from '../../../resource/utils/comment.js'
let app = getApp()
class Index extends Base {
  constructor() {
    super();
    this.seid = ''
    this.id = ''
  }

  /*得到详情信息*/
  getDetailData(id,callback) {
    this.getSeid((seid) => {
      this.id = id
      var param = {
        url: 'entry/wxapp/GetInfoById',
        data: { id,seid},
        sCallback: (res) => {
          
            callback && callback(res.data.data)
        }
      }
      this.request(param)
    })
  }
  // 请求地址信息
  getLocationData(location, callback) {
    var param = {
      url: 'entry/wxapp/GetLaction',
      data: location,
      sCallback: (res) => {
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
  // 用户浏览量
  addviews(id, callback) {
    this.getSeid((seid) => {
      var param = {
        url: 'entry/wxapp/Addviews',
        data: { seid, message_id: id },
        sCallback: (res) => {
          callback && callback(res.data.data)
        }
      }
      this.request(param)
    })
  }
  // 用户转发量
  sendviews(id, callback) {
    this.getSeid((seid) => {
      var param = {
        url: 'entry/wxapp/DoSendInfo',
        data: { seid, info_id: id },
        sCallback: (res) => {
          callback && callback(res.data)
        }
      }
      this.request(param)
    })
  }
  // 用户转发量
  doZanInfo(id, callback) {
    this.getSeid((seid) => {
      var param = {
        url: 'entry/wxapp/DoZanInfo',
        data: { seid, info_id: id },
        sCallback: (res) => {
          callback && callback(res.data)
        }
      }
      this.request(param)
    })
  }

  getSeid(callback) {
    if (this.seid == '') {
      this.store({ type: 'GET_SEID' }, (data) => {
        this.seid = data
        callback(data)
      })
    } else {
      callback && callback(this.seid)
    }
  }
  // 请求/发送评论
  getCommentData(options, callback) {
    this.getSeid((seid) => {
      let data = {
        seid,
        id: options.id
      }
      if (options.type == 1) {
        data.type = 1
        data.info = options.comment
      }
      var param = {
        url: 'entry/wxapp/Comment',
        data,
        sCallback: (res) => {
          if (options.type == 1) {  // 为发送评论时
            wx.showToast({
              title: '消息发送成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            callback && callback(res.data.data)
          }
        }
      }
      this.request(param)
    })
  }
  // 评论发送
  sendComment(comment) {
    if (comment == '') {
      wx.showModal({
        title: '提示',
        content: '输入不能为空',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    }
    this.getCommentData({ id: this.id, type: 1, comment })
  }
  // 判断是否收藏
  isCollect(id, callback) {
    this.getSeid((seid) => {
      var param = {
        url: 'entry/wxapp/GetCollect',
        data: { seid, message_id: id },
        sCallback: (res) => {
          let flag = false
          if (res.data.data.info.length > 0) {
            flag = true
          }
          callback && callback(flag)
        }
      }
      this.request(param)
    })
  }
  // 收藏
  collect(callback) {
    let id = this.id
    this.getSeid((seid) => {
      var param = {
        url: 'entry/wxapp/ProCollect',
        data: { seid, message_id: id },
        sCallback: (res) => {
          callback && callback(res)
        }
      }
      this.request(param)
    })
  }
}

export { Index }