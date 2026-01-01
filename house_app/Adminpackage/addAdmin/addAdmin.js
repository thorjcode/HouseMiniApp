// pages/addadmin/addadmin.js
const db = wx.cloud.database()
const {
  formatTime
} = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserList: [], //所有普通用户列表
    switch: false, //管理员状态
    total: 0, //数据条数
    page: 0, //页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let page = this.data.page
    this.getUser(page) // 查询所有普通用户
    this.DocCount() // 查询数据总条数
  },

  // 查询数据总条数
  DocCount() {
    db.collection('UserList').where({
        'admin': false,
      })
      .count({
        success: res => {
          if (res.errMsg == "collection.count:ok") {
            this.setData({
              total: res.total
            })
          }
        },
        fail: err => {}
      })
  },

  // 查询所有普通用户
  getUser(page) {
    let UserList = this.data.UserList
    db.collection('UserList').where({
        'admin': false
      })
      .skip(page)
      .limit(10)
      .get({
        success: res => {
          //console.log('查询普通用户成功', res)
          if (res.errMsg == "collection.get:ok" && res.data.length > 0) {
            let data = res.data
            for (let i = 0; i < data.length; i++) {
              UserList.push(data[i])
            }
            this.setData({
              UserList: UserList //把从数据库查询到的数据赋值
            })
          }
        },
        fail: err => {
          console.log('查询普通用户失败', err)
        }
      })
  },


  // 添加管理员
  addAdmin(e) {
    let userInfo = wx.getStorageSync('UserInfo')
    let id = e.currentTarget.dataset.id
    let value = e.detail.value
    if (value) {
      db.collection('UserList').doc(id).update({
        data: {
          admin: true,
          level: Number("1"),
          operator: userInfo.nickName,
          addAdminTime: formatTime(new Date())
        },
        success: res => {
          if (res.errMsg == "document.update:ok" && res.stats.updated > 0) {
            wx.navigateBack({
              delta: 1, //添加管理员成功，自动返回上一层
            })
          }
        },
        fail: err => {
          this.setData({
            switch: false
          })
          wx.showToast({
            title: '添加失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let total = this.data.total
    let page = this.data.page
    let UserList = this.data.UserList
    if (UserList.length < total) {
      page = UserList.length
      this.getUser(page)
    } else {
      wx.showToast({
        icon: "none",
        title: '没有数据了哟',
        duration: 1000,
      })
    }
  },

})