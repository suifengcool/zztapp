// yc_youliao/index/index.js
var app = getApp()
app.util.date()
import { Index } from 'index-model.js'
import { dateToStr } from '../../resource/utils/comment.js'
var index = new Index()
Page({
  data: {
    data: null,
    imagesSocket: null,
    weatherImg: '../../resource/images/y.png',
    weatherdata: null,
    date: '',
    moduleLen: 1,
    newsNum: 1,
    checkIn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求图片套接字
    index.getAttachurl((data) => {
      this.setData({
        imagesSocket: data
      })
    })
    // 得到首页信息
    index.getIndexData((data) => {
      this.renderIndex(data)
    })
    // 保存用户信息
    // index.indexGetUserInfo()
    index.setNavigationBarTitle()
  },
  // 渲染首页
  renderIndex(data) {
    let dateArr = dateToStr("yyyy-MM-dd W",new Date()).split(" ")
    let date = dateArr[0] + ' 星期' + dateArr[1]
    let moduleLen = Math.ceil(data.module.length / 8)
    // 天气判断
    if (data.weatherdata) {
      let weatherdata = JSON.parse(data.weatherdata)
      weatherdata.data.forecast[0].high = weatherdata.data.forecast[0].high.slice(2)
      weatherdata.data.forecast[0].low = weatherdata.data.forecast[0].low.slice(2)
      let weatherType = weatherdata.data.forecast[0].type
      let weatherImg = '../../resource/images/y.png'
      data.weatherdata = weatherdata
      if (weatherType.indexOf('云') > 0) {
        weatherImg = '../../resource/images/dy.png'
      } else if (weatherType.indexOf('雨') > 0) {
        weatherImg = '../../resource/images/by.png'
      } else if (weatherType.indexOf('阴') > 0) {
        weatherImg = '../../resource/images/y.png'
      } else {
        weatherImg = '../../resource/images/dy.png'
      }
      this.setData({
        weatherImg,
        weatherdata: weatherdata.data
      })
    }
    this.setData({
      date,
      moduleLen,
      data,
      checkIn: !data.isSignIn //签到
    })

  },
  // 二维码
  scanCode() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  // 下拉更新
  onPullDownRefresh: function () {
    index.getIndexData((data) => {
      this.renderIndex(data)
      wx.stopPullDownRefresh()
    })
  },
  // 改变显示模块
  newClick(e) {
    let newsNum = e.currentTarget.dataset.newsnum
    this.setData({
      newsNum
    })
  },
  // 图片预览
  previewImg(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  // 签到
  onCheckIn () {
    if (this.data.checkIn == false) {
      index.checkIn((data) => {
        console.log(data)
        if (data.status == 1) {
          this.setData({
            checkIn: true
          }) 
          wx.showToast({
            title: data.str.slice(5),
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  },
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '社区首页',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow: function () {
    // index.getIndexData((data) => {
    //   this.renderIndex(data)
    // })
  }
})