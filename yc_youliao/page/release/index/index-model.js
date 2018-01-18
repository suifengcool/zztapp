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


    // 请求图片socket
	getAttachurl(callback) {
		getImageSocket((data) => {
		    console.log(data)
		    callback(data)
		})
	}

    // 获取用户信息
    indexGetUserInfo() {
		// getUserInfo(true, (res) => {
		  // console.log(res)
		// })
    }

	// 获取经纬度信息
	_indexGetLocation(callback) {
		getLocation(false, (res) => {
		  callback(res)
		})
	}


}



export { Index }