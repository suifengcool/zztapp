import { getImageSocket } from '../../../resource/utils/comment.js'
import { html2json } from '../../../../we7/resource/js/htmlToWxml.js'
import { ShopStore } from 'shopStore-model.js'
import { Detail } from 'detail-model.js'
const shopStore = new ShopStore()
var detail = new Detail()
const app = getApp()

Page({
    data: {
		movies: [],                                   // 轮播图数据
		tabList: [{
			name: '主页',
			tab: 0
		},{
			name: '发现',
			tab: 1
		}],
		data: null,
		shop_id: '',
		isCollect: false,
		tab:0,
		msgList: [{
			avatar:"https://wx.qlogo.cn/mmopen/vi_32/3hE5bd8Np4fEsibJQcDq18mMExLgIrlRfk896McfIzh6TiblSfoN9q8iaL3JKxMHV04blonHlxfKtwcaua4Df87Nw/0",
			city:"武汉市"

		}]
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
    	let id = options.shop_id;

		this.setData({
			shop_id: id,
            movies: [{
	        	url:'http://img04.tooopen.com/images/20130712/tooopen_17270713.jpg'
	        },{
	        	url:'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg'
	        },{
	        	url:'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg'
	        },{
	        	url:'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg'
			}]
        })

        // 收藏判断
	    detail.isCollect(id,(flag) => {
	        this.setData({
	        	isCollect: flag
	        })
	    })

        // 加载商户信息
	    shopStore.getData(id,(data) => {
	        console.log(data)
	        this.setData({
	        	data
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
		this.setData({
			tab: tab
		})
    },

    // 电话拨打
    phonetap() {
	    if (this.data.data.telphone) {
	        wx.makePhoneCall({
	        	phoneNumber: this.data.data.telphone
	        })
	    }
    },
	
	// 查看地图
    map() {
	    wx.openLocation({
	        latitude: parseFloat(this.data.data.lat), longitude: parseFloat(this.data.data.lng), address: this.data.data.address, success: (res) => {
	        	console.log(res)
	        }
	    })
    },

    // 收藏(取消收藏)按钮
    onCollectTap() {
    	let id = this.data.shop_id;
	    detail.collect(id,(res) => {
	        console.log(res)
	        this.setData({
	        	isCollect: !this.data.isCollect
	        })
	        wx.showToast({
		        title: res.data.message,
		        icon: 'success',
		        duration: 2000
	        })
	    })
    },

})