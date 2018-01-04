// yc_youliao/my/my.js
import { getUserInfo } from '../../resource/utils/comment.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    avatar: '',
    city: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getUserInfo((data) => {
      let userInfo = data
      this.setData({
        name: userInfo.nickName,
        avatar: userInfo.avatarUrl
      })
    })
  },
  onTitleTap(e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      [name]: !this.data[name]
    })
  },
  go(e) {
    let type = e.currentTarget.dataset.type
    if (type == 'comment') {
      wx.navigateTo({
        url: "/yc_youliao/page/myComment/myComment"
      })
    } else if (type == 'pay') {
      wx.navigateTo({
        url: "/yc_youliao/page/myPayInfo/myPayInfo"
      })
    } else if (type == 'collect') {
      wx.navigateTo({
        url: "/yc_youliao/page/myCollect/myCollect"
      })
    } else if (type == 'publish') {
      wx.navigateTo({
        url: "/yc_youliao/page/myPublish/myPublish"
      })
    }
  }
})