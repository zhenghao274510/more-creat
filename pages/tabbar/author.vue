<template>
	<view>
		<view class="header">
			<image src="/static/img/logo@2x.png" />
		</view>
		<button class="bottom" type="primary" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo" >微信授权登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: ''
			};
		},
		methods: {
			bindGetUserInfo(e) {
				console.log(e)
				let that = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.userInfo']) {
							uni.authorize({
								scope: 'scope.userInfo',
								success() {
									that.logo(e);
								},
								fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
									uni.openSetting({
										success() {
											uni.authorize({
												scope: 'scope.userInfo',
												success() {
													that.logo(e);
												}
											})
										}
									})
								}
							})
						} else {
							that.logo(e);
						}
					}
				})
			},
			logo(e) {
				uni.showLoading({
					title: "登录中..."
				});
				let self = this;
				uni.login({
					success: function(res) {
						console.log(res)
						let parmas = {
							nickname: e.detail.userInfo.nickName,
							icon: e.detail.userInfo.avatarUrl,
							code: res.code
						};
						console.log(parmas)
						self._reqw.ipost(parmas, "userLogin").then(res => {
							if (res.result == 0) {
								uni.hideLoading();
								console.log(res)
								self.$api.tip('登录成功')
								uni.setStorageSync('uid', res.uid);
								uni.setStorageSync('useType', res.type);
								setTimeout(() => {
									self.$api.back();
								}, 30)
							} else {
								self.$api.tip(res.resultNote)
							}
						}).catch(err => {})

					},
					fail: function() {
						uni.hideLoading();
						// fail
					},
					complete: function() {
						uni.hideLoading();
						// complete
					}
				});
			}

		}
	};
</script>
<style scoped lang="scss">
	.header {
		margin: 90px auto;
		text-align: center;
		width: 200rpx;
		height: 200rpx;
	}

	.hide {
		opacity: 0;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
		// border-radius: 50%;
	}

	.bottom {
		height: 80rpx;
		width: 200px;
		background: #FF4848;
		border-radius: 12rpx;
		margin: 70rpx auto;
		font-size: 30rpx;
	}
</style>
