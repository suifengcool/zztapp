import { getImageSocket } from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()
Page({
    data: {
		score: 0,
		content: '',
		textareaEmpty: false,
        id: null
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
       if(options && options.id){
            this.setData({
                id: options.id
            })
       }
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
        if(e.detail.value.length){
            this.setData({
                textareaEmpty: false,
                content: e.detail.value
            })
        }else{
            this.setData({
                textareaEmpty: true
            })
        }
    },

    sendComment(e){
        let _this = this;
        if(!this.data.content || !this.data.content.trim().length){
            wx.showModal({
                title: '提示',
                content: '请输入评论内容~',
                showCancel: false,
                confirmColor: '#333',
                success: function (res) {
                    if (res.confirm) {

                    } else if (res.cancel) {

                    }
                }
            })
            return
        }

        let form = {};
        form.id = this.data.id;
        form.dp = this.data.score;
        form.info = this.data.content;
        index.sendComment(form,(data)=>{
            if(data.message == "sucess"){
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 3000,
                    success: ()=>{
                        setTimeout(()=>{
                            wx.redirectTo({
                               url: `/yc_youliao/page/shop/detail/index?shop_id=${data.data.shop_id}`
                            })
                        }, 3000) 
                    }
                })
            }
        })
    },

    // redirect(data){
    //     wx.redirectTo({
    //         url: `/yc_youliao/page/shop/detail/index?shop_id=${data.data.shop_id}`
    //     })
    // }

})