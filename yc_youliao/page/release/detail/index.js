import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
		form:{},
		isNotEmpty: true,
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        let release = wx.getStorageSync('release')
        console.log('release:',release)
        if(release){
            if(release.nickName){
                this.setData({
                    'form.nickName':release.nickName,
                    'form.shop_id':release.shop_id,
                })
            }
            if(release.type_name){
                this.setData({
                    'form.type_name':release.type_name,
                    'form.type_id':release.type_id,
                })
                
            }
            if(release.intro){
                this.setData({
                    'form.intro':release.intro
                })
            }
            if(release.telphone){
                this.setData({
                    'form.telphone':release.telphone
                })
            }
            

            
        }
        if(options && options.user_name){
            this.setData({
                'form.nickName':options.user_name,
                'form.shop_id':options.user_id,
            })
        }
        if(options && options.type_name){
            this.setData({
                'form.type_name':options.type_name,
                'form.type_id':options.type_id,
            })
        }
	
    },

    // 门店描述
    bindShopDescBlur(e){
        this.setData({
            'form.intro': e.detail.value,
            isNotEmpty: e.detail.value.trim() ? false : true
        })
    },

    // 电话
    listenerPhoneInput: function(e) {
    	this.setData({
    		'form.telphone': e.detail.value,
    		isNotEmpty: e.detail.value.trim() ? false : true
    	})

    },

    goToChooseType(){
        wx.setStorage({
            key: "release",
            data: this.data.form
        })  
        wx.navigateTo({
            url: `/yc_youliao/page/release/type/index`
        })
    },

    goToChooseUser(){
        wx.setStorage({
            key: "release",
            data: this.data.form
        })
        wx.navigateTo({
            url: `/yc_youliao/page/release/user/index`
        })
    }
})