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

		this.fetchData('new')

        index.getPublishData((data)=>{
			this.setData({
				moduleList: data.module,
				count: data.count
			})
		})
    },

    onShow: function(){
		this.fetchData('new')
    },

    fetchData(type){
		let form = {};
		form.type = type;
		index.getModuleData(form,(data)=>{
            this.setData({
                dataList: data
            })
        })
    },

    // 图片预览
    previewImg(e) {
        let arr = e.currentTarget.dataset.src; 
        let arr2 = arr;
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

    changeTap(e){
    	let item = e.currentTarget.dataset.item;
    	this.setData({
    		tab: item.id
    	})

    	switch(item.id){
			case 0:
			    this.fetchData('new')
			    break;
			case 1:
			    this.fetchData('hot')
			    break;
		    case 2:
			    this.fetchData('comment')
			    break;
		    case 3:
			    this.fetchData('near')
			    break;
		}
    },

    goToModule(e){
		let item = e.currentTarget.dataset.item;
		wx.navigateTo({
            url: `/yc_youliao/page/release/list/index?name=${item.name}&id=${item.id}`
        })
    },

    goToSearch(e){
    	wx.navigateTo({
            url: `/yc_youliao/page/search/index/index?fromPage=release`
        })
    }
})