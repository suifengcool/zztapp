import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
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
        location: {
            lat: 0,
            lng: 0,
            address: ''
        },
        confirmAdress: true,
		form: {},
	    cate_name: '',
	    cate_id: '',
	    hiddenToast: true,
	    toastText: '',
	    start_time: '06:00',
	    end_time: '18:00',
	    imgUrl: [],
        imgs:[],
        logoImg: '',
        shop_id: ''

    },

    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

        if(options.id){
            let id = options.id
            index.getShop(id,(data)=>{
                let arr1 = []
                data.qr_code.forEach((item,index)=>{
                    if(item.indexOf('http') < 0){
                        arr1.push(this.data.imagesSocket+ '/' + item)
                    }else{
                        arr1.push(item)
                    }
                    
                })
                this.setData({
                    shop_id: id,
                    form: data,
                    logoImg: data.logo.indexOf('http') > -1 ? data.logo : this.data.imagesSocket + '/' + data.logo,
                    imgs: arr1,
                    imgUrl: arr1
                })
                let arr = [];
                this.data.items.forEach((item,index)=>{
                    data.inco.forEach((ele,i)=>{
                        if(ele == item.value){
                            item.checked = true
                        }
                    })
                    arr.push(item);
                })
                this.setData({
                    items: arr
                })
            })

            return
        }else{
            let moveInData = wx.getStorageSync('moveInData');
            if(moveInData){
                this.setData({
                    form: moveInData,
                    logoImg: moveInData.logoImg.indexOf('http') > -1 ? moveInData.logoImg : this.data.imagesSocket + '/' + moveInData.logoImg,
                    imgs: moveInData.imgs,
                    imgUrl: moveInData.imgUrl
                })          
            }
            if(this.data.form && this.data.form.inco && this.data.form.inco.length){
                let arr = [];
                this.data.items.forEach((item,index)=>{
                    this.data.form.inco.forEach((ele,i)=>{
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

        }
    	
    	if(options && options.cate_name){
    		this.setData({
				'form.cate_name': options.cate_name,
				'form.cate_id': options.cate_id
    		})
    	}
		this.init()
    },

    // 一些初始化的信息
    init(options) {
        getLocation(true, (location) => {
            if(location) {
                index.getSeid((seid) => {
                    this.setData({
                        options: options,
                        'location.lat': location.latitude,
                        'location.lng': location.longitude,
                        'form.seid': seid
                    })
                    this.setAddress(false)
                })  
            }
        })
    },

    // 设置form的地址 reset -- boolean 是否重新请求详细地址
    setAddress(reset) {
        let address = wx.getStorageSync('address')
        if (!reset && address) {
            let data = address
            let nowLocation = { lat: this.data.location.lat, lng: this.data.location.lng }
            this.setLocationData(data, nowLocation)
        } else {
            let nowLocation = { lat: this.data.location.lat, lng: this.data.location.lng }
            index.getDetailLocation(nowLocation, (data) => {
                this.setLocationData(data, nowLocation)
                wx.setStorage({
                    key: "address",
                    data: data
                })  
            })
        }
    },

    setLocationData(data, nowLocation) {
        this.setData({
            'form.lat': nowLocation.lat,
            'form.lng': nowLocation.lng,
            'form.address': data.province + data.city + data.district + data.address,
            'location.address': data.formatted_address,
            confirmAdress: true
        })
      },

    // 地址选择
    chooseAddress() {
        wx.chooseLocation({
            success: (res) => {
                console.log(res)
                this.setData({
                    'location.lat': res.latitude,
                    'location.lng': res.longitude
                })
                this.setAddress(true)
            }
        })
    },

    // 图片上传logo
    imgUpload: function (e) {
	    let type = e.currentTarget.dataset.type
        wx.chooseImage({
	        success: (res) => {
	        	this.uploadDIY(res.tempFilePaths, (dir) => {
		            this.setData({
		                'form.logo': [dir[0]],
		                logoImg: res.tempFilePaths[0]
		            })
		        })
	        }
        })
    },

    // 图片上传  
    imgUpload2: function (e) {
	    let type = e.currentTarget.dataset.type
        console.log('this.data.imgUrl:',this.data.imgUrl)
        wx.chooseImage({
	        success: (res) => {
	        	this.uploadDIY(res.tempFilePaths, (dir) => {
	        		let arr = []
	        		dir.forEach((item,index)=>{
						arr.push(this.data.imagesSocket+ '/' + item)
	        		})
                    console.log('arr:',arr)
		            this.setData({
		                imgs: [...this.data.imgs, ...res.tempFilePaths],
		                imgUrl: [...this.data.imgUrl, ...arr]
		            })
		        })
	        }
        })

    },

    uploadDIY(filePaths,callback) {
        let url = getWxUrl('entry/wxapp/Submit_imgs')
        let i = 0
        let length = filePaths.length
        let successUp = 0
        let failUp = 0
        let imgArr = []
        wx.showLoading({
            title: '图片上传中...',
        })
        uploadFile();
        function uploadFile() {
            wx.uploadFile({
                url: url,
                filePath: filePaths[i],
                name: 'file',
                success: (resp) => {
                    imgArr.push(JSON.parse(resp.data.trim()).data.img_dir)
                    successUp++;
                },
                fail: (res) => {
                    failUp++;
                },
                complete: () => {
                    i++;
                    if(i == length) {
                        wx.hideLoading()
                        callback(imgArr)
                        console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！')
                    }else {  
                        uploadFile();  //递归调用
                    }
                },
            })
        }
    },

    delImg(e){
    	let target = e.target.dataset.item
		const arr2 = this.data.imgs.filter((item)=>{
			return item != target
		})
		this.setData({
			imgs: arr2,
            'form.imgUrl': arr2
		})
    },

    // 电话
    listenerPhoneInput: function(e) {
    	this.setData({
    		'form.telphone': e.detail.value
    	})

    },

    // 店名
    listenerShopNameInput(e){
    	this.setData({
    		'form.shop_name': e.detail.value
    	})
    },

    // 选择店内设施
    checkboxChange: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        this.setData({
            'form.inco': e.detail.value
        })
    },

    // 门店描述
    bindShopDescBlur(e){
        this.setData({
            'form.intro': e.detail.value
        })
    },

    // 营业时间
    listenerTimeInput(e){
        this.setData({
            'form.opendtime': e.detail.value
        })
    },

	// 选择地址
	makeSureLocation(){
        
	},

	// 清空地址
    giveUpLocation(){
    	this.setData({
    		confirmAdress: false,
            'form.adress': ''
    	})
    },
    
    // 选择分类
    getShopType(){
        let obj = this.data.form;
        obj.imgUrl = this.data.imgUrl;
        obj.logoImg = this.data.logoImg;
        obj.imgs = this.data.imgs;
		wx.setStorage({
            key: "moveInData",
            data: obj
        })
        wx.navigateTo({
	        url: `/yc_youliao/page/moveIn/type/index`
    	})
    },

    moveInHandle(){
    	if(!this.data.form.logo){
            wx.showToast({
              title: '请上传门店Logo',
              icon: 'success',
              image: '../../../resource/images/成功.png',
              duration: 2000000,
              mask: true
            })
			// this.setData({
			// 	hiddenToast: false,
			// 	toastText: '请上传门店Logo'
			// })
			return
    	}
    	if(!this.data.form.shop_name.trim()){
			this.setData({
				hiddenToast: false,
				toastText: '请填写门店名称'
			})
			return
    	}
    	if(!this.data.form.telphone){
			this.setData({
				hiddenToast: false,
				toastText: '请填写门店电话'
			})
			return
    	}
    	if(!this.data.form.address){
			this.setData({
				hiddenToast: false,
				toastText: '请选择门店位置'
			})
			return
    	}
    	if(!this.data.form.intro.trim()){
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
    	if(!this.data.form.cate_name){
    		this.setData({
				hiddenToast: false,
				toastText: '请选择入驻类型'
			})
			return
    	}

        let form = this.data.form
        if(this.data.shop_id){
            form.shop_id = this.data.shop_id
        }
    	
    	index.submit(form,(data)=>{
            if(data == 'success'){
                wx.showToast({
                    title: this.data.shop_id ? '修改成功' : '上传成功',
                    icon: 'success',
                    duration: 2000,
                    complete: function(){
                        wx.removeStorageSync('moveInData')
                        wx.navigateTo({
                            url: `/yc_youliao/page/index/index`
                        })
                    }
                })
            }
    	})
    },

    toastHidden(){
    	this.setData({
    		hiddenToast: true
    	})
    }

    // bindStartTimeChange: function(e) {
       //  this.setData({
       //      start_time: e.detail.value
       //  })
    // },

    // bindEndTimeChange: function(e) {
    //     this.setData({
    //         end_time: e.detail.value
    //     })
    // },

})