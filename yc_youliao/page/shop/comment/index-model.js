import { Base } from '../../../resource/utils/base.js'
import { handleTime } from '../../../resource/utils/comment.js'
let app = getApp()
class Index extends Base {
  constructor() {
    super();
    this.seid = ''
    this.id = ''
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
  sendComment(options, callback) {
    this.getSeid((seid) => {
      let data = {
        seid,
        id: options.id,
        dp: options.dp,
        info: options.info
      }
        data.type = 1
      var param = {
        url: 'entry/wxapp/ShopComment',
        data,
        sCallback: (res) => {
          callback && callback(res.data)
        }
      }
      this.request(param)
    })
  }
}

export { Index }