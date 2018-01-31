import { getUserInfo } from '../../resource/utils/comment.js'
Page({
    data: {
		name: '',
		avatar: '',
		city: true
    },

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
	}
})