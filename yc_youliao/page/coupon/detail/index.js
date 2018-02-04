import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
		isUsed: false,
		imagesSocket: '',
		couponInfo: {},
        id: null,
        isMaster: false,
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

        if(options && options.id){
            this.setData({
                id: options.id
            })
        }
        this.fetchData()
    },

    fetchData(){
        if(this.data.id){
            let form = {}
            form.id = this.data.id

            index.getCouponDetail(form,(data)=>{
                if(data && data.data){
                    this.setData({
                        couponInfo: data.data,
                        isMaster: true
                    })
                }
            })
        }else{
            let couponDetail = wx.getStorageSync('couponDetail');
            if(couponDetail){
                this.setData({
                    couponInfo: couponDetail
                })
            }
        }
    },

    confirmCoupon(e){
        index.confirmCoupon({id:this.data.id},(data)=>{
            if(data && data.errno == 0){
                wx.showToast({
                    title: '优惠券核销成功',
                    icon: 'success',
                    duration: 3000,
                    success: ()=>{
                        setTimeout(()=>{
                            wx.switchTab({
                               url: `/yc_youliao/page/index/index`
                            })
                        }, 3000) 
                    }
                })
            }
        })
    },

    // 下拉更新
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        if(this.data.id){
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
            return
        }
        let form = {};
        form.id = this.data.couponInfo.id
        index.getCouponDetail(form,(data) => {
            if(data && data.data){
                this.setData({
                    couponInfo: data.data
                })
            }
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        })
    },

    goToApp(){
        wx.redirectTo({
            url: `/yc_youliao/page/index/index`
        })
    }
})