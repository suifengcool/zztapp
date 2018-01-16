import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
        shopList: [],
        imagesSocket: '',
    },

    onLoad: function (options) {
        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });

	    index.getMyShopList((data)=>{
            this.setData({
                shopList: data
            })
        })
    },

    editShop(e){
    	let id = e.currentTarget.dataset.item.shop_id;
    	wx.navigateTo({
			url: `/yc_youliao/page/moveIn/create/index?id=${id}`
	    })
    },

    longTap(e){
        let id = e.currentTarget.dataset.item.shop_id;
        let shop_name = e.currentTarget.dataset.item.shop_name;
        wx.vibrateShort({
            success: (res) => {
                wx.showModal({
                    title: '是否确定删除该入驻店铺',
                    content: shop_name,
                    cancelText: '取消',
                    onfirmText: '确定',
                    confirmColor: '#979797',
                    success: function(res){
                        if(res.confirm){
                            index.DelMyShop(id,(data)=>{
                                if(data === '删除店铺成功!'){
                                    index.getMyShopList((data)=>{
                                        this.setData({
                                            shopList: data
                                        })
                                    })
                                }else{
                                    wx.showModal({
                                        title: '删除失败',
                                        content: data,
                                        showCancel: false
                                    })

                                }
                            })
                        }
                    }
                })
            },
            fail: (res) => {
                console.log(res)
            }
        })
    }
})