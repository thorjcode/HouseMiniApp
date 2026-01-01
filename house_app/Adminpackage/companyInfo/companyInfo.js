// Adminpackage/companyInfo/companyInfo.js
const db = wx.cloud.database()
const {
  formatTime
} = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CompanyData: {
      'editer': '', //上次编辑
      'updateTime': '', //上次更新
      'introduce': '', //公司介绍文案
      'notice': '', //首页滚动公告
      'manager': '', //负责人
      'phone': '', //电话
      'ration': '', //待遇
      'worktime': '', //上班时间
      'postintro': '', //岗位介绍
    },
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
    this.CompanyInfo() //从数据库获取公司信息数据
  },

  // 从数据库获取公司信息数据
  CompanyInfo() {
    db.collection('CompanyInfo')
      .get({
        success: res => {
          wx.hideLoading()
          //console.log('查询成功', res)
          if (res.errMsg == "collection.get:ok" && res.data.length > 0) {
            this.setData({
              CompanyData: res.data[0]
            })
          }
        },
        fail: err => {
          wx.hideLoading()
          console.log('查询失败', err)
        }
      })
  },


  // 获取输入框的数据
  InputData(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    let CompanyData = this.data.CompanyData
    if (key == 'introduce') {
      CompanyData['introduce'] = value
    }
    if (key == 'notice') {
      CompanyData['notice'] = value
    }
    if (key == 'manager') {
      CompanyData['manager'] = value
    }
    if (key == 'phone') {
      CompanyData['phone'] = value
    }
    if (key == 'ration') {
      CompanyData['ration'] = value
    }
    if (key == 'worktime') {
      CompanyData['worktime'] = value
    }
    if (key == 'postintro') {
      CompanyData['postintro'] = value
    }
    this.setData({
      CompanyData: CompanyData //把获取到的数据存放到CompanyData
    })
  },

  // 提交更新数据
  submitData() {
    let CompanyData = this.data.CompanyData
    let introduce = CompanyData.introduce
    let notice = CompanyData.notice
    let manager = CompanyData.manager
    let phone = CompanyData.phone
    let ration = CompanyData.ration
    let worktime = CompanyData.worktime
    let postintro = CompanyData.postintro
    let userInfo = wx.getStorageSync('UserInfo')
    let editer = userInfo.nickName
    console.log('CompanyData：',CompanyData._id)
    //如果返回的数据里有：_id，则证明有数据，进行更新，如果没有：_id，则证明没有数据，进行创建
    if (CompanyData._id) {
      console.log('走if')
      let Id = CompanyData._id
      db.collection('CompanyInfo')
        .doc(Id).update({
          data: {
            introduce: introduce,
            notice: notice,
            editer: editer,
            manager: manager,
            phone: phone,
            ration: ration,
            worktime: worktime,
            postintro: postintro,
            updateTime: formatTime(new Date())
          },
          success: res => {
            if (res.errMsg == "document.update:ok") {
              wx.showToast({
                title: '更新成功',
                icon: "success",
                duration: 1000,
              })
              this.CompanyInfo() //刷新数据
            }
          },
          fail: res => {
            wx.showToast({
              title: '网络错误，更新失败！',
              icon: "error",
              duration: 1000,
            })
          }
        })
    } else {
      console.log('走else')
      db.collection('CompanyInfo')
        .add({
          data: {
            introduce: introduce,
            notice: notice,
            manager: manager,
            phone: phone,
            ration: ration,
            worktime: worktime,
            postintro: postintro,
            updateTime: formatTime(new Date())
          },
          success: res => {
            if (res.errMsg == "collection.add:ok") {
              wx.showToast({
                title: '添加成功',
                icon: "success",
                duration: 1000,
              })
              this.CompanyInfo() //刷新数据
            }
          },
          fail: res => {
            wx.showToast({
              title: '网络错误，添加失败！',
              icon: "error",
              duration: 1000,
            })
          }
        })
    }
  },
  
})