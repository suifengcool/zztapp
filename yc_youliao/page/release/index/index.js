import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
		form:{},
		imagesSocket: '',
		tabList: [{
			name: '最新',
			id: 0
		},{
			name: '热门主题',
			id: 1
		},{
			name: '热门评论',
			id: 2
		},{
			name: '离我最近',
			id: 3
		}],
		tab: 0,
		newMsgList: [],
		hotMsgList: [],
		nearMsgList: [],
		dataList: [],
		moduleList: [],
		count: {}
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

		index.getPublishData((data)=>{
			this.setData({
				newMsgList: data.newMsg,
				hotMsgList: data.hotMsg,
				nearMsgList: data.nearMsg,
				dataList: data.newMsg,
				moduleList: data.module,
				count: data.count
			})
		})
    },

    changeTap(e){
    	let item = e.currentTarget.dataset.item;
    	this.setData({
    		tab: item.id
    	})

    	switch(item.id){
			case 0:
			    this.setData({
		    		dataList: this.data.newMsgList
		    	})
			    break;
			case 1:
			    this.setData({
		    		dataList: this.data.hotMsgList
		    	})
			    break;
		    case 2:
			    this.setData({
		    		dataList: []
		    	})
			    break;
		    case 3:
			    this.setData({
		    		dataList: this.data.nearMsgList
		    	})
			    break;
		}

		console.log('this.data.dataList:',this.data.dataList)
    },

    goToModule(e){
		let item = e.currentTarget.dataset.item;
		wx.navigateTo({
            url: `/yc_youliao/page/release/list/index?name=${item.name}&id=${item.id}`
        })
    }
})