import { Base } from '../../resource/utils/base.js'
import { dateToStr } from '../../resource/utils/comment.js'
class MyPayInfo extends Base {
  constructor() {
    super()
  }
  getData(data, callback) {
    this.store({ type: 'GET_SEID' }, (seid) => {
      data.seid = seid
      var param = {
        url: `entry/wxapp/${data.url}`,
        data: data,
        sCallback: (res) => {
          let data = res.data.data
          data.forEach((v) => {
            v.status = 1
            v.createtime = this._handleTime(v.createtime)
          })
          callback && callback(res.data.data)
        }
      }
      this.request(param)
    })
  }
  _handleTime(data) {
    return dateToStr("yyyy-MM-dd HH:mm:ss", new Date(parseInt(data + '000')))
  }
}



export { MyPayInfo }