// yc_youliao/myPublish/myPublish.js
import { MyPublish } from 'myPublish-model.js'
import { Index } from '../index/index-model.js'
var myPublish = new MyPublish()
var index = new Index()
const LENGTH = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    render0: {
      isComplete: false,
      page: 1,
      data: []
    },
    render1: {
      isComplete: false,
      page: 1,
      data: []
    }
  },
  pay (e) {
    let itemid = e.currentTarget.dataset.itemid
    wx.navigateTo({
      url: `/yc_youliao/page/pay/pay?id=${itemid}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  // 切换类型
  onTitleTap(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      type,
    })
    if (this.data['render' + type].page == 1) {
      this.getData()
    }
  },
  // 删除
  del(e) {
    wx.showModal({
      title: '确认删除',
      content: '删除后将无法恢复',
      success: (res) => {
        if (res.confirm) {
          myPublish.deleteInfo(e, (flag) => {
            if (flag) {
              let type = this.data.type
              let name = 'render' + type
              let index = e.currentTarget.dataset.index
              this.setData({
                [name + '.data']: [...this.data[name].data.slice(0, index), ...this.data[name].data.slice(index + 1)]
              })
            }
          })
          index.getIndexData((data)=>{
            console.log('重置index数据')
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getData() {
    let name = 'render' + this.data.type
    if (this.data[name].isComplete) {
      return
    }
    myPublish.getMyPublishData({ page: this.data[name].page,status: this.data.type, num: LENGTH }, (data) => {
      let isComplete = false
      if (data.length < 10) {
        isComplete = true
      }
      this.setData({
        [name]: {
          isComplete,
          page: this.data[name].page + 1,
          data: [...this.data[name].data, ...data]
        }
      })
    })
  },
  onReachBottom: function () {
    if (this.data['render' + this.data.type].isComplete) {
      return
    }
    this.getData()
  }
})