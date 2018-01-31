import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
		userList: [],
		imagesSocket: ''
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {

    	// 获取图片头
		getImageSocket((data) => {
		    this.setData({
				imagesSocket: data
		    })
		});

		this.getUserList()
    },

    getUserList(){
    	index.getUserName((data)=>{
			let arr = data;
	        arr.map((item,index)=>{
	        	if(item.logo.indexOf('http') < 0 ){
					item.logo = this.data.imagesSocket + '/' + item.logo
	        	}
			})
			this.setData({
				userList: arr
			})
		})
    },

    chooseUser(e){
    	let item = e.currentTarget.dataset.item
    	var pages = getCurrentPages();
		var currPage = pages[pages.length - 1];   //当前页面
		var prevPage = pages[pages.length - 2];  //上一个页面

		//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
		prevPage.setData({
		    'form.nickName':item.nickname,
            'form.shop_id':item.shop_id,
            'form.logo':item.logo,
		})
    	wx.switchTab({
	        url: `/yc_youliao/page/release/create/index`
    	})
    }

})