// pages/home/home.js
const app = getApp() //与app.js关联，可以调用app.js里的方法
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserLogin: false,
    HouseList: [],
    notice: '欢迎光临、【房产小程序】：真诚为您服务~我们有最优的“一手房、二手房、出租房”房源供您挑选...' // 默认公告信息
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('首页onLoad执行了')
    this.GetBanner() //获取轮播图数据
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('首页onShow执行了')
    this.setData({
      total: 0,
      page: 0,
      HouseList: [],
    })

    this.GetHouse() //获取房源数据
    this.GetNotice() //获取滚动公告数据
    app.isLogin() //调用app.js里的isLogin方法
    this.setData({
      UserLogin: app.globalData.UserLogin, // 获取全局登录状态
    })
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("首页onHide执行了")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("首页onUnload执行了")
  },

  //获取轮播图
  GetBanner() {
    db.collection('HomeBanner').get()
      .then(res => {
        this.setData({
          home_banner: res.data
        })
      })
      .catch(err => {
        console.log('轮播图请求失败', err)
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.setData({
          home_banner: [{
            banner: '../images/Network_no.png', // 显示网络错误的图片
          }]
        })
      })
  },

  // 获取滚动公告数据
  GetNotice() {
    db.collection('CompanyInfo')
      .field({
        notice: true
      })
      .get({
        success: res => {
          wx.stopPullDownRefresh() //停止下拉
          wx.hideNavigationBarLoading() //隐藏标题栏加载
          if (res.errMsg == "collection.get:ok") {
            console.log("notice数据库：", res.data)
            if (res.data[0].notice != '') {
              this.setData({
                notice: res.data[0].notice
              })
            } else {
              this.setData({
                notice: this.data.notice // 默认公告信息
              })
            }
          }
        },
        fail: err => {
          wx.stopPullDownRefresh() //停止下拉
          wx.hideNavigationBarLoading() //隐藏标题栏加载
        }
      })
  },

  // 获取房源数据列表
  GetHouse() {
    let HouseList = this.data.HouseList
    db.collection('HouseList')
      .where({
        'publish': true,
      })
      .orderBy('publishTime', 'desc')
      .limit(10)
      .get({
        success: res => {
          wx.stopPullDownRefresh() //停止下拉
          wx.hideNavigationBarLoading() //隐藏标题栏加载
          console.log('首页房源查询成功', res.data.length)
          if (res.errMsg == "collection.get:ok") {
            if (res.data.length > 0) {
              for (let i = 0; i < res.data.length; i++) {
                HouseList.push(res.data[i])
              }
              this.setData({
                HouseList: HouseList
              })
            }
          }
        },
        fail: err => {
          wx.stopPullDownRefresh() //停止下拉
          wx.hideNavigationBarLoading() //隐藏标题栏加载
          console.log('首页推荐房源查询失败', err)
        }
      })
  },

  //功能栏跳转到新房列表
  goNewhouse: function (e) {
    wx.navigateTo({
      url: '../../housePackage/newHouse/newHouse',
    })
  },

  //功能栏跳转到二手房列表
  goSecondhouse: function (e) {
    wx.navigateTo({
      url: '../../housePackage/secondHouse/secondHouse',
    })
  },

  //功能栏跳转到租房列表
  goRenthouse: function (e) {
    wx.navigateTo({
      url: '../../housePackage/rentHouse/rentHouse',
    })
  },

  //功能栏跳转房价、计算器，门店，判断是否登录
  Navigate: function (e) {
    let url = e.currentTarget.dataset.url
    let id = e.currentTarget.dataset.id
    let UserLogin = this.data.UserLogin
    if (UserLogin) {
      wx.navigateTo({
        url: `${url}?id=${id}`,
      })
    } else {
      // 未登录状态，提示登录
      wx.showToast({
        title: '请先登录！',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }
  },

  // 推荐房源跳到房源详情页
  NavigateToDetail: function (e) {
    wx.navigateTo({
      url: '../../housePackage/houseDetail/houseDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      total: 0,
      page: 0,
      HouseList: [],
    })
    this.GetNotice() // 获取滚动公告信息
    this.GetHouse()
  },

  /** 
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    wx.showToast({
      title: '没有更多推荐数据了',
      icon: 'none',
      duration: 1000,
    })
  },

  /**
   * 用户点击右上角分享
   */
  //分享给朋友
  onShareAppMessage: function () {
    return {
      title: '房产小程序.首页',
    }

  },
  //分享朋友圈
  onShareTimeline: function (res) {
    return {
      title: '房产小程序.首页',
    }
  }
})