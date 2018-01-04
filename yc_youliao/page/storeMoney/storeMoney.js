// yc_youliao/page/storeMoney/storeMoney.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    type: -1,
    discount: [],
    shopName: '',
    payValue: ''
  },
  onLoad: function (options) {
    this.setData({
      shopName: options.shopName
    })
    wx.getStorage({
      key: 'discountInfo',
      success: (res) => {
        this.setData({
          discount: [...this.data.discount, ...res.data]
        })
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    this.payValue()
  },
  choose(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      type
    })
    this.payValue()
  },
  payValue() {
    let num = parseInt(this.data.inputValue)
    this.data.discount.forEach((v) => {
      if (v.fullmoney == 0 || num >= v.fullmoney) {
        if (v.cardtype == 1 ) {
          if (this.data.type == 1) {
            num -= parseFloat(v.cardvalue)
            num = num.toFixed(1)
          }
        } else if (v.cardtype == 3 ) {
          if (this.data.type == 3) {
            let ran = Math.random() * parseFloat(v.randomnum)
            if (num > ran) {
              num -= ran
            }
            num = num.toFixed(1)
          }
        } else {
          num *= v.cardvalue * 10
          num = num.toFixed(1)
        }
      }
    })
    if (num > 0) {
      this.setData({
        payValue: num
      })
    }
  },
  submit() {
    wx.showModal({
      title: '提示',
      content: '该功能暂缓上线',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})