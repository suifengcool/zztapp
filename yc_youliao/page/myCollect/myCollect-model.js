import { Base } from '../../resource/utils/base.js'
import { handleTime } from '../../resource/utils/comment.js'
class MyCollect extends Base {
  constructor() {
    super()
  }
  getMyCollectData(data, callback) {
    this.store({ type: 'GET_SEID' }, (seid) => {
      data.seid = seid
      console.log(data)
      var param = {
        url: 'entry/wxapp/GetCollect',
        data,
        sCallback: (res) => {
          console.log(res)
          // 处理数字
          let arr = res.data.data
          arr.forEach(function (v) {
            handleTime(v)
            // 设置id
            v.id = v.message_id
            v.status = 1 //状态
          })
          this.page++
          callback && callback(arr)
        }
      }
      this.request(param)
    })
  }
}



export { MyCollect }