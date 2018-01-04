// yc_youliao/myComment/myComment.js
import { MyComment } from 'myComment-model.js'
var myComment = new MyComment()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    myComment.getMyCommentData((data) => {
      console.log(data)
      this.setData({
        data
      })
    })
  }
})