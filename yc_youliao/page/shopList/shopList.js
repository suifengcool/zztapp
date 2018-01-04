// yc_youliao/shopList/shopList.js
const LENGTH = 10
let app = getApp()
import { ShopList } from 'shopList-model.js'
var shopList = new ShopList()
import { getLocation, getImageSocket } from '../../resource/utils/comment.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    cate: [],
    cateId: -1,
    page: 1,
    location: null,
    imagesSocket: '',
    isComplete: false
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
    getLocation((location) => {
      this.setData({
        location: location
      })
      this.getData(false)
    })
    shopList.getGetCateData((data) => {
      this.setData({
        cate: [...this.data.cate, ...data]
      })
    })
    shopList.setNavigationBarTitle()
  },
  // newID -- 是否切换了
  getData(newId) {
    if (newId) {
      this.setData({
        page: 0,
        isComplete: false,
        shopList: []
      })
    }
    if (this.data.isComplete) {
      return
    }
    let form = {
      lat: this.data.location.latitude,
      lng: this.data.location.longitude,
      page: this.data.page,
      num: LENGTH
    }
    if (this.data.cateId != -1) {
      form.cid = this.data.cateId
    }
    shopList.getPageData(form, (data) => {
      console.log(form,data)
      if (data.length < LENGTH) {
        this.setData({
          isComplete: true
        })
      }
      this.setData({
        shopList: [...this.data.shopList, ...data],
        page: this.data.page + 1
      })
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '更多的精彩内容',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(false)
  },
  scrollTap(e) {
    let id = parseInt(e.currentTarget.dataset.id)
    this.setData({
      cateId: id
    })
    this.getData(true)
  },
  tap (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/yc_youliao/page/shopStore/shopStore?shop_id=${id}`
    })
  }
})