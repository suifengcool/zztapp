import { getImageSocket } from '../../../resource/utils/comment.js'
import { html2json } from '../../../../we7/resource/js/htmlToWxml.js'
import { ShopStore } from 'shopStore-model.js'
import { Detail } from 'detail-model.js'
const shopStore = new ShopStore()
var detail = new Detail()
const app = getApp()

Page({
    data: {
		tabList: [],
		shopInfo: {},
		shop_id: '',
		isCollect: false,
		imagesSocket: '',
		tab:0,
		msgList: [{
			avatar:"https://wx.qlogo.cn/mmopen/vi_32/3hE5bd8Np4fEsibJQcDq18mMExLgIrlRfk896McfIzh6TiblSfoN9q8iaL3JKxMHV04blonHlxfKtwcaua4Df87Nw/0",
			city:"武汉市"

		}]
    },

    onLoad: function (options) {
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
	    	console.log('data111:',data)
	        if(data && data.qr_code.length){
		        data.qr_code.map((item,index)=>{
		        	if(item.indexOf('http') < 0 ){
						item = this.data.imagesSocket + '/' + item
		        	}
				})
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
	        })
	        if (data.intro) {
	        	let des = data.intro
		        this.setData({
		            des: html2json(data.intro)
		        })	
	        }
	        console.log('this.data.shopInfo:',this.data.shopInfo)
	    })
    },

    changeTab(e){
    	let tab = e.currentTarget.dataset.tab
    	let id = this.data.shop_id
    	let type = this.data.shopInfo.infoNum
  //   	type && tab && shopStore.getPublishData(id,(data) => {
		// 	this.setData({
		// 		tab: tab,
		// 		msgList: data
		// 	})
		// })
		this.setData({
				tab: tab
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

})