import { Base } from '../../resource/utils/base.js'
class ShopList extends Base {
  constructor() {
    super()
  }
  getGetCateData(callback) {
    var param = {
      url: 'entry/wxapp/GetCate',
      sCallback: (res) => {
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }

  // 得到页面信息
  getPageData(data, callback) {
    console.log('data:',data)
    var param = {
      url: 'entry/wxapp/GetShopList',
      data,
      sCallback: (res) => {
        this._handleData(res.data.data)
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
  _handleData(data) {
    data.forEach((v) => {
      if(v.dp) {
        v.dp = Number(v.dp)
        v.dp = v.dp.toFixed(1)
        v.dpVal = parseInt(v.dp)
      }
    })
  }
}



export { ShopList }