Page({
    data: {
		score: 0,
		content: '',
		textareaEmpty: false
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
	
    },

    changeStar(e){
    	let item = e.currentTarget.dataset.item;
    	this.setData({
    		score: item + 1
    	})
    },

    clearStar(e){
    	this.setData({
    		score: 0
    	})
    },

    // 门店描述
    bindShopDescBlur(e){
        this.setData({
            content: e.detail.value
        })
    },

    bindTextinput(e){
        console.log('e:',e.detail.value)
        if(e.detail.value.length){
            this.setData({
                textareaEmpty: false
            })
        }else{
            this.setData({
                textareaEmpty: true
            })
        }
    },
})