// Adminpackage/EntrustDetail/EntrustDetail.js
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
    step: 1, // 步骤
    plateList: ['新房', '二手房', '出租房'], //房源板块
    PlateNameList: ['NewHouse', 'SecondHouse', 'RentHouse'], // 发布的板块的数据库名字
    publishPlateName: '',
    plate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let id = e.id
    console.log('从房源管理传过来的id', id)
    this.setData({
      Id: id
    })
    this.EntrustDetail(id)
  },

  // 根据传过来的id去数据库里查询该房源信息
  EntrustDetail(id) {
    wx.showLoading({
      title: '查询中...',
      mask: true
    })
    db.collection('HouseList').where({
      '_id': id
    }).get({
      success: res => {
        wx.hideLoading()
        console.log('房源详情查询成功：', res.data)
        if (res.errMsg == "collection.get:ok") {
          this.setData({
            houseInfo: res.data,
            houseImg: res.data[0].houseImg,
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        console.log('房源详情查询失败！', res)
      }
    })
  },

  // 预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.houseImg,
      current: e.currentTarget.dataset.url
    });
  },


  // 下一步
  nextStep() {
    this.setData({
      step: this.data.step + 1
    })
  },

  // 删除确认提示
  deleteshowModal() {
    // 进行确认提示
    wx.showModal({
      title: '删除提示',
      content: '删除后,不能恢复,是否确定继续删除?',
      confirmText: '确定',
      confirmColor: '#ff0080',
      cancelText: '取消',
      mask: true,
      success: res => {
        if (res.confirm) {
          // 跳转删除照片
          this.DeleteImages()
        }
      }
    })
  },

  // 删除照片
  DeleteImages() {
    wx.showLoading({
      title: '删除照片...',
      mask: true
    })
    let houseImg = this.data.houseImg
    console.log('房源图片：', houseImg)
    wx.cloud.deleteFile({
      fileList: houseImg,
      success: res => {
        wx.hideLoading()
        // 图片删除成功
        if (res.errMsg == "cloud.deleteFile:ok") {
          console.log('删除关联图片成功')
          // 跳转删除该房源
          this.DeleteHouse()
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('删除房源图片失败：', err)
        wx.showToast({
          title: '网络错误,房源删除失败！',
          mask: true,
          icon: 'none'
        })
      }
    })
  },

  // 删除该房源
  DeleteHouse() {
    let Id = this.data.Id
    wx.showLoading({
      title: '删除房源...',
      mask: true
    })
    db.collection('HouseList').doc(Id).remove({
      success: res => {
        wx.hideLoading()
        if (res.errMsg == "document.remove:ok" && res.stats.removed > 0) {
          console.log('删除房源成功')
          wx.showToast({
            title: '删除成功！',
            icon: 'success',
            duration: 1000,
          })
          // 删除成功，自动返回上一层
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('删除房源失败：', err)
        wx.showToast({
          ttitle: '网络错误,房源删除失败！',
          icon: 'none',
          duration: 1000,
        })
      }
    })
  },

  // 板块选择
  SelectPlate() {
    // 选择发布到哪个模块
    wx.showActionSheet({
      itemList: this.data.plateList,
      mask: true,
      success: res => {
        // 发布模块
        this.setData({
          plate: this.data.plateList[res.tapIndex],
          publishPlateName: this.data.PlateNameList[res.tapIndex]
        })
      },
      fail: err => {
        console.log('选择板块失败：', err)
      }
    })
  },

  // 发布按钮
  DoPublishing() {
    wx.showModal({
      title: '温馨提示',
      content: `确定发布到${this.data.plate}板块吗?`,
      success: res => {
        if (res.confirm) {
          // 发布房源
          this.publish()
        }
      }
    })
  },

  // 发布房源
  publish() {
    wx.showLoading({
      title: '正在发布...',
      mask: true
    })
    let publishPlateName = this.data.publishPlateName
    let plate = this.data.plate
    let Id = this.data.Id
    db.collection('HouseList')
      .doc(Id)
      .update({
        data: {
          publish: true,//把该条房源的发布状态更新为：已发布
          plate: plate,//板块的中文名称
          publishPlateName: publishPlateName,//板块的英文名称
          publishTime: formatTime(new Date()),
        },
        success: res => {
          wx.hideLoading()
          if (res.errMsg == "document.update:ok") {
            // 发布成功，自动返回审核列表
            wx.navigateBack({
              delta: 1
            })
          }
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            title: '发布失败！',
            icon: 'none',
            duration: 1000,
          })
        }
      })
  },
})