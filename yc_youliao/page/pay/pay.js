// yc_youliao/page/pay/pay.js
import { Pay } from 'pay-model.js'
import { getLocation, getWxUrl } from '../../resource/utils/comment.js'
var pay = new Pay()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null,
    price: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options
    })
    if (options.id != undefined) {
      pay.GetInfoOdersn(options.id, (data) => {
        this.setData({
          options: { ...this.data.options, ...{ ordersn: data.ordersn, needpay: data.price}},
          price: data.price
        })
      })
    } else {
      this.setData({
        price: options.needpay
      })
    }
  },
  pay () {
    // wx.showModal({
    //   title: '提示',
    //   content: '付款功能暂缓上线',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    // return
    pay.pay({ ordersn: this.data.options.ordersn, needpay: this.data.options.needpay})
  },
  cancle () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  }
})