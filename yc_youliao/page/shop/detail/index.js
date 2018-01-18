import { getImageSocket, handleTime } from '../../../resource/utils/comment.js'
import { html2json } from '../../../../we7/resource/js/htmlToWxml.js'
import { ShopStore } from 'shopStore-model.js'
import { Detail } from 'detail-model.js'
const shopStore = new ShopStore()
var detail = new Detail()
const app = getApp()
let pageOptions = null
Page({
    data: {
		tabList: [],
		shopInfo: {},
		shop_id: '',
		isCollect: false,
		imagesSocket: '',
		tab:0,
		msgList: [],
		score: 5,
		score_solid: [],
		score_solid_half: [],
		score_solid_none: [],
    },

    onLoad: function (options) {
    	pageOptions = options
    	console.log('options:',options)
    	// 获取图片头
		getImageSocket((data) => {
		    this.setData({
				imagesSocket: data
		    })
		});

    	let id = options.shop_id;

		this.setData({
			shop_id: id
        })

        // 收藏判断
	    detail.isCollect(id,(flag) => {
	    	console.log('flag:',flag)
	        this.setData({
	        	isCollect: flag
	        })
	    })

        // 加载商户信息
	    shopStore.getData(id,(data) => {
	        if(data && data.qr_code && data.qr_code.length){
	        	if(data.qr_code.length>5){
	        		data.qr_code = data.qr_code.slice(0,5)
	        	}
		        data.qr_code.map((item,index)=>{
		        	if(item.indexOf('http') < 0 ){
						item = this.data.imagesSocket + '/' + item
		        	}
				})
	        }
			
			data.dp = data.dp > 5 ? 5 : data.dp;
	        let num1 = Math.floor(data.dp);
	        let	num2 = Math.ceil(data.dp - num1); 
	        let	num3 = Math.floor(5 - data.dp); 
	        let	arr = [], arr1 = [], arr2 = []
	        for(let i=0;i<num1;i++){
				arr.push('solid_star')
	        }
	        for(let i=0;i<num2;i++){
				arr1.push('solid_star')
	        }
	        for(let i=0;i<num3;i++){
				arr2.push('solid_star')
	        }
	        this.setData({
	        	shopInfo: data,
	        	tabList: [{
					name: '主页',
					tab: 0
				},{
					name: '发现(' + data.infoNum + '条)',
					tab: 1
				}],
				score_solid: arr,
				score_solid_half: arr1,
				score_solid_none: arr2,
	        })
	        if (data.intro) {
	        	let des = data.intro
		        this.setData({
		            des: html2json(data.intro)
		        })	
	        }
	    })
    },

    changeTab(e){
    	let tab = e.currentTarget.dataset.tab
    	let id = this.data.shop_id
    	let type = this.data.shopInfo.infoNum

    	type && tab && shopStore.getPublishData(id,(data) => {
    		data.map((item)=>{
    			if(item.freshtime){
	    			item.freshtime = handleTime(item).freshtime;
	    		}
    		})
    		
			this.setData({
				tab: tab,
				msgList: data
			})
		})
    },

    // 电话拨打
    phonetap() {
	    if (this.data.shopInfo.telphone) {
	        wx.makePhoneCall({
	        	phoneNumber: this.data.shopInfo.telphone
	        })
	    }
    },
	
	// 查看地图
    map() {
	    wx.openLocation({
	        latitude: parseFloat(this.data.shopInfo.lat), longitude: parseFloat(this.data.shopInfo.lng), address: this.data.shopInfo.address, success: (res) => {
	        	console.log(res)
	        }
	    })
    },

    // 收藏(取消收藏)按钮
    onCollectTap() {
    	let id = this.data.shop_id;
	    detail.collect(id,(res) => {
	        this.setData({
	        	isCollect: !this.data.isCollect
	        })
	        wx.showToast({
		        title: this.data.isCollect ? '收藏成功' : '取消收藏成功',
		        icon: 'success',
		        duration: 2000
	        })
	    })
    },

    // 分享按钮
    onShareAppMessage: function (res) {
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
            path: '/yc_youliao/page/shop/detail/index?' + params,
            success: function (res) {
                console.log('/yc_youliao/page/shop/detail/index?' + params)
            },
            fail: function (res) {
            // 转发失败
            }
        }
    },

})