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
			this.setData({
				typeList: data
			})
		})
    },

    chooseType(e){
    	let item = e.currentTarget.dataset.item
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面

        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
            'form.type_name':item.name,
            'form.type_id':item.id,
        })
        wx.switchTab({
            url: `/yc_youliao/page/release/create/index`
        })
    }
})