<template>
	<view class="contain">
		<view class="box">
			<view class="list-item">
				<span>修改头像</span>
				<view class="modify_right" @click="onRead">
					<image :src="icon" alt style="border-radius: 50%;" v-if="icon != ''" />
					<image src="/static/img/touxiang@2x.png" alt v-else />
					<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
				</view>
			</view>
			<view class="list-item">
				<span>昵称</span>
				<view class="modify_right">
					<input type="text" placeholder="请输入" v-model="nickname" />
					<view class="iconfont icon-bianji"></view>
				</view>
			</view>
			<view class="list-item" @click="changePhone">
				<span>绑定手机号</span>
				<view class="modify_right">
					{{phone}}
					<!-- <input type="text" placeholder="请输入昵称" v-model="nickname" /> -->
					<view class="iconfont icon-youjiantou"></view>
				</view>
			</view>
		</view>

		<view class="box top">
			<view class="list_title">个人资料</view>
			<view class="list-item">
				<span>真实姓名</span>
				<view class="modify_right">
					<input type="text" placeholder="请输入" v-model="realname" />
					<view class="iconfont icon-bianji"></view>
				</view>
			</view>
	<!-- 		<view class="list-item">
				<span>联系电话</span>
				<view class="modify_right">
					<input type="text" placeholder="请输入" v-model="phone" />
					<view class="iconfont icon-bianji"></view>
				</view>
			</view> -->
			<view class="list-item">
				<span>联系地址</span>
				<view class="modify_right">
					<input type="text" placeholder="请输入" v-model="address" />
					<view class="iconfont icon-bianji"></view>
				</view>
			</view>
			<view class="list-item">
				<span>QQ</span>
				<view class="modify_right">
					<input type="text" placeholder="请输入" v-model="qq" />
					<view class="iconfont icon-bianji"></view>
				</view>
			</view>

			<view class="list-item">
				<span>微信号</span>
				<view class="modify_right">
					<input type="text" placeholder="请输入" v-model="wx" />
					<view class="iconfont icon-bianji"></view>
				</view>
			</view>
		</view>
		<view class="btn" @click="subChange(1)" hover-class="btn-hover">保 存</view>
	</view>
</template>

<script>
	import bassUrl from '@/common/js/config.js'
	export default {
		data() {
			return {
				icon: "", //头像
				nickname: "", // 昵称
				phone: "", // 手机号
				realname: "", // 真实姓名
				address: "", // 地址
				qq: "", // QQ
				wx: "", // 微信
				qrcode: "", // 微信二维码
			};
		},
		onLoad() {
			this.initData()
		},
		methods: {
			onRead() {
				let _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success(result) {
						// tempFilePath可以作为img标签的src属性显示图片
						console.log(result);
						_this._reqw
							.iupfile(result.tempFiles[0])
							.then(res => {
								console.log(res);
								let r = JSON.parse(res);
								r.result == 0 ? (_this.$api.tip('上传成功!'), (_this.icon =bassUrl.bass+r.url), _this.subChange(0)) : _this.$api.tip(
									r.resultNote);
							})
							.catch(res => {});
					}
				});
			},
			initData() {
				let parmas = {
					uid: uni.getStorageSync('uid')
				};
				this._reqw
					.ipost(parmas, 'userDetail')
					.then(res => {
						res.result == 0 ? ((this.icon = res.icon), (this.nickname = res.nickname), (this.phone = res.phone), this.realname =
							res.realname, this.address = res.address, this.qq = res.qq,this.wx=res.wx) : this.$api.tip(
							res.resultNote);
					})
					.catch(err => {});
			},
			subChange(n) {
				let parmas = {
					uid:uni.getStorageSync('uid'),
					icon:this.icon, 
					nickname:this.nickname ,
					phone:this.phone, 
					realname:this.realname, 
					address:this.address, 
					qq:this.qq, 
					wx:this.wx, 
					qrcode:this.qrcode
				};
				console.log(parmas);
				this._reqw
					.ipost(parmas, 'updateUserInfo')
					.then(res => {
						res.result == 0 ? (this.$api.tip('修改成功!'), n == 1 ? this.$api.back() : this.initData()) : this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			},
			changePhone(){
				this.$api.navTo('/pagesA/mine/bindtell')
			}
		}
	};
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.iconfont {
		font-size: 28upx;
		color: #333333;
		margin-left: 20upx;
	}

	.list_title {
		padding: 10px;
		color: $page-color-light;
		font-weight: bold;
	}

	.top {
		margin-top: 10px;
	}

	.top .list-item {
		border-bottom: 1px solid #f3f3f3;
	}

	.contain {
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;

		.box {
			width: 100%;
			display: flex;
			flex-direction: column;
			background: #ffffff;

			.list-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 14px;
				color: #333;

				padding: 10px;

				.modify_right {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.icon-zuojiantou {
						color: #333333;
						font-size: 16px;
						margin-left: 20upx;
					}

					image {
						width: 100upx;
						height: 100upx;
					}

					input {
						text-align: right;
						background: #fff;
					}
				}
			}
		}

		.btn {
			width: 230px;
			margin: 0 auto;
			margin-top: 61px;
			height: 44px;
			line-height: 44px;
			text-align: center;
			color: #ffffff;
			border-radius: 22px;
			font-size: 18px;
			background-color: $page-color-light;
		}
	}
</style>
