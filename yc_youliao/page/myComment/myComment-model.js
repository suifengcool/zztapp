import { Base } from '../../resource/utils/base.js'
class MyComment extends Base {
  constructor() {
    super()
  }
  // 取得地址
  
  getMyCommentData(callback) {
    this.store({ type: 'GET_SEID' }, (seid) => {
      var param = {
        url: 'entry/wxapp/comment',
        data: { seid },
        sCallback: (res) => {
          callback && callback(res.data.data)
        }
      }
      this.request(param)
    })
  }
}



export { MyComment }