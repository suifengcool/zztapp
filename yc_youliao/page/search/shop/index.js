import { getUserInfo, getImageSocket, getLocation , dateToStr} from '../../../resource/utils/comment.js'

import { Index } from 'index-model.js'

var index = new Index()

let app = getApp();
const LENGTH = 10;

Page({
	data: {
		keyword: '',
		tab: 0,
		isKeywordEmpty: true,
		shopList: [],
		showSearch: true,
		page: 1,
		isComplete: false,
		imagesSocket: '',
		cate_id: 0,
		

	},
	
	onLoad: function(option){
		console.log('option:',option)
		// 获取图片头
		getImageSocket((data) => {
		    this.setData({
				imagesSocket: data
		    })
		});

		if(option && option.keyword){
			this.setData({
				keyword: option.keyword,
				isKeywordEmpty: false,
				showSearch: option.from ? false : true
			})

			if(option.from){
				this.setData({
					cate_id: option.cate_id
				})
				this.getDataByCateId()
			}else{
				this.getData()
			}
		}
	},

	listenerInput(e){
		this.setData({
            keyword: e.detail.value
        })
	},

	search(){
		this.setData({
			isComplete: false,
			page: 1,
			shopList: []
		})
		this.getData()
	},

	getData(){
		if(this.data.isComplete) return

		let form = {};
		if(this.data.keyword.trim()){
			form.key = this.data.keyword
		}
		form.page = this.data.page
        form.num = LENGTH
		index.search(form,(data)=>{

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

	        	item.dp = item.dp > 5 ? 5 : item.dp;
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
		        shopList: [...this.data.shopList,...data],
	        	page: this.data.page + 1
		    })
		})
	},

	getDataByCateId(){
		if(this.data.isComplete) return

		let form = {};
		form.page = this.data.page
        form.num = LENGTH

        if(this.data.cate_id != 31){
        	form.cid = this.data.cate_id
        }
        
		index.getPageData(form,(data)=>{

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
	        	item.dp = item.dp > 5 ? 5 : item.dp;
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
		        shopList: [...this.data.shopList,...data],
	        	page: this.data.page + 1
		    })
		})
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
    	if(this.data.cate_id){
    		this.getDataByCateId()
    	}else{
    		this.getData()
    	}
    },

	
})