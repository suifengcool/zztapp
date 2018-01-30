import { getLocation, getUserInfo, getImageSocket , getWxUrl, dateToStr, handleTime} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()
let pageOptions = null

Page({
    data: {
		info:{},
        imagesSocket: '',
        commentList: [],
        id: '',
        isCollect: false,
        showCommentBox: false,
        scanNum: 100,
        sendNum: 1,
        zanNum: 10,
        isInput: false,
        comment: '',
        userInfo: null,
        createTime: '',
        isZaned: false
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        pageOptions = options

        wx.setNavigationBarTitle({
            title: '详情'
        })

        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

        getUserInfo((data) => {
            this.setData({
                userInfo: data
            })
        })

        let id = options.id
        this.setData({
            id: id
        })

        // 详情信息加载
        index.getDetailData(id, (data) => {
            // 有经纬度显示导航
            if (data.lat !== '' && data.lng !== '') {
                this.getLocation({ lat: data.lng, lng: data.lat }) // 后端要求反过来
            }
            let time = this.getFormatDays(data.freshtime)

            if(data.content.thumbs && data.content.thumbs.length){
                let picArr = data.content.thumbs; let arr2 = [];
                picArr.map((ele,i)=>{
                    if(ele.indexOf('http')<0){
                        arr2.push(this.data.imagesSocket + ele)
                    }else{
                        arr2.push(ele)
                    }
                })
                data.content.thumbs = arr2;
            }

            this.setData({
                info: data,
                sendNum: data.send,
                zanNum: data.zan,
                isZaned: data.iszan ? true : false,
                createTime: time
            })
        })

        //评论加载
        index.getCommentData({id}, (data) => {
            this.setData({
                commentList: [...this.data.commentList, ...data]
            })
        })

        // 收藏判断
        index.isCollect(id,(flag) => {
            this.setData({
                isCollect: flag
            })
        })

        // 浏览量
        index.addviews(id,(data) => {
            this.setData({
                scanNum: data
            })
        })
	
    },

    // 经纬度求详细地址
    getLocation(location) {
        index.getLocationData(location, (data) => {
            this.setData({
                'address': data.formatted_address
            })
        })
    },

    showComment(){
        let _this = this

        this.setData({
            showCommentBox: !this.data.showCommentBox
        })

        setTimeout(function(){
            _this.setData({
                showCommentBox: false
            })
        },2000)

    },

    // 收藏按钮
    onCollectTap() {
        let _this = this
        index.collect((res) => {
            this.setData({
                isCollect: !this.data.isCollect
            })
            wx.showToast({
                title: this.data.isCollect ? '收藏成功' : '取消收藏成功',
                icon: 'success',
                duration: 2000,
                complete: function(){
                    setTimeout(function(){
                        _this.setData({
                            showCommentBox: false
                        })
                    },2000)
                }
            })
        })
    },

    // 评论点击
    inputTap() {
        this.setData({
            isInput: !this.data.isInput,
            showCommentBox: false
        })
    },

    // 评论点击确认
    commentSure() {
        index.sendComment(this.data.comment)
        this.setData({
            commentList: [...this.data.commentList, { nickname: this.data.userInfo.nickName, addtime: dateToStr(), info: this.data.comment, avatar: this.data.userInfo.avatarUrl }],
            isInput: false,
            comment: ''
        })
    },

    // 保存评论文字
    bindTextAreaInput: function (e) {
        this.setData({
            comment: e.detail.value
        })
    },

    // 电话点击
    phonetap() {
        if (this.data.info.content.shouji || this.data.info.content.telphone){
            wx.makePhoneCall({
                phoneNumber: this.data.info.content.shouji ? this.data.info.content.shouji : this.data.info.content.telphone
            })
        }
    },

    // 分享按钮
    onShareAppMessage: function (res) {
        let _this = this;
        if (res.from === 'button') {
          // 来自页面内转发按钮
            console.log(res.target)
        }

        let params = ''
        for (let i in pageOptions) {
            params += i + '=' +pageOptions[i] + '&'
        }
        params = params.slice(0, -1)

        return {
            title: '更多精彩尽在镇镇通',
            path: '/yc_youliao/page/release/detail/index?' + params,
            success: function (res) {
                index.sendviews(_this.data.id,(data) => {
                    if(data && data.errno == 0){
                        _this.setData({
                            sendNum: _this.data.sendNum - (-1)
                        })
                    }
                })
                console.log('/yc_youliao/page/release/detail/index?' + params)
            },
            fail: function (res) {
            // 转发失败
            }
        }
    },

    doZanInfo(e){
        if(this.data.isZaned){
            return
        }
        index.doZanInfo(this.data.id,(data)=>{
            this.setData({
                isZaned: !this.data.isZaned,
                zanNum: this.data.isZaned ? this.data.zanNum - 1 : this.data.zanNum - (-1) 
            })
        })
    },

    getFormatDays(timesamp){
        var timestampNow = Date.parse(new Date()); 
    
        var num1 = (timestampNow-timesamp*1000)/(24*60*60*1000);
        var num2 = (timestampNow-timesamp*1000)/(60*60*1000);
        var num3 = (timestampNow-timesamp*1000)/(60*1000);

        let time = '';
        if(Math.floor(num1)>=1){
            time = Math.floor(num1) + '天前'
        }else{
            if(Math.floor(num2)>=1){
                time = Math.floor(num2) + '小时前'
            }else{
                if(Math.floor(num3)>=1){
                    time = Math.floor(num3) + '分钟前'
                }else{
                    time = '刚刚'
                }
            }
        }
        return time;
    },

    goHome(){
        wx.switchTab({
            url: `/yc_youliao/page/index/index`
        })
    }
})