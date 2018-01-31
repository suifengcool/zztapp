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
		msgList: [],
		showSearch: true,
		page: 1,
		isComplete: false,
		imagesSocket: '',
	},
	
	onLoad: function(option){
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
		}
		
		this.getData()
	},

	listenerInput(e){
		this.setData({
            keyword: e.detail.value
        })
	},

	getData(){
		if(this.data.isComplete) return

		let form = {};
		if(this.data.keyword.trim()){
			form.key = this.data.keyword
		}
		form.page = this.data.page,
        form.num = LENGTH
		index.search(form,(data)=>{

			if (data.length < LENGTH) {
		        this.setData({
		            isComplete: true
		        })
	        }

	        let arr = [];
	        arr = [...this.data.msgList, ...data];
	        arr.map((item,index)=>{
	        	if(item.avatar.indexOf('http') < 0 ){
					item.avatar = this.data.imagesSocket + '/' + item.avatar
	        	}
			})

	        this.setData({
		        msgList: [...this.data.msgList, ...data],
	        	page: this.data.page + 1
		    })
		})
		
	},

	search(){
		this.setData({
			isComplete: false,
			page: 1,
			msgList: []
		})
		this.getData()
	},

	// 页面上拉触底事件的处理函数
    onReachBottom: function () {
    	this.getData()
    },

	
})