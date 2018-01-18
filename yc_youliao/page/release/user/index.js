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
			console.log('data:',data)
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
    	wx.redirectTo({
	        url: `/yc_youliao/page/release/create/index?user_name=${item.nickname}&user_id=${item.shop_id}`
    	})
    }

})