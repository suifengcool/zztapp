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
		shopList: [],
		cate: [],
		advs: [],
		hotshop: [],
	    cateId: -1,
	    page: 1,
	    location: null,
	    imagesSocket: '',
	    isComplete: false,
	    currentIndex: 0,

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
			let arr = [];
	        arr = [...this.data.hotshop, ...data.hotshop];
	        arr.map((item,index)=>{
	        	if(item.logo.indexOf('http') < 0 ){
					item.logo = this.data.imagesSocket + '/' + item.logo
	        	}
			})
			this.setData({
	       		cate: [...data.cate],
	       		advs: [...this.data.advs, ...data.advs],
	       		hotshop: [...this.data.hotshop, ...data.hotshop]
	        })
		})

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
	       		cate: data
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
		        page: 1,
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

	    if(this.data.cateId != 31) form.cid = this.data.cateId

	    shopList.getPageData(form, (data) => {
	        if (data.length < LENGTH) {
		        this.setData({
		            isComplete: true
		        })
	        }

	        let arr = [];
	        arr = [...this.data.shopList, ...data];
	        arr.map((item,index)=>{
	        	if(item.logo.indexOf('http') < 0 ){
					item.logo = this.data.imagesSocket + '/' + item.logo
	        	}
				
				item.dp = item.dp > 5 ? '5.0' : item.dp;
	        	let num1 = Math.floor(item.dp);
		        let	num2 = Math.ceil(item.dp - num1); 
		        let	num3 = Math.floor(5 - item.dp); 
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
		        item.score_solid = arr;
		        item.score_solid_half = arr1;
		        item.score_solid_none = arr2;
			})
	        this.setData({
		        shopList: arr,
	        	page: this.data.page + 1
		    })
	    })
	},

	// 点击选择分类
	scrollTap(e) {
	    let id = parseInt(e.currentTarget.dataset.id);
	    let index = parseInt(e.currentTarget.dataset.index);
	    this.setData({
	      	cateId: id,
	      	currentIndex: index
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