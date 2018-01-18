import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
		info:{},
        imagesSocket: '',
        commentList: [],
        id: '',
        isCollect: false,
        showCommentBox: false,
        scanNum: 100,
        isInput: false,
        comment: ''
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {

        wx.setNavigationBarTitle({
            title: '详情'
        })

        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

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
            this.setData({
                info: data
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
  // 失去保存评论文字
  bindTextAreaInput: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },

    
})