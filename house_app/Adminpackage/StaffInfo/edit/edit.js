// pages/edit/edit.js
const db = wx.cloud.database()
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
    console.log('从test3传过来的id', id)
    this.queryInfo(id) // 根据传过来的id查询详细信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {},

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
        console.log('edit查询到的数据', res.data)
        wx.hideLoading()
        if (res.errMsg == "collection.get:ok") {
          if (res.data.length > 0) {
            let data = res.data[0]
            this.setData({
              id: data._id,
              staffImg: data.staffImg,
              name: data.name,
              phone: data.phone
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
   * 跳转
   */
  navigateToName(e) {
    wx.navigateTo({
      url: './name/name?id=' + e.currentTarget.dataset.id,
    })
  },
  navigateToPhone(e) {
    wx.navigateTo({
      url: './phone/phone?id=' + e.currentTarget.dataset.id,
    })
  },
  navigateToImg(e) {
    wx.navigateTo({
      url: './headImg/headImg?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 取消按钮
   */
  close() {
    wx.navigateBack({
      delta: 1
    })
    //清除缓存
    wx.removeStorageSync('BeforeName')
    wx.removeStorageSync('BeforePhone')
    wx.removeStorageSync('BeforeImgFileId')
  },

})