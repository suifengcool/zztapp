import { Base } from '../../resource/utils/base.js'
import { ShopStore } from '../shopStore/shopStore-model.js'
var shopStore = new ShopStore()
class Goods extends Base {
  constructor() {
    super()
  }
  // 得到商品详情
  getData(data, callback) {
    var param = {
      url: 'entry/wxapp/getGood',
      data,
      sCallback: (res) => {
        console.log(res)
        res.data.data.inco = JSON.parse(res.data.data.inco)
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
  getStoreInfo(id, callback) {
    wx.getStorage({
      key: 'storeInfo',
      success: function (res) {
        callback && callback(res.data)
      },
      fail(err) {
        shopStore.getData(id,callback)
      }
    })
  }
  getCredit(callback) {
    this.store({type: "GET_CREDIT"}, callback)
  }
}

export { Goods }