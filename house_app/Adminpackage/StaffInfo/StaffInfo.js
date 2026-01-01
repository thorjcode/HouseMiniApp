const app = getApp();
const db = wx.cloud.database();
const {
  formatTime
} = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showlist: false,
    showInput: false,
    nothing: false,
    isChooseImg: true, // 默认显示选择图片按钮
    total: 0, // 默认数据总数
    page: 0, // 默认查询第一页
    inputTitle: '',
    confirmTxt: '',
    type: '',
    id: '',
    inputName: '',
    inputPhone: '',
    name: '',
    phone: '',
    staffImg: '',
    staffList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad执行了')

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow执行了')
    //初始化
    this.setData({
      staffList: [],
      total: 0, // 默认数据总数
      page: 0, // 默认查询第一页
    })

    let page = this.data.page
    this.DocCount()
    this.staffList(page)
  },

  /**
   * 查询数据总数
   */
  DocCount() {
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
          console.log('查询总条数失败', err)
        }
      })
  },

  /**
   * 员工列表
   */
  staffList(page) {
    wx.showLoading({
      title: '刷新中...',
      mask: true
    })
    let staffList = this.data.staffList
    db.collection('StaffList')
      .orderBy('updateTime', 'desc')
      .skip(page)
      .limit(10)
      .get({
        success: res => {
          wx.hideLoading()
          if (res.errMsg == "collection.get:ok") {
            let data = res.data
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                staffList.push(data[i])
              }
              this.setData({
                staffList: staffList,
                nothing: false,
              })
            } else {
              this.setData({
                nothing: true,
              })
            }
          }
        },
        fail: err => {
          wx.hideLoading()
          console.log('查询员工列表失败', err)
        }
      })
  },

  /**
   *  打开输入框
   */
  openInput(e) {
    //初始化
    this.setData({
      id: '',
      inputName: '',
      inputPhone: '',
      staffImg: '',
      showInput: true,
      isChooseImg: true,
      nothing: false,
    })
  },

  /**
   * 关闭输入框
   */
  closeInput() {
    // 初始化
    this.setData({
      type: '',
      id: '',
      inputName: '',
      inputPhone: '',
      staffImg: '',
      showInput: false,
      isChooseImg: true,
    })
  },

  /**
   * 获取输入框数据
   */
  inputData(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    if (key == 'name') {
      this.setData({
        inputName: value
      })
    }
    if (key == 'phone') {
      this.setData({
        inputPhone: value
      })
    }
  },

  /**
   * 选择图片
   */
  chooseImg() {
    wx.chooseImage({
      count: 1, //张数
      sizeType: ['compressed'], //压缩图
      sourceType: ['album'], //从相册选择
      success: res => { //chooseImage-success方法，返回类型是数组
        //const tempFilePaths = res.tempFilePaths[0]; //把数组转换成字符串,
        console.log('选择图片成功', res.tempFilePaths, 'res.tempFilePaths类型', typeof res.tempFilePaths)
        //console.log('选择图片成功-转换字符串', tempFilePaths)
        this.setData({
          isChooseImg: false,
          //staffImg: tempFilePaths,//字符串
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
    console.log('点击了大图预览', this.data.staffImg, 'this.data.staffImg类型', typeof this.data.staffImg)
    //let a = ''
    //console.log(a instanceof Array) //测试a是否为数组类型，是返回true，否返回false
    //let previewList = []
    //console.log(previewList instanceof Array) //返回true
    //previewList.push(this.data.staffImg) //把字符串转换成数组
    //console.log('大图预览-字符串转换数组', previewList)
    wx.previewImage({ //大图预览,需要的类型是数组
      //urls: previewList,
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
    let staffImg = this.data.staffImg
    //console.log('确定提交里的img', this.data.staffImg, 'this.data.staffImg类型', typeof this.data.staffImg)
    let name = this.data.inputName
    let phone = this.data.inputPhone
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (name == "") {
      wx.showToast({
        title: '请输入姓名！',
        duration: 1000,
        icon: "none"
      })
    } else if (phone == "") {
      wx.showToast({
        title: '请输入电话！',
        duration: 1000,
        icon: "none"
      })
    } else if (phone.length != 11) {
      wx.showToast({
        title: '请输入11位电话号！',
        duration: 1000,
        icon: "none"
      })
    } else if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入有效电话号！',
        duration: 1000,
        icon: "none"
      })
    } else if (staffImg.length == 0) {
      wx.showToast({
        title: '请上传头像！',
        duration: 1000,
        icon: "none"
      })
    } else {
      // 跳转添加新员工
      this.addStaff(name, phone, staffImg)
    }
  },

  /**
   * 添加员工，完工
   */
  addStaff(name, phone, staffImg) {
    let imgFileID = [] //把图片以数组保存
    wx.showLoading({
      title: '添加中...',
    })
    for (let i = 0; i < staffImg.length; i++) {
      const fileName = this.data.staffImg[i]; //this.data.staffImg是数组类型，fileName转换字符串
      //console.log('fileName类型', fileName, typeof fileName)
      let cloudPath = "StaffImg/" + Date.now() + '.jpg'; // StaffImg/后面的内容为图片名称
      wx.cloud.uploadFile({
          cloudPath,
          filePath: fileName, // 文件路径（临时的），uploadFile的filePath类型要是字符串，才可以上传
        }).then(res => {
          wx.hideLoading()
          //console.log('uploadFile-then的fileID', res.fileID, 'fileID的类型', typeof res.fileID)
          imgFileID.push(res.fileID) //返回的res.fileID是字符串类型，把上传成功后返回的res.fileID压入（push）imgFileID数组中，这样写入数据库就是数组了
          //console.log('imgFileID', imgFileID, 'imgFileID类型', typeof imgFileID)
          if (imgFileID.length == this.data.staffImg.length) {
            db.collection('StaffList')
              .add({
                data: {
                  name: name,
                  phone: phone,
                  staffImg: imgFileID,
                  updateTime: formatTime(new Date())
                },
                success: res => {
                  console.log('add-success', res.errMsg)
                  wx.hideLoading()
                  if (res.errMsg == "collection.add:ok") {
                    console.log('走add-if,添加成功', )
                    wx.showToast({
                      title: '添加成功',
                      icon: "success",
                      duration: 1000,
                    })
                    //设置初始值
                    this.setData({
                      total: 0,
                      page: 0,
                      staffList: [],
                      isChooseImg: true,
                      showInput: false,
                    })
                    this.DocCount() //添加成功后，重新查询一遍将新添加的显示出来
                    this.staffList(0)
                  } else {
                    console.log('走add-else', )
                    wx.showToast({
                      title: '添加失败！',
                      icon: 'none',
                      duration: 1000,
                    })
                  }
                },
                fail: err => {
                  wx.hideLoading()
                  console.log('add-fail', err)
                  //添加员工失败，则把已经上传的图片删除
                  wx.cloud.deleteFile({
                    fileList: imgFileID, //deleteFile的fileList是数组才能删除
                    success: res => {
                      if (res.errMsg == "cloud.deleteFile:ok") {
                        wx.showToast({
                          title: '添加失败！',
                          icon: 'none',
                          duration: 1000,
                        })
                      }
                    },
                    fail: err => {

                    }
                  })
                }
              })
          }
        })
        .catch(err => {
          // uploadFile上传图片失败
          wx.hideLoading()
          console.log('uploadFile-catch', err)
          wx.showToast({
            title: '添加失败！',
            icon: 'none',
            duration: 1000,
          })
        })
    }
  },

  /**
   * 长按
   */
  longPress(e) {
    let id = e.currentTarget.dataset.id
    //console.log('长按获取的id', id)
    let name = e.currentTarget.dataset.name
    let phone = e.currentTarget.dataset.phone
    let img = e.currentTarget.dataset.img
    //console.log('长按获取的img', img)
    wx.setStorageSync('BeforeName', name)
    wx.setStorageSync('BeforePhone', phone)
    wx.setStorageSync('BeforeImgFileId', img) //把长按获取的图片fileID存入缓存，给下面删除之前图片方法使用

    wx.showActionSheet({
      itemList: ['修改', '删除'],
      success: res => {
        if (res.tapIndex === 0) {
          console.log('点击了修改')
          wx.navigateTo({
            url: './edit/edit?id=' + e.currentTarget.dataset.id,
          })
        }
        if (res.tapIndex === 1) {
          console.log('点击了删除')
          //删除模式
          this.delete(id, name, img)
        }
      },
      fail: err => { //点击取消
        console.log('点击了取消')
        //清除缓存
        wx.removeStorageSync('BeforeName')
        wx.removeStorageSync('BeforePhone')
        wx.removeStorageSync('BeforeImgFileId')
      }
    })
  },


  // 删除员工提示
  delete(id, name, img) {
    console.log('delete里的id', id)
    wx.showModal({
      title: '温馨提醒',
      content: `确定删除 ${name} ? 删除后将不可恢复！`,
      confirmText: '确定删除',
      confirmColor: '#ff0080',
      cancelText: '取消',
      mask: true,
      success: res => {
        if (res.confirm) {
          // 跳转删除员工
          this.deleteStaff(id, img)
        }
      }
    })
  },

  // 删除员工，完工
  deleteStaff(id, img) {
    //console.log('DeleteImages里的id', id)
    //console.log('DeleteImages里的img', img)
    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    wx.cloud.deleteFile({
      fileList: img, //deleteFile的fileList是数组才能删除
      success: res => {
        //console.log('走deleteFile的success', res.errMsg)
        wx.hideLoading()
        if (res.errMsg == "cloud.deleteFile:ok") {
          db.collection('StaffList').doc(id).remove({
            success: res => {
              //console.log('remove-success', res.errMsg)
              if (res.errMsg == "document.remove:ok" && res.stats.removed > 0) {
                //console.log('走remove-if', )
                //清除缓存
                wx.removeStorageSync('BeforeName')
                wx.removeStorageSync('BeforePhone')
                wx.removeStorageSync('BeforeImgFileId')
                wx.showToast({
                  title: '删除成功',
                  icon: "success",
                  duration: 1000,
                })
                //设置初始值
                this.setData({
                  total: 0,
                  page: 0,
                  staffList: []
                })
                this.DocCount() //删除成功后，重新查询一遍将新数据的显示出来
                this.staffList(0)
              } else {
                console.log('走remove-else', )
                wx.showToast({
                  title: '删除失败！',
                  icon: 'none',
                  duration: 1000,
                })
              }
            },
            fail: err => {
              console.log('remove-fail', err)
              //清除缓存
              wx.removeStorageSync('BeforeName')
              wx.removeStorageSync('BeforePhone')
              wx.removeStorageSync('BeforeImgFileId')
              wx.showToast({
                title: '删除失败！',
                icon: 'none',
                duration: 1000,
              })
            }
          })
        } else {
          console.log('走删除图片的else')
          //清除缓存
          wx.removeStorageSync('BeforeName')
          wx.removeStorageSync('BeforePhone')
          wx.removeStorageSync('BeforeImgFileId')
          wx.showToast({
            title: '删除图片失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.log('deleteFile-fail', err)
        //清除缓存
        wx.removeStorageSync('BeforeName')
        wx.removeStorageSync('BeforePhone')
        wx.removeStorageSync('BeforeImgFileId')
        wx.hideLoading()
        wx.showToast({
          title: '删除图片失败',
          icon: 'none',
          duration: 1000,
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let total = this.data.total
    //console.log('触底的条数', total)
    let page = this.data.page
    //console.log('触底page', page)
    let staffList = this.data.staffList
    if (staffList.length < total) {
      page = staffList.length
      this.staffList(page)
    } else {
      wx.showToast({
        title: '看到底了哟！',
        icon: 'none',
        duration: 1000,
      })
    }
  },
})