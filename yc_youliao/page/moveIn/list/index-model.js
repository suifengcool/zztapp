import { Base } from '../../../resource/utils/base.js'
import { getLocation, getUserInfo, getImageSocket } from '../../../resource/utils/comment.js'
const app = getApp()
class Index extends Base {

	constructor() {
		super()
	}
	
	getMyShopList(cb) {
		let data = {}
		this.store({ type: 'GET_SEID' }, (seid) => {
            data.seid = seid
			var param = {
			    url: 'entry/wxapp/GetMyShopList',
			    data,
			    sCallback: (res) => {
					cb && cb(res.data.data)
			    }
			}
			this.request(param)
	    })
	}

	DelMyShop(id,cb) {
		let data = {}
		this.store({ type: 'GET_SEID' }, (seid) => {
            data.seid = seid
            data.shop_id = id
			var param = {
			    url: 'entry/wxapp/DelMyShop',
			    data,
			    sCallback: (res) => {
					cb && cb(res.data.message)
			    }
			}
			this.request(param)
	    })
	}

    // 请求图片socket
	getAttachurl(callback) {
		getImageSocket((data) => {
		    callback(data)
		})
	}
}



export { Index }