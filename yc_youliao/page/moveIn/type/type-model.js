import { Base } from '../../../resource/utils/base.js'
import { getUserInfo } from '../../../resource/utils/comment.js'
const app = getApp()

class Index extends Base {
  constructor() {
    super()
  }

  getTypeList(callback) {
    app.util.getUserInfo((userInfo) => {
      var param = {
        url: 'entry/wxapp/GetCate',
        data: { uid: userInfo.memberInfo.uid },
        sCallback: (res) => {
          callback(res.data.data)
        }
      }
      this.request(param)
    })
  }
}

export { Index }