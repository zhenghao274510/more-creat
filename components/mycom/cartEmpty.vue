<template>
	<view class="cart-content">
		<view class="cart-nothing">
			<image src="/static/img/kongshuju@2x.png" mode="" class="empty-img"></image>
			<view class="empty-text">
				暂无结算商品
			</view>
			<view class="empty-to" @click="toDo">
				去逛逛
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			empty: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			}
		},
		methods: {
			toDo() {
				this.$emit('click')
			}
		}

	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background: #F8F9FB;
	}
	.cart-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.cart-nothing {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.empty-img {
		width: 200upx;
		height: 180upx;
	}

	.empty-text {
		height: 54upx;
		font-size: 28upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 54upx;
		margin: 50upx;
	}

	.empty-to {
		height: 54upx;
		font-size: 28upx;
		font-weight: bold;
		color: rgba(255, 72, 72, 1);
		line-height: 54upx;
	}
</style>
