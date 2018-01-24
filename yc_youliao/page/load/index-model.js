import { Base } from '../../resource/utils/base.js'
import { getLocation, getUserInfo, getImageSocket } from '../../resource/utils/comment.js'
const app = getApp()
class Index extends Base {
  constructor() {
    super()
  }
  /*得到首页信息*/
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

    getTownList(callback){
        let data = [{
            logo: '',
            text: '梅江镇',
            id: 1
        },{
            logo: '',
            text: '黄石镇',
            id: 2
        },{
            logo: '',
            text: '青塘镇',
            id: 3
        },{
            logo: '',
            text: '固村镇',
            id: 4
        },{
            logo: '',
            text: '田头镇',
            id: 5
        },{
            logo: '',
            text: '黄陂镇',
            id: 6
        },{
            logo: '',
            text: '石上镇',
            id: 7
        },{
            logo: '',
            text: '东山坝镇',
            id: 8
        },{
            logo: '',
            text: '赖村镇',
            id: 9
        },{
            logo: '',
            text: '小布镇',
            id: 10
        },{
            logo: '',
            text: '洛口镇',
            id: 11
        },{
            logo: '',
            text: '长胜镇',
            id: 12
        }]
        callback && callback(data)
        // var param = {
        //   url: 'entry/wxapp/index',
        //   data,
        //   sCallback: (res) => {
        //     wx.setStorage({
        //       key: "index",
        //       data: res
        //     })
        //     callback && callback(res.data.data)
        //   }
        // }
        // this.request(param)
    }

  // 请求图片socket
  getAttachurl(callback) {
    getImageSocket((data) => {
      console.log(data)
      callback(data)
    })
  }
  // 获取用户信息
  indexGetUserInfo() {
    // getUserInfo(true, (res) => {
      // console.log(res)
    // })
  }
  // 获取经纬度信息
  _indexGetLocation(callback) {
    getLocation(false, (res) => {
      callback(res)
    })
  }
  // 签到
  checkIn(callback) {
    app.util.getUserInfo((userInfo) => {
      var param = {
        url: 'entry/wxapp/Qiandao',
        data: { uid: userInfo.memberInfo.uid },
        sCallback: (res) => {
          callback(res.data.data)
        }
      }
      this.request(param)
    })
  }

}



export { Index }

