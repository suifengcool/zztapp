import { getLocation, getUserInfo, getImageSocket } from '../../../resource/utils/comment.js'
import { Create } from 'moveInCreate-model.js'
var index = new Create()
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
	    inco: [],                         // 店内设施，标签
	    shopDesc: '',                     // 门店简介
	    imgs: [],
	    cate_name: '',
	    cate_id: '',
	    hiddenToast: true,
	    toastText: '',
	    start_time: '06:00',
	    end_time: '18:00',
	    opendtime: ''

    },

    // 生命周期函数--监听页面加载
    onLoad: function (options) {
    	let moveInData = wx.getStorageSync('moveInData')
    	if(moveInData){
    		this.setData({
    			logoImg: moveInData.logoImg ? moveInData.logoImg : '',
			    phone: moveInData.phone ? moveInData.phone : '',
			    shopName: moveInData.shopName ? moveInData.shopName: '',
			    latitude: moveInData.latitude ? moveInData.latitude : '',
			    longitude: moveInData.longitude ? moveInData.longitude : '',
			    inco: moveInData.inco ? moveInData.inco : [],                         
			    shopDesc: moveInData.shopDesc ? moveInData.shopDesc : '',           
			    imgs: moveInData.imgs ? moveInData.imgs : [],
			    cate_name: moveInData.cate_name ? moveInData.cate_name : '',
			    cate_id: moveInData.cate_id ? moveInData.cate_id : '',
			    // start_time: moveInData.start_time ? moveInData.start_time : '06:00',
			    // end_time: moveInData.end_time ? moveInData.end_time : '18:00',
			    opendtime: moveInData.opendtime ? moveInData.opendtime : ''
			})			
    	}
    	if(this.data.inco.length){
    		let arr = [];
			this.data.items.forEach((item,index)=>{
				this.data.inco.forEach((ele,i)=>{
					if(ele == item.value){
						item.checked = true
					}
				})
				arr.push(item);
			})
			this.setData({
				items: arr
			})
    	}
    	console.log('this.data.items:',this.data.items)
    	if(options && options.cate_name){
    		this.setData({
				cate_name: options.cate_name,
				cate_id: options.cate_id
    		})
    	}
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
    	this.setData({
    		shopDesc: e.detail.value
    	})
    },

    bindStartTimeChange: function(e) {
	    this.setData({
	        start_time: e.detail.value
	    })
    },

    bindEndTimeChange: function(e) {
        this.setData({
            end_time: e.detail.value
        })
    },

    listenerTimeInput(e){
		this.setData({
    		opendtime: e.detail.value
    	})
    },

    getShopType(){
    	console.log('this.data.shopName:',this.data.shopName)
    	let data = {};
    	data.logoImg = this.data.logoImg;
    	data.phone = this.data.phone;
    	data.shopName = this.data.shopName;
    	data.latitude = this.data.latitude;
    	data.longitude = this.data.longitude;
    	data.inco = this.data.inco;
    	data.shopDesc = this.data.shopDesc;
    	data.imgs = this.data.imgs;
    	data.cate_name = this.data.cate_name;
    	data.cate_id = this.data.cate_id;
    	// data.start_time = this.data.start_time;
    	// data.end_time = this.data.end_time;
    	data.opendtime = this.data.opendtime;
		wx.setStorage({
            key: "moveInData",
            data: data
        })
        wx.navigateTo({
	        url: `/yc_youliao/page/moveIn/type/index`
    	})
    },

    moveInHandle(){
    	if(!this.data.logoImg){
			this.setData({
				hiddenToast: false,
				toastText: '请上传门店Logo'
			})
			return
    	}
    	if(!this.data.shopName.trim()){
			this.setData({
				hiddenToast: false,
				toastText: '请填写门店名称'
			})
			return
    	}
    	if(!this.data.phone){
			this.setData({
				hiddenToast: false,
				toastText: '请填写门店电话'
			})
			return
    	}
    	if(!this.data.latitude){
			this.setData({
				hiddenToast: false,
				toastText: '请选择门店位置'
			})
			return
    	}
    	if(!this.data.shopDesc.trim()){
    		this.setData({
				hiddenToast: false,
				toastText: '请填写门店简介'
			})
			return
    	}
    	if(!this.data.imgs.length){
    		this.setData({
				hiddenToast: false,
				toastText: '请上传门店照片'
			})
			return
    	}
    	if(!this.data.cate_name){
    		this.setData({
				hiddenToast: false,
				toastText: '请选择入驻类型'
			})
			return
    	}
    	let form = {};
    	form.logoImg = this.data.logoImg;
    	form.phone = this.data.phone;
    	form.shopName = this.data.shopName;
    	form.latitude = this.data.latitude;
    	form.longitude = this.data.longitude;
    	form.inco = this.data.inco;
    	form.shopDesc = this.data.shopDesc;
    	form.imgs = this.data.imgs;
    	form.cate_name = this.data.cate_name;
    	form.cate_id = this.data.cate_id;
    	form.opendtime = this.data.opendtime;
    	// form.start_time = this.data.start_time;
    	// form.end_time = this.data.end_time;
    	index.submit(form,(data)=>{
			console.log('data:',data)
    	})
    },

    toastHidden(){
    	this.setData({
    		hiddenToast: true
    	})
    }

})