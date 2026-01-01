// StorePackage/storeMap/storeMap.js
const db = wx.cloud.database()
Page({
	data: {
		//门店的经纬度
		latitude: 30.338874,
		longitude: 121.189238,
		
		markers: [{
			id: 0,
			name: "房产小程序",
			address: "地址：碧桂园",
			latitude: 30.338874, //纬度
			longitude: 121.189238, //经度
			width: 80,
			height: 80
		}]
	},
	
	//导航
	navRoad(e) {
		let marker = e.currentTarget.dataset.marker
		wx.getLocation({ 
			type: 'wgs84', 
			success(res) {
				wx.openLocation({ 
					latitude: marker.latitude, 
					longitude: marker.longitude, 
					name: marker.name,
					address: marker.address,
					scale: 17
				})
			},
			fail: res => {
				console.log('授权失败', res)
				wx.showModal({
					title: "授权位置",
					content: "需要手动打开获取位置信息，才能继续导航哟",
					confirmText: "去设置",
					success: res => {
						if (res.confirm) {
							wx.openSetting()
						}
					}
				})
			}
		})
	}
})