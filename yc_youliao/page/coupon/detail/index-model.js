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

  getCouponDetail(options,callback) {
    this.getSeid((seid) => {
      let data = {
        seid,
        rid: options.id
      }
      var param = {
        url: 'entry/wxapp/TicketReceive',
        data,
        sCallback: (res) => {
          callback && callback(res.data)
        }
      }
      this.request(param)
    })
  }

  confirmCoupon(options,callback) {
    this.getSeid((seid) => {
      let data = {
        seid,
        rid: options.id
      }
      var param = {
        url: 'entry/wxapp/UseTicketReceive',
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