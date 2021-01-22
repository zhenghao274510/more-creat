<template>
	<view class="sec-footer">
		<view @click.stop="onNavTab(index)" class="item" v-for="(item, index) in nav" :key="index">
			<image :src="item.img" class="img"></image>
			<!-- <text class="choose" v-if="tabarA == index">{{ item.txt }}</text> -->
			<text class="dc">{{ item.txt }}</text>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				nav: [{
						txt: '首页',
						img: '/static/tabs/dibu_shouye@2x.png',
						imgh: '/static/tabs/dibu_shouye2@2x.png'
					},
					{
						txt: '购物车',
						img: '/static/tabs/dibu_gouwuche@2x.png',
						imgh: '/static/tabs/dibu_gouwuche2@2x.png'
					},
					{
						txt: '我的订单',
						img: '/static/tabs/dibu_dingdan@2x.png',
						imgh: '/static/tabs/dibu_dingdan2@2x.png'
					},
					{
						txt: '我的',
						img: '/static/tabs/dibu_wode@2x.png',
						imgh: '/static/tabs/dibu_wode2@2x.png'
					}
				]
			};
		},
		components: {},
		methods: {
			onNavTab(e) {
				let num = e - 0;
				console.log(e);
				switch (num) {
					case 0:
						uni.switchTab({
							url: '/pages/tabbar/home'
						});
						break;
					case 1:
						uni.switchTab({
							url: '/pages/tabbar/cart'
						});
						break;
					case 2:
						uni.switchTab({
							url: '/pages/tabbar/order'
						});
						break;
					case 3:
						uni.switchTab({
							url: '/pages/tabbar/mine'
						});
						break;
				}
			}
		}
	};
</script>

<style>
	.sec-footer {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50px;
		background: #fff;
		z-index: 999;
		border-top: 1px solid #f2f3f4;
	}

	.item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		position: relative;
	}

	.item .img {
		width: 48upx;
		height: 50upx;
	}

	.choose {
		color: #ff4848;
	}

	.pos {
		width: 13px;
		height: 13px;
		line-height: 13px;
		text-align: center;
		position: absolute;
		top: 0;
		right: 15px;
		background: red;
		color: #fff;
		border-radius: 50%;
		font-size: 12px;
	}
</style>
