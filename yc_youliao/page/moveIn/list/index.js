Page({
    data: {

    },

    onLoad: function (options) {
	
    },

    goDetail(e){
    	let id = e.currentTarget.dataset.id;
    	wx.navigateTo({
			url: `/yc_youliao/page/coupon/detail/index?id=${id}`
	    })
    }
})