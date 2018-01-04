import { Base } from '../../resource/utils/base.js'
import { Goods } from '../goods/goods-model.js'
var goods = new Goods()
class Order extends Base {
  constructor() {
    super()
  }
  // 得到商品详情
  getGoodsData(good_id,callback) {
    wx.getStorage({
      key: 'goodsInfo',
      success: function (res) {
        callback && callback(res.data)
      },
      fail: function () {
        goods.getData(good_id, (data) =>{
          callback && callback(data)
        })
      }
    })
  }
}



export { Order }