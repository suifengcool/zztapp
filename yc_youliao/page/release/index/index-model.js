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

	getPublishData(callback) {
	    let indexData = wx.getStorageSync('index')
	    if (indexData && indexData.data && indexData.data.data) {
	        callback && callback(indexData.data.data)
	    } else {
	        index.getIndexData((data) => {
	        	callback && callback(data)
	        })
	    }
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

	// 请求模块信息
    getModuleData(options, callback) {
	    this.store({ type: 'GET_SEID' }, (seid) => {

	    })
	        this.page = 1
	        this.length = 10
	    if(options && options.type){
	    	this.type = options.type
	    }
	    let data = {
	        page: this.page,
	        num: this.length,
	        type: this.type
	    }
	    getLocation((location) => {
	        if (location) {
		        data.lat = location.latitude
		        data.lng = location.longitude
	        }
	        this._requestModule(data, callback)
	    })
    }

    _requestModule(data, callback) {
	    var param = {
	        url: 'entry/wxapp/GetModuleById',
	        data: data,
	        sCallback: (res) => {
		        this.page++
		        callback && callback(res.data.data)
	        }
	    }
	    this.request(param)
	}
}



export { Index }