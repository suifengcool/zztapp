import { Base } from '../../resource/utils/base.js'
class Pay extends Base {
  constructor() {
    super()
    this.seid = null
  }
  // 请求模块信息
  pay(options, callback) {
    this.getSeid((seid) => {
      this._requestPayData({
        seid: seid,
        ordersn: options.ordersn,
        sum: options.needpay,
        ptype: "pay"
      },(data) => {
        console.log(data)
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': 'MD5',
          'paySign': data.paySign,
          'success': function (res) {
            wx.switchTab({
              url: '/yc_youliao/page/my/my'
            })
          },
          'fail': function (res) {
            wx.switchTab({
              url: '/yc_youliao/page/my/my'
            })
          }
        })
      })
    })
  }
  getSeid (callback) {
    if (this.seid) {
      callback(this.seid)
    } else {
      this.store({ type: 'GET_SEID' }, (seid) => {
        this.seid = seid
        callback(seid)
      })
    }
  }
  _requestPayData(data, callback) {
    var param = {
      url: 'entry/wxapp/pay',
      data: data,
      sCallback: (res) => {
        console.log(res)
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
  GetInfoOdersn (id,callback) {
    this.getSeid((seid) => {
      console.log({ seid, message_id: id })
      var param = {
        url: 'entry/wxapp/GetInfoOdersn',
        data: { seid, message_id: id },
        sCallback: (res) => {
          callback && callback(res.data.data)
        }
      }
      this.request(param)
    })
  }
}



export { Pay }