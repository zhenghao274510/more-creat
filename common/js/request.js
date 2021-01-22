const bassUrl = require('./config.js').bass;
const http = {
	iget(t = {}, e) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: encodeURI(bassUrl + '/api/' + e),
				data: JSON.stringify(t),
				method: "GET",
				header: {
					//   'X-Bmob-Application-Id': bmobConfig.applicationId,
					//   'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
					'Content-Type': 'application/json'
				},
				success: function(res) {
					if (res.statusCode == 200) {
						resolve(res.data)
					} else if (res.statusCode == 500) {
						uni.showToast({
							title: "系统异常",
							icon: "none"
						});
					} else {
						uni.showToast({
							title: "未知错误",
							icon: "none"
						});
					}
				},
				fail: function(res) {
					resolve(res)
					uni.showToast({
						title: "服务器无连接",
						icon: "none"
					});
				}
			});
		});
	},
	ipost(t = {}, e) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: encodeURI(bassUrl + '/api/' + e),
				data: JSON.stringify(t),
				method: "POST",
				header: {
					//   'X-Bmob-Application-Id': bmobConfig.applicationId,
					//   'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
					'Content-Type': 'application/json'
				},
				success: function(res) {
					if (res.statusCode == 200) {
						resolve(res.data)
					} else if (res.statusCode == 500) {
						uni.showToast({
							title: "系统异常",
							icon: "none"
						});
					} else {
						uni.showToast({
							title: "未知错误",
							icon: "none"
						});
					}
				},
				fail: function(res) {
					uni.showToast({
						title: "服务器无连接",
						icon: "none"
					});
				}
			});
		});
	},
	i_post(t = {}, e) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: encodeURI(bassUrl + '/api/' + e),
				data: JSON.stringify(t),
				method: "POST",
				responseType: 'arraybuffer',
				header: {
					//   'X-Bmob-Application-Id': bmobConfig.applicationId,
					//   'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
					'Content-Type': 'application/json',
					

				},
				success: function(res) {
					if (res.statusCode == 200) {
						resolve(res.data)
					} else if (res.statusCode == 500) {
						uni.showToast({
							title: "系统异常",
							icon: "none"
						});
					} else {
						uni.showToast({
							title: "未知错误",
							icon: "none"
						});
					}
				},
				fail: function(res) {
					uni.showToast({
						title: "服务器无连接",
						icon: "none"
					});
				}
			});
		});
	},
	iupfile(t = {}) {
		uni.showLoading({
			title: "上传中..."
		});
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: encodeURI(bassUrl + '/api/uploadFile'),
				filePath: t.path,
				name: 'file',
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Content-Type': 'multipart/form-data;'
				},
				formData: {
					file: t
				},
				success: function(res) {
					uni.hideLoading();
					if (res.statusCode == 200) {
						resolve(res.data)
					} else if (res.statusCode == 500) {
						uni.showToast({
							title: "系统异常",
							icon: "none"
						});
					} else {
						uni.showToast({
							title: "未知错误",
							icon: "none"
						});
					}
				},
				fail: function(res) {
					uni.hideLoading();
					uni.showToast({
						title: "服务器无连接",
						icon: "none"
					});
				}
			});
		});
	}
}

export default http;
