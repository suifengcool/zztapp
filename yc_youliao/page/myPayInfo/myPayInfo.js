// yc_youliao/myPayInfo/myPayInfo.js
import { MyPayInfo } from 'myPayInfo-model.js'
var myPayInfo = new MyPayInfo()
const LENGTH = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    type: 0,
    render0: {
      isComplete: false,
      page: 1,
      data: [],
      url: 'GetPayInfoByUser'
    },
    render1: {
      isComplete: false,
      page: 1,
      data: [],
      url: 'GetTopInfoByUser'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  onTitleTap(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      type
    })
    if (type = 1) {
      this.getData()
    }
  },
  getData() {
    let name = 'render' + this.data.type
    if (this.data[name].isComplete) {
      return
    }
    myPayInfo.getData({ page: this.data[name].page, url: this.data[name].url, num: LENGTH }, (data) => {
      console.log(data)
      let isComplete = false
      if (data.length < LENGTH) {
        isComplete = true
      }
      this.setData({
        [name + '.isComplete']: isComplete,
        [name + '.page']: this.data[name].page + 1,
        [name + '.data']: [...this.data[name].data, ...data],
      })
      console.log(this.data[name])
    })
  },
  // 下拉更新
  onPullDownRefresh: function () {
    this.getData()
  }
})