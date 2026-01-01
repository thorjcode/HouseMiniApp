// StorePackage/intro/intro.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        culturebg:[],
        // 文案更新时间
        updatetime: '',
        // 默认介绍
        introduce: '我们公司的核心价值观：诚信，利他，高效，专业，励志成为您身边的房产专家。'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.CompanyInfo()

        //背景轮播图
		db.collection('StoreInfo').get()
        .then(res => {
            this.setData({
                culturebg: res.data[0].culturebg,
            })
        })
        .catch(res => {
            console.log('背景轮播图失败', res)
            this.setData({
                culturebg: [{
                    culturebg: '../../pages/image/Network_no.png'
                }]
            })
        })
    },

    // 获取数据
    CompanyInfo() {
        db.collection('CompanyInfo')
            .field({
                introduce: true,
            })
            .get({
                success:res=> {
                    //console.log('CompanyInfo-res', res, res.data[0].updatetime)
                    if (res.errMsg == "collection.get:ok") {
                        if (res.data.length > 0) {
                            this.setData({
                                introduce: res.data[0].introduce,
                            })
                        }
                    }
                },
                fail: err => {
                    console.log('Recommend-err', err)
                }
            })
    },
})