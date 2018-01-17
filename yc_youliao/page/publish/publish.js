// yc_youliao/publish/publish.js
let app = getApp()
import { Publish } from 'publish-model.js'
import { getImageSocket } from '../../resource/utils/comment.js'
var publish = new Publish()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: 0,
    data: [],
    scrollName: '热门推荐',
    scrollData:[],
    scrollMore: '',
    imagesSocket: ''
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
    publish.getPublishData((data) => {
      console.log('data:',data)
      this.infiniteScroll(data.cate)
      this.renderFun(data)
    })
    // publish.setNavigationBarTitle()
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
      title: '更多的精彩尽在社区',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

    changeTab: function(e) {
      if(e.currentTarget.dataset.tab == 0){
        wx.navigateTo({
          url: "../index/index"
        })
      }else if(e.currentTarget.dataset.tab == 2){
        wx.navigateTo({
          url: "../index/index"
        })
      }
    },

  renderFun(data) {
    let moduleLen = Math.ceil(data.cate.length / 8)
    this.setData({
      data,
      moduleLen,
      scrollData: data.newMsg
    })
  },
  infiniteScroll(data) {
    let i = 0
    let timer = setInterval(() => {
      if (i == data.length - 3) {
        i = 0
      }
      data && data[i] && data[i].id && this.setData({
        scrollId: data[i].id
      })
      i++
    }, 2000)
    this.setData({
      timer
    })
  },
  scrolltouchstart() {
    clearInterval(this.data.timer)
  },
  scrolltouchend() {
    this.infiniteScroll(this.data.data.module)
  },
  categoryTap(e) {
    let id = e.currentTarget.dataset.id
    let scrollName = e.currentTarget.dataset.name
    publish.getModuleData(id, (data) => {
      this.setData({
        scrollName,
        scrollData: data,
        scrollMore: id
      })
    })
  }
})