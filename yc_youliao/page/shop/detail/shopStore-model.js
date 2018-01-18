import { Base } from '../../../resource/utils/base.js'
const app = getApp()
import { dateToStr } from '../../../resource/utils/comment.js'
class ShopStore extends Base {
    constructor() {
		super()
    }
    // 得到店铺详情
    getData(id, callback) {
	  	this.store({ type: 'GET_SEID' }, (seid) => {
			let data = {}
			data.seid = seid;
			data.shop_id = id;
			var param = {
			    url: 'entry/wxapp/getShop',
			    data: data,
			    sCallback: (res) => {
			    	console.log('res33333:',res)
					// this.handleData(res.data.data, callback)
					callback && callback(res.data.data)
			    }
			}
			this.request(param)
		})
    }

    // 得到店铺详情
    getPublishData(id, callback) {
	  	this.store({ type: 'GET_SEID' }, (seid) => {
			let data = {}
			data.seid = seid;
			data.shop_id = id;
			var param = {
			    url: 'entry/wxapp/GetInfoByShop',
			    data: data,
			    sCallback: (res) => {
					callback && callback(res.data.data)
			    }
			}
			this.request(param)
		})
    }

    // 处理数据
    handleData(data, callback) {
    	console.log('data33444:',data)
		// 评分转为小数点一位
		if(data.dp && data.dpFor){
			data.dp = parseFloat(data.dp).toFixed(1)
			data.dpFor = parseFloat(data.dp)
		}
		// 评价转为数组
		if(data.inco){
			data.inco = JSON.parse(data.inco)
		}
		callback && callback(data)
		

		// 判断有无地址
		// if(data.lat && data.lng) {
		//     this.getDetailLocation({ lat: data.lng, lng: data.lat }, (resp) => {
		// 		data.address = resp.address
		// 		callback && callback(data)
		//     })
		// }else {
		//   callback && callback(data)
		// }
    }

    // 请求地址
    getDetailLocation(nowLocation, callback) {
	    console.log(nowLocation)
	    var param = {
	        url: 'entry/wxapp/GetLaction',
	        data: nowLocation,
	        sCallback: function (res) {
	            console.log(res)
	            callback && callback(res.data.data)
	        }
	    }
	    this.request(param)
	}


	// 得到店铺商品
	getGoods(id, callback) {
		var param = {
		    url: 'entry/wxapp/getGood_list',
		    data: { shop_id: id },
		    sCallback: (res) => {
				callback && callback(res.data)
		    }
		}
		this.request(param)
	}

    // 获取优惠数据
    getDiscount(id, callback) {
		var param = {
		    url: 'entry/wxapp/getDiscount',
		    data: { shop_id: id },
		    sCallback: (res) => {
				let data = res.data.data
				data.forEach((v) => {
				    v.starttime = this._handleTime(v.starttime)
				    v.endtime = this._handleTime(v.endtime)
				})	
				console.log(data)
		  		callback && callback(data)
		    }
		}
		this.request(param)
	}

    _handleTime(time) {
		return dateToStr("yyyy-MM-dd", new Date(parseInt(time + '000')))
	}
}



export { ShopStore }