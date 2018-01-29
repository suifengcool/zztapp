import { getLocation, getUserInfo, getImageSocket , getWxUrl} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
        shopList: [],
        imagesSocket: '',
        items: [],
        startX: 0, //开始坐标
        startY: 0
    },

    onLoad: function (options) {
        // 获取图片头
        getImageSocket((data) => {
            this.setData({
                imagesSocket: data
            })
        });
        this.getData()
    },

    getData(){
        index.getMyShopList((data)=>{
            let arr = [];
            arr = [...this.data.shopList, ...data];
            arr.map((item,index)=>{
                if(item.logo.indexOf('http') < 0 ){
                    item.logo = this.data.imagesSocket + '/' + item.logo
                }
                
                item.dp = item.dp > 5 ? 5 : item.dp;
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
                item.isTouchMove = false;
            })
            
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
        let _this = this;
        let id = e.currentTarget.dataset.item.shop_id;
        let shop_name = e.currentTarget.dataset.item.shop_name;
        wx.vibrateShort({
            success: (res) => {
                wx.showModal({
                    title: shop_name,
                    cancelText: '进入店铺',
                    confirmText: '删除店铺',
                    confirmColor: '#999',
                    success: function(res){
                        if(res.confirm){
                            wx.showModal({
                              title: '是否确定删除该店铺',
                              cancelText: '取消',
                              confirmText: '确认',
                              confirmColor: '#333',
                              success: function(res){
                                if (res.confirm){
                                  index.DelMyShop(id,(data)=>{
                                    if(data === '删除店铺成功!'){
                                        wx.showToast({
                                          title: '店铺删除成功',
                                          icon: 'success',
                                          duration: 3000,
                                          success: ()=>{
                                            setTimeout(()=>{
                                                _this.getData()
                                            }, 3000) 
                                          }
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
                        }else{
                          wx.redirectTo({
                            url: `/yc_youliao/page/shop/detail/index?shop_id=${id}`
                        })
                        }
                    }
                })
            },
            fail: (res) => {
                console.log(res)
            }
        })
    },

    goToDetail(e){
        let item = e.currentTarget.dataset.item;
        wx.redirectTo({
            url: `/yc_youliao/page/shop/detail/index?shop_id=${item.shop_id}`
        })
    },

    //手指触摸动作开始 记录起点X坐标
 touchstart: function (e) {
  //开始触摸时 重置所有删除
  this.data.items.forEach(function (v, i) {
   if (v.isTouchMove)//只操作为true的
    v.isTouchMove = false;
  })
  this.setData({
   startX: e.changedTouches[0].clientX,
   startY: e.changedTouches[0].clientY
  })
 },

    //滑动事件处理
 touchmove: function (e) {
  var that = this,
   index = e.currentTarget.dataset.index,//当前索引
   startX = that.data.startX,//开始X坐标
   startY = that.data.startY,//开始Y坐标
   touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
   touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
   //获取滑动角度
   angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
  that.data.items.forEach(function (v, i) {
   v.isTouchMove = false
   //滑动超过30度角 return
   if (Math.abs(angle) > 30) return;
   if (i == index) {
    if (touchMoveX > startX) //右滑
     v.isTouchMove = false
    else //左滑
     v.isTouchMove = true
   }
  })
  //更新数据
  that.setData({
   items: that.data.items
  })
 },
 /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
 angle: function (start, end) {
  var _X = end.X - start.X,
   _Y = end.Y - start.Y
  //返回角度 /Math.atan()返回数字的反正切值
  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
 },
 //删除事件
 del: function (e) {
  this.data.items.splice(e.currentTarget.dataset.index, 1)
  this.setData({
   items: this.data.items
  })
 }
})