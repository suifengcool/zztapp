import { getUserInfo } from '../../resource/utils/comment.js'
let app = getApp()
let animationShowHeight = 300; 
import { getImageSocket } from '../../resource/utils/comment.js'
Page({
    data: {
        currentTab: 0,                                // 底部当前tab
        movies: [],                                   // 轮播图数据
        name: '',                                     // 我的-用户名
		avatar: '',                                   // 我的-头像
		city: true,                                   // 我的-显示同城详情
		showClassify: false,                          // 显示所有分类
		timer: 0,
	    data: [],
	    scrollName: '热门推荐',
	    scrollData:[],
	    scrollMore: '',
	    imagesSocket: '',
	    animationData: false
    },
	
	onLoad: function(){
		app.util.getUserInfo((userInfo) => {
			var data = {}
        if (userInfo.memberInfo.uid) {
          data.uid = userInfo.memberInfo.uid
        }
        var param = {
          url: 'entry/wxapp/getSeid',
          data,
          sCallback: (res) => {
            wx.setStorage({
              key: "index",
              data: res
            })
            console.log(res)
            callback && callback(res.data.data)
          }
        }
        app.util.request(param)
      })

    	getUserInfo((data) => {
		    let userInfo = data
		    this.setData({
				name: userInfo.nickName,
				avatar: userInfo.avatarUrl
		    })
		})
		this.setData({
            movies: [{
	        	url:'http://img04.tooopen.com/images/20130712/tooopen_17270713.jpg'
	        },{
	        	url:'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg'
	        },{
	        	url:'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg'
	        },{
	        	url:'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg'
			}]
        })
        getImageSocket((data) => {
	      this.setData({
	        imagesSocket: data
	      })
	    })
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

	showAllClassify(){
		 // 显示遮罩层  
        var animation = wx.createAnimation({  
            duration: 200,  
            timingFunction: "linear",  
            delay: 0  
        })  
        this.animation = animation  
        animation.translateY(animationShowHeight).step()  
        this.setData({  
            animationData: animation.export(),  
            showClassify: !this.data.showClassify  
        })  
        setTimeout(function () {  
            animation.translateY(0).step()  
            this.setData({  
                animationData: animation.export()  
            })  
        }.bind(this), 200)  
		
	},

	closeClassify(){
		// 隐藏遮罩层  
        var animation = wx.createAnimation({  
            duration: 200,  
            timingFunction: "linear",  
            delay: 0  
        })  
        this.animation = animation;  
        animation.translateY(animationShowHeight).step()  
        this.setData({  
            animationData: animation.export(),  
        })  
        setTimeout(function () {  
        animation.translateY(0).step()  
        this.setData({  
            animationData: animation.export(),  
            showClassify: false  
        })  
        }.bind(this), 200)  
	},
	preventD(){

	},
})