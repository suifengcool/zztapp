import { Base } from '../../resource/utils/base.js'
let app = getApp()
class Apply extends Base {
  constructor() {
    super();
  }
  /*得到表单信息*/
  getFieldsData(id, callback) {
    var param = {
      url: 'entry/wxapp/fields',
      data: { id },
      sCallback: (res) => {
        console.log(res)
        this._handleRes(res.data.data, callback)
      }
    }
    this.request(param)
  }
  // 多选处理数组
  _handleRes(res, callback) {     
    res.forEach((v) => {
      if (v.mtype == 'checkbox') {
        v.mtypeconarr = v.mtypeconarr.map((x) => {
          return {
            name: x,
            value: x
          }
        })
      }
    })
    callback && callback(res)
  }
  // 请求地址
  getDetailLocation(nowLocation, callback) {
    console.log(nowLocation)
    var param = {
      url: 'entry/wxapp/GetLaction',
      data: nowLocation,
      sCallback: function (res) {
        console.log(res)
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
  submit(form, callback) {
    var param = {
      url: 'entry/wxapp/AddInfo',
      data: form,
      type: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      sCallback: function (res) {
        if (res.data.data.error == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.data.message,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          return
        }
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
  handleSubmitData(data) {
    let newUrl = ''
    for(let i in data) {
      if (typeof data[i] == 'object') {
        for(let x in data[i]){
          newUrl += '&' + i + '[]' + '=' + data[i][x]
        }
      } else {
        newUrl += '&' + i + '=' +data[i]
      }
    }
    if (app.sq_acid) {
      newUrl += '&' + 'sq_acid' + '=' + app.sq_acid
    }
    return newUrl.slice(1)
  }
  getSeid(callback) {
    this.store({ type: 'GET_SEID' }, (seid) => {
      callback(seid)
    })
  }
}



export { Apply }