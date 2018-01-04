let app = getApp()
import { Detail } from 'detail-model.js'
import { getUserInfo, getImageSocket, dateToStr } from '../../resource/utils/comment.js'
var detail = new Detail()
let pageOptions = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imagesSocket: '',
    height: 0,
    renderList: [],
    data: null,
    isInput: false,
    comment: '',
    commentList: [],
    topIcon: {
      checkCollect: '../../resource/images/collect1.png',
      unCheckCollect: '../../resource/images/collect.png'
    },
    isCollect: false,
    status: 1,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let mid = options.mid
    let status = options.status
    pageOptions = options
    if (status == 0) {
      this.setData({
        status: 0
      })
      wx.hideShareMenu()
    }
    getImageSocket((data) => {
      this.setData({
        imagesSocket: data
      })
    })
    getUserInfo((data) => {
      this.setData({
        userInfo: data
      })
    })
    this.setHeight()
    // 详情信息加载
    detail.getDetailData(id, mid, (data, renderList) => {
      // 有经纬度显示导航
      if (data.lat !== '' && data.lng !== '') {
        this.getLocation({ lat: data.lng, lng: data.lat }) // 后端要求反过来
      }
      this.setData({
        data,
        renderList
      })
    })
    //评论加载
    detail.getCommentData({id}, (data) => {
      console.log(data)
      this.setData({
        commentList: [...this.data.commentList, ...data]
      })
    })
    // 收藏判断
    detail.isCollect(id,(flag) => {
      this.setData({
        isCollect: flag
      })
    })
    // 浏览量
    detail.addviews(id,(data) => {
      console.log(data)
    })
  },
  // 初始化高度
  setHeight() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight - 50
        })
      }
    })
  },
  // 收藏按钮
  onCollectTap() {
    detail.collect((res) => {
      console.log(res)
      this.setData({
        isCollect: !this.data.isCollect
      })
      wx.showToast({
        title: res.data.message,
        icon: 'success',
        duration: 2000
      })
    })
  },
  // 经纬度求详细地址
  getLocation(location) {
    detail.getLocationData(location, (data) => {
      this.setData({
        'address': data.formatted_address
      })
    })
  },
  // 导航点击
  map() {
    wx.openLocation({
      latitude: parseFloat(this.data.data.lat), longitude: parseFloat(this.data.data.lng), address: this.data.address, success: (res) => {
        console.log(res)
      }
    })
  },
  // 电话点击
  phonetap() {
    if (this.data.data.content.shouji) {
      wx.makePhoneCall({
        phoneNumber: this.data.data.content.shouji
      })
    }
  },
  // 评论点击
  inputTap() {
    this.setData({
      isInput: !this.data.isInput
    })
  },
  // 评论点击确认
  commentSure() {
    detail.sendComment(this.data.comment)
    this.setData({
      commentList: [...this.data.commentList, { nickname: this.data.userInfo.nickName, addtime: dateToStr(), info: this.data.comment, avatar: this.data.userInfo.avatarUrl }],
      isInput: false,
      comment: ''
    })
  },
  // 失去保存评论文字
  bindTextAreaInput: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  // 图片预览
  imgView(e) {
    let img = e.currentTarget.dataset.img
    let i = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.imagesSocket + img,
      urls: this.data.renderList[i].value.map((v) => {
        return this.data.imagesSocket + v
      })
    })
  },
  // 分享按钮
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let params = ''
    for (let i in pageOptions) {
      params += i + '=' +pageOptions[i] + '&'
    }
    params = params.slice(0, -1)
    return {
      title: '社区首页',
      path: '/yc_youliao/page/detail/detail?' + params,
      success: function (res) {
        // 转发成功
        console.log('/yc_youliao/page/detail/detail?' + params)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})