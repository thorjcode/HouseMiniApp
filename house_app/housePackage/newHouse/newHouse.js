// housePackage/newHouse/newHouse.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HouseList: [], //房源列表
    total: 0, // 默认数据总数
    page: 0, // 默认查询第一页
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    this.DocCount() // 查询数据总数
    this.QueryHouse(this.data.page) // 获取房源数据列表
  },

  // 查询数据总数
  DocCount() {
    db.collection('HouseList').where({
        'publish': true, //只查询已发布的房源
        'publishPlateName': 'NewHouse' //只查询新房板块的房源
      })
      .count({
        success: res => {
          if (res.errMsg == "collection.count:ok") {
            this.setData({
              total: res.total
            })
          } else {}
        },
        fail: err => {}
      })
  },

  // 获取房源数据列表
  QueryHouse(page) {
    let HouseList = this.data.HouseList
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    db.collection('HouseList').where({
        'publish': true, //只查询已发布的房源
        'publishPlateName': 'NewHouse' //只查询新房板块的房源
      })
      .orderBy('publishTime', 'desc')
      .skip(page)
      .limit(10)
      .get({
        success: res => {
          wx.hideLoading()
          if (res.errMsg == "collection.get:ok") {
            console.log('查询成功', res.data)
            let data = res.data
            if (res.data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                HouseList.push(data[i])
              }
              this.setData({
                HouseList: HouseList
              })
            } else {
              wx.showToast({
                icon: "none",
                title: '没有数据',
                duration: 1000,
              })
            }
          }
        },
        fail: err => {
          wx.hideLoading()
          console.log('查询失败', err)
          wx.showToast({
            icon: "none",
            title: '查询失败',
            duration: 1000,
          })
        }
      })
  },

  // 点击跳转到房源详情页
  Navigate: function (e) {
    // console.log('点击获取的id', e.currentTarget.dataset.id)
    let url = '../houseDetail/houseDetail'
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `${url}?id=${id}`,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let total = this.data.total
    //console.log('触底的条数', total)
    let page = this.data.page
    //console.log('触底的page', page)
    let HouseList = this.data.HouseList
    //console.log('触底的HouseList', HouseList)
    if (HouseList.length < total) {
      page = HouseList.length
      //console.log('触底的重新去查询的page', page)
      this.QueryHouse(page)
    } else {
      wx.showToast({
        icon: "none",
        title: '没有数据了哟',
        duration: 1000,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})