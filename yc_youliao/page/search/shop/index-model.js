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
			data.type = 'shop'
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

	getPageData(form, callback) {
		let location = wx.getStorageSync('location');
		this.store({ type: 'GET_SEID' }, (seid) => {
			let data = {}
			data.seid = seid;
			data.lat = location.latitude;
	    	data.lng = location.longitude;
	    	data.page = form.page;
    		data.num = form.num;
    		data.cid = form.cid;
    		data.area_id = form.area_id;
		    var param = {
		        url: 'entry/wxapp/GetShopList',
		        data,
		        sCallback: (res) => {
			        this._handleData(res.data.data)
			        callback && callback(res.data.data)
		        }
		    }
		    this.request(param)
	    })
	}

  	_handleData(data) {
	    data.forEach((v) => {
	        if(v.dp) {
		        v.dp = Number(v.dp)
		        v.dp = v.dp.toFixed(1)
		        v.dpVal = parseInt(v.dp)
	        }
	    })
    }

}



export { Index }

