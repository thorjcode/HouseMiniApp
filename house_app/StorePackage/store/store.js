// StorePackage/store/store.js
const db = wx.cloud.database()
Page({
	data: {
		storebg:[],
		StoreInfo:[]
	},
	
	onLoad: function (options) {

		//公司信息
		db.collection('StoreInfo')
		.get()
		.then(res =>{
			console.log('公司信息获取成功',)
			this.setData({
				StoreInfo:res.data,
				storebg: res.data[0].storebg,
			})
		})
		.catch(res => {
			console.log('公司信息获取失败', res)
			this.setData({
				storebg: [{
					storebg: '../../pages/image/Network_no.png'
				}]
			})
		})
	},
	//跳转到员工页面
	jumpToEmployee(){
		wx.navigateTo({
			url: "../staff/staff"
		})
	},
	//跳转到公司简介页面
	goIntro(){
		wx.navigateTo({
			url: "../intro/intro"
		})
	},
	//跳转到招聘页面
	goZhaopin(){
		wx.navigateTo({
			url: '../recruit/recruit',
		})
	},
	//跳转到地图
	jumpToMap(){
		wx.navigateTo({
			url: '../storeMap/storeMap',
		})
	},
	//拨打电话
	jumpToCall: function(e) {
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.number+'',
		});
	  },

})