// yc_youliao/page/goods/goods.js
import { getImageSocket } from '../../resource/utils/comment.js'
import { html2json } from '../../../we7/resource/js/htmlToWxml.js'
import { Goods } from 'goods-model.js'
let goods = new Goods()
let optionsData = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSocket: '',
    image: 'images/43/2017/05/oqJ33Yi4iNzDV8WjiIIn3J3aqjwWIZ.jpg',
    des: null,
    shopData: null,
    time: {
      hour: '00',
      minute: '00',
      second: '00'
    },
    isGroup: false,
    isSecKill: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    optionsData = options
    getImageSocket((imageSocket) => {
      this.setData({
        imageSocket
      })
    })
    // 获取商品消息
    goods.getData({ shop_id: options.shop_id, good_id: options.good_id},(data) => {
      let des = null
      if (data.description) {
        des = [...html2json(data.description)]
      }
      if (data.is_group == '1') {
        this.setData({
          isGroup: true
        })
      }
      if (data.times_flag && data.times_flag.times_flag == 1) {
        this.setData({
          isSecKill: true,
          isGroup: false
        })
        this.clock(data.times_flag.timeend)
      }
      this.setData({
        data,
        des
      })
    })
    // 获取商家信息
    goods.getStoreInfo(options.shop_id, (data) => {
      this.setData({
        shopData: data
      })
    })
    // 积分可抵多少钱
    goods.getCredit((data) => {
      console.log(data)
      this.setData({
        credit: data
      })
    })
  },
  // 点击地址
  map() {
    wx.openLocation({
      latitude: parseFloat(this.data.shopData.lat), longitude: parseFloat(this.data.shopData.lng), address: this.data.shopData.address, success: (res) => {
        console.log(res)
      }
    })
  },
  // 点击电话
  phonetap() {
    if (this.data.shopData.telphone) {
      wx.makePhoneCall({
        phoneNumber: this.data.shopData.telphone
      })
    }
  },
  // 转到店铺
  goStore () {
    let pages = getCurrentPages()
    if (pages[pages.length - 2].route.indexOf('shopStore') > 0) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: `/yc_youliao/page/shopStore/shopStore?shop_id=${optionsData.shop_id}`
      })
    }
    
  },
  buy (e) {
    let params = `good_id=${optionsData.good_id}&isGroup=${this.data.isGroup}&isSecKill=${this.data.isSecKill}`
    if (this.data.isGroup) {
      let type = e.currentTarget.dataset.type
      params += `&type=${type}`
    }
    wx.setStorage({
      key: "goodsInfo",
      data: this.data.data
    })
    wx.navigateTo({
      url: `/yc_youliao/page/order/order?` + params
    })
  },
  onUnload: function () {
    wx.removeStorage({
      key: 'storeInfo',
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  clock (toHour) {
    toHour = 19
    if (toHour < new Date().getHours() ) {
      return
    }
    let date = new Date()
    let time = this.data.time
    let hour = 0
    let minute = 0
    let second = 0
    let interVal = 0
    date.setHours(toHour)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    interVal = parseInt((+date - +new Date()) / 1000)
    console.log(interVal)
    hour = parseInt(interVal/3600)
    minute = parseInt((interVal % 3600) / 60)
    second = interVal % 60
    console.log(hour, minute, second)
    hour = hour < 10 ? '0' + hour : hour
    minute = minute < 10 ? '0' + minute : minute
    second = second < 10 ? '0' + second : second
    
    time = {
      hour,
      minute,
      second
    }
    
    let timer = setInterval(() => { 
      if (time.second == 0) {
        time.second = 59

        if (time.minute == 0) {
          time.minute = 59

          if (time.hour == 0) {
            console.log('over')
            clearInterval(timer)
            return 
          } else {
            time.hour -=  1
            if (time.hour < 10) {
              time.hour = "0" + time.hour
            }
          }

        } else {
          time.minute -= 1
          if (time.minute < 10) {
            time.minute = "0" + time.minute
          }
        }

      } else {
        time.second -= 1
        if (time.second < 10) {
          time.second = "0" + time.second
        }
      }
      this.setData({
        'time': time
      })
    }, 1000)
    this.setData({
      timer,
      time
    })
  },
  /**
   * 用户点击右上角分享
   */
  onHide: function () {
    if (this.data.timer) {
      clearInterval(timer)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.timer) {
      clearInterval(timer)
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.data.title,
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