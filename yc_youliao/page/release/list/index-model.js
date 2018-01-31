import { Base } from '../../../resource/utils/base.js'
import { getLocation, getUserInfo, getImageSocket } from '../../../resource/utils/comment.js'
const app = getApp()
class Index extends Base {
	constructor() {
		super()
		this.location = null
	    this.page = 1
	    this.id = null
	    this.data = null
	    this.length = 10
	    this.type = 'new'
	}

	// 请求模块信息
  getModuleData(options, callback) {
    this.store({ type: 'GET_SEID' }, (seid) => {

    })
    if (options && options.id) {
      this.id = options.id
      this.page = 1
      this.length = options.LENGTH
    }
    if(options && options.type){
    	this.type = options.type
    }
    let data = {
      id: this.id,
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

	/*得到首页信息*/
	getIndexData(callback) {
		this._indexGetLocation((location) => {
			let data = {}
			if (location) {
				data.lat = location.latitude
				data.lng = location.longitude
			}

		    app.util.getUserInfo((userInfo) => {
				if (userInfo.memberInfo.uid) {
				    data.uid = userInfo.memberInfo.uid
				}
				var param = {
				    url: 'entry/wxapp/GetIndex',
				    data,
				    sCallback: (res) => {
						wx.setStorage({
						  key: "index",
						  data: res
						})
						callback && callback(res.data.data)
				    }
				}
				this.request(param)
		    })
		})
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