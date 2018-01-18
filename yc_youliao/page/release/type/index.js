import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
		typeList: [],
		allType: {
			name: '不选择分类',
			id:0
		}
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
		this.getTypeList()
    },

    getTypeList(){
    	index.getChannel((data)=>{
			console.log('data:',data)
			this.setData({
				typeList: data
			})
		})
    },

    chooseType(e){
    	let item = e.currentTarget.dataset.item
    	wx.redirectTo({
	        url: `/yc_youliao/page/release/create/index?type_name=${item.name}&type_id=${item.id}`
    	})
    }
})