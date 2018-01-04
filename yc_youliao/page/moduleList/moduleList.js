// yc_youliao/moduleList/moduleList.js
let app = getApp()
import { ModuleList } from 'moduleList-model.js'
import { getImageSocket } from '../../resource/utils/comment.js'
var moduleList = new ModuleList()
const LENGTH = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    isComplete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    getImageSocket((data) => {
      this.setData({
        imagesSocket: data
      })
    })
    // 第一次加载数据
    moduleList.getModuleData({ id, LENGTH }, this.handleModuleData)
  },
  handleModuleData (data) {
    console.log(data)
    if (data.length < LENGTH) {
      this.setData({
        isComplete: true
      })
    }
    this.setData({
      data: [...this.data.data, ...data]
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  // 下拉加载
  onReachBottom: function () {
    if (this.data.isComplete == true) return
    moduleList.getModuleData({}, this.handleModuleData)
  },
  // 图片预览
  previewImg(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  }
})