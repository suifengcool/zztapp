import { Base } from '../../resource/utils/base.js'
import { handleTime } from '../../resource/utils/comment.js'
class MyCollect extends Base {
    constructor() {
        super()
        this.seid = ''
    }

    getMyCollectData(callback) {
        this.store({ type: 'GET_SEID' }, (seid) => {
            let data = {};
            data.seid = seid
            var param = {
                url: 'entry/wxapp/GetCollect',
                data,
                sCallback: (res) => {
                    let arr = res.data.data.info
                    let arr2 = res.data.data.shop

                    // 处理数字
                    arr.forEach(function (v) {
                        handleTime(v)
                        // 设置id
                        v.id = v.message_id
                        v.status = 1 //状态
                    })
                    callback && callback(arr, arr2)
                }
            }
            this.request(param)
        })
    }

    // 收藏
    collect(form,callback) {
        this.getSeid((seid) => {
            let data = {};
            data.seid = seid;
            if(form.type){
                data.shop_id= form.id;
            }else{
                data.message_id = form.id
            }
          var param = {
            url: 'entry/wxapp/ProCollect',
            data: data,
            sCallback: (res) => {
              callback && callback(res)
            }
          }
          this.request(param)
        })
    }

    getSeid(callback) {
        if(this.seid == '') {
            this.store({ type: 'GET_SEID' }, (data) => {
                this.seid = data
                callback(data)
            })
        }else {
            callback && callback(this.seid)
        }
    }
}

export { MyCollect }