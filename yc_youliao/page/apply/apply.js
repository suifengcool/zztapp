let app = getApp()
import { Apply } from 'apply-model.js'
import { getLocation, getWxUrl } from '../../resource/utils/comment.js'
var apply = new Apply()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    options: '',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    data: [],
    form: {
    },
    shijian: {
      date: '2017-01-01',
      time: '12:00',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化
    this.init(options)
    // 取得表单信息
    apply.getFieldsData(options.id, (res) => {
      this.setData({
        data: res
      })
    })
  },
  // 一些初始化的信息
  init(options) {
    getLocation(true, (location) => {
      if (location) {
        apply.getSeid((seid) => {
          this.setData({
            options: options,
            'location.lat': location.latitude,
            'location.lng': location.longitude,
            'form.seid': seid,
            'form.mid': options.id
          })
          this.setAddress(false)
        })
      }
    })
  },
  // 设置form的地址 reset -- boolean 是否重新请求详细地址
  setAddress(reset) {
    let address = wx.getStorageSync('address')
    if (!reset && address) {
      let data = address
      let nowLocation = { lat: this.data.location.lat, lng: this.data.location.lng }
      this.setLocationData(data, nowLocation)
    } else {
      let nowLocation = { lat: this.data.location.lat, lng: this.data.location.lng }
      apply.getDetailLocation(nowLocation, (data) => {
        this.setLocationData(data, nowLocation)
        wx.setStorage({
          key: "address",
          data: data
        })
      })
    }
  },
  setLocationData(data, nowLocation) {
    this.setData({
      'form': { ...this.data.form, ...{ province: data.province, city: data.city, district: data.district }, ...nowLocation },
      'location.address': data.formatted_address
    })
  },
  // 图片上传
  imgUpload: function (e) {
    let type = e.currentTarget.dataset.type
    let varName = e.currentTarget.dataset.name
    if (type == 'add') {
      wx.chooseImage({
        success: (res) => {
          if (this.data.form[varName] === undefined) {
            this.setData({
              ['form.' + varName]: []
            })
          }
          this.uploadDIY(res.tempFilePaths, (dir) => {
            this.setData({
              ['form.' + varName]: [...this.data.form[varName], ...dir]
            })
          })
          this.setData({
            imgs: [...this.data.imgs, ...res.tempFilePaths]
          })
        }
      })
    } else if (type == 'del') {
      this.setData({
        ['form.' + varName]: [...this.data.form[varName].slice(0, -1)],
        imgs: [...this.data.imgs.slice(0, -1)]
      })
    } else {
      let img = e.currentTarget.dataset.img
      wx.previewImage({
        current: img,
        urls: this.data[varName]
      })
    }
  },
  // 地址选择
  chooseAddress() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          'location.lat': res.latitude,
          'location.lng': res.longitude
        })
        this.setAddress(true)
      }
    })
  },
  // 单选
  radio(e) {
    let value = e.currentTarget.dataset.value
    let name = 'form.' + e.currentTarget.dataset.name
    this.setData({
      [name]: value
    })
  },
  // input
  input(e) {
    let name = "form." + e.currentTarget.dataset.name
    this.setData({
      [name]: e.detail.value
    })
  },
  // 多行输入框
  bindTextAreaBlur(e) {
    let name = "form." + e.currentTarget.dataset.name
    this.setData({
      [name]: e.detail.value
    })
  },
  // 多选tap
  checkboxTap(e) {
    let index = parseInt(e.currentTarget.dataset.index)
    let value = e.currentTarget.dataset.value
    let itemIndex = parseInt(e.currentTarget.dataset.itemIndex)
    let checked = "data[" + itemIndex + "].mtypeconarr[" + index + "].checked"
    let varName = e.currentTarget.dataset.name
    let checkVal = this.data.data[itemIndex].mtypeconarr[index].checked || false
    if (!checkVal) {
      if (!this.data.form.hasOwnProperty(varName)) {
        this.setData({
          ['form.' + varName]: []
        })
      }
      this.setData({
        ['form.' + varName]: [...this.data.form[varName], value],
        [checked]: true
      })
    } else {
      let arrIndex = this.data.form[varName].indexOf(value)
      this.setData({
        ['form.' + varName]: [...this.data.form[varName].slice(0, arrIndex), ...this.data.form[varName].slice(arrIndex + 1)],
        [checked]: false
      })
    }
  },
  // 上传
  submit() {
    let form = apply.handleSubmitData(this.data.form)
    console.log(form)
    apply.submit(form,(data) => {
      console.log(data)
      if (this.data.options.isneedpay == 1) {
        wx.navigateTo({
          url: `/yc_youliao/page/pay/pay?ordersn=${data.ordersn}&needpay=${this.data.options.needpay}`
        })
        return
      }
      setTimeout(() => {
        wx.redirectTo({
          url: '/yc_youliao/page/myPublish/myPublish'
        })
      }, 2000)
    })
  },
  uploadImage(path, callback) {
    wx.showNavigationBarLoading()
    let url = getWxUrl('entry/wxapp/Submit_imgs')
    wx.uploadFile({
      url: url,
      filePath: path,
      name: 'file',
      success: function (res) {
        wx.hideLoading();
        callback(JSON.parse(res.data.trim()).data.img_dir)
      }
    })
  },
  uploadDIY(filePaths,callback) {
    let url = getWxUrl('entry/wxapp/Submit_imgs')
    let i = 0
    let length = filePaths.length
    let successUp = 0
    let failUp = 0
    let imgArr = []
    wx.showLoading({
      title: '图片上传中...',
    })
    console.log(url)
    uploadFile()
    function uploadFile() {
      wx.uploadFile({
        url: url,
        filePath: filePaths[i],
        name: 'file',
        success: (resp) => {
          console.log('suc->图片上传')
          imgArr.push(JSON.parse(resp.data.trim()).data.img_dir)
          successUp++;
        },
        fail: (res) => {
          failUp++;
        },
        complete: () => {
          i++;
          if (i == length) {
            wx.hideLoading()
            callback(imgArr)
            console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！')
          }
          else {  //递归调用
            uploadFile();
          }
        },
      })
    }
  },
  bindDateChange: function (e) {
    let varName = e.currentTarget.dataset.name
    this.setData({
      'shijian.date': e.detail.value,
      ['form.' + varName]: e.detail.value + ' ' +this.data.shijian.time
    })
    console.log(this.data.form)
  },
  bindTimeChange: function (e) {
    let varName = e.currentTarget.dataset.name
    this.setData({
      'shijian.time': e.detail.value,
      ['form.' + varName]: this.data.shijian.date + ' ' + e.detail.value
    })
    console.log(this.data.form)
  }
})