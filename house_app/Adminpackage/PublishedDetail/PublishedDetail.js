// Adminpackage/PublishedDetail/PublishedDetail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseImg: [],//房源图片
    houseInfo: '',//房源信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let id = e.id
    this.setData({
      Id: id
    })
    this.queryPublishDetail(id)
  },

  // 根据id去数据库查询房源
  queryPublishDetail(id) {
    wx.showLoading({
      title: '查询中...',
      mask: true
    })
    db.collection('HouseList').where({
      '_id': id
    }).get({
      success: res => {
        wx.hideLoading()
        console.log('查询成功', )
        if (res.errMsg == "collection.get:ok" && res.data.length > 0) {
          this.setData({
            houseInfo: res.data,
            houseImg: res.data[0].houseImg,
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        console.log('查询失败', res)
      }
    })
  },

  // 预览照片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.houseImg,
      current: e.currentTarget.dataset.url
    });
  },


  // 删除确认提示
  deleteshowModal() {
    wx.showModal({
      title: '温馨提示',
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
      title: '删除关联照片...',
      mask: true
    })
    let houseImg = this.data.houseImg
    wx.cloud.deleteFile({
      fileList: houseImg,
      success: res => {
        wx.hideLoading()
        // 图片删除成功
        if (res.errMsg == "cloud.deleteFile:ok") {
          console.log('删除关联图片成功', )
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
          // 删除成功，自动返回审核列表
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
})