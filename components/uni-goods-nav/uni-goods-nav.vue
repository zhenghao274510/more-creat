<template>
	<view class="uni-goods-nav">
		<!-- 底部占位 -->
		<view class="uni-tab__seat" />
		<view class="uni-tab__cart-box flex">
			<view class="flex uni-tab__cart-sub-box">
				<view v-for="(item,index) in options" :key="index" class="flex uni-tab__cart-button-left uni-tab__shop-cart" @click="onClick(index,item)">
					<view class="uni-tab__icon">
						<image class="image" :src="item.iconActive" mode="widthFix" v-if="collect==1&&index==1" />
						<image class="image" :src="item.icon" mode="widthFix" v-else />
					</view>
					<text class="uni-tab__text">{{ item.text }}</text>
					<view class="flex uni-tab__dot-box">
						<text v-if="item.info" :class="{ 'uni-tab__dots': item.info > 9 }" class="uni-tab__dot ">{{ item.info }}</text>
					</view>
				</view>
			</view>
			<view :class="{'uni-tab__right':fill}" class="flex uni-tab__cart-sub-box ">
				<view v-for="(item,index) in buttonGroup" :key="index" :style="{color:item.color}" :class="{one:index==0,two:index==1}"
				 class="flex uni-tab__cart-button-right" @click="buttonClick(index,item)"><text class="uni-tab__cart-button-right-text">{{ item.text }}</text></view>
				<!-- <view class="flex uni-tab__cart-button-right uni-tab__color-y ">立即购买</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniGoodsNav',
		props: {
			options: {
				type: Array,
				default () {
					return [{
							icon: '/static/img/dianpu@2x.png',
							text: '店铺'
						}, {
							icon: '/static/img/xiangq_shoucang@2x.png',
							iconActive: '/static/img/xiangq_shoucang2@2x.png',
							text: '收藏'
						},
						{
							icon: '/static/img/gouwuche@2x.png',
							text: '购物车'
						}
					]
				}
			},
			collect: {
				type: String || Number,
				default: 0
			},
			buttonGroup: {
				type: Array,
				default () {
					return [{
							text: '加入购物车',
							color: '#fff'
						},
						{
							text: '立即购买',
							color: '#fff'
						}
					]
				}
			},
			fill: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClick(index, item) {
				console.log(this.collect)
				this.$emit('click', {
					index,
					content: item
				})
			},
			buttonClick(index, item) {
				if (uni.report) {
					uni.report(item.text, item.text)
				}
				this.$emit('buttonClick', {
					index,
					content: item
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.one {
		background: linear-gradient(90deg,rgba(255,181,66,1) 0%,rgba(254,148,33,1) 100%);
	}

	.two {
		background: linear-gradient(90deg,rgba(255,91,99,1) 0%,rgba(255,15,15,1) 100%);
	}

	.flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-goods-nav {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		position: fixed;
		bottom: 0;
		width: 100%;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
		z-index: 99;
	}

	.uni-tab__cart-box {
		flex: 1;
		height: 100rpx;
		background-color: #fff;
		z-index: 900;
	}

	.uni-tab__cart-sub-box {
		flex: 1;
	}

	.uni-tab__right {
		margin: 5px 0;
		margin-right: 10px;
		border-radius: 100px;
		overflow: hidden;
	}

	.uni-tab__cart-button-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		position: relative;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.uni-tab__icon {
		width: 20px;
		height: 20px;
	}

	.image {
		width: 20px;
		height: 20px;
	}

	.uni-tab__text {
		margin-top: 3px;
		font-size: $uni-font-size-sm;
		color: #666;
	}

	.uni-tab__cart-button-right {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.uni-tab__cart-button-right-text {
		font-size: $uni-font-size-base;
		color: #fff;
	}

	.uni-tab__cart-button-right:active {
		opacity: 0.7;
	}

	.uni-tab__dot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		position: absolute;
		right: 12px;
		top: 4px;
		justify-content: center;
		align-items: center;
		// width: 0;
		// height: 0;
	}

	.uni-tab__dot {
		// width: 30rpx;
		// height: 30rpx;
		padding: 0 4px;
		line-height: 15px;
		color: #ffffff;
		text-align: center;
		font-size: 12px;
		background-color: #ff0000;
		border-radius: 15px;
	}

	.uni-tab__dots {
		padding: 0 4px;
		// width: auto;
		border-radius: 15px;
	}

	.uni-tab__color-y {
		background-color: #ffa200;
	}

	.uni-tab__color-r {
		background-color: #ff0000;
	}
</style>
