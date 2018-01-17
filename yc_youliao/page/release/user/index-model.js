import { Base } from '../../../resource/utils/base.js'
import { getLocation, getUserInfo, getImageSocket } from '../../../resource/utils/comment.js'
const app = getApp()
class Index extends Base {
	constructor() {
		super()
	}
	
	getUserName(cb) {
        let data = {}
        this.store({ type: 'GET_SEID' }, (seid) => {
            data.seid = seid
            var param = {
                url: 'entry/wxapp/GetUserName',
                data,
                sCallback: (res) => {
                    cb && cb(res.data.data)
                }
            }
            this.request(param)
        })
    }
}



export { Index }