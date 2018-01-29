import { handleTime , getUserInfo, getImageSocket} from '../../../resource/utils/comment.js'
import { Index } from 'index-model.js'
var index = new Index()
const app = getApp()

Page({
    data: {
		delNum: null,
		peopleNum: null,
		count: null,
		counsume: null,
		start_time: '',
		end_time: '',
		logo: '',
		shop_name: '',
		shop_id: null,
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

		console.log('options:',options)
		if(options && options.shop_id){
			this.setData({
				logo: options.logo,
				shop_name: options.shop_name,
				shop_id: options.shop_id
			})
		}
		let date = new Date();
		this.setData({
			start_time: date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate(),
			end_time: date.getFullYear() + '-' + date.getMonth()+2 + '-' + date.getDate()
		})
    },

    createCoupon(e){
		if(!this.data.counsume){
			wx.showToast({
                title: '请填写消费金额',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
		}
		if(!this.data.delNum){
			wx.showToast({
                title: '请填写免减金额',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
		}
		if(!this.data.peopleNum){
			wx.showToast({
                title: '请填写人数',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
		}
		if(!this.data.count){
			wx.showToast({
                title: '请填写发放数量',
                image: '../../../resource/images/warn.png',
                duration: 2000,
                mask: true
            })
            return
		}
		let form = {};
		form.amount = this.data.delNum;
		form.peopleNum = this.data.peopleNum;
		form.numbers = this.data.count;
		form.sill_amount = this.data.counsume;
		form.starttime = this.data.start_time;
		form.endtime = this.data.end_time;
		form.shop_id = this.data.shop_id;
		form.name = '满' + this.data.counsume + '减' + this.data.delNum;
		form.type = 1;
		index.createCoupon(form,(data)=>{
			console.log('data:',data)
			if(data.errno == 0){
				wx.showToast({
                    title: '优惠券创建成功',
                    icon: 'success',
                    duration: 3000,
                    success: ()=>{
			            setTimeout(()=>{
			                wx.redirectTo({
	                           url: `/yc_youliao/page/shop/detail/index?shop_id=${this.data.shop_id}`
	                        })
			            }, 3000) 
		    	    }
                })
			}
		})
    },

    listenerConsumeInput(e){
		this.setData({
			counsume: e.detail.value
		})
    },

    listenerDelInput(e){
		this.setData({
			delNum: e.detail.value
		})
    },

    listenerPeopleNumInput(e){
		this.setData({
			peopleNum: e.detail.value
		})
    },

    listenerCountInput(e){
		this.setData({
			count: e.detail.value
		})
    },

    bindStartTimeChange: function(e) {
        this.setData({
            start_time: e.detail.value
        })
    },

    bindEndTimeChange: function(e) {
        this.setData({
            end_time: e.detail.value
        })
    },
})