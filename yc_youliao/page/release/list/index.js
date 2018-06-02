import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()
const LENGTH = 10;
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
        imagesSocket: '',
        id: '',
        isComplete: false,
    },

    onLoad: function (options) {
        console.log('options:',options)
        if(options && options.id){
            this.setData({
                id: options.id 
            })
        }
        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

        wx.setNavigationBarTitle({
            title: options.name
        })

        this.getData()
    },

    getData(tab){
        let form = {}
        form.LENGTH = 10
        form.id = this.data.id
        if(tab){
            switch(tab){
                case 0:
                    form.type = 'new'
                    break;
                case 1:
                    form.type = 'hot'
                    break;
                case 2:
                    form.type = 'comment'
                    break;
                case 3:
                    form.type = 'near'
                    break;
            }
        }
        index.getModuleData(form,(data)=>{
            if (data.length < LENGTH) {
                this.setData({
                    isComplete: true
                })
            }
            this.setData({
                list: data
            })
        })
    },

    changeTap(e){
        let item = e.currentTarget.dataset.item;
        this.getData(item.id)
        this.setData({
            tab: item.id
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

})