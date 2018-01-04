// yc_youliao/page/myCollect/myCollect.js
import { MyCollect } from 'myCollect-model.js'
import { getImageSocket } from '../../resource/utils/comment.js'
var myCollect = new MyCollect()
const LENGTH = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '',
    isComplete: false,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getImageSocket((data) => {
      this.setData({
        imagesSocket: data
      })
    })
    this.getCollect(true)
  },
  getCollect(flag) {
    if (this.data.isComplete) {
      return
    }
    myCollect.getMyCollectData({num: LENGTH, page: this.data.page}, (data) => {
      console.log(data)
      if (data.length < LENGTH) {
        this.setData({
          isComplete: true
        })
      }
      this.setData({
        data:[...this.data.data, ...data],
        page: this.data.page + 1
      })
    })
  },
  // 图片预览
  previewImg(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCollect()
  }
})