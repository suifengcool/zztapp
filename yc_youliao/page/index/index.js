import { getUserInfo } from '../../resource/utils/comment.js'

Page({
    data: {
        currentTab: 0,                                // 底部当前tab
        movies: [],                                   // 轮播图数据
        name: '',                                     // 我的-用户名
		avatar: '',                                   // 我的-头像
		city: true,                                   // 我的-显示同城详情
		showClassify: false,                          // 显示所有分类
    },
	
	onLoad: function(){
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


})