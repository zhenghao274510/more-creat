<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex == index }"
			 @click="tabClick(index)">{{ item.text }}</view>
		</view>


		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true" top="100">
			<view class="goods-list">
				<view class="product-list">
					<view class="product" v-for="(v, k) in dataList" :key="k" @tap="gotoDetails(v)">
						<image :src="v.logo" class="img"></image>
						<view class="name">{{ v.title }}</view>
						<view class="info">
							<view class="slogan">已售:{{ v.sales }}</view>
							<view class="price">￥{{ v.price }}</view>
						</view>
					</view>
				</view>
			</view>
		</s-pull-scroll>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabCurrentIndex:0,
				dataList: [],
				navList: [{text: '商品'},{text: '餐品'},{text: '房间'}]
			};
		},
		onShow() {
			this.refresh()
		},
		methods: {
			refresh() {
				this.$nextTick(() => {
					this.$refs.pullScroll.refresh();
				});
			},
			pullDown(pullScroll) {
				setTimeout(() => {
					this.loadData(pullScroll);
				}, 200)
			},
			async loadData(pullScroll) {
				if (pullScroll.page == 1) {
					this.dataList = [];
				}
				let parmas = {
					uid: uni.getStorageSync('uid'),
					type:Number(this.tabCurrentIndex)+2,
					pageNo: pullScroll.page,
					pageSize: '10'
				}
				console.log(parmas);
				const res = await this._reqw.ipost(parmas, 'collectProductList');
				if (res.result != 0) {
					this.$api.tip(res.resultNote)
					return
				}
				const curList = [];
				res.dataList.length == 0 ? (pullScroll.empty()) : res.dataList.forEach(item => {
						curList.push(item)
					}), this.dataList = this.dataList.concat(curList), pullScroll.page >= res.totalPage ? pullScroll.finish() :
					pullScroll.success();
			},
			//顶部tab点击
			tabClick(k) {
				this.tabCurrentIndex = k;
				this.refresh()
			},
			gotoDetails(e) {
				console.log(e);
				let n = this.tabCurrentIndex,
					url;
				if (n == 0) {
					url = `/pagesE/shop/goodsDetails?id=${e.productId}`
				} else if (n == 1) {
					url = `/pagesE/shop/eatDetails?id=${e.productId}`
				} else {
					url = `/pagesE/shop/totalDetails?id=${e.productId}`
				}
				this.$api.navTo(url);
			}
		}
	};
</script>

<style lang="scss">
	page,
	.content {
		background: #FAFAFA;
		height: 100%;
	}

	.img {
		height: 348upx;
	}

	.swiper-box {
		height: 100%;
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		width: 100%;
		box-sizing: border-box;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;
		position: fixed;
		top: 0;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $page-color-light;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $page-color-light;
				}
			}
		}
	}

	.goods-list {
		background-color: #FAFAFA;

		.title {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}

		.product-list {
			width: 95%;
			padding: 0 2.5% 2.5vw 2.5%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.product {
				width: 48.75%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;

				image {
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}

				.name {
					width: 92%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;

					.price {
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}

					.slogan {
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
