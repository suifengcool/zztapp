import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
		form:{},
		isNotEmpty: true,
        location: {
            lat: 0,
            lng: 0,
            address: ''
        },
        imgUrl: [],
        imgs: [],
        imagesSocket: '',
        readed: true
    },

    onLoad: function (options) {
        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

        let release = wx.getStorageSync('release')
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
                    'form.intro':release.intro,
                    isNotEmpty: false
                })
            }
            if(release.imgUrl){
                this.setData({
                    'form.imgUrl':release.imgUrl,
                    'imgUrl':release.imgUrl
                })
            }
            if(release.imgs){
                this.setData({
                    'form.imgs':release.imgs,
                    'imgs':release.imgs
                })
            }
            if(release.telphone){
                this.setData({
                    'form.telphone':release.telphone
                })
            } 
            if(release.readed){
                this.setData({
                    'form.readed':release.readed,
                    readed: release.readed
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
        this.init()
        this.getUserList()
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
            'form.province': data.province,
            'form.city': data.city,
            'form.city': data.city,
            'form.district': data.district,
            'form.address': data.province + data.city + data.district + data.address,
            'location.address': data.formatted_address,
            confirmAdress: true
        })
      },

    // 地址选择
    chooseAddress() {
        wx.chooseLocation({
            success: (res) => {
                this.setData({
                    'location.lat': res.latitude,
                    'location.lng': res.longitude
                })
                this.setAddress(true)
            }
        })
    },

    // 图片上传  
    imgUpload2: function (e) {
        let type = e.currentTarget.dataset.type
        wx.chooseImage({
            success: (res) => {
                this.uploadDIY(res.tempFilePaths, (dir) => {
                    let arr = []
                    dir.forEach((item,index)=>{
                        arr.push(this.data.imagesSocket+ '/' + item)
                    })
                    this.setData({
                        imgs: [...this.data.imgs, ...res.tempFilePaths],
                        imgUrl: [...this.data.imgUrl, ...arr],
                        'form.imgUrl': [...this.data.imgUrl, ...arr],
                        'form.imgs':[...this.data.imgs, ...res.tempFilePaths],
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

    // 图片预览
    previewImg(e) {
        wx.previewImage({
            urls: this.data.imgs       // 需要预览的图片http链接列表
        })
    },

    delImg(e){
        let target = e.target.dataset.item
        const arr2 = this.data.imgs.filter((item)=>{
            return item != target
        })

        const arr3 = this.data.imgs.filter((item)=>{
            return item == target
        })

        if(arr3.length>=2){
            arr2.push(target)
        }
        this.setData({
            imgs: arr2,
            'form.imgUrl': arr2
        })
    },

    getUserList(){
        index.getUserName((data)=>{
            let arr = data;
            arr.map((item,index)=>{
                if(item.logo.indexOf('http') < 0 ){
                    item.logo = this.data.imagesSocket + '/' + item.logo
                }
            })
            this.setData({
                'form.nickName':arr.length ? arr[0].nickname : '',
                'form.shop_id':arr.length ? arr[0].shop_id : '',
                'form.logo':arr.length ? arr[0].logo : '',
            })
        })
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
    },

    readDeal(){
        wx.setStorage({
            key: "release",
            data: this.data.form
        })  
        wx.navigateTo({
            url: `/yc_youliao/page/release/deal/index`
        })
    },

    toast(text){
        wx.showToast({
            title: text,
            icon: 'success',
            image: '../../../resource/images/warn.png',
            duration: 2000,
            mask: true
        })
    },

    submitHandle(){
        if(!this.data.form.intro || !this.data.form.intro.trim()){
            this.toast('请填写发布内容')
            return
        }
        if(!this.data.form.nickName){
            this.toast('请选择发布人')
            return
        }
        if(!this.data.form.telphone || !this.data.form.telphone.trim()){
            this.toast('请填写手机号码')
            return
        }
        if(this.data.form.telphone && !(/^1[3|5][0-9]\d{4,8}$/.test(this.data.form.telphone))){
            this.toast('请填写正确号码')
            return
        }
        if(!this.data.form.type_name){
            this.toast('请选择信息类别')
            return
        }
        if(!this.data.readed){
            this.toast('请选择阅读协议')
            return
        }
        let form = this.data.form
        console.log('form:',form)
        index.submit(form,(data)=>{
            if(data.message == "sucess" || data.errno == 0){
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    image: '../../../resource/images/success.png',
                    duration: 2000,
                    mask: true,
                    success: ()=>{
                        setTimeout(()=>{
                            wx.removeStorageSync('release')
                            this.setData({
                                'form.nickName':'',
                                'form.shop_id':null,
                                'form.type_name':'',
                                'form.type_id':null,
                                'form.intro':'',
                                isNotEmpty: true,
                                'form.imgUrl':[],
                                'imgUrl':[],
                                'form.telphone':null,
                                imgs: []
                            })
                            wx.switchTab({
                                url: `/yc_youliao/page/release/index/index`
                            })

                        }, 2000) 
                    }
                })
            }else{
                this.toast(data)
            }
        })
    }
})