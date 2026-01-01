// Adminpackage/EntrustList/EntrustList.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowColor: false, // 顶部导航栏默认颜色
    unpublished: true, // 顶部导航栏默认状态

    unPublishList: [], // 待审核的数据列表
    publishList: [], // 已审核的数据列表
    unPutotal: 0, // 待审核的条数
    Putotal: 0, // 已审核的条数
    page: 0, // 默认查询第一页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('onLoad执行了', )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    //console.log('onShow执行了', )
    //恢复初始数据
    this.setData({
      isShowColor: false,
      unpublished: true,
      unPublishList: [],
      publishList: [],
      Putotal: 0,
      unPutotal: 0,
      page: 0,
      // type: 'unpublished',
    })
    let state = false //默认查询房源的状态：待审核
    this.queryCount(state)
    let page = this.data.page
    this.queryUnpublished(page, state)
  },

  // 顶部导航栏切换
  ChangeTab(e) {
    let type = e.currentTarget.dataset.type
    if (type == 'unpublished') {
      //恢复初始值
      this.setData({
        isShowColor: false,
        unpublished: true,
        published: false,
        type: type,
        unPublishList: [],
        unPutotal: 0,
        page: 0, // 默认查询第一页
      })
      let state = false
      this.queryCount(state)
      let page = 0
      this.queryUnpublished(page, state)
      console.log('点击切换到待审核', page, state)
    }
    if (type == 'published') {
      //恢复初始值
      this.setData({
        isShowColor: true,
        unpublished: false,
        published: true,
        type: type,
        publishList: [],
        Putotal: 0,
        page: 0, // 默认查询第一页
      })
      let state = true
      this.queryCount(state)
      let page = 0
      this.queryPublished(page, state)
      console.log('点击切换到已发布', page, state)
    }
  },

  // 查询房源数据的条数
  queryCount(state) {
    let openId = app.globalData.openid
    wx.showLoading({
      title: '查询中...',
    })
    db.collection('HouseList')
      .where({
        '_openid': openId,
        'publish': state
      })
      .count({
        success: res => {
          wx.hideLoading()
          console.log('查询总条数成功', res.total)
          if (res.errMsg == "collection.count:ok") {
            if (state) {
              console.log('已发布的条数:', res.total)
              this.setData({
                Putotal: res.total, //已发布条数
              })
            } else {
              console.log('待审核的条数:', res.total)
              this.setData({
                unPutotal: res.total, //待审核条数
              })
            }
          }
        },
        fail: err => {
          wx.hideLoading()
          console.log('查询总条数失败', err)
          this.setData({
            isShowColor: false,
            unpublished: false,
            published: false
          })
          wx.showToast({
            title: '网络错误,查询失败！',
            icon: 'none',
            duration: 1000,
          })
        }
      })
  },

  // 查询待审核的数据
  queryUnpublished(page, state) {
    let openId = app.globalData.openid
    let unPublishList = this.data.unPublishList
    db.collection('HouseList')
      .where({
        '_openid': openId,
        'publish': state
      }).orderBy('updateTime', 'desc')
      .skip(page) //从page数之后的数开始加载
      .limit(10)
      .get({
        success: res => {
          console.log('获取待审核房源成功', res.data.length)
          if (res.errMsg == "collection.get:ok" && res.data.length > 0) {
            console.log('走未发布-if', )
            let data = res.data
            for (let i = 0; i < data.length; i++) {
              unPublishList.push(data[i])
            }
            this.setData({
              unPublishList: unPublishList, //给待审核列表赋值
            })

          } else {
            console.log('走未发布-else', )
            wx.showToast({
              title: '暂时没有待审核的数据哦',
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail: err => {
          console.log('获取待审核房源失败', err)
        }
      })
  },

  // 查询已发布的数据
  queryPublished(page, state) {
    let openId = app.globalData.openid
    let publishList = this.data.publishList
    db.collection('HouseList')
      .where({
        '_openid': openId,
        'publish': state
      }).orderBy('updateTime', 'desc')
      .skip(page) //从page数之后的数开始加载
      .limit(10)
      .get({
        success: res => {
          console.log('获取已发布房源成功', res.data.length)
          if (res.errMsg == "collection.get:ok" && res.data.length > 0) {
            console.log('走已发布-if', )
            let data = res.data
            for (let i = 0; i < data.length; i++) {
              publishList.push(data[i])
            }
            this.setData({
              publishList: publishList, //给已发布列表赋值
            })

          } else {
            console.log('走已发布-else', )
            wx.showToast({
              title: '暂时没有已发布的数据哦',
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail: err => {
          console.log('获取已发布房源失败', err)
        }
      })

  },

  // 点击跳转到审核详情页/已发布详情页
  Navigate: function (e) {
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type

    if (type == 'unpublished') {
      var url = '../EntrustDetail/EntrustDetail'
    }
    if (type == 'published') {
      var url = '../PublishedDetail/PublishedDetail'
    }

    wx.navigateTo({
      url: `${url}?id=${id}`,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page
    console.log('触底page', page)
    let type = this.data.type
    console.log('触底type', type)

    if (type == 'unpublished') {
      let unPutotal = this.data.unPutotal
      console.log('触底的待审核条数', unPutotal)
      let unPublishList = this.data.unPublishList
      if (unPublishList.length < unPutotal) {
        page = unPublishList.length
        let state = false
        console.log('触底重新去查询未发布的page', page)
        this.queryUnpublished(page, state)
      } else {
        wx.showToast({
          title: '看到底了哟！',
          icon: 'none',
          duration: 1000,
        })
      }
    }

    if (type == 'published') {
      let Putotal = this.data.Putotal
      console.log('触底的已发布条数', Putotal)
      let publishList = this.data.publishList
      if (publishList.length < Putotal) {
        page = publishList.length
        console.log('触底重新去查询已发布的page', page)
        let state = true
        this.queryPublished(page, state)
      } else {
        wx.showToast({
          title: '看到底了哟！',
          icon: 'none',
          duration: 1000,
        })
      }
    }

  },
})