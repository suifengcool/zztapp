import { Base } from '../../resource/utils/base.js'
import { handleTime } from '../../resource/utils/comment.js'
class MyPublish extends Base {
  constructor() {
    super()
    this.seid = null
  }
  getMyPublishData(options, callback) {
    this.store({ type: 'GET_SEID' }, (seid) => {
      options.seid = seid
      console.log(options)
      var param = {
        url: 'entry/wxapp/GetInfoByUser',
        data: options,
        sCallback: (res) => {
          console.log(res)
          let arr = res.data.data
          arr.forEach((v) => {
            handleTime(v)
          })
          callback && callback(arr)
        }
      }
      this.request(param)
    })
  }
  deleteInfo (e, callback){
    this.store({ type: 'GET_SEID' }, (seid) => {
      let id = this.getDataSet(e, 'id')
      console.log(seid, id)
      var param = {
        url: 'entry/wxapp/DeleteInfo',
        data: { seid, message_id: id },
        sCallback: (res) => {
          console.log(res)
          if (res.data.message.indexOf('sucess') > -1) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            callback && callback(true)
          }
        }
      }
      this.request(param)
    })
  }
}



export { MyPublish }