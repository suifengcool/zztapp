// yc_youliao/page/shopStore/shopStore.js
import { getImageSocket } from '../../resource/utils/comment.js'
import { html2json } from '../../../we7/resource/js/htmlToWxml.js'
import { ShopStore } from 'shopStore-model.js'
const shopStore = new ShopStore()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSocket: '',
    image: 'images/43/2017/06/sfvhVyP77H7xhX7V7TnZ5zTpHk57dx.png',
    data: null,
    goodsList: [],
    discountList: [],
    intro: null,
    id: null
  },

  onLoad: function (options) {
    let id = options.shop_id
    this.setData({
      id
    })
    // 图片前缀
    getImageSocket((imageSocket) => {
      this.setData({
        imageSocket
      })
    })
    // 加载商户信息
    shopStore.getData(id,(data) => {
      console.log(data)
      this.setData({
        data
      })
      if (data.intro) {
        let des = data.intro
        this.setData({
          des: html2json(data.intro)
        })
      }
    })
    // 加载商品
    shopStore.getGoods(id, (data) => {
      if(data.data == null) {
        return
      }
      this.setData({
        goodsList: [...this.data.goodsList, ...data.data]
      })
    })
    // 加载优惠信息
    shopStore.getDiscount(id, (data) => {
      this.setData({
        discountList: [...this.data.discountList,...data]
      })
    })
    // 得到当前的积分
    // app.util.getUserInfo((data) => {
    //   console.log(data)
    // })
  },
  // 电话拨打
  phonetap() {
    if (this.data.data.telphone) {
      wx.makePhoneCall({
        phoneNumber: this.data.data.telphone
      })
    }
  },
  map() {
    wx.openLocation({
      latitude: parseFloat(this.data.data.lat), longitude: parseFloat(this.data.data.lng), address: this.data.data.address, success: (res) => {
        console.log(res)
      }
    })
  },
  goGoods (e) {
    let id = e.currentTarget.dataset.id
    wx.setStorage({
      key: "storeInfo",
      data: this.data.data
    })
    wx.navigateTo({
      url: `/yc_youliao/page/goods/goods?good_id=${id}&shop_id=${this.data.id}`
    })
  },
  money () {
    wx.setStorage({
      key: "discountInfo",
      data: this.data.discountList
    })
    wx.navigateTo({
      url: `/yc_youliao/page/storeMoney/storeMoney?shop_id=${this.data.id}&shopName=${this.data.data.shop_name}`
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.data.shop_name,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})