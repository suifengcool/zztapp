import { getUserInfo, getImageSocket, getLocation , dateToStr} from '../../../resource/utils/comment.js'

import { Index } from 'index-model.js'

var index = new Index()
let app = getApp();

Page({
	data: {
		keyword: '',
		cateTypeList: [],
		msgTypeList: [],
		tab: 0,
		history: [],
		tabList: [{
			name: '店铺',
			tab: 0
		},{
			name: '信息',
			tab: 1
		}],
		searchList: [],
		isKeywordEmpty: true

	},
	
	onLoad: function(){
		index.getIndexData((data)=>{
			this.setData({
				cateTypeList: data.cate,
				msgTypeList: data.module
			})
		})

		let searchList = wx.getStorageSync('searchList')
		searchList && this.setData({
			searchList: searchList
		})


	},
	
	listenerInput(e){
		this.setData({
            keyword: e.detail.value,
            isKeywordEmpty: e.detail.value.trim() ? false : true
        })
	},

	changeTab(e){
		let tab = e.currentTarget.dataset.tab
		this.setData({
			tab: tab
		})
	},

	del(e){
		let item = e.currentTarget.dataset.item
		let arr = [];
		this.data.searchList.forEach((ele,index)=>{
			if(ele.name != item.name){
				arr.push(ele)
			}
		})
		this.setData({
			searchList: arr
		})

		wx.setStorage({
            key: "searchList",
            data: arr
        })  
	},

	goToSearch(e){
		let item = e.currentTarget.dataset.item
		let type = '';
		item.type == 'info' ? type = 'msg' : type = 'shop'

		wx.navigateTo({
	        url: `/yc_youliao/page/search/${type}/index?keyword=${item.name}`
    	})
	},

	clear(){
		this.setData({
			searchList: []
		})
		wx.removeStorage({
		    key: 'searchList',
		    success: function(res) {
		    	console.log(res.data)
		    } 
		})
	},

	search(){
		let keyword = this.data.keyword;
		if(!keyword.trim()){
			wx.showToast({
                title: '请输入关键字',
                image: '../../../resource/images/成功.png',
                duration: 2000
            })
            return
		}
		
		let arr = []
		arr.push({
			name: keyword,
			type: this.data.tab ? 'info' : 'shop'
		})
		wx.setStorage({
            key: "searchList",
            data: [...arr, ...this.data.searchList]
        })  

		let type = '';
		this.data.tab ? type = 'msg' : type = 'shop'


		wx.navigateTo({
	        url: `/yc_youliao/page/search/${type}/index?keyword=${keyword}`
    	})
	},

	goToSearchList(e){
		let key = e.currentTarget.dataset.key
		let type = e.currentTarget.dataset.type
		let id = e.currentTarget.dataset.id
		wx.navigateTo({
	        url: id 
	        	? `/yc_youliao/page/search/${type}/index?keyword=${key}&from=index&cate_id=${id}`
				: `/yc_youliao/page/search/${type}/index?keyword=${key}&from=index`
    	})
	}
	
})