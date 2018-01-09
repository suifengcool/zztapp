import { getUserInfo } from '../../resource/utils/comment.js'
let app = getApp()
import { Publish } from 'publish-model.js'
import { getImageSocket } from '../../resource/utils/comment.js'
var publish = new Publish()
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
	    imagesSocket: ''
    },
	
	onLoad: function(){
		wx.request({  
         url:'https://tongcheng.iweiji.cc/entry/wxapp/getSeid',  
         data:{},  
         header: {'Content-Type': 'application/json'},  
         success: function(res) {  
           console.log(res)  
         }  
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
	    publish.getPublishData((data) => {
	      this.infiniteScroll(data.module)
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

	showAllClassify(){
		this.setData({
			showClassify: !this.data.showClassify
		})
	},

	closeClassify(){
		this.setData({
			showClassify: false
		})
	},

    changeTab (e) {
   //  	if(e.currentTarget.dataset.tab == 1){
			// wx.navigateTo({
			// 	url: "../publish/publish"
		 //    })
		 //    return
   //  	}
    	this.setData({
            currentTab : e.currentTarget.dataset.tab
        })
        let title = '';
		if(this.data.currentTab == 0){
			title = '镇镇通'
		}else if(this.data.currentTab == 1){
			title = '发现'
		}else if(this.data.currentTab == 2){
			title = '我的'
		}
		
        wx.setNavigationBarTitle({
	        title: title,
	        success: function(res) {
	        // success
	        }
	    })
    },
	
	/*******我的*******/
    onTitleTap(e) {
		let name = e.currentTarget.dataset.name
		this.setData({
		  [name]: !this.data[name]
		})
	},

	go(e) {
		let type = e.currentTarget.dataset.type
		if(type == 'comment') {
		    wx.navigateTo({
				url: "/yc_youliao/page/myComment/myComment"
		    })
		}else if (type == 'moveIn') {
		    wx.navigateTo({
				url: "/yc_youliao/page/moveIn/list/index"
		    })
		}else if (type == 'collect') {
		    wx.navigateTo({
				url: "/yc_youliao/page/myCollect/myCollect"
		    })
		}else if (type == 'publish') {
		  	wx.navigateTo({
				url: "/yc_youliao/page/myPublish/myPublish"
		    })
		}else if (type == 'coupon') {
		  	wx.navigateTo({
				url: "/yc_youliao/page/coupon/list/index"
		    })
		}
	},

	/*******首页*******/

	/*******发现*******/
	renderFun(data) {
    let moduleLen = Math.ceil(data.module.length / 8)
    this.setData({
      data,
      moduleLen,
      scrollData: data.hotMsg
    })
  },
  infiniteScroll(data) {
    let i = 0
    let timer = setInterval(() => {
      if (i == data.length - 3) {
        i = 0
      }
      this.setData({
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