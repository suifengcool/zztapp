import { Index } from 'type-model.js'
var index = new Index()

Page({
    data: {
		cateList: []
    },

    onLoad: function (options) {
		index.getTypeList((data)=>{
			this.setData({
	       		cateList: data
	        })
		})
    },

    chooseCate(e){
		let item = e.target.dataset.item
		wx.navigateTo({
	        url: `/yc_youliao/page/moveIn/create/index?cate_id=${item.cate_id}&cate_name=${item.cate_name}`
    	})
    }
})