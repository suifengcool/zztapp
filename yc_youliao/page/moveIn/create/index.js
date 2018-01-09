Page({
    data: {
		items: [{
			name: 'WIFI', 
			value: 'WIFI'
		},{
			name: '停车位', 
			value: '停车位'
		},{
			name: '支付宝支付', 
			value: '支付宝支付'
		},{
			name: '微信支付', 
			value: '微信支付'
		}]
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
	
    },
    checkboxChange: function(e) {
	    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    }
})