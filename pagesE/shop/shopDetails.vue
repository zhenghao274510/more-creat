<template>
	<div class="list">
		<!-- 商家信息 -->
		<div class="s_head">
			<div class="s_box">
				<img :src="logo" alt />
				<div class="s_right">
					<div class="s_top">
						<h3>{{title}}</h3>
					</div>
					<div class="s_middle">
						<div v-if="auth==1">
							<div class="iconfont icon-renzheng-"></div>
							<span>已认证</span>
						</div>
						<div v-if="bail==1">
							<div class="iconfont icon-baozheng"></div>
							<span>已缴纳保险金</span>
						</div>
						<div v-else>
							<div class="iconfont icon-baozheng"></div>
							<span>未缴纳保险金</span>
						</div>
					</div>
					<div class="s_address">店铺地址:{{address}}</div>
				</div>
			</div>
			<div class="s_notice">公告：{{notice}}</div>
		</div>

		<!-- 定位 图标 -->
		<view class="icon-right">
			<view class="" style="display: flex;align-items: center;width: 100%;">
				<view class="icon-right-con" @click="make">
					<image src="/static/img/erweima_bg@2x.png" style="z-index: -1;" class="bg-image"></image>
					<image src="/static/img/erweima.png" class="img"></image>
				</view>

				<view class="icon-right-text" style="margin-left:40upx ;" :class="{borde:auth==1}">
					认
				</view>
				<view class="icon-right-text" :class="{borde:bail==1}">
					保
				</view>
				<view class="icon-right-con" @click="stores" v-if="useType!=2">
					<image src="/static/img/shoucang1@2x.png" class="bg-image" v-if="collect==0"></image>
					<image src="/static/img/shoucang2@2x.png" class="bg-image" v-else></image>
				</view>

			</view>
			<view class="icon-right-con" @click="callShopPhone">
				<image src="/static/img/lianxidianhua@2x.png" class="bg-image"></image>
			</view>


		</view>
		<!-- 商家信息 -->
		<ul class="fenlei">
			<li :class="{ add: active == index }" v-for="(item, index) in titleList" :key="index" @click="shopper(index)">{{ item }}</li>
		</ul>
		<swiper :current="active" class="swiper-box" duration="100" @change="changeTab">
			<swiper-item class="cascad-menu">
				<scroll-view ref="leftMenu" scroll-y class="left-menu">
					<div class="left-menu-container">
						<view class="" @click.stop="selectLeft(menu,index)" v-for="(menu, index) in categoryList" :key="index">
							<!-- <view> -->
							<view class="left-item uni-ellipsis" :class="{ current: actindex === index }">{{menu.childName2}}</view>
							<view class="">
								<view class="left-item uni-ellipsis" v-if="actindex==index" @click.stop="selectLeftTwo(v,k)" v-for="(v, k) in menu.childList3"
								 :class="{ on: actindexTwo === k}" :key="k">
									{{ v.childName3 }}
								</view>
							</view>

							<!-- </view> -->
						</view>
					</div>
				</scroll-view>
				<scroll-view class="right-menu" scroll-y @scrolltolower="loadMore">
					<div class="right-menu-container">
						<ul>
							<li class="right-item">
								<!-- <div class="title">{{name }}</div> -->
								<ul>
									<li style="margin-left:10rpx" v-for="(item, j) in rightDataList" :key="j" @click="goGoods(item.productId)">
										<view class="data-wrapper">
											<img :src="item.logo" alt />
											<view class="s_right">
												<view class="s_price uni-two-cut">
													{{ item.title }}
												</view>
												<view class="s_top">
													<span class="shop_name" v-if="showPrice">￥{{ item.price }}</span>
													<span class="shop_name" v-else></span>
													<span style="color:#999;font-size: 24rpx;" class="shop_num">已售：{{ item.sales }}份</span>
												</view>
											</view>
										</view>
									</li>
								</ul>
								<!-- <ul v-else class="class-more-con">
									<li class="class-more" style="margin-left:20upx;" v-for="(item, j) in rightDataList" :key="j" @click="goClass(item)">
										<img class="img" :src="item.logo" alt />
										<span class="text-title">{{ item.childName3 }}</span>
									</li>
								</ul> -->
								<uni-load-more :status='status'></uni-load-more>
							</li>
						</ul>
					</div>
				</scroll-view>
				<!-- </div> -->
				<!-- </scroll-view> -->
			</swiper-item>
			<swiper-item class="s_shop" scroll-y="true">
				<div class="shop_box">
					<div class="self_box">
						<div>
							<div class="self_top">
								<h3 class="shop_zi">商家图片:</h3>
								<div class="self_img"><img :src="img" v-for="(img, index) in images" alt :key="index" /></div>
							</div>
							<ul>
								<li>
									<div class="self_name shop_zi">品牌:</div>
									<div class="self_content">{{categoryName}}</div>
								</li>
								<li>
									<div class="self_name shop_zi">商家名称:</div>
									<div class="self_content">{{title}}</div>
								</li>
								<li>
									<div class="self_name shop_zi">商家地址:</div>
									<div class="self_content">{{address}}</div>
								</li>
								<li>
									<div class="self_name shop_zi">商家电话:</div>
									<div class="self_content">{{phone}}</div>
								</li>
								<li>
									<div class="self_name shop_zi">营业时间:</div>
									<div class="self_content">{{hours}}</div>
								</li>
							</ul>
							<div class="self_top" style="border-bottom:none">
								<h3 class="shop_zi">营业资质:</h3>
								<div class="self_img"><img :src="license" /></div>
							</div>
						</div>
					</div>
				</div>
				<!-- </div> -->
			</swiper-item>
			<swiper-item class="s_shop" scroll-y="true">
				<div class="shop_box" style="padding: 20upx;">
					<jyf-parser :html="content"></jyf-parser>
				</div>
			</swiper-item>
		</swiper>
		<!-- 弹出二维码 -->
		<view class="mask" @click.stop="showTip = false" v-if="showTip">
			<view class="input-view" @click.stop>
				<image :src="qrcode" mode="" class="qrcode" @longpress="longTapSave"></image>
				<view class="" style="margin-top: 10rpx;">
					长按二维码保存到手机
				</view>
				<view class="btn" @click="showTip=false">
					<image src="/static/img/guanbi@2x.png" mode="" class="img"></image>
				</view>
			</view>
		</view>
		<page-foot></page-foot>
	</div>
</template>

<script>
	// import uQRCode from '@/common/js/uqrcode.js'
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import pageFoot from "@/components/mycom/page-foot.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		data() {
			return {
				logo: "", // 店铺图标
				title: "", // 店铺名称
				address: "", // 地址
				phone: "", // 电话
				notice: "", // 公告
				auth: 1, // 认证状态 0否 1是
				bail: 1, // 保证金状态 0否 1是
				collect: 0, // 收藏状态 0否 1是
				images: [], // 商家图片
				hours: "", // 营业时间
				license: "", // 营业执照
				content: "", // 店铺环境
				categoryList: [],
				rightDataList: [],
				categoryName: '', // 分类名称
				showTip: false,
				titleList: ['店铺商品', '店铺介绍', '店铺环境'],
				active: 0,
				actindex: 0,
				actindexTwo: 0,
				shopId: '',
				status: 'loading',
				page: 1,
				totalPage: 1,
				useType: 0,
				type: '',
				qrcode: '',
				showClass: false,
				showPrice: false,
				loadId: ''
			};
		},
		watch: {
			shopId(newVal) {
				this.$forceUpdate();
				if (newVal === uni.getStorageSync('shopId')) {
					this.showPrice = true
				} else {
					if (this.useType == 2 && uni.getStorageSync('type')==1) {
						this.showPrice = false
					} else {
						this.showPrice = true
					}
				}
			}
		},
		components: {
			uniLoadMore,
			pageFoot,
			uniCollapse,
			uniCollapseItem,
			jyfParser
		},
		onLoad(options) {
			if (options.scene) {
				this.shopId = decodeURIComponent(options.scene)
			} else {
				this.shopId = options.id;
			}
			this.loadData();
			if (uni.getStorageSync('useType')) {
				this.useType = uni.getStorageSync('useType')
			}
		},
		methods: {
			loadMore() {
				this.totalPage > this.page ? (this.page += 1, this.status = 'loading', this.getRight(this.loadId)) : setTimeout(() => {
					this.status = 'noMore'
				}, 300);
			},
			selectLeftTwo(v, k) {
				this.loadId = v.childId3;
				if (this.actindexTwo != k) {
					this.rightDataList = [];
					this.actindexTwo = k;
					this.page = 1;
					this.totalPage = 1;
					this.getRight(this.loadId)
				}
			},
			goClass(e) {
				console.log(e)
				this.$api.navTo(`/pagesC/classChild/threeClass?id=${e.childId3}&title=${e.childName3}&type=${this.type}`)
			},
			make() {
				let parmas = {
					scene: this.shopId,
					page: 'pagesE/shop/shopDetails'
				}
				this._reqw.ipost(parmas, 'getUnlimited').then(res => {
					console.log(res.image)
					res.result == 0 ? (this.qrcode = 'data:image/jpg;base64,' + res.image, this.showTip = true) : this.$api.tip(res.resultNote)
				}).catch(err => {})
			},
			callShopPhone() {
				this.$api.callPhone(this.phone)
			},
			selectLeft(e, k) {
				console.log(e)
				if (this.actindex != k) {
					this.actindex = k;
					this.actindexTwo = 0;
					this.clear(1);
					this.loadId = e.childList3[0].childId3;
					this.getRight(this.loadId);

				} else {
					e.checked = !e.checked
				}

			},
			changeTab(e) {
				console.log(e);
				this.active = e.detail.current;
			},
			goGoods(id) {
				if (this.type == 1 || this.type == 2) {
					uni.navigateTo({
						url: '/pagesE/shop/goodsDetails?id=' + id
					})
				} else if (this.type == 3) {
					uni.navigateTo({
						url: '/pagesE/shop/eatDetails?id=' + id
					})
				} else {
					uni.navigateTo({
						url: '/pagesE/shop/totalDetails?id=' + id
					})
				}

			},
			loadData() {
				let parmas = {
					shopId: this.shopId,
					uid:uni.getStorageSync('uid')
				};
				console.log(parmas);
				this._reqw.ipost(parmas, 'shopInfo')
					.then(res => {
						console.log(res, '商家信息');
						if (res.result == 0) {
							this.status = 'noMore';
							this.logo = res.logo;
							this.title = res.title;
							this.address = res.address;
							this.phone = res.phone;
							this.notice = res.notice;
							this.auth = res.auth;
							this.bail = res.bail;
							this.collect = res.collect;
							this.images = res.images;
							this.categoryName = res.categoryName;
							this.hours = res.hours;
							this.license = res.license;
							this.content = this.$api.formText(res.content, uni.getStorageSync('screen').screenWidth);
							this.type = res.type;
							if (res.categoryList.length != 0) {
								this.fromClass(res.categoryList);
							}
						} else {
							this.$api.tip(res.resultNote)
						}
					})
					.catch(res => {});
			},
			fromClass(res) {
				console.log(res)
				let arry = [];
				res.forEach((item, index) => {
					if (item.childList2.length != 0) {
						item.childList2.forEach((e, k) => {
							this.$set(arry, arry.length, e)
						})
					}
				})
				this.categoryList = arry;
				this.loadId = this.categoryList[0].childList3[0].childId3;
				console.log(this.categoryList, this.loadId);
				this.getRight(this.loadId);
			},
			getRight(id) {
				console.log(id)
				let parmas = {
					uid:uni.getStorageSync('uid'),
					categoryId: id,
					shopId: this.shopId,
					pageNo: this.page
				};
				console.log(parmas);
				this._reqw
					.ipost(parmas, 'productList')
					.then(res => {
						res.result == 0 ?
							((res.totalPage > 1 ? this.status = 'more' : this.status = 'noMore'), this.totalPage = res.totalPage,
								res.dataList.forEach(item => {
									this.rightDataList.push(item)
								})
							) :
							this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			},
			stores() {
				if (!uni.getStorageSync('uid')) {
					this.$api.loginType();
				} else {
					let type;
					this.collect == 1 ? type = 0 : type = 1;
					let parmas = {
						uid:uni.getStorageSync('uid'),
						shopId: this.shopId,
						type: type
					};
					this._reqw.ipost(parmas, 'collectShop')
						.then(res => {
							if (res.result == 0) {
								this.collect == 1 ? (this.collect = 0, this.$api.tip('取消收藏成功!')) : (this.collect = 1, this.$api.tip('收藏成功!'))
							} else {
								this.$api.tip(res.resultNote)
							}
						})
						.catch(res => {});
				}

			},
			clear(type) {
				this.page = 1;
				this.totalPage = 1;
				this.rightDataList = [];
			},
			savePhoto() {
				let that = this;
				uni.getFileSystemManager().writeFile({
					filePath: wx.env.USER_DATA_PATH + '/DHG.png',
					data: that.qrcode.slice(22),
					encoding: 'base64', //写入当前文件的字符编码
					success: function(res) {
						console.log(res)
						uni.saveImageToPhotosAlbum({
							filePath: wx.env.USER_DATA_PATH + '/DHG.png',
							success(res) {
								uni.showToast({
									title: '保存成功',
									icon: "success",
									duration: 1000
								})
							}
						})
					}
				})
			},
			longTapSave() {
				let that = this;
				uni.showToast({
					icon: 'loading',
					title: '正在保存图片',
					duration: 1000
				})
				//判断用户是否授权"保存到相册"
				uni.getSetting({
					success(res) {
						//没有权限，发起授权
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() { //用户允许授权，保存图片到相册
									that.savePhoto();
								},
								fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
									uni.openSetting({
										success() {
											uni.authorize({
												scope: 'scope.writePhotosAlbum',
												success() {
													that.savePhoto();
												}
											})
										}
									})
								}
							})
						} else { //用户已授权，保存到相册
							that.savePhoto()
						}
					}
				})

			},
			shopper(ind) {
				// this.clear();
				if (this.active == ind) {
					return;
				} else {
					this.active = ind;
				}
			}
		}
	};
</script>

<style lang="scss">
	.class-more-con {
		display: flex;
		flex-wrap: wrap;
	}

	.class-more {
		width: 28%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.img {
			width: 160upx;
			height: 160upx;
			border-radius: 50%;
		}

		.text-title {
			margin-top: 20upx;
		}
	}

	.qrcode {
		width: 430upx;
		height: 430upx;
	}

	.borde {
		border: 1px solid #333333;
		border-radius: 50%;
	}

	// 弹出提示
	.mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9999;
		// transition: background 0.3s linear;
		display: flex;
		align-items: center;
		background: rgba(0, 0, 0, 0.5);
		justify-content: center;
	}

	.input-view {
		width: 550upx;
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx 0;
	}

	.input-view .er-img {
		width: 320upx;
		height: 320upx;
	}

	.btn {
		height: 100rpx;
		margin-top: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.img {
			width: 40upx;
			height: 40upx;
		}
	}

	.icon-right {
		position: absolute;
		top: 0;
		right: 30upx;
		z-index: 99;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		width: 35%;
	}

	.icon-right-text {
		font-size: 30upx;
		font-weight: bold;
		margin: 0 10upx;
	}

	.icon-right-con {
		width: 100upx;
		height: 100upx;
		line-height: 100upx;
		position: relative;
	}

	.icon-right-con .bg-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100upx;
		height: 100upx;
	}

	.icon-right-con .img {
		position: absolute;
		top: 35upx;
		left: 35upx;
		width: 30upx;
		height: 30upx;
	}

	.iconfont {
		color: #fd9500 !important;
		font-size: 34upx !important;
	}

	page {
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 490upx);
		padding-bottom: 40upx;
	}

	// 商家信息
	.s_notice {
		font-size: 24upx;
		color: #333;
		line-height: 60upx;
	}

	.s_head {
		width: 100%;
		padding: 30px 20upx 20upx 20upx;
		box-sizing: border-box;
		background-color: #f8f9fb;
		box-sizing: border-box;

		.s_box {
			width: 100%;
			display: flex;
			// align-items: center;

			img {
				width: 200upx;
				height: 200upx;
				border-radius: 5px;
			}

			.s_right {
				// width: 56%;
				flex: 1;
				padding-left: 20upx;
				box-sizing: border-box;

				.s_top {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;

					h3 {
						font-size: 15px;
						line-height: 60upx;
						color: #333;
						width: 75%;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						font-weight: bold;
					}
				}

				.s_middle {
					display: flex;
					align-items: center;
					padding: 10upx 0;

					div {
						display: flex;
						align-items: center;
						font-size: 22upx;
						color: #999;

						.s_img {
							width: 40upx;
							height: 40upx;
						}
					}
				}

				.s_address {
					font-size: 22upx;
					line-height: 60upx;
					color: #999;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}

	// 商家信息
	.noComment {
		width: 100%;
		height: 100%;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 15px;
		color: #333;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 25;
	}

	.list {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

		.fenlei {
			display: flex;
			width: 100%;
			justify-content: space-around;
			font-size: 18px;
			line-height: 87upx;
			border-radius: 50upx 50upx 0px 0px;
			z-index: 9999;

			.add {
				border-bottom: 2px solid $page-color-light;
				color: $page-color-light;
			}
		}

		.rate {
			width: 100%;
			height: 90px;
			margin-top: 5px;
			background: #fff;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.r_left {
				width: 30%;
				height: 70%;
				z-index: 99;
				padding: 0.4rem;
				padding-right: 0;
				background: #f5f5f5;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				font-size: 15px;
				color: #333;
				border-right: 2px solid #eee;
			}

			.r_right {
				width: 70%;
				height: 70%;
				padding: 0.4rem;
				padding-left: 0;
				background: #f5f5f5;
				z-index: 99;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 14px;
				color: #333;
			}
		}

		.s_shop {
			width: 100%;
			// min-height: 500px;
			padding-bottom: 30upx;
			position: relative;

			.shop_box {
				width: 100%;
				height: 100%;
				overflow-y: scroll;

				.self_box {
					width: 100%;
					display: flex;
					flex-direction: column;
					color: #333;

					.self_top {
						width: 100%;
						padding: 20upx 30upx;
						box-sizing: border-box;

						h3 {
							width: 100%;
							height: 36px;
							line-height: 36px;
							font-size: 14px;
							color: #333;
						}

						.self_img {
							width: 100%;
							display: flex;
							align-items: center;
							flex-wrap: wrap;

							img {
								width: 180upx;
								height: 180upx;
								margin-right: 10upx;
								margin-top: 10upx;
							}
						}

						p {
							width: 100%;
							font-size: 12px;
							margin-top: 50upx;
							color: #333;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
							line-height: 20px;
						}
					}

					ul {
						width: 100%;
						display: flex;
						flex-direction: column;

						li {
							width: 100%;
							display: flex;
							align-items: center;
							font-size: 14px;
							color: #333;
							padding: 30upx 30upx;
							box-sizing: border-box;

							.self_content {
								padding-left: 20upx;
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
							}
						}
					}
				}
			}
		}
	}

	.shop_zi {
		color: #333333;
	}

	.cascad-menu {
		display: flex;
		justify-content: space-between;
		width: 100%;
		overflow: hidden;
		position: absolute;
		bottom: 100upx;
		top: 10upx;

		.left-menu {
			width: 170upx;
			background: #f5f5f5;
			z-index: 999;
			padding-bottom: 50upx;

			.left-item {
				width: 170upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;

				&.on {
					background: #fff !important;
					color: $page-color-light;
				}

				&.current {
					background: $page-color-light !important;
					color: #FFFFFF;
				}

				.text {
					width: 100%;
					line-height: 100upx;
				}
			}
		}

		.right-menu {
			// width: 100%;
			padding-bottom: 50upx;

			.right-item {
				// height: 100%;
				// padding: 20upx;

				.title {
					// border-bottom: 1px solid #ccc;
					height: 30px;
					line-height: 35px;
					padding-left: 10px;
				}

				.data-wrapper {
					display: flex;
					align-items: center;
					border-bottom: 1px solid #eee;
					box-sizing: border-box;

					img {
						width: 160upx;
						height: 160upx;
						border-radius: 5px;
					}

					.s_right {
						width: 400upx;
						height: 180upx;
						padding-left: 20upx;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.s_top {
							width: 100%;
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 14px;
							color: #333;

							.shop_name {
								width: 50%;
								display: block;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								height: 20px;
								line-height: 20px;
								color: $page-color-light;
							}
						}

						.s_price {
							width: 100%;
							font-size: 12px;
							color: #333;
						}
					}
				}
			}
		}
	}
</style>
