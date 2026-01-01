//app.js
App({
  onLaunch: function () {
    // 初始化云开发环境
    if (!wx.cloud) {
      //console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-4g5312z87c697bf0',//填写自己的云环境ID
        traceUser: true,
      })
    }
    this.getOpenid();// 获取用户openid
  },
  globalData: {
    userInfo: null,
    UserLogin: false,
    openid:null,
  },

  // 获取用户openid
  getOpenid: function () {
    var app = this;
    var openId = wx.getStorageSync('openId');
    if (openId) {
      //console.log('本地获取openid:', openId);
      app.globalData.openid = openId;
      app.isLogin();
    } else {
      wx.cloud.callFunction({
        name: 'getOpenid',
        success(res) {
          //console.log('云函数获取openid成功', res.result.openid)
          var openId = res.result.openid;
          wx.setStorageSync('openId', openId)
          app.globalData.openid = openId;
          app.isLogin();
        },
        fail(res) {
          console.log('云函数获取openid失败', res)
        }
      })
    }
  },

  //检测登录状态
  isLogin() {
    //console.log('app.isLogin方法被执行了')
    var userInfo = wx.getStorageSync('UserInfo') // 获取缓存的用户信息
    if (userInfo.nickName && userInfo.avatarUrl) {
     // console.log('走isLogin的if，缓存里的用户信息', userInfo)
      this.globalData.UserLogin = true
      this.globalData.userInfo = userInfo
    } else {
     // console.log('走IsLogin的else')
      this.globalData.UserLogin = false
    }
  },

})