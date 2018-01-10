import { Base } from '../../../resource/utils/base.js'
import { Apply } from '../../apply/apply-model.js'
const apply = new Apply()
const app = getApp()
import { dateToStr } from '../../../resource/utils/comment.js'
class ShopStore extends Base {
  constructor() {
    super()
  }
  // 得到店铺详情
  getData(id, callback) {
    var param = {
      url: 'entry/wxapp/getShop',
      data: { shop_id: id },
      sCallback: (res) => {
        this.handleData(res.data.data, callback)
      }
    }
    this.request(param)
  }
  // 处理数据
  handleData(data, callback) {
    // 评分转为小数点一位
    data.dp = parseFloat(data.dp).toFixed(1)
    data.dpFor = parseFloat(data.dp)
    // 评价转为数组
    data.inco = JSON.parse(data.inco)
    // 判断有无地址
    if (data.lat && data.lng) {
      apply.getDetailLocation({ lat: data.lng, lng: data.lat }, (resp) => {
        data.address = resp.address
        callback && callback(data)
      })
    } else {
      callback && callback(data)
    }
  }
  // 得到店铺商品
  getGoods(id, callback) {
    var param = {
      url: 'entry/wxapp/getGood_list',
      data: { shop_id: id },
      sCallback: (res) => {
        callback && callback(res.data)
      }
    }
    this.request(param)
  }
  // 获取优惠数据
  getDiscount(id, callback) {
    var param = {
      url: 'entry/wxapp/getDiscount',
      data: { shop_id: id },
      sCallback: (res) => {
        let data = res.data.data
        data.forEach((v) => {
          v.starttime = this._handleTime(v.starttime)
          v.endtime = this._handleTime(v.endtime)
        })
        console.log(data)
        callback && callback(data)
      }
    }
    this.request(param)
  }
  _handleTime(time) {
    return dateToStr("yyyy-MM-dd", new Date(parseInt(time + '000')))
  }
}



export { ShopStore }