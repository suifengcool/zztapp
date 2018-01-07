Page({
    data: {
		movies: [],                                   // 轮播图数据
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
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
})