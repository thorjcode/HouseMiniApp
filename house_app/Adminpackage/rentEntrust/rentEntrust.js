// housePackage/rentEntrust/rentEntrust.js
const {
  formatTime
} = require("../../utils/util.js")
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    EntrustType: 'rent', // 委托类型
    imgList: [], // 照片列表
    // 表单数据
    FormData: {
      'name': '', // 委托人姓名
      'phone': '', // 委托人电话
      'houseName': '', // 房源名字
      'location': '', // 详细地址
      'decorate': '', //装修配置
      'floor': '', //楼层
      'area': '', // 房子面积
      'totalPrice': '', // 总价
      'averagePrice': '', // 平均价
      'houseintro': '', //房源简介
      'HouseType': '', // 房子类型，新房，旧房
      'houseRoom': '', // 居室类型，如：一居室
      'houseTags': '', //房子标签
      'LookUpStyle': '', // 看房方式
      'Invoice': '', // 朝向
    },
    // 渲染输入框
    InputList: [{
        'id': 'name',
        'title': '姓名:',
        'placeholder': '填写负责人',
        'type': 'text',
        'maxlength': 8
      },
      {
        'id': 'phone',
        'title': '电话:',
        'placeholder': '填写负责人电话',
        'type': 'number',
        'maxlength': 11
      }, {
        'id': 'houseName',
        'title': '房源名字:',
        'placeholder': '填写房源名字',
        'type': 'text',
        'maxlength': 50
      }, {
        'id': 'location',
        'title': '房源地址:',
        'placeholder': '填写房源详细地址',
        'type': 'text',
        'maxlength': 50
      }, {
        'id': 'floor',
        'title': '楼层:',
        'placeholder': '如:10楼 或 11-20楼',
        'type': 'text',
        'maxlength': 20
      }, {
        'id': 'area',
        'title': '出租面积（单位：㎡）',
        'placeholder': '填写出租面积',
        'type': 'digit',
        'maxlength': 20
      },
      {
        'id': 'totalPrice',
        'title': '租金（单位：月/元）',
        'placeholder': '填写房子的租金',
        'type': 'digit',
        'maxlength': 20
      },
      {
        'id': 'houseintro',
        'title': '房源简介:',
        'placeholder': '房源简介',
        'type': 'textarea',
        'maxlength': 100
      }
    ],

    // 居室选择列表，多列选择
    HouseRoomList: [
      ['0室', '1室', '2室', '3室', '4室', '5室'],
      ['0厅', '1厅', '2厅', '3厅'],
      ['0卫', '1卫', '2卫', '3卫'],
    ],
    HouseRoomSelected: [0, 0, 0], // 居室选择结果

    // 房子标签
    HouseTagsList: [
      ['月租', '整租', '合租'],
      ['房子新', '采光良好', '南北通透', '环境优美'],
      ['交通方便', '近地铁', '近学校', '近公交'],
    ],
    HouseTagsSelected: [0, 0, 0], // 房子标签选择结果

    // 渲染选择器,单列选择
    PickerList: [{
        'id': 'decorate',
        'title': '装修配置',
        'pickerlist': ['精装', '拎包入住']
      },
      {
        'id': 'HouseType',
        'title': '房子类型',
        'pickerlist': ['出租房']
      }, {
        'id': 'LookUpStyle',
        'title': '看房方式',
        'pickerlist': ['随时看房', '电话预约']
      }, {
        'id': 'Invoice',
        'title': '朝向',
        'pickerlist': ["南北", "东西", "西北", "东北"]
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {},

  // 获取输入框数据
  InputData: function (e) {
    let FormData = this.data.FormData
    let id = e.currentTarget.id
    let value = e.detail.value
    FormData[id] = value
    this.setData({
      FormData
    })
  },

  // 居室选择
  houseRoomChange(e) {
    let HouseRoomList = this.data.HouseRoomList
    let FormData = this.data.FormData
    let value = e.detail.value
    let room = value[0]
    let hall = value[1]
    let toilet = value[2]

    if (room == 0) {
      room = ''
    } else {
      room = HouseRoomList[0][room]
    }
    if (hall == 0) {
      hall = ''
    } else {
      hall = HouseRoomList[1][hall]
    }
    if (toilet == 0) {
      toilet = ''
    } else {
      toilet = HouseRoomList[2][toilet]
    }
    let houseRoom = `${room}${hall}${toilet}`

    FormData.houseRoom = houseRoom
    this.setData({
      HouseRoomSelected: value,
      FormData
    })
  },

  // 标签选择
  houseTagsChange(e) {
    let HouseTagsList = this.data.HouseTagsList
    let FormData = this.data.FormData
    let value = e.detail.value
    let oneTag = value[0]
    let twoTag = value[1]
    let threeTag = value[2]

    if (oneTag == 0) {
      oneTag = HouseTagsList[0][oneTag]
    } else {
      oneTag = HouseTagsList[0][oneTag]
    }
    if (twoTag == 0) {
      twoTag = HouseTagsList[1][twoTag]
    } else {
      twoTag = HouseTagsList[1][twoTag]
    }
    if (threeTag == 0) {
      threeTag = HouseTagsList[2][threeTag]
    } else {
      threeTag = HouseTagsList[2][threeTag]
    }
    let houseTags = `${oneTag}${twoTag}${threeTag}`

    FormData.houseTags = houseTags
    this.setData({
      HouseTagsSelected: value,
      FormData
    })
  },

  // 获取单列选择器数据
  PickerData(e) {
    console.log(e, e.currentTarget.id, e.detail.value)
    let FormData = this.data.FormData
    let id = e.currentTarget.id
    let value = e.detail.value
    let list = e.currentTarget.dataset.pickerlist
    FormData[id] = list[value]
    this.setData({
      FormData
    })
  },

  // 选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 5, //可选择图片数
      sizeType: ['compressed'], //压缩图
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  // 预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  // 删除图片
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  // 提交信息前进行数据校验
  Submit(e) {
    let ImgList = this.data.imgList
    let FormData = this.data.FormData
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    // 计算平均价格
    let averagePrice = (FormData['totalPrice'] * 10000 / FormData['area']).toFixed(2)
    FormData['averagePrice'] = averagePrice
    // 表单数据的校验
    for (let key in FormData) {
      if (FormData[key] == '') {
        wx.showToast({
          title: '请把所有数据填写完整',
          duration: 1000,
          icon: "none"
        })
        return;
      }
      if (FormData['phone'].length != 11) {
        wx.showToast({
          title: '请输入11位电话号！',
          duration: 1000,
          icon: "none"
        })
        return;
      }
      if (!myreg.test(FormData['phone'])) {
        wx.showToast({
          title: '请输入有效电话号！',
          duration: 1000,
          icon: "none"
        })
        return;
      }
    }
    // 图片为空时报错
    if (ImgList.length == 0) {
      wx.hideLoading()
      wx.showToast({
        title: '图片不能为空,最少需要一张',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }
    this.setData({
      FormData: FormData
    })

    // 上传数据
    this.Upload()
  },


  // 上传数据
  Upload() {
    let EntrustType = this.data.EntrustType
    let FormData = this.data.FormData
    let imgFileID = [] //把图片以数组保存
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    // 上传图片到云存储
    for (let i = 0; i < this.data.imgList.length; i++) {
      const fileName = this.data.imgList[i]; //this.data.imgList是数组类型，把imgList转换字符串fileName
      const cloudPath = "HouseImg/" + Date.now() + Math.floor(Math.random(0, 1) * 10000000) + '.jpg'; // HouseImg/后面的内容为图片名称
      wx.cloud.uploadFile({
          cloudPath,
          filePath: fileName, //filePath需要字符串才能上传
        }).then(res => {
          wx.hideLoading()
          //console.log('uploadFile-then的fileID', res.fileID, 'fileID的类型', typeof res.fileID)
          imgFileID.push(res.fileID) //返回的res.fileID是字符串类型，把上传成功后返回的res.fileID压入（push）imgFileID数组中，这样写入数据库就是数组了
          //console.log('imgFileID', imgFileID, 'imgFileID类型', typeof imgFileID)
          if (imgFileID.length == this.data.imgList.length) {
            db.collection('HouseList') //上传图片成功后把数据上传到数据库
              .add({
                data: {
                  publish: false,
                  EntrustType: EntrustType,
                  FormData: FormData,
                  houseImg: imgFileID,
                  updateTime: formatTime(new Date())
                },
                success: res => {
                  console.log('上传数据库成功：', res.errMsg)
                  wx.hideLoading()
                  if (res.errMsg == "collection.add:ok") {
                    wx.showToast({
                      title: '上传成功',
                      icon: "success",
                      duration: 1000,
                    })
                    // 上传成功，关闭当前页面跳转到审核页面
                    wx.redirectTo({
                      url: '../EntrustList/EntrustList',
                    })
                  }
                },
                fail: err => {
                  wx.hideLoading()
                  console.log('上传数据库失败：', err)
                  //发布失败，则把已经上传的图片删除
                  wx.cloud.deleteFile({
                    fileList: imgFileID, //deleteFile的fileList是数组才能删除
                    success: res => {
                      console.log('删除已经上传的图片成功：', res.errMsg)
                      if (res.errMsg == "cloud.deleteFile:ok") {
                        wx.showToast({
                          title: '上传失败！请稍后重试',
                          icon: 'none',
                          duration: 1000,
                        })
                      }
                    },
                    fail: err => {
                      wx.showToast({
                        title: '网络错误，上传失败！',
                        icon: 'none',
                        duration: 1000,
                      })
                    }
                  })
                }
              })
          }
        })
        .catch(err => {
          wx.hideLoading()
          console.log('上传图片失败', err)
          wx.showToast({
            title: '网络错误，上传失败！',
            icon: 'none',
            duration: 1000,
          })
        })
    }
  },
})