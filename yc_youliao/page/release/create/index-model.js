import { Base } from '../../../resource/utils/base.js'
import { getLocation, getUserInfo, getImageSocket } from '../../../resource/utils/comment.js'
const app = getApp()
class Index extends Base {
	constructor() {
		super()
	}

	getSeid(callback) {
	    this.store({ type: 'GET_SEID' }, (seid) => {
	        callback(seid)
	    })
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

	// 请求地址
    getDetailLocation(nowLocation, callback) {
	    var param = {
	        url: 'entry/wxapp/GetLaction',
	        data: nowLocation,
        	sCallback: function (res) {
		        callback && callback(res.data.data)
	        }
	    }
	    this.request(param)
    }

	submit(form,cb){
		let data = {};
		this.indexGetUserInfo((obj)=>{
			data.logo = obj.avatarUrl
		})
		
		if(form.type_id){
			data.mid = form.type_id
		}
		data.nickname = form.nickName
		data.telphone = form.telphone
		data.shop_id = form.shop_id
		data.lat = form.lat
		data.lng = form.lng
		data.province = form.province 
		data.city = form.city
		data.district = form.district
		data.text = form.intro
		if(form.imgUrl && form.imgUrl.length){
			data['thumbs'] = form.imgUrl.join(',')
		}
		this.store({ type: 'GET_SEID' }, (seid) => {
            data.seid = seid
			var param = {
			    url: 'entry/wxapp/AddInfo',
			    type: 'post',
			    data,
			    sCallback: (res) => {
					cb && cb(res.data)
			    }
			}
			this.request(param)
	    })
	}

    // 请求图片socket
	getAttachurl(callback) {
		getImageSocket((data) => {
		    console.log(data)
		    callback(data)
		})
	}

    // 获取用户信息
    indexGetUserInfo(cb) {
		getUserInfo(true, (res) => {
			cb && cb(res)
		  console.log('res222222:',res)
		})
    }

	// 获取经纬度信息
	_indexGetLocation(callback) {
		getLocation(false, (res) => {
		  callback(res)
		})
	}


}



export { Index }