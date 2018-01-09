import { Base } from '../../resource/utils/base.js'
import { getLocation } from '../../resource/utils/comment.js'
class ModuleList extends Base {
  constructor() {
    super()
    this.location = null
    this.page = 1
    this.id = null
    this.data = null
    this.length = 10
  }
  // 请求模块信息
  getModuleData(options, callback) {
    this.store({ type: 'GET_SEID' }, (seid) => {
      console.log(seid)
    })
    if (options && options.id) {
      this.id = options.id
      this.page = 1
      this.length = options.LENGTH
    }
    let data = {
      id: this.id,
      page: this.page,
      num: this.length
    }
    getLocation((location) => {
      if (location) {
        data.lat = location.latitude
        data.lng = location.longitude
      }
      this._requestModule(data, callback)
    })
  }
  _requestModule(data, callback) {
    console.log(data)
    var param = {
      url: 'entry/wxapp/GetModuleById',
      data: data,
      sCallback: (res) => {
        console.log(res)
        this.page++
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
}



export { ModuleList }