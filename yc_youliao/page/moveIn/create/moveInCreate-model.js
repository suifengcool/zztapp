import { Base } from '../../../resource/utils/base.js'
import { getLocation, getUserInfo, getImageSocket } from '../../../resource/utils/comment.js'
const app = getApp()
class Create extends Base {
	constructor() {
		super()
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

	submit(form,cb){
		// app.util.getUserInfo((userInfo) => {

			let data = form;
			// if (userInfo.memberInfo.uid) {
			//     data.uid = userInfo.memberInfo.uid
			// }
			var param = {
			    url: 'entry/wxapp/AddShopInfo',
			    type: 'post',
			    data,
			    sCallback: (res) => {
			    	console.log('res:',res)
					cb && cb(res.data.data)
			    }
			}
			this.request(param)
	    // })
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



export { Create }