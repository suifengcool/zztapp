import { getUserInfo, getImageSocket, getLocation , dateToStr} from '../../resource/utils/comment.js'

import { Index } from 'index-model.js'

var index = new Index()
let app = getApp();

Page({
	data: {
		list: [],
		imagesSocket: '',
		location: ''
	},
	
	onLoad: function(options){
		wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000'
        })

		let isLoaded = wx.getStorageSync('isLoaded');
	    if(isLoaded){
			wx.switchTab({
	            url: `/yc_youliao/page/index/index`
	        })
	    }else{
	    	// 获取用户信息
			getUserInfo((data) => {
				console.log('data')
			});

			// 获取图片头
			getImageSocket((data) => {
			    this.setData({
					imagesSocket: data
			    })
			});

			// 获取店铺位置
		    getLocation((location) => {
		        this.setData({
		        	location: location
		        })
		    });

		    index.getTownList((data)=>{
		    	let list = data.data
		    	list.map((item,inde)=>{
		    		item.name = item.name.substr(3,item.name.length)
		    	})
		    	this.setData({
		    		list: list
		    	})
		    })
	    }
	},

	goToIndex(e){
		let item = e.currentTarget.dataset.item;
		wx.setStorage({
            key: "isLoaded",
            data: item,
            success: function(res) {
	        	wx.switchTab({
		            url: `/yc_youliao/page/index/index`
		        })
	        },
        })
	}
	
})