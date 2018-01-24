import { MyCollect } from 'myCollect-model.js'
import { getImageSocket } from '../../resource/utils/comment.js'
var myCollect = new MyCollect()

Page({
    data: {
        data: [],
        none: false,
        tab: 0,
        infoList: [],
        shopList: [],
        text: '暂无收藏，快去收集你喜爱的店铺吧~',
        tabList: [{
            name: '店铺',
            tab: 0
        },{
            name: '信息',
            tab:1
        }]
    },

    onLoad: function (options) {
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        })
        this.getCollect()
    },

    // 获取收藏数据
    getCollect() {
        myCollect.getMyCollectData((infoData,shopData) => {
            shopData.map((item,index)=>{
                if(item.logo.indexOf('http') < 0 ){
                    item.logo = this.data.imagesSocket + '/' + item.logo
                }
                
                item.dp = item.dp > 5 ? '5.0' : item.dp;
                let num1 = Math.floor(item.dp);
                let num2 = Math.ceil(item.dp - num1); 
                let num3 = Math.floor(5 - item.dp); 
                let arr = [], arr1 = [], arr2 = []
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
            
            infoData.map((item,inde)=>{
                if(item.con.thumbs && item.con.thumbs.length){
                    let picArr = item.con.thumbs; let arr2 = [];
                    picArr.forEach((ele,i)=>{
                        if(ele.indexOf('http')<0){
                            arr2.push(this.data.imagesSocket + ele)
                        }else{
                            arr2.push(ele)
                        }
                    })
                    item.con.thumbs = arr2;
                }
            })

            this.setData({
                infoList: infoData,
                shopList: shopData,
                data: shopData
            })
            if(!this.data.data.length){
                this.setData({
                    none:true
                })
            }
        })
    },

    // 图片预览
    previewImg(e) {
        let arr = e.currentTarget.dataset.src; let arr2 = arr;
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

    // tab切换
    changeTab(e){
        let tab = e.currentTarget.dataset.tab;
        this.setData({
            tab: tab,
            data : tab ? this.data.infoList : this.data.shopList
        })
        this.setData({
            none: this.data.data.length ? false : true
        })
    },

    // 收藏(取消收藏)按钮
    onCollectTap(e) {
        console.log('e.currentTarget.dataset.item:',e.currentTarget.dataset.item)
        let _this = this;
        let type = Number(e.currentTarget.dataset.type);
        let id = type ? e.currentTarget.dataset.item.shop_id : e.currentTarget.dataset.item.message_id;
        let form = {
            id: id,
            type: type
        }
        console.log('form:',form)
        myCollect.collect(form,(res) => {
            if(!res.data.errno){
                wx.showToast({
                    title:'取消收藏成功',
                    icon: 'success',
                    duration: 2000,
                    complete: function(){
                        let arr = [];
                        if(type){
                            arr = _this.data.shopList.filter((item)=>{
                                return item.shop_id != id
                            });
                            _this.setData({
                                data: arr,
                                shopList: arr,
                                none: !arr.length ? true : false
                            })
                        }else{
                            arr = _this.data.infoList.filter((item)=>{
                                return item.message_id != id
                            });
                            _this.setData({
                                data: arr,
                                infoList: arr,
                                none: !arr.length ? true : false
                            })
                        }
                    }
                })
            }else{
                wx.showToast({
                    title: res.data.message,
                    icon: 'success',
                    image: '../../resource/images/cry.png',
                    duration: 2000
                })
            }
        })
    },

    // 查看店铺详情
    goToShopDetail(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: `/yc_youliao/page/shop/detail/index?shop_id=${item.shop_id}`
        })

    }
})