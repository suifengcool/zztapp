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
	    opendtime: '',
	    imgUrl: [],
	    logo:''

    },

    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        let _this = this
        console.log('options:',options)
        if(options.id){
            let id = options.id
            index.getShop(id,(data)=>{
                console.log('data1111:',data)
                _this.setData({
                    form: data
                })
            })
        }
    	// 获取图片头
		getImageSocket((data) => {
		    this.setData({
				imagesSocket: data
		    })
		});
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
            let nowLocation = { 
                lat: res.latitude, 
                lng: res.longitude 
            }
            index.getDetailLocation(nowLocation, (data) => {
                console.log('data:',data)
            })
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
		        	this.uploadDIY(res.tempFilePaths, (dir) => {
			            this.setData({
			                logo: [dir[0]],
			                logoImg: res.tempFilePaths[0]
			            })
			        })
		        }
	        })
	    }
    },

    imgUpload2: function (e) {
	    let type = e.currentTarget.dataset.type
	    
	        wx.chooseImage({
		        success: (res) => {
		        	this.uploadDIY(res.tempFilePaths, (dir) => {
		        		console.log('dir:',dir)
		        		let arr = []
		        		dir.forEach((item,index)=>{
							arr.push(this.data.imagesSocket+ '/' + item)
		        		})
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
    console.log(url)
    uploadFile()
    function uploadFile() {
      wx.uploadFile({
        url: url,
        filePath: filePaths[i],
        name: 'file',
        success: (resp) => {
          console.log('suc->图片上传')
          imgArr.push(JSON.parse(resp.data.trim()).data.img_dir)
          successUp++;
        },
        fail: (res) => {
          failUp++;
        },
        complete: () => {
          i++;
          if (i == length) {
            wx.hideLoading()
            callback(imgArr)
            console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！')
          }
          else {  //递归调用
            uploadFile();
          }
        },
      })
    }
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
    	data.imgUrl = this.data.imgUrl;
    	data.logo = this.data.logo;
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
    	form.imgUrl = this.data.imgUrl;
    	form.logo = this.data.imagesSocket + '/' +this.data.logo;
    	// form.start_time = this.data.start_time;
    	// form.end_time = this.data.end_time;
    	console.log('this.data.imgUrl:',this.data.imgUrl)
    	console.log('this.data.logo:',this.data.logo)

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