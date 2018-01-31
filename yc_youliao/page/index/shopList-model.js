import { Base } from '../../resource/utils/base.js'
class ShopList extends Base {
  constructor() {
    super()
  }

  // 获取分类
  getGetCateData(callback) {
    var param = {
      url: 'entry/wxapp/GetCate',
      sCallback: (res) => {
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }

  // 获取店铺列表
  getPageData(data, callback) {
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