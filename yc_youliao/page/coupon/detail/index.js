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
        console.log('options11:',options)
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

            let form = {}
            form.id = options.id

            index.getCouponDetail(form,(data)=>{
                if(data && data.data){
                    this.setData({
                        couponInfo: data.data,
                        isMaster: true,
                        id: options.id
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
            console.log('data:',data)
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
    }
})