import { Base } from '../../../resource/utils/base.js'
import { handleTime } from '../../../resource/utils/comment.js'
let app = getApp()
class Detail extends Base {
  constructor() {
    super();
    this.seid = ''
    this.id = ''
  }

  /*得到详情信息*/
  getDetailData(id, mid, callback) {
    this.id = id
    var param = {
      url: 'entry/wxapp/GetInfoById',
      data: { id, mid },
      sCallback: (res) => {
        let data = handleTime(res.data.data)
        this.getFieldsData(mid, (formData) => {
          let renderData = this._matchingTitle(data, formData)
          callback && callback(data, renderData)
        })
      }
    }
    this.request(param)
  }
  // 请求地址信息
  getLocationData(location, callback) {
    var param = {
      url: 'entry/wxapp/GetLaction',
      data: location,
      sCallback: (res) => {
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
  // 用户浏览量
  addviews(id, callback) {
    this.getSeid((seid) => {
      var param = {
        url: 'entry/wxapp/Addviews',
        data: { seid, message_id: id },
        sCallback: (res) => {
          callback && callback(res.data.data)
        }
      }
      this.request(param)
    })
  }
  getSeid(callback) {
    if (this.seid == '') {
      this.store({ type: 'GET_SEID' }, (data) => {
        this.seid = data
        callback(data)
      })
    } else {
      callback && callback(this.seid)
    }
  }
  // 请求/发送评论
  getCommentData(options, callback) {
    this.getSeid((seid) => {
      let data = {
        seid,
        id: options.id
      }
      if (options.type == 1) {
        data.type = 1
        data.info = options.comment
      }
      var param = {
        url: 'entry/wxapp/Comment',
        data,
        sCallback: (res) => {
          if (options.type == 1) {  // 为发送评论时
            wx.showToast({
              title: '消息发送成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            callback && callback(res.data.data)
          }
        }
      }
      this.request(param)
    })
  }
  // 请求/发送评论
  getComment(options, callback) {
    this.getSeid((seid) => {
      let data = {
        seid,
        id: options.id
      }
        data.type = 2
      var param = {
        url: 'entry/wxapp/ShopComment',
        data,
        sCallback: (res) => {
          callback && callback(res.data)
        }
      }
      this.request(param)
    })
  }
  // 评论发送
  sendComment(comment) {
    if (comment == '') {
      wx.showModal({
        title: '提示',
        content: '输入不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    this.getCommentData({ id: this.id, type: 1, comment })
  }
  // 获取优惠券列表
  getCouponList(options, callback) {
    this.getSeid((seid) => {
      let data = {
        seid,
        shop_id: options.id
      }
      var param = {
        url: 'entry/wxapp/TicketList',
        data,
        sCallback: (res) => {
          callback && callback(res.data)
        }
      }
      this.request(param)
    })
  }

  // 领取优惠券
  chooseCoupon(options, callback) {
    this.getSeid((seid) => {
      let data = {
        seid,
        tid: options.tid
      }
      var param = {
        url: 'entry/wxapp/AddTicketReceive',
        data,
        sCallback: (res) => {
          callback && callback(res.data)
        }
      }
      this.request(param)
    })
  }


  // 判断是否收藏
  isCollect(id, callback) {
    this.getSeid((seid) => {
      var param = {
        url: 'entry/wxapp/GetCollect',
        data: { seid, shop_id: id },
        sCallback: (res) => {
          console.log(res)
          let flag = false
          if (res.data.data.shop.length > 0) {
            const arr2 = res.data.data.shop.filter((item)=>{
              return item.shop_id === id
            });
            if(arr2.length){
              flag = true
            }
          }
          callback && callback(flag)
        }
      }
      this.request(param)
    })
  }
  // 收藏
  collect(id,callback) {
    this.getSeid((seid) => {
      var param = {
        url: 'entry/wxapp/ProCollect',
        data: { seid, shop_id: id },
        sCallback: (res) => {
          callback && callback(res)
        }
      }
      this.request(param)
    })
  }
  // 对比标题 
  _matchingTitle(data, formData) {
    let renderData = []
    for (let c in data.content) {
      formData.every(function (v, i) {
        if (v.enname == c) {
          if (v.mtype === 'images') {
            renderData.push({
              name: v.name,
              value: data.content[c],
              renderType: 'images'
            })
          } else {
            renderData.push({
              name: v.name,
              value: data.content[c],
              renderType: v.mtype !== 'checkbox' ? 'text' : 'mul'
            })
          }
          formData.splice(i, 1)
          return false
        }
        return true
      })
    }
    return renderData
  }
  // 请求表单
  getFieldsData(id, callback) {
    var param = {
      url: 'entry/wxapp/fields',
      data: { id },
      sCallback: (res) => {
        callback && callback(res.data.data)
      }
    }
    this.request(param)
  }
}

export { Detail }