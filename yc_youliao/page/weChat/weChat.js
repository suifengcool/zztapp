// yc_youliao/weChat/weChat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '啊啊',
    chatList: [
      {
        content: '你好',
        states: 1,
        id: 0
      },
      {
        content: 'ai',
        states: 0,
        id: 1
      },
      {
        content: 'haha',
        states: 1,
        id: 2
      },
    ],
    height: 0,
    toView: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({success: (res) => {
      console.log(res.windowHeight)
      this.setData({
        height: res.windowHeight - 50
      })
    }})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // touchbtm () {
  //   this.over
  // },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  sendMsg () {
    console.log(this.data.inputValue)
    let id= this.data.chatList.length
    this.setData({
      chatList: [...this.data.chatList, { content: this.data.inputValue, states: 0, id }],
      toView: 'id' + id
    })
    // wx.getUserInfo({
    //   withCredentials: true,
    //   success: (res)=> {
    //     console.log(res)
    //   }
    // })
  }
})