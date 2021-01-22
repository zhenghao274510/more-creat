<template>
	<view>
		<view class="icon">
			<image src="/static/img/zhifuchengg@2x.png"></image>
		</view>
		<view class="tis">
			订单支付成功
		</view>
		<view class="back">
			<view class="btn" @tap="toOrder">返回首页</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {

		},
		methods: {
			toOrder() {
				uni.switchTab({
					url:'/pages/tabbar/home'
				})
			}
		},
	}
</script>

<style lang="scss">
	view {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.icon {
		width: 100%;
		margin-top: 10vw;

		image {
			width: 25vw;
			height: 25vw;
		}
	}

	.tis {
		width: 100%;
		margin-top: 20upx;
		font-size: 30upx;
		color: #333333;
	}

	.pay-amount {
		width: 100%;
		margin-top: 10upx;
		font-size: 32upx;
	}

	.back {
		width: 100%;
		margin-top: 80upx;

		.btn {
			padding: 0 50upx;
			height: 70upx;
			background-color:#FF4848 ;
			color: #FFFFFF;
			align-items: center;
			border-radius: 40upx;
			font-size: 26upx;
		}
	}
</style>
