// yc_youliao/page/order/order.js
import { Order } from 'order-model.js'
import { getCredit } from '../../resource/utils/comment.js'
let order = new Order()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numVal: 1,
    unit: 278,
    total: '',
    credit: false,
    data: null,
    creditNum: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    order.getGoodsData(options.good_id, (data) => {
      let unit = data.marketprice
      if (JSON.parse(options.isGroup) && options.type == 2) {
        unit = data.groupprice
      }
      if (JSON.parse(options.isSecKill)) {
        unit = data.time_money
      }
      this.setData({
        data,
        unit
      })
      this.total()
    })
    getCredit((creditNum) => {
      this.setData({
        creditNum
      })
    })
  },
  add() {
    if (this.data.numVal < this.data.data.total) {
      let num = this.data.numVal + 1
      this.setData({
        numVal: num
      })
      this.total()
    }
  },
  del() {
    if (this.data.numVal > 1) {
      this.setData({
        numVal: this.data.numVal - 1
      })
      this.total()
    }
  },
  input(e) {
    let val = parseInt(e.detail.value)
    if (!isNaN(val)) {
      if (val > 1 && val <= this.data.data.total) {
        this.setData({
          numVal: val
        })
        this.total()
      } else {
        if (val > this.data.data.total) {
          val = this.data.data.total
        } else {
          val = 1
        }
        this.setData({
          numVal: val
        })
        this.total()
      }
    }
  },
  total() {
    let total = this.data.unit * this.data.numVal
    if (this.data.credit) {
      total = (total - this.data.creditNum).toFixed(1)  //防止浮点数加减出现尾数
    }
    if (this.data.data.isfirstcut) {
      total = (total - this.data.data.isfirstcut).toFixed(1) //防止浮点数加减出现尾数
    }
    this.setData({
      total
    })
  },
  onCredit() {
    this.setData({
      credit: !this.data.credit
    })
    this.total()
  },
  submit() {
    wx.showModal({
      title: '提示',
      content: '付款功能暂缓上线',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorage({
      key: 'goodsInfo',
      success: function (res) {
        console.log(res.data)
      }
    })
  }
})