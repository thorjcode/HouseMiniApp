// pages/edit/headImg/headImg.js
const db = wx.cloud.database()
const {
  formatTime
} = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChooseImg: true, // 默认显示选择图片按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.queryInfo(id) // 根据传过来的id查询详细信息
    this.setData({
      id: id
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 查询信息
   */
  queryInfo(id) {
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('StaffList').where({
      _id: id
    }).get({
      success: res => {
        wx.hideLoading()
        if (res.errMsg == "collection.get:ok") {
          if (res.data.length > 0) {
            let data = res.data[0]
            this.setData({
              id: data._id,
              staffImg: data.staffImg,
              name: data.name,
              phone: data.phone,
              isChooseImg: false, // 默认显示选择图片按钮
            })
          } else {
            wx.showToast({
              title: '网络错误!加载失败',
              duration: 1000,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '网络错误!加载失败',
            duration: 1000,
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误!加载失败',
          duration: 1000,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 选择图片
   */
  chooseImg() {
    wx.chooseImage({
      count: 1, //张数
      sizeType: ['compressed'], //压缩图
      sourceType: ['album'], //从相册选择
      success: res => {
        console.log('选择图片成功', res.tempFilePaths, 'res.tempFilePaths类型', typeof res.tempFilePaths)
        this.setData({
          isChooseImg: false,
          staffImg: res.tempFilePaths
        })
      },
      fail: err => {}
    });
  },

  /**
   * 大图预览
   */
  previewImg(e) {
    wx.previewImage({
      urls: this.data.staffImg,
      current: e.currentTarget.dataset.url
    });
  },

  /**
   * 删除照片
   */
  deleteImg(e) {
    console.log('点击了删除图片', )
    wx.showModal({
      title: '温馨提示',
      content: '确定删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.setData({
            isChooseImg: true,
            staffImg: ''
          })
        }
      },
      fail: err => {}
    })
  },

  /**
   * 确认提交按钮
   */
  confirmSubmit(e) {
    var beforeImgFileId = wx.getStorageSync('BeforeImgFileId')
    let staffImg = this.data.staffImg
    if (staffImg.length == 0) {
      wx.showToast({
        title: '请上传头像！',
        duration: 1000,
        icon: "none"
      })
    } else if (staffImg[0] == beforeImgFileId[0]) {
      wx.showToast({
        title: '好像什么也没动哦！',
        icon: 'none',
        duration: 1000,
      })
    } else {
      let id = e.currentTarget.dataset.id
      this.editUserPhoto(id)

    }
  },
  /**
   * 修改图片
   */
  editUserPhoto(id) {
    console.log('走修改图片的id', id)
    let imgFileID = []
    for (let i = 0; i < this.data.staffImg.length; i++) {
      const fileName = this.data.staffImg[i]; //this.data.userPhoto是数组类型，通过for循环i，提取数组集合里的i项赋值给fileName转换为字符串
      let cloudPath = "StaffImg/" + Date.now() + '.jpg';
      wx.cloud.uploadFile({
        cloudPath,
        filePath: fileName, // 文件路径（临时的），uploadFile的filePath需要字符串才上传
      }).then(res => {
        wx.hideLoading()
        console.log('走修改图片-uploadFile-then', res.fileID)
        imgFileID.push(res.fileID)
        console.log('修改图片imgFileID', imgFileID, '类型', typeof imgFileID)
        db.collection('StaffList').doc(id).update({
          data: {
            staffImg: imgFileID,
            updateTime: formatTime(new Date())
          },
          success: res => {
            console.log('走修改图片update-success', res.errMsg)
            if (res.errMsg == "document.update:ok") {
              console.log('走修改图片update-if', )
              //修改成功后，删除原有的图片
              var beforeImgFileId = wx.getStorageSync('BeforeImgFileId') //从缓存里取之前图片的fileID
              console.log('获取缓存里之前图片的id', beforeImgFileId, '类型', typeof beforeImgFileId)
              wx.cloud.deleteFile({
                fileList: beforeImgFileId, //deleteFile的fileList是数组才能删除，从缓存里获取之前图片的fileID
                success: res => {
                  console.log('走修改图片-删除之前图片success', res.errMsg)
                  if (res.errMsg == "cloud.deleteFile:ok") {
                    console.log('走修改图片-删除之前图片的if,成功')
                    //清除缓存
                    wx.removeStorageSync('BeforeName')
                    wx.removeStorageSync('BeforePhone')
                    wx.removeStorageSync('BeforeImgFileId')
                    wx.showToast({
                      title: '修改成功',
                      icon: "success",
                      duration: 1000,
                    })
                    //修改成功，返回员工列表页面
                    wx.navigateBack({
                      delta: 2
                    })

                  } else {
                    console.log('走修改图片-删除之前的图片的else，失败')
                    //清除缓存
                    wx.removeStorageSync('BeforeName')
                    wx.removeStorageSync('BeforePhone')
                    wx.removeStorageSync('BeforeImgFileId')
                    wx.showToast({
                      title: '删除之前图片失败',
                      icon: 'none'
                    })
                  }
                },
                fail: err => {
                  console.log('走修改图片-删除之前的图片的fail', err)
                  //清除缓存
                  wx.removeStorageSync('BeforeName')
                  wx.removeStorageSync('BeforePhone')
                  wx.removeStorageSync('BeforeImgFileId')
                  wx.hideLoading()
                  wx.showToast({
                    title: '删除之前图片失败',
                    icon: 'none'
                  })
                }
              })
            } else {
              console.log('走修改图片update-else', )
              //清除缓存
              wx.removeStorageSync('BeforeName')
              wx.removeStorageSync('BeforePhone')
              wx.removeStorageSync('BeforeImgFileId')
              wx.showToast({
                title: '修改失败！',
                icon: 'none',
                duration: 1000,
              })
            }
          },
          fail: err => {
            console.log('走修改图片update-fail', err)
            //清除缓存
            wx.removeStorageSync('BeforeName')
            wx.removeStorageSync('BeforePhone')
            wx.removeStorageSync('BeforeImgFileId')
            wx.showToast({
              title: '修改失败',
              icon: 'none',
              duration: 1000,
            })
          }
        })
      }).catch(err => {
        // uploadFile失败
        console.log('走修改图片-uploadFile-catch', err)
        //清除缓存
        wx.removeStorageSync('BeforeName')
        wx.removeStorageSync('BeforePhone')
        wx.removeStorageSync('BeforeImgFileId')
        wx.hideLoading()
        wx.showToast({
          title: '文件上传失败',
          icon: 'none',
          duration: 1000,
        })
      })
    }
  },

  /**
   * 取消按钮
   */
  close() {
    wx.navigateBack({
      delta: 1
    })
  },
})