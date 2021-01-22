<template>
	<view class="content">
		<view class="top-nav">
			<uni-search-bar placeholder="输入商品名称搜索" bgColor='#f6f6f6' @confirm="confirmSearch" @clear='clear'></uni-search-bar>
			<view class="uni-flex">
				<view class="top-nav-item" @click="changeTab(v, k)" v-for="(v, k) in navList" :key="k">
					<view class="top-nav-item-title" :class="{ iconColor: k == current }">{{ v.title }}</view>
					<view class="top-nav-item-icon" v-if="k!=0">
						<view class="iconfont icon-shangjiantou" :class="{ iconColor: v.flag==1 }"></view>
						<view class="iconfont icon-xiajiantou" :class="{ iconColor: v.flag==0 }"></view>
					</view>
				</view>
			</view>

		</view>
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true" top='160'>
			<view class="goods-list">
				<view class="product-list">
					<view class="product" v-for="product in dataList" :key="product.productId" @tap="toGoods(product)">
						<image :src="product.logo" class="img"></image>
						<view class="name uni-two-cut">{{ product.title }}</view>
						<view class="info">
							<view class="slogan">已售：{{ product.sales }}</view>
							<view class="price" v-if="showPrice">￥{{ product.price }}</view>
							<view class="price" v-else></view>
						</view>
					</view>
				</view>
			</view>
		</s-pull-scroll>
		<drag-ball></drag-ball>
	</view>
</template>

<script>
	import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue"
	import dragBall from "@/components/drag-ball/drag-ball.vue"
	export default {
		components: {
			uniSearchBar,
			dragBall
		},
		data() {
			return {
				dataList: [],
				sortType: '',
				navList: [{
						title: '综合',
						flag: '',
						sort: ''
					},
					{
						title: '价格',
						flag: 1,
						sort: 1
					},
					{
						title: '销量',
						flag: 1,
						sort: 1
					}
				],
				useType: 0,
				current: 0,
				categoryId: '',
				showPrice: false,
				keywords: '',
				type: 0 //  0  商城  1 餐厅 2 酒店
			};
		},
		watch: {
			dataList(newVal) {
				if (this.useType == 2 && uni.getStorageSync('type') == 1) {
					this.showPrice = false
				} else {
					this.showPrice = true
				}
				console.log(this.showPrice)
			}
		},
		onLoad(options) {
			this.categoryId = options.id;
			let title = options.title;
			this.$api.setNav(title)
			getApp().globalData.type == 4 ? this.type = 2 : getApp().globalData.type == 1 ? this.type = 1 : this.type = getApp()
				.globalData.type - 1;
			if (uni.getStorageSync('useType')) {
				this.useType = uni.getStorageSync('useType')
			}
			this.refresh();
			console.log(uni.getSystemInfoSync().screenHeight - 60)


		},
		methods: {
			useroptions() {
				this.$api.switchTab('/pages/tabbar/home')
			},
			clear() {
				this.keywords = '';
				this.refresh();
			},
			confirmSearch(e) {
				console.log(e)
				this.keywords = e.value.trim();
				this.refresh();
			},
			toGoods(e) {
				if (this.type == 1 || this.type == 2) {
					this.$api.navTo(`/pagesE/shop/goodsDetails?id=${e.productId}`)
				} else if (this.type == 3) {
					this.$api.navTo(`/pagesE/shop/eatDetails?id=${e.productId}`)
				} else {
					this.$api.navTo(`/pagesE/shop/totalDetails?id=${e.productId}`)
				}
			},
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
					keywords: this.keywords,
					type: this.type,
					categoryId: this.categoryId,
					sortBy: this.current,
					pageNo: pullScroll.page,
					sortType: this.sortType
				};
				console.log(parmas);
				const res = await this._reqw.ipost(parmas, 'productList');
				if (res.result != 0) {
					this.$api.tip(res.resultNote)
					return
				}
				const curList = [];
				res.dataList.length == 0 ? (pullScroll.empty()) : res.dataList.forEach(item => {
						curList.push(item)
					}), this.dataList = this.dataList.concat(curList), pullScroll.page >= res.totalPage ? pullScroll.finish() :
					pullScroll.success()
			},
			changeTab(e, ind) {
				if (this.current != ind) {
					this.current = ind;
					this.sortType = this.navList[ind].sort;
					this.refresh();
				} else {
					if (ind != 0) {
						console.log(e)
						e.flag == 0 ? (this.navList[ind].flag = this.sortType = this.navList[ind].sort = 1) : (this.navList[ind].flag =
							this.sortType = this.navList[ind].sort = 0);
						this.refresh();
					} else {
						this.sortType = this.navList[ind].sort;
					}
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #FAFAFA;
	}

	.img {
		height: 348upx;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.iconColor {
		color: $page-color-light !important;
	}

	.iconfont {
		// margin-right: 10px;
		color: #ccc;
		font-size: 10px !important;
	}

	.top-nav {
		position: fixed;
		left: 0;
		right: 0;
		height: 160upx;
		background: #ffffff;
		z-index: 999;
	}

	.top-nav-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.top-nav-item-title {
		text-align: center;
	}

	.top-nav-item-icon {
		// width: 30px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.uni-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	// 列表

	.goods-list {
		padding-top: 20upx;

		.title {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}

		.loading-text {
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
					padding: 10upx 4%;
					font-size: 30upx;
					line-height: 1.5;
				}

				.info {
					display: flex;
					justify-content: space-between;
					padding: 10upx 4% 10upx 4%;
					margin-top: 10upx;

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
