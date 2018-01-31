import { getImageSocket } from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()
Page({
    data: {
        imagesSocket: '',
        couponList: [], 
    },

    onLoad: function (options) {
	   // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

        index.getCouponList((data)=>{
            this.setData({
                couponList: data.data
            })
        })
    },

    goDetail(e){
    	let item = e.currentTarget.dataset.item;
        if(item.status > 0) return
        wx.setStorage({
            key: "couponDetail",
            data: item,
            success: (res)=>{
                wx.navigateTo({
                    url: `/yc_youliao/page/coupon/detail/index`
                }) 
            }
        })
    }
})