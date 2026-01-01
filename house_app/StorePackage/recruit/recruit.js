// StorePackage/recruit/recruit.js
const db = wx.cloud.database()
let page
Page({
	data: {
		culturebg: [],
		recruitInfo: [],
	},

	onLoad: function (options) {
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
						culturebg:"../../pages/image/Network_no.png"
					}]
				})
			})

			db.collection('CompanyInfo')
			.get()
			.then(res => {
				this.setData({
					recruitInfo:res.data,
				})
			})
			.catch(res => {
				console.log('请求招聘数据失败', res)
			})
	},

		//拨打电话
		jumpToCall: function(e) {
			wx.makePhoneCall({
				phoneNumber: e.currentTarget.dataset.number+'',
			});
		  },

	//页面上滑 滚动条触底事件
	onReachBottom() {
		
	}

})