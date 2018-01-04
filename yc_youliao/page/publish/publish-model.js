import { Base } from '../../resource/utils/base.js'
import {Index} from '../index/index-model.js'
import { ModuleList } from '../moduleList/moduleList-model.js'
var moduleList = new ModuleList()
let index = new Index()
class Publish extends Base {
  constructor() {
    super()
    this.seid = null
  }
  getPublishData(callback) {
    let indexData = wx.getStorageSync('index')
    if (indexData && indexData.data && indexData.data.data) {
      callback && callback(indexData.data.data)
    } else {
      index.getIndexData((data) => {
        callback && callback(data)
      })
    }
  }
  getModuleData(id,callback) {
    console.log(id)
    moduleList.getModuleData({ id, LENGTH: 10}, (data) => {
      callback && callback(data)
    })
  }
}



export { Publish }