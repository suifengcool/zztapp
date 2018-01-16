import { getUserInfo, getImageSocket, getLocation , dateToStr} from '../../../resource/utils/comment.js'

import { Index } from 'index-model.js'

var index = new Index()

let app = getApp();

Page({
	data: {
		keyword: '',
		tab: 0,
		isKeywordEmpty: true,
		shopList: [],
		showSearch: true

	},
	
	onLoad: function(option){
		console.log('option:',option)
		if(option && option.keyword){
			this.setData({
				keyword: option.keyword,
				isKeywordEmpty: false,
				showSearch: true
			})
			let key = option.keyword
			index.search(key,(data)=>{
				console.log('data:',data)
				this.setData({
					shopList: data
				})
			})
		}else{
			this.setData({
				showSearch: false
			})
		}
		
	},

	listenerInput(e){
		this.setData({
            keyword: e.detail.value
        })
	},

	search(props){
		let key = this.data.keyword
		index.search(key,(data)=>{
			this.setData({
				shopList: data
			})
		})
	},

	// 点击门店列表，查看店铺详情
	tap (e) {
	    let id = e.currentTarget.dataset.id;
	    wx.navigateTo({
	        url: `/yc_youliao/page/shop/detail/index?shop_id=${id}`
    	})
    },

	
})