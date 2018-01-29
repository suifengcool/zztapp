import { Base } from '../../../resource/utils/base.js'
import { handleTime } from '../../../resource/utils/comment.js'
let app = getApp()
class Index extends Base {
  constructor() {
    super();
    this.seid = ''
    this.id = ''
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
  getCouponList(callback) {
    this.getSeid((seid) => {
      let data = {
        seid
      }
      var param = {
        url: 'entry/wxapp/TicketReceiveList',
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