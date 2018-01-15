import { getUserInfo, getImageSocket, getLocation , dateToStr} from '../../resource/utils/comment.js'
import { ShopList } from 'shopList-model.js'
import { Index } from 'index-model.js'

var index = new Index()
var shopList = new ShopList();
let app = getApp();
let animationShowHeight = 300; 
const LENGTH = 10;

Page({
	data: {
		movies: [],                                   // 轮播图数据
		shopList: [],
		cate: [{
			cate_name: '全部分类',
			cate_id: 0
		}],
		advs: [],
		hotshop: [],
	  //   cate: [{
			// cate_name: '全部分类',
			// cate_id: 0
	  //   },{
	  //   	cate_name: '餐饮美食',
	  //   	cate_id: 1
	  //   },{
	  //   	cate_name: '电影KTV',
	  //   	cate_id: 2
	  //   },{
	  //   	cate_name: '酒店住宿',
	  //   	cate_id: 3
	  //   },{
			// cate_name: '休闲娱乐',
			// cate_id: 4
	  //   },{
			// cate_name: '结婚摄影',
			// cate_id: 5
	  //   },{
			// cate_name: '艺术培训',
			// cate_id: 6
	  //   },{
	  //   	cate_name: '家居建材',
	  //   	cate_id: 7
	  //   },{
			// cate_name: '服装饰品',
			// cate_id: 8
	  //   },{
			// cate_name: '数码家电',
			// cate_id: 9
	  //   },{
			// cate_name: '医疗保健',
			// cate_id: 10
	  //   },{
	  //   	cate_name: '汽贸汽修',
	  //   	cate_id: 11
	  //   },{
			// cate_name: '水果生鲜',
			// cate_id: 12
	  //   },{
			// cate_name: '农家娱乐',
			// cate_id: 13
	  //   },{
			// cate_name: '金融服务',
			// cate_id: 14
	  //   }],
	    cateId: -1,
	    page: 0,
	    location: null,
	    imagesSocket: '',
	    isComplete: false
	},
	
	onLoad: function(){
		// 获取用户信息
		getUserInfo((data) => {
			let userInfo = data
			this.setData({
				name: userInfo.nickName,
				avatar: userInfo.avatarUrl
			})
		});

		wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000'
        })

		// 获取图片头
		getImageSocket((data) => {
		    this.setData({
				imagesSocket: data
		    })
		});

		index.getIndexData((data)=>{
			this.setData({
	       		cate: [...this.data.cate, ...data.cate],
	       		advs: [...this.data.advs, ...data.advs],
	       		hotshop: [...this.data.hotshop, ...data.hotshop]
	        })
		})

		// 获取首页轮播图数据源
		this.setData({
			movies: [{
				url:'http://img04.tooopen.com/images/20130712/tooopen_17270713.jpg',
				name: '顾村新街幼儿园'
			},{
				url:'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg',
				name: '中国电信'
			},{
				url:'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg',
				name: '家乐福超市'
			},{
				url:'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg',
				name: '沃尔玛'
			}]
		});
		
		// 获取店铺位置
	    getLocation((location) => {
	        this.setData({
	        	location: location
	        })
	      	this.getData(false)
	    });
		
		// 获取分类信息
	    shopList.getGetCateData((data) => {
	        this.setData({
	       		cate: [...this.data.cate, ...data]
	        })
	    })
	},

	// 二维码
	scanCode() {
	    wx.scanCode({
	        success: (res) => {
	        	console.log(res)
	        },
	        fail: (res) => {
	        	console.log(res)
	        }
	    })
	},
	
    // 用户点击右上角分享
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
		    // 来自页面内转发按钮
		    console.log(res.target)
		}
		return {
		    title: '更多的精彩尽在镇镇通',
		    // 转发成功
		    success: function (res) {
				console.log('转发成功:',res)
		    },
		    // 转发失败
		    fail: function (res) {
				console.log('转发失败:',res)
		    }
		}
	},

	// 显示遮罩层  
	showAllClassify(){ 
		var _this = this;
		var animation = wx.createAnimation({  
			duration: 200,  
			timingFunction: "linear",  
			delay: 0  
		});  
		_this.animation = animation;  
		animation.translateY(animationShowHeight).step(); 

		_this.setData({  
			animationData: animation.export(),  
			showClassify: !_this.data.showClassify  
		});

		setTimeout(function () {  
			animation.translateY(0).step()  
			_this.setData({  
				animationData: animation.export()  
			})  
		}.bind(_this), 200);  
	},

	// 隐藏遮罩层  
	closeClassify(){
		var _this = this;
		var animation = wx.createAnimation({  
			duration: 200,  
			timingFunction: "linear",  
			delay: 0  
		});  

		_this.animation = animation;  
		animation.translateY(animationShowHeight).step();

		_this.setData({  
			animationData: animation.export(),  
		});

		setTimeout(function () {  
			animation.translateY(0).step();  
			_this.setData({  
				animationData: animation.export(),  
				showClassify: false  
			})  
		}.bind(_this), 200);  
	},

	// 阻止蒙层下滚动
	preventD(){

	},

	getData(newId) {
	    if(newId){
	        this.setData({
		        page: 0,
		        isComplete: false,
		        shopList: []
	        })
	    }
	    if(this.data.isComplete) return

	    let form = {
	        lat: this.data.location.latitude,
	        lng: this.data.location.longitude,
	        page: this.data.page,
	        num: LENGTH
	    }

	    if(this.data.cateId != -1) form.cid = this.data.cateId

	    shopList.getPageData(form, (data) => {
	        console.log(form,data)
	        if (data.length < LENGTH) {
		        this.setData({
		            isComplete: true
		        })
	        }
	        this.setData({
		        shopList: [...this.data.shopList, ...data],
	        	page: this.data.page + 1
		    })
	    })
	},

	// 点击选择分类
	scrollTap(e) {
	    let id = parseInt(e.currentTarget.dataset.id);

	    this.setData({
	      	cateId: id
	    })
	    this.getData(true)
	},

	// 点击门店列表，查看店铺详情
	tap (e) {
	    let id = e.currentTarget.dataset.id;
	    wx.navigateTo({
	        url: `/yc_youliao/page/shop/detail/index?shop_id=${id}`
    	})
    },

    // 页面上拉触底事件的处理函数
    onReachBottom: function () {
    	this.getData(false)
    },

    // 下拉更新
    onPullDownRefresh: function () {
    	wx.showNavigationBarLoading()
	    index.getIndexData((data) => {
	    	wx.hideNavigationBarLoading()
        	wx.stopPullDownRefresh()
        })
    },
})