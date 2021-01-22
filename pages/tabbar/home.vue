<template>
	<view class="container999">
		<view class="top-place" :style="{'height':top+'px'}"></view>
		<view class="nav" :style="{top:top+'px'}">
			<view class="navTabBox">
				<view class="longTab" v-if="direct==0" >
					<block v-for="(item, index) in tabTitle" :key="index">
						<view class="longItem" :data-index="index" :class="{zero:index==0,one:index ==1,two:index==2 }" @click="longClick(index)">
							{{ item.name }}
						</view>
					</block>
				</view>
				<view class="longTab" v-else>

				</view>
			</view>
			<!-- 搜索 -->
			<view class="nui-home-top">
				<view class="map-top-warp">
					<view class="iconfont icon-dizhi3"></view>
					<view class="uni-ellipsis">{{ city }}</view>
				</view>
				<view class="mp-search-box">
					<view class="ser-input" @tap.stop="onSearch">输入商品搜索</view>
				</view>
				<view class="iconfont icon-saoma" @click="goScan"></view>
			</view>
			<!-- 导航栏 agents导航栏标题 -->
		</view>
		<swiper style="min-height: 100vh;padding-top: 260upx;" :current="currentTab" @change="changeTab" duration="60">
			<swiper-item v-for="(listItem, listIndex) in tabTitle" :key="listIndex">
				<scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="loadMoreDate" scroll-with-animation>
					<view class="swiper-box">
						<swiper autoplay="3000" indicator-active-color="#F70E24" indicator-color="#ffffff" circular="true" indicator-dots="true">
							<swiper-item v-for="(item, index) in listItem.bannerList" :key="index">
								<image class="imgs" :src="item.image" @click.stop="imgurl(item)" lazy-load mode="scaleToFill" />
							</swiper-item>
						</swiper>
					</view>
					<!-- banner -->

					<!-- 二级分类 -->
					<view class="all">
						<view class="contains">
							<view class="nav-item" v-for="(v, k) in listItem.productCategoryList" :key="k" @tap.stop="classify(v.categoryId)">
								<image :src="v.icon" alt  lazy-load />
								<text class="uni-ellipsis" style="width: 100%;text-align: center;">{{ v.title }}</text>
							</view>
							<!-- <view class="nav-item">
								<view class="more">
									<image src="/static/img/more.png" class="img" @tap.stop="classify" lazy-load />
								</view>
								<text>全部</text>
							</view> -->
						</view>
					</view>
					<view class="promotion" v-if="currentTab==0&&direct==0">
						<view class="list">
							<view class="column" v-for="(v, k) in 2" @tap="toPromotion(k)" :key="k">
								<view class="right">
									<image src="/static/img/p1.jpg" mode="scaleToFill"></image>
								</view>
							</view>
						</view>
					</view>

					<!-- 附近店铺 -->
					<view class="uni-list">
						<view class="list-top-title">附近店铺</view>
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(n,m) in listItem.dataList" :key="m" @click="goDetail(n)">
							<view class="uni-media-list">
								<view class="uni-media-list-top">
									<image class="uni-media-list-logo" :src="n.logo"></image>
									<view class="uni-media-list-body">
										<view class="uni-media-list-text-top">{{ n.title }}</view>
										<sx-rate :value="n.score" disabled="true"></sx-rate>
										<view style="margin-top:20upx;"> 人气:{{n.hits}}</view>
										<view style="margin-top:20upx;color: #FF4848;"> {{n.categoryName}}</view>
									</view>
									<view class="uni-media-list-text-bottom">
										<text v-if="n.near==0">{{ n.distance }}km </text>
										<text v-else>{{n.distance}}m </text>
									</view>
								</view>
								<view class="uni-media-list-address">
									<view class="iconfont icon-dizhi3" style="color: #FF4848;">
									</view> <text>{{ n.address}}</text>
								</view>

							</view>

						</view>
					</view>
					<uni-load-more :status="listItem.load"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import sxRate from '@/components/uni-rate/uni-rate.vue';
	import bassUrl from "@/common/js/config.js"
	export default {
		components: {
			uniLoadMore,
			sxRate
		},
		data() {
			return {
				top:uni.getSystemInfoSync()['statusBarHeight'],
				city: '定位中...',
				direct: '',
				point: {},
				tabTitle: [{
					name: '馨商城',
					type: 1,
					load: 'loading',
					dataList: [],
					productCategoryList: [],
					page: 1,
					totalPage:1
				}, {
					name: '馨餐厅',
					type: 2,
					load: 'loading',
					dataList: [],
					bannerList: [],
					productCategoryList: [],
					page: 1,
					totalPage:1
				}, {
					name: '馨酒店',
					type: 3,
					load: 'loading',
					dataList: [],
					bannerList: [],
					productCategoryList: [],
					page: 1,
					totalPage:1
				}],
				currentTab: 0
			};
		},
		onLoad() {
			if (uni.getStorageSync('city')) {
				this.city = uni.getStorageSync('city')
			}
			if (uni.getStorageSync('point')) {
				this.point = JSON.parse(uni.getStorageSync('point'))
			}
			this.direct = uni.getStorageSync('type');
			this.initNav();
			this.loadDate();
		},
		// onShow() {
		// 	this.direct = uni.getStorageSync('type');
		// 	this.initNav();
		// 	this.loadDate();
		// },
		methods: {
			initNav() {
				console.log(this.direct)
				if (this.direct !=0) {
					this.currentTab=0;
					this.tabTitle = [{
						name: '',
						type: 4,
						load: 'loading',
						dataList: [],
						productCategoryList: [],
						page: 1,
						totalPage:1
					}];
					getApp().globalData.type=this.tabTitle[0].type;
				} else {
					this.tabTitle = [{
						name: '馨商城',
						type: 1,
						load: 'loading',
						dataList: [],
						productCategoryList: [],
						page: 1,
						totalPage:1
					}, {
						name: '馨餐厅',
						type: 2,
						load: 'loading',
						dataList: [],
						bannerList: [],
						productCategoryList: [],
						page: 1,
						totalPage:1
					}, {
						name: '馨酒店',
						type: 3,
						load: 'loading',
						dataList: [],
						bannerList: [],
						productCategoryList: [],
						page: 1,
						totalPage:1
					}]
				}
			},
			goScan() {
				let that = this;
				uni.scanCode({
					success(res) {
						console.log(res);
						if (res.result.indexOf(bassUrl.bass) != -1) {
							let id = res.result.split('?')[1]
							that.$api.navTo(`/pagesE/shop/shopDetails?id=${id}`)
						} else {
							that.$api.tip('二维码不合法，请确认!')
						}
					}
				});
			},
			imgurl(e) {
				uni.setStorageSync('url', e.url);
				setTimeout(() => {
					this.$api.navTo(`/pages/tabbar/newwebview`)
				}, 30)

			},
			//  首页数据
			loadDate() {
				let n = this.currentTab,data=this.tabTitle[n];
				let parmas = {
					uid: uni.getStorageSync('uid'),
					type: data.type,
					lon: this.point.longitude,
					lat: this.point.latitude,
					pageNo: data.page,
					pageSize: '10'
				}
				console.log(parmas)
				this._reqw.ipost(parmas, 'indexInfo').then(res => {
					console.log(res)
					res.result == 0 ? (data.totalPage = res.totalPage,(res.totalPage == 1 ? data.load = 'noMore' : data.load = 'more'),
						 data.bannerList = res.bannerList,
						data.productCategoryList = res.productCategoryList, res.dataList.forEach(item => {
							item.distance > 1000 ? (item.distance = (Math.round(item.distance / 100) / 10).toFixed(2), item.near = 0) :
								(item.distance, item.near = 1),
								data.dataList.push(item)
						}),console.log(data)) : this.$api.tip(res.resultNote)
				}).catch(err => {})
			},
			gotoClass() {
				this.$api.navTo('/pagesC/classChild/homeClass');
			},
			onSearch() {
				this.$api.navTo('/pagesC/search/search_index');
			},
			longClick(index) {
				console.log(index);
				this.currentTab = index;
				getApp().globalData.type=this.tabTitle[index].type;
			},
			toPromotion(k) {
				k == 0 ? this.$api.navTo(`/pagesC/classChild/firstClass?type=${this.currentTab}`) : this.$api.navTo(
					`/pagesC/classChild/twoClass?type=${this.currentTab}`);
			},
			classify(id) {
				if(this.currentTab!=0){
					let url='';
					this.currentTab==1?url=`/pages/tabbar/shopList?id=${id}&type=3`:url=`/pages/tabbar/shopList?id=${id}&type=4`
					this.$api.navTo(url);
				}else{
				this.$api.navTo(`/pagesC/classChild/homeClass?id=${id}`);
				}
			},
			changeTab(e) {
				console.log(e);
				this.currentTab = e.detail.current;
				getApp().globalData.tabIndex=this.currentTab;
				let n = this.currentTab,
					data = this.tabTitle[n].dataList;
				if (data.length == 0) {
					this.loadDate()
				}
			},
			goDetail(v) {
				if (this.direct == 0) {
					this.$api.navTo(`/pagesE/shop/shopDetails?id=${v.shopId}&type=${this.currentTab}`)
				} else {
					this.$api.navTo(`/pagesE/shop/shopDetails?id=${v.shopId}`)
				}
			},
			loadMoreDate() {
				
				let n = this.currentTab,
					data = this.tabTitle[n];
				data.load = 'loading';
				console.log(data.totalPage)
				data.totalPage > data.page ? (data.page += 1, this.loadDate()) : setTimeout(() => {
					data.load = 'noMore'
				}, 100)

				console.log("加载")
			}
		},
		// onHide() {
		// 	this.tabTitle.forEach(item => {
		// 		item.page = 1;
		// 		item.totalPage = 1;
		// 		item.load = 'loading';
		// 		item.dataList = [];
		// 		item.bannerList = [];
		// 		item.productCategoryList = [];
		// 	})
		// },
		onShareAppMessage(){
				return {
				    title: '馨网购'
				}
		}
	};
</script>

<style lang="scss" scoped>
	.one {
		background: #00CB7D;
	}

	.two {
		background: #FFA61F;
	}

	.zero {
		background: #ff4848;
	}

	.iconfont {
		font-size: 50upx;
		color: #fffdef;
	}

	.icon-saoma {
		font-weight: bold;
	}

	.map-top-warp {
		display: flex;
		align-items: center;
		width: 22%;
	}

	//   顶部导航
	.top-place {
		background-color: #f9f9f9;
		position: fixed;
		width: 100%;
		z-index: 999;
	}

	.navTabBox {
		width: 100vw;
		color: rgba(255, 255, 255, 0.5);
		background-color: #f9f9f9;
		padding: 0 30upx;
		box-sizing: border-box;

		.click {
			color: white;
			font-size: 34upx !important;
		}

		.longTab {
			height: 90upx;

			.longItem {
				width: 100upx;
				height: 40upx;
				padding: 10upx;
				display: inline-block;
				line-height: 40upx;
				text-align: center;
				position: relative;
				margin-top: 16upx;
				margin-right: 10upx;
				font-size: 24upx;
				border-radius: 30upx;
				color: #FFFFFF;
			}

			.underlineBox {
				position: absolute;
				bottom: 2px;
				left: 10%;
				height: 2px;
				width: 80%;
				transition: 0.5s;
				background-color: #ffffff;
			}
		}
	}

	.list-top-title {
		height: 100upx;
		font-size: 36upx;
		text-align: center;
		line-height: 100upx;
		font-weight: bold;
		color: #333333;
	}

	.nui-home-top {
		background-color: $page-color-light;
		width: 100%;
		margin-top: 5px;
	}

	.mp-search-box {
		background-color: #ffffff;
	}

	.ser-input {
		background-color: #ffffff;
	}

	.topImage {
		width: 24px;
		height: 24px;
	}

	.container999 {
		width: 100vw;
		font-size: 28upx;
		min-height: 100vh;
		overflow: hidden;
		color: #6b8082;
		position: relative;
		// background-color: #f6f6f6;
	}

	.nav {
		position: fixed;
		left: 0;
		color: white;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		font-size: 24upx;
		background-color: $page-color-light;
		z-index: 996;
	}

	.list-top-title {
		height: 100upx;
		font-size: 36upx;
		text-align: center;
		line-height: 100upx;
		font-weight: bold;
	}

	.nui-home-top {
		background-color: $page-color-light;
	}

	.mp-search-box {
		background-color: #ffffff;
	}

	.ser-input {
		background-color: #ffffff;
	}

	.topImage {
		width: 24px;
		height: 24px;
	}

	.promotion {
		width: 92%;
		margin: 4%;

		.list {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.column {
				width: 49%;
				background-color: #ffffff;
				border-radius: 10upx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.right {
					width: 100%;
					height: 98px;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}

	/* 附近商店 */
	.uni-media-list {
		padding: 20upx 30upx;
		box-sizing: border-box;
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.uni-navigate-right.uni-media-list {
		padding-right: 74upx;
	}

	.uni-media-list-top {
		display: flex;
	}

	.uni-pull-right {
		flex-direction: row-reverse;
	}

	.uni-pull-right>.uni-media-list-logo {
		margin-right: 0upx;
		margin-left: 20upx;
	}

	.uni-media-list-logo image {
		height: 100%;
		width: 100%;
	}

	.uni-media-list-text-bottom {
		width: 100%;
		line-height: 30upx;
		font-size: 26upx;
		color: #8f8f94;
	}

	.uni-media-list-logo {
		width: 184upx;
		height: 184upx;
		border-radius: 10upx;
		margin-right: 20upx;
	}

	.uni-media-list-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		// justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
		height: auto;
	}

	.uni-media-list-address {
		display: flex;
		align-items: center;
		margin-top: 15upx;
	}

	.icon-dizhi3 {
		color: #FFFFFF;
		font-size: 38upx;
	}

	.uni-media-list-text-top {
		width: 100%;
		line-height: 36upx;
		font-size: 30upx;
		height: 74upx;
		font-size: 28upx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		width: 120upx;
		text-align: right;
	}

	.all {
		position: relative;
		padding: 0 20upx;
		background: $font-color-spec;

		.contains {
			display: flex;
			flex-wrap: wrap;
			position: relative;

			.more {
				background: linear-gradient(-45deg, rgba(255, 137, 64, 1) 0%, rgba(255, 85, 20, 1) 100%);
				box-shadow: 0px 5px 9px 0px rgba(255, 114, 45, 0.5);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 88upx;
				height: 88upx;

				.img {
					width: 60upx;
					height: 60upx;
				}
			}

			.nav-item {
				width: 20%;
				margin-top: 10px;
				margin-bottom: 10px;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;

				image {
					width: 45px;
					height: 45px;
					border-radius: 50%;
				}

				text {
					font-size: 12px;
					color: #666;
					margin-top: 7px;
				}
			}
		}
	}
</style>
