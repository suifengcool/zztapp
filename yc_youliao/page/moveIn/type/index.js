import { Index } from 'type-model.js'
var index = new Index()

Page({
    data: {
		isUsed: false,
		cateList: []
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
		index.getTypeList((data)=>{
			console.log('data:',data)
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