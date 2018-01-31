import { Base } from '../../resource/utils/base.js'
import { getLocation, getUserInfo } from '../../resource/utils/comment.js'
const app = getApp()
class Index extends Base {
  constructor() {
    super()
  }

  // 获取首页信息
  getIndexData(callback) {
    this._indexGetLocation((location) => {
      let data = {}
      if (location) {
        data.lat = location.latitude
        data.lng = location.longitude
      }
      app.util.getUserInfo((userInfo) => {
        if (userInfo.memberInfo.uid) {
          data.uid = userInfo.memberInfo.uid
        }
        var param = {
          url: 'entry/wxapp/index',
          data,
          sCallback: (res) => {
            wx.setStorage({
              key: "index",
              data: res
            })
            callback && callback(res.data.data)
          }
        }
        this.request(param)
      })
    })
  }

  // 获取经纬度信息
  _indexGetLocation(callback) {
    getLocation(false, (res) => {
      callback(res)
    })
  }
}

export { Index }