import { getLocation, getUserInfo, getImageSocket } from '../../../resource/utils/comment.js'
const app = getApp()
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
		}],
		form: {},
	    logoImg: '',
	    phone: '',
	    shopName: '',
	    latitude: '',
	    longitude: '',
	    inco: [],                 // 店内设施，标签
	    shopDesc: '',             // 门店简介
	    imgs: []

    },

    // 生命周期函数--监听页面加载
    onLoad: function (options) {
    	console.log('options:',options)
		this.getLocation()
    },

    getLocation(callback) {
	    getLocation(false, (res) => {
	    	this.setData({
	    		latitude: res.latitude,
		    	longitude: res.longitude
	    	})
	    	
		    
	    })
	},

	chooseLocation(){
		wx.getLocation({
		    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
		    success: function(res) {
			    var latitude = res.latitude
			    var longitude = res.longitude
			    wx.openLocation({
			        latitude: latitude,
			        longitude: longitude
			    })
		    }
	    })
	},

    

	// 选择店内设施
    checkboxChange: function(e) {
	    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
	    this.setData({
	    	inco: e.detail.value
	    })
    },

    // 图片上传
    imgUpload: function (e) {
	    let type = e.currentTarget.dataset.type
	    if (type == 'add') {
	        wx.chooseImage({
		        success: (res) => {
		        	this.setData({
		        		logoImg: res.tempFilePaths[0]
		        	})
		        }
	        })
	    }
    },

    imgUpload2: function (e) {
	    let type = e.currentTarget.dataset.type
	    
	        wx.chooseImage({
		        success: (res) => {
		        	console.log('res:',res)
		        	this.setData({
		        		imgs: [...this.data.imgs, ...res.tempFilePaths]
		        	})
		        }
	        })

    },

    delImg(e){
    	console.log('e:',e)
    	let target = e.target.dataset.item
		const arr2 = this.data.imgs.filter((item)=>{
			return item != target
		})
		this.setData({
			imgs: arr2
		})
    },

    listenerPhoneInput: function(e) {
    	this.setData({
    		phone: e.detail.value
    	})
    	console.log('this.data.phone:',this.data.phone)

    },

    listenerShopNameInput(e){
    	this.setData({
    		shopName: e.detail.value
    	})
    	console.log('this.data.shopName:',this.data.shopName)
    },

	// 选择地址
	makeSureLocation(){

	},

	// 清空地址
    giveUpLocation(){
    	this.setData({
    		latitude: '',
	    	longitude: ''
    	})
    },

    bindShopDescBlur(e){
    	this.setDate({
    		shopDesc: e.detail.value
    	})
    }

})