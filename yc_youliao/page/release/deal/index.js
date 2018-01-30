Page({
    data: {
		from: true
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
		if(options && options.form){
			this.setData({
				from: options.form
			})
		}
    },

    radioChange: function(e) {
    	console.log('radio发生change事件，携带value值为：', e.detail.value)
    	if(e.detail.value){
    		let item = e.currentTarget.dataset.item
	        var pages = getCurrentPages();
	        var currPage = pages[pages.length - 1];   //当前页面
	        var prevPage = pages[pages.length - 2];  //上一个页面

	        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
	        prevPage.setData({
	            readed: true,
	            'form.readed': true
	        })

	        setTimeout(function(){
				wx.navigateBack({
				  // delta: 2
				})
	        },1500)
    	}
    }
})