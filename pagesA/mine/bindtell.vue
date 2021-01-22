<template>
	<view class="content">
		<view class="content-info">
			<view class="one-info">
				<!-- <view class="one-info-top"> -->
				<text class="tit">+86</text>
				<input class="input" type="text" v-model="phone" placeholder="请输入你要绑定的手机号" placeholder-style="font-size:13px;color:#A4A4A5" />
				<!-- </view> -->
			</view>
			<view class="one-info">
				<input class="oneinput" type="number" v-model="YZM" placeholder="验证码" placeholder-style="font-size:13px;color:#A4A4A5" maxlength="11" />
				<view class="btn" @click="getYZM">{{rTime}} <text v-if="btnState">s后重发</text></view>
			</view>
		</view>
		<view class="confirmBtn" @click="subOrder">完 成</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			YZM: '',
			phone: '',
			rTime:"获取验证码",
			btnState:false,
			interval:null,
			uid:''
		};
	},
	onLoad() {
	},
	methods: {
		getYZM() {
			if (this.rTime == '获取验证码') {
				if (this.phone == '') {
					this.$api.tip('请输入手机号！');
				} else if (!this.$api.regPhone(this.phone)) {
					this.$api.tip('请输入正确的手机号哦！');
				} else {
					this.rTime = 60;
					// let rTime = this.rTime;
					this.btnState = true;
					this.interval = setInterval(() => {
						if (--this.rTime <= 0) {
							this.rTime = '获取验证码';
							clearInterval(this.interval);
							this.btnState = false;
						}
					}, 1000);
					let parmas = {
						phone: this.phone
					};
					this._reqw
						.ipost(parmas, 'sendSms')
						.then(res => {
							this.$api.tip(res.resultNote)
						})
						.catch(err => {});
				}
			}
		},
		subOrder() {
			let Y = this.YZM.trim();
			if (this.phone == '') {
				this.$api.tip('请输入手机号！');
			} else if (!this.$api.regPhone(this.phone)) {
				this.$api.tip('请输入正确的手机号哦！');
			} else if (this.YZM == '') {
				this.$api.tip('请输入验证码');
			} else {
				let parmas = {
					uid: uni.getStorageSync('uid'),
					phone: this.phone,
					code: this.YZM
				};
				this._reqw
					.ipost(parmas, 'bindPhone')
					.then(res => {
						res.result==0
							? (this.$api.tip('绑定成功!',this.$api.prePage().phone=this.phone),
							  setTimeout(() => {
									this.$api.back();
							  }, 300))
							: this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			}
		}
	},
	onHide() {
		if(this.interval){
			clearInterval(this.interval)
		}
	}
};
</script>

<style scoped lang="scss">
.tit {
	width: 80upx;
	color: #6d6c6c;
	font-size: 13px;
	padding-left: 20upx;
}

.perseve {
	width: 120px;
	color: #6d6c6c;
	font-size: 13px;
}
.content {
	padding-top: 60upx;
}
.content-info {
	padding: 0 15px;

	.one-info {
		display: flex;
		align-items: center;
		height: 88upx;
		margin: 10px 0;
        background: #F8F9FB;
		.input {
			flex: 1;
			padding-left: 10px;
		}

		.oneinput {
			width: 80%;
			padding-left: 10px;
		}

		.btn {
			width: 90px;
			height: 27px;
			color: #FF4848;
			font-size: 12px;
			font-weight: 500;
			line-height: 27px;
			text-align: center;
			margin-left: 10px;
			border-left: 1px solid #E6E6E6;
		}
	}
}

.confirmBtn {
	width: 260px;
	height: 42px;
	margin: 40px auto;
	background: #FF4848;
	box-shadow: 0px 2px 8px 0px #FF4848;
	border-radius: 22px;
	font-size: 17px;
	font-weight: bold;
	color: rgba(255, 255, 255, 1);
	line-height: 42px;
	text-align: center;
}
</style>
