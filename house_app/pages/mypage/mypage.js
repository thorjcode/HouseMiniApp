// pages/mypage/mypage.js
const app = getApp(); //与app.js关联，可以调用app.js里的方法
const db = wx.cloud.database()
const {
  formatTime
} = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserLogin: false, //登录状态
    userInfo: null, //用户信息
    ClickAccount: 0, // 点击次数记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.isLogin() //调用app.js里的isLogin方法
    this.setData({
      UserLogin: app.globalData.UserLogin, // 获取全局登录状态
      userInfo: app.globalData.userInfo // 获取全局的用户信息
    })
  },

  // 后台入口
  BackstageDoor() {
    let ClickAccount = this.data.ClickAccount
    ClickAccount = ClickAccount + 1
    console.log('点击的次数：', ClickAccount)
    if (ClickAccount < 5) {
      this.setData({
        ClickAccount: ClickAccount
      })
    } else {
      this.setData({
        ClickAccount: 0 // 恢复点击次数记录
      })
      this.IsAdminstator() // 跳转检查是否为管理员方法
    }
  },

  // 检查是否为管理员
  IsAdminstator() {
    let openId = app.globalData.openid
    //console.log('全局的openid', openId)
    wx.showLoading({
      title: '正在检验...',
      mask: true
    })
    db.collection('UserList').where({
        '_openid': openId, //根据全局的openid去检查该用户是否未管理员
        'admin': true,
      }).count()
      .then(res => {
        wx.hideLoading()
        if (res.total > 0) {
          // 管理员跳转到管理员页面
          wx.navigateTo({
            url: '../../Adminpackage/BackstageHome/BackstageHome'
          })
        } else {
          wx.showToast({
            title: '你还不是管理员！',
            icon: 'none',
            mask: true,
            duration: 1500
          })
        }
      })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误！请稍后重试',
          icon: 'none',
          duration: 1000,
        })
      })
  },

  //获取用户信息
  getUserProfile() {
    let openId = app.globalData.openid
    //console.log('全局的openid', openId)
    wx.getUserProfile({//此登录接口官方已修改，新登录接口请看B站主页，或者获取（小吃地图2.1，长期维护本版）
      desc: '用于完善会员资料', //声明获取用户信息的用途
      success: (res) => {
        //console.log('点击获取用户信息成功', res.userInfo)
        let userInfo = res.userInfo
        db.collection('UserList').where({
          '_openid': openId
        }).get({
          success: res => {
            console.log('根据全局openid查询用户表成功', res.data)
            if (res.errMsg == "collection.get:ok" && res.data.length == 0) { //length等于0，证明没有该用户，走写入数据库
              //console.log('走if，开始写入数据库')
              db.collection('UserList') // 把用户信息写入数据库的用户表
                .add({
                  data: {
                    avatarUrl: userInfo.avatarUrl, //用户头像
                    nickName: userInfo.nickName, //用户昵称
                    admin: false, //管理员状态
                    level: Number(0), //用户等级权限
                    registerTime: formatTime(new Date()) //用户注册时间
                  },
                  success: res => {
                    //console.log('写入成功', res.errMsg)
                    if (res.errMsg == "collection.add:ok") {
                      wx.setStorageSync('UserInfo', userInfo) //保存用户信息到本地缓存
                      this.setData({
                        userInfo: userInfo,
                        UserLogin: true, //登录状态
                      })
                      wx.showToast({
                        title: '恭喜,登录成功',
                        icon: "success",
                        duration: 1000,
                      })
                    }
                  },
                  fail: err => {
                    console.log('用户信息写入失败', err)
                    // 提示网络错误
                    wx.showToast({
                      title: '登录失败，请检查网络后重试！',
                      icon: 'none',
                      duration: 1000,
                    })
                  }
                })
            } else {
              //console.log('走else,数据库里已存有用户信息,直接登录，不用写入数据库')
              wx.setStorageSync('UserInfo', userInfo) //保存用户信息到本地缓存
              this.setData({
                userInfo: userInfo,
                UserLogin: true,
              })
              //更新全局登录状态
              app.globalData({
                userInfo: userInfo,
                UserLogin: true,
              })
            }
          },
          fail: err => {
            console.log('根据全局openid查询用户表失败', err)
            // 提示网络错误
            wx.showToast({
              title: '网络错误！获取授权信息失败',
              icon: 'none',
              duration: 1000,
            })
          }
        })
      },
      fail: err => {
        console.log('用户信息获取失败', err)
        // 提示网络错误
        wx.showToast({
          title: '网络错误！获取授权信息失败',
          icon: 'none',
          duration: 1000,
        })
      }
    })
  },

  // 跳转到我的收藏
  goMycollection() {
    let UserLogin = this.data.UserLogin
    if (UserLogin) {
      wx.navigateTo({
        url: '../collection/collection',
      })
    } else {
      // 提示登录
      wx.showToast({
        title: '你还未登录，请先登录！',
        icon: 'none',
        duration: 1000,
      })
    }
  },

  // 清除缓存数据并退出登录
  exit() {
    let UserLogin = this.data.UserLogin
    if (UserLogin) {
      wx.showToast({
        title: '退出成功',
        icon: 'success',
        duration: 1000,
      })
      this.setData({
        UserLogin: false,
      })
      wx.removeStorageSync('UserInfo')
    } else {
      // 提示登录
      wx.showToast({
        title: '你还未登录，请先登录！',
        icon: 'none',
        duration: 1000,
      })
    }
  },
})