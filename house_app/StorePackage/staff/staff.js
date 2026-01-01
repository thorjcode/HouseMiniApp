// StorePackage/staff/staff.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户列表
    staffList: [],
    // 默认数据总数
    total: 0,
    // 默认查询第一页
    page: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    let page = this.data.page
    this.queryCount()
    this.queryStaffList(page)
  },

  // 查询数据总数
  queryCount() {
    db.collection('StaffList')
      .count({
        success: res => {
          if (res.errMsg == "collection.count:ok") {
            this.setData({
              total: res.total
            })
          } else {}
        },
        fail: err => {
          wx.hideLoading()
          console.log('DocCount失败', err)
        }
      })
  },

  // 查询员工列表
  queryStaffList(page) {
    wx.showLoading({
      title: '加载员工信息...',
      mask: true
    })
    let staffList = this.data.staffList
    db.collection('StaffList')
      .orderBy('updaTetime', 'desc')
      .skip(page)
      .limit(10)
      .get({
        success: res => {
          wx.hideLoading()
          if (res.errMsg == "collection.get:ok") {
            let data = res.data
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                let info = {
                  '_id': data[i]._id,
                  'name': data[i].name,
                  'phone': data[i].phone,
                  'updateTime': data[i].updateTime,
                  'staffImg': data[i].staffImg,
                }
                staffList.push(info)
              }
              this.setData({
                page: page,
                staffList: staffList,
              })
            }else{
              wx.showToast({
                title: '没有数据',
                icon: 'none',
                duration: 1000,
            })
            }
          }
        },
        fail: err => {
          wx.hideLoading()
          //console.log('StaffList失败', err)
          wx.showToast({
            title: '网络错误！刷新失败',
            icon: 'none',
            duration: 1000,
            mask: true,
        })
        }
      })
  },

  // 长按打电话
  CallPhone(e) {
    let phoneNumber = e.currentTarget.dataset.phone
    wx.showModal({
      title: '温馨提示',
      content: `是否拨打：${phoneNumber}`,
      confirmText: '确定拨打',
      confirmColor: '#0081ff',
      cancelText: '取消',
      cancelColor: '#acb5bd',
      success: res => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phoneNumber,
            success: res => {
            },
            fail: err => {
            }
          })
        }
      },
      fail: err => {
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let total = this.data.total
    let page = this.data.page
    let staffList = this.data.staffList

    if (staffList.length < total) {
      page = staffList.length
      this.queryStaffList(page)
    } else {
      wx.showToast({
        icon: "none",
        title: '没有数据了哟',
      })
    }
  },
})