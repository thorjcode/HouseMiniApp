// housePackage/houseDetail/houseDetail.js
var app = getApp()
const db = wx.cloud.database()
const {
  formatTime
} = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseImg: [], //房源图片
    hasCollection: false // 收藏状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    console.log('详情页面接收的id', id)

    let openId = app.globalData.openid // 获取全局openId
    let UserLogin = app.globalData.UserLogin // 获取全局登录状态
    this.setData({
      Id: id,
      openId: openId,
      UserLogin: UserLogin
    })
    this.getHouseInfo(id)
    this.getCollection(openId, id)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  // 根据传过来的id去数据库查询该房源
  getHouseInfo(id) {
    wx.showLoading({
      title: '查询中...'
    })
    db.collection('HouseList').where({
      '_id': id
    }).get({
      success: res => {
        wx.hideLoading()
        if (res.errMsg == "collection.get:ok") {
          let data = res.data
          this.setData({
            houseDetail: data,
            EntrustType: data[0].EntrustType,
            houseRoom: data[0].FormData.houseRoom,
            HouseType: data[0].FormData.HouseType,
            houseName: data[0].FormData.houseName,
            houseImg: data[0].houseImg
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误，查询失败！',
          mask: true,
          icon: 'none'
        })
      }
    })
  },


  // 检查是否已经收藏
  getCollection(openId, id) {
    db.collection('Collections')
      .where({
        '_openid': openId,
        'CollectionId': id
      })
      .count({
        success: res => {
          if (res.errMsg == "collection.count:ok") {
            if (res.total > 0) {
              this.setData({
                hasCollection: true // 已收藏
              })
            }
          }
        },
        fail: err => {
          console.log("检查是否已经收藏失败", err)
        }
      })
  },


  // 点击收藏
  collection() {
    // 检查登录状态
    if (this.data.UserLogin) {
      // 如果已收藏，终止，防止重复收藏
      if (this.data.hasCollection) {
        wx.showToast({
          title: '已收藏',
          duration: 1000,
          icon: 'none'
        })
        return
      }
      // 未收藏，开始收藏
      db.collection('Collections')
        .add({
          data: {
            CollectionId: this.data.Id,
            houseName: this.data.houseName,
            houseImg: this.data.houseImg,
            EntrustType: this.data.EntrustType,
            houseRoom: this.data.houseRoom,
            HouseType: this.data.HouseType,
            CollectionTime: formatTime(new Date())
          },
          success: res => {
            if (res.errMsg == "collection.add:ok") {
              this.setData({
                hasCollection: true
              })
              wx.showToast({
                title: '收藏成功',
                duration: 1000,
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: '收藏失败',
                duration: 1000,
                icon: 'none'
              })
            }
          },
          fail: err => {
            wx.showToast({
              title: '网络错误！收藏失败',
              duration: 1000,
              icon: 'none'
            })
          }
        })
    } else {
      wx.showToast({
        title: '请先登录后再收藏',
        duration: 1000,
        icon: 'none'
      })
      this.setData({
        hasCollection: false
      })
    }
  },

  // 跳转计算器
  Calc() {
    if (this.data.UserLogin) {
      wx.navigateTo({
        url: '../../CalculatorPackage/calculator/calculator',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        duration: 1000,
        icon: 'none'
      })
    }
  },


  // 预约看房
  openActionSheet(e) {
    wx.showActionSheet({
      itemList: ['电话预约', '添加通讯录', '复制电话号'],
      success: res => {
        if (res.tapIndex == 0) {
          this.CallPhone(e) // 打电话
        }
        if (res.tapIndex == 1) {
          this.addPhoneContact(e) //添加到通讯录
        }
        if (res.tapIndex == 2) {
          this.CopyPhone(e) //复制电话号
        }
      },
      fail: err => {
        console.log(err.errMsg)
      }
    })
  },

  // 拨打电话
  CallPhone(e) {
    let phoneNumber = e.currentTarget.dataset.phone
    wx.showModal({
      title: '温馨提示',
      content: `是否拨打${phoneNumber}号码？`,
      confirmText: '确定拨打',
      confirmColor: '#0081ff',
      cancelText: '取消',
      cancelColor: '#acb5bd',
      success: res => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phoneNumber,
            success: res => {},
            fail: err => {
              console.log(err)
            }
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })

  },

  //添加到通讯录
  addPhoneContact(e) {
    let phone = e.currentTarget.dataset.phone
    let name = e.currentTarget.dataset.name
    let remark = e.currentTarget.dataset.remark
    wx.addPhoneContact({
      firstName: name, //联系人姓名
      mobilePhoneNumber: phone, //联系人手机号
      organization: '房产小程序', //公司名字
      remark: remark,
    })
  },

  //复制电话号
  CopyPhone(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.phone,
    })
  },

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function (options) {
    let share_title = this.data.houseName
    console.log('分享的title', share_title)
    return {
      title: share_title,
    }
  },
})