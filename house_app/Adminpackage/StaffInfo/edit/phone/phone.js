// pages/edit/phone/phone.js
const db = wx.cloud.database()
const {
  formatTime
} = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.queryInfo(id) // 根据传过来的id查询详细信息
    this.setData({
      id: id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 查询信息
   */
  queryInfo(id) {
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('StaffList').where({
      _id: id
    }).get({
      success: res => {
        wx.hideLoading()
        if (res.errMsg == "collection.get:ok") {
          if (res.data.length > 0) {
            let data = res.data[0]
            this.setData({
              id: data._id,
              staffImg: data.staffImg,
              name: data.name,
              phone: data.phone,
              isChooseImg: false, // 默认显示选择图片按钮
            })
          } else {
            wx.showToast({
              title: '网络错误!加载失败',
              duration: 1000,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '网络错误!加载失败',
            duration: 1000,
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误!加载失败',
          duration: 1000,
          icon: 'none'
        })
      }
    })
  },

    /**
   * 获取输入框数据
   */
  inputData(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    if (key == 'phone') {
      this.setData({
        phone: value
      })
    }
  },

  /**
   * 确认提交按钮
   */
  confirmSubmit(e) {
    let phone = this.data.phone
    var BeforePhone = wx.getStorageSync('BeforePhone')
    if (phone.length == 0) {
      wx.showToast({
        title: '请输入电话！',
        duration: 1000,
        icon: "none"
      })
    } else if (phone == BeforePhone) {
      wx.showToast({
        title: '好像什么也没动哦！',
        icon: 'none',
        duration: 1000,
      })
    } else {
      let id = e.currentTarget.dataset.id
      this.editPhone(id,phone)
    }
  },

    /**
   * 修改名字
   */
  editPhone(id, phone) {
    console.log('走修改电话')
    db.collection('StaffList').doc(id).update({
      data: {
        phone: phone,
        updateTime: formatTime(new Date())
      },
      success: res => {
        console.log('走修改电话update-success', res.errMsg)
        if (res.errMsg == "document.update:ok") {
          console.log('走修改电话update-if', )
          wx.showToast({
            title: '修改电话成功！',
            icon: 'success',
            duration: 1000,
          })
          //清除缓存
          wx.removeStorageSync('BeforeName')
          wx.removeStorageSync('BeforePhone')
          wx.removeStorageSync('BeforeImgFileId')
          //修改成功，返回员工列表页面
          wx.navigateBack({
            delta: 2
          })
        } else {
          console.log('走修改电话update-else', )
          //清除缓存
          wx.removeStorageSync('BeforeName')
          wx.removeStorageSync('BeforePhone')
          wx.removeStorageSync('BeforeImgFileId')
          wx.showToast({
            title: '修改电话失败！',
            icon: 'none',
            duration: 1000,
          })
        }
      },
      fail: err => {
        console.log('走修改电话update-fail', err)
        //清除缓存
        wx.removeStorageSync('BeforeName')
        wx.removeStorageSync('BeforePhone')
        wx.removeStorageSync('BeforeImgFileId')
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 1000,
        })
      }
    })
  },

  /**
   * 取消按钮
   */
  close() {
    wx.navigateBack({
      delta: 1
    })
  },
})