import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
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
        list: [],
        imagesSocket: ''
    },

    onLoad: function (options) {
        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

        wx.setNavigationBarTitle({
            title: options.name
        })

        let form = {}
        form.LENGTH = 10
        form.id = options.id
        index.getModuleData(form,(data)=>{
            console.log('data:',data)
            this.setData({
                list: data
            })
        })
	
    },

    changeTap(e){
        let item = e.currentTarget.dataset.item;
        this.setData({
            tab: item.id
        })
    },

})