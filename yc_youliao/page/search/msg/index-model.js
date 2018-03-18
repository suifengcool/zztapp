import { Base } from '../../../resource/utils/base.js'
import { getLocation, getUserInfo, getImageSocket } from '../../../resource/utils/comment.js'
const app = getApp()
class Index extends Base {
	constructor() {
	super()
	}
  
	search(form,cb) {
		let location = wx.getStorageSync('location');
	    let data = {}
	    data.lat = location.latitude;
	    data.lng = location.longitude;
	    data.page = form.page;
	    data.num = form.num;
	    if(form.key){
	    	data.key = form.key
	    }
	    this.store({ type: 'GET_SEID' }, (seid) => {
			data.seid = seid
			data.type = 'info'
			var param = {
			    url: 'entry/wxapp/Search',
			    data,
			    sCallback: (res) => {
					cb && cb(res.data.data)
			    }
			}
			this.request(param)
		})
	}

	// 请求模块信息
    getDataByCateId(options, callback) {
	    this.store({ type: 'GET_SEID' }, (seid) => {

	    })
	        this.page = 1
	        this.length = 10
	    if(options && options.id){
	    	this.id = options.id
	    }
	    let data = {
	        page: this.page,
	        num: this.length,
	        id: this.id
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

