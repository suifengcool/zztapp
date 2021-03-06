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
            address: '未选择位置，请选择您的位置信息'
        },
        confirmAdress: true,
        form: {},
        cate_name: '',
        cate_id: '',
        start_time: '06:00',
        end_time: '18:00',
        imgUrl: [],
        imgs:[],
        logoImg: '',
        shop_id: '',
        textareaEmpty: true,
        readed: true

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
                    cate_name: data.cate_name,
                    cate_id: data.cate_id ? data.cate_id : data.pcate_id,
                    logoImg: data.logo.indexOf('http') > -1 ? data.logo : this.data.imagesSocket + '/' + data.logo,
                    imgs: arr1,
                    imgUrl: arr1,
                    textareaEmpty: data.intro && data.intro.trim().length ? false : true
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
                    imgs: moveInData.imgs,
                    imgUrl: moveInData.imgUrl,
                    cate_name: moveInData.cate_name,
                    cate_id: moveInData.cate_id,
                    readed: moveInData.readed,
                    textareaEmpty: moveInData.intro && moveInData.intro.trim().length ? false : true
                }) 
                if(moveInData.logoImg){
                    this.setData({
                        logoImg: moveInData.logoImg.indexOf('http') > -1 ? moveInData.logoImg : this.data.imagesSocket + '/' + moveInData.logoImg
                    }) 
                }         
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
                'cate_name': options.cate_name,
                'form.cate_id': options.cate_id,
                'cate_id': options.cate_id
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
            let nowLocation = { 
                lat: this.data.location.lat, 
                lng: this.data.location.lng
            }
            index.getDetailLocation(nowLocation, (data) => {
                let obj = {};
                obj.province = data.province;
                obj.city = data.city;
                obj.district = data.district;
                obj.formatted_address = (this.data.location.address+  this.data.location.name).replace(/(.).*\1/g,"$1");
                obj.address = this.data.location.address;
                this.setLocationData(obj, nowLocation)
                wx.setStorage({
                    key: "address",
                    data: obj
                })  
            })
        }
    },

    setLocationData(data, nowLocation) {
        this.setData({
            'form.lat': nowLocation.lat,
            'form.lng': nowLocation.lng,
            'form.address': (data.province + data.city + data.district + data.address).replace(/(.).*\1/g,"$1"),
            'location.address': data.formatted_address,
            confirmAdress: true
        })
      },

    // 地址选择
    chooseAddress() {
        wx.chooseLocation({
            success: (res) => {
                console.log('res:',res)
                this.setData({
                    'location.lat': res.latitude,
                    'location.lng': res.longitude,
                    'location.address': res.address,
                    'location.name': res.name
                })
                this.setAddress(true)
            }
        })
    },

    // 图片预览
    previewImg(e) {
        wx.previewImage({
            urls: this.data.imgs       // 需要预览的图片http链接列表
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
        wx.chooseImage({
            success: (res) => {
                this.uploadDIY(res.tempFilePaths, (dir) => {
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

    // 删除照片
    delImg(e){
        let target = e.target.dataset.item
        const arr2 = this.data.imgs.filter((item)=>{
            return item != target
        })
        this.setData({
            imgs: arr2,
            'form.imgUrl': arr2,
            imgUrl: arr2
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

    bindTextinput(e){
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
        obj.readed = this.data.readed;
        wx.setStorage({
            key: "moveInData",
            data: obj
        })
        wx.redirectTo({
            url: `/yc_youliao/page/moveIn/type/index`
        })
    },

    // 查看协议
    readDeal(){
        let obj = this.data.form;
        obj.imgUrl = this.data.imgUrl;
        obj.logoImg = this.data.logoImg;
        obj.imgs = this.data.imgs;
        obj.cate_name = this.data.cate_name;
        obj.cate_id = this.data.cate_id;
        wx.setStorage({
            key: "moveInData",
            data: obj
        })
        wx.navigateTo({
            url: `/yc_youliao/page/release/deal/index`
        })
    },

    moveInHandle(){
        if(!this.data.form.logo){
            wx.showToast({
                title: '请上传门店Logo',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
        }
        if(!this.data.form.shop_name || !this.data.form.shop_name.trim()){
            wx.showToast({
                title: '请填写门店名称',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
        }
        if(!this.data.form.telphone){
            wx.showToast({
                title: '请填写门店电话',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
        }
        if(this.data.form.telphone && !(/^1[3|5][0-9]\d{4,8}$/.test(this.data.form.telphone))){
            wx.showToast({
                title: '请填写正确的手机号码',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
        }
        if(!this.data.form.address){
            wx.showToast({
                title: '请选择门店位置',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
        }
        if(!this.data.form.intro || !this.data.form.intro.trim()){
            wx.showToast({
                title: '请填写门店简介',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
        }
        if(!this.data.imgs.length){
            wx.showToast({
                title: '请上传门店照片',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
        }
        if(!this.data.form.cate_name){
            wx.showToast({
                title: '请选择入驻类型',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
        }
        // if(!this.data.readed){
        //     wx.showToast({
        //         title: '请选择阅读协议',
        //         image: '../../../resource/images/warn.png',
        //         duration: 2000,
        //         mask: true
        //     })
        //     return
        // }
        let form = this.data.form
        if(form.shop_id){
            // form.imgUrl = this.data.imgUrl
        }
        if(this.data.shop_id){
            form.shop_id = this.data.shop_id
        }

        index.submit(form,(data)=>{
            if(data.message == 'sucess' || data.errno == 0){
                wx.showToast({
                    title: this.data.shop_id ? '修改成功' : '上传成功',
                    icon: 'success',
                    duration: 3000,
                    success: ()=>{
                        setTimeout(()=>{
                            wx.removeStorageSync('moveInData')
                            wx.switchTab({
                                url: `/yc_youliao/page/index/index`
                            })
                        }, 3000) 
                    }
                })
            }
        })
    },

    radioChange(){
        console.log('111111')
        this.setData({
            readed: !this.data.readed
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