import { getImageSocket, handleTime } from '../../../resource/utils/comment.js'
import { html2json } from '../../../resource/js/htmlToWxml.js'
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
		// icon-weixinpay
		icon: '',
		marqueePace: 1,//滚动速度
    	marqueeDistance: 0,//初始滚动距离
    	orientation: 'left',//滚动方向
    	interval: 20, // 时间间隔
    	marqueeDistance2: 0,
	    marquee2copy_status: false,
	    marquee2_margin: 60,
	    size: 11,
	    text: '通知：春节放假期间暂停发货，所有订单在正月10日后开始发货，不便之处，敬请谅解！',
	    showGetCoupon: false,
	    couponList: []
    },

    onLoad: function (options) {
    	pageOptions = options
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
	        this.setData({
	        	isCollect: flag
	        })
	    })

        // 加载商户信息
	    shopStore.getData(id,(data) => {
	    	let obj = data;
	    	obj.bannerImg = [];
	        if(obj && obj.qr_code && obj.qr_code.length){
	        	obj.qr_code.map((item,index)=>{
		        	if(item.indexOf('http') < 0 ){
						item = this.data.imagesSocket + '/' + item
		        	}
				})
	        	if(obj.qr_code.length>5){
	        		obj.bannerImg = obj.qr_code.slice(0,5)
	        	}else{
	        		obj.bannerImg = obj.qr_code
	        	}
		        
	        }
			
			obj.dp = obj.dp > 5 ? '5.0' : obj.dp;
	        let num1 = Math.floor(obj.dp);
	        let	num2 = Math.ceil(obj.dp - num1); 
	        let	num3 = Math.floor(5 - obj.dp); 
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

	        if(obj.inco && obj.inco.length){
	        	let arr = [], icon = '';
	        	obj.inco.forEach((item,index)=>{
	        		if(item == 'WIFI'){
						icon = 'icon-wifi'
	        		}else if(item == '支付宝支付'){
						icon = 'icon-alipay'
	        		}else if(item == '停车位'){
						icon = 'icon-stop'
	        		}else if(item == '微信支付'){
						icon = 'icon-weixinpay'
	        		}
	        		arr.push({
	        			icon: icon,
	        			text: item
	        		})
	        	})
	        	obj.icon = arr
	        }
	        this.setData({
	        	shopInfo: obj,
	        	tabList: [{
					name: '主页',
					tab: 0
				},{
					name: '发现(' + data.infoNum + '条)',
					tab: 1
				},{
					name: '评论(' + data.comment + '条)',
					tab: 2
				}],
				score_solid: arr,
				score_solid_half: arr1,
				score_solid_none: arr2,
	        })
	        if (data.intro) {
	        	let des = obj.intro
		        this.setData({
		            des: html2json(obj.intro)
		        })	
	        }
	    })
    },

    onShow: function () {
	    var vm = this;
	    var length = vm.data.text.length * vm.data.size;      // 文字长度
	    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
	    vm.setData({
	        length: length,
	        windowWidth: windowWidth,
	        marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
	    });
	    vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
	    // vm.run2();  // 第一个字消失后立即从右边出现
	  },

    changeTab(e){
    	let tab = e.currentTarget.dataset.tab
    	let id = this.data.shop_id
    	let type = this.data.shopInfo.infoNum
    	let comment = this.data.shopInfo.comment
		this.setData({
			tab: tab
		})

    	if(tab == 1 && type){
			shopStore.getPublishData(id,(data) => {
	    		data.map((item)=>{
	    			if(item.freshtime){
		    			item.freshtime = handleTime(item).freshtime;
		    		}
	    		})
	    		
				this.setData({
					msgList: data
				})
			})
    	}

    	if(tab == 2 && comment){
    		let form = {};
    		form.id = this.data.shop_id;
    		detail.getComment(form,(data)=>{
				let obj = data.data;
    			obj.map((item,index)=>{
    				let len = item.dp
    				let arr = [], arr1 = [];
    				for(let i=0; i<len; i++){
    					arr.push(i)
    				}
    				for(let j=0; j<5-len; j++){
    					arr1.push(j)
    				}
    				item.starList1 = arr;
    				item.starList2 = arr1;
    			})
    			this.setData({
					commentList: obj
				})

    		})
    	}
    },

    // 图片预览
    previewImg(e) {
        let arr = e.currentTarget.dataset.src; let arr2 = arr;
        arr.map((item)=>{
            if(item.indexOf('http')<0){
                arr2.length = 0;
                arr2.push(this.data.imagesSocket + '/' + item)
            }
        })
        wx.previewImage({
            urls: arr2       // 需要预览的图片http链接列表
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
	        latitude: parseFloat(this.data.shopInfo.lat), 
	        longitude: parseFloat(this.data.shopInfo.lng), 
	        address: this.data.shopInfo.address, 
	        success: (res) => {

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

            },
            fail: function (res) {
            // 转发失败
            }
        }
    },

    run1: function () {
	    var vm = this;
	    var interval = setInterval(function () {
	      if (-vm.data.marqueeDistance < vm.data.length) {
	        vm.setData({
	          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
	        });
	      } else {
	        clearInterval(interval);
	        vm.setData({
	          marqueeDistance: vm.data.windowWidth
	        });
	        vm.run1();
	      }
	    }, vm.data.interval);
	},

    run2: function () {
	    var vm = this;
	    var interval = setInterval(function () {
	        if (-vm.data.marqueeDistance2 < vm.data.length) {
		        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
		        vm.setData({
		          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
		          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
		        });
	        }else {
		        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
		          vm.setData({
		            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
		          });
		          clearInterval(interval);
		          vm.run2();
		        }else {
		          clearInterval(interval);
		          vm.setData({
		            marqueeDistance2: -vm.data.windowWidth
		          });
		          vm.run2();
		        }
	        }
	    }, vm.data.interval);
	},

	// 阻止蒙层下滚动
	preventD(){

	},

	getCouponList(e){
		if(this.data.showGetCoupon){
			this.setData({
				showGetCoupon: false
			})
			return
		}

		let form = {};
		form.id = this.data.shop_id;
		detail.getCouponList(form,(data)=>{
			if(!data || !data.data.length){
				wx.showModal({
	                title: '提示',
	                content: '该商家暂未提供优惠券~~',
	                showCancel: false,
	                confirmColor: '#333',
	                success: function (res) {
	                    if (res.confirm) {

	                    } else if (res.cancel) {

	                    }
	                }
	            })	
	            return
			}
			if(data && data.data.length){
				this.setData({
					showGetCoupon: true,
					couponList: data.data
				})
			}
		})
	},

	chooseCoupon(e){
		let item = e.currentTarget.dataset.item
		let form = {};
		form.tid = item.id;
		detail.chooseCoupon(form,(data)=>{
			if(data.data && data.data.errno == 0){
				wx.showToast({
                    title: '优惠券领取成功',
                    icon: 'success',
                    duration: 3000,
                    success: ()=>{
			            setTimeout(()=>{
			                this.setData({
			                	showGetCoupon: false
			                })
			            }, 3000) 
		    	    }
                })
			}
		})
	}

})