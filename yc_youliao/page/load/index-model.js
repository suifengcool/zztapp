import { Base } from '../../resource/utils/base.js'
import { getLocation, getUserInfo, getImageSocket } from '../../resource/utils/comment.js'
const app = getApp()

class Index extends Base {
  constructor() {
    super()
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

  getTownList(callback) {
    this.getSeid((seid) => {
      let data = {
        seid
      }
      var param = {
        url: 'entry/wxapp/GetArea',
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

