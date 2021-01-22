<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400" autoplay="true" interval='3000'>
				<swiper-item class="swiper-item" v-for="(item, index) in dataObj.images" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<view class="title">{{dataObj.title}}</view>
			<view class="price-box" v-if="showPrice==true">
				<text class="price-tip">¥</text>
				<text class="price">{{dataObj.price}} <text class="price" v-if="dataObj.unit">/{{dataObj.unit}}</text> </text>
			</view>
			<view class="bot-row">
				<text>配送费: ￥{{dataObj.freight}}</text>
				<text>已售: {{dataObj.sales}}</text>
			</view>
		</view>
		<view class="c-list">
			<view class="c-row b-b">
				<text class="tit">品牌:</text>
				<text class="con t-r">{{dataObj.brand}}</text>
			</view>
			<view class="c-row b-b" @click="toggleSpec(1)">
				<text class="tit">选择规格和属性</text>
				<view class="con">
				</view>
				<text class="iconfont icon-youjiantou"></text>
			</view>
		</view>

		<!-- 评价 -->
		<eva :list='evaList' @click="moreEva"></eva>

		<view class="detail-desc">
			<view class="d-header"><text>商品详情</text></view>
			<view class="" style="padding:20upx;">
				<jyf-parser :html="content" ref="article"></jyf-parser>
			</view>
		</view>

		<!-- 底部操作菜单 -->
		<uni-goods-nav :fill="true" @click="onClick" @buttonClick="buttonClick" :collect="dataObj.collect"></uni-goods-nav>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click.stop="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content">
				<view class="a-t">
					<image :src="dataObj.images[0]"></image>
					<view class="right">
						<text class="guge-price">¥{{currentObj.price}}</text>
						<text class="stock">库存：{{currentObj.stock}}{{dataObj.unit}}</text>

					</view>
					<view class="iconfont icon-error" style="color: #999999;" @click.stop="showChoose = false"></view>
				</view>
				<view class="attr-list">

					<view class="uni-flex">
						<view class="item-list" v-for="(item,index) in skuNameList" :key="index">
							{{ item.skuName }}
						</view>
					</view>
					<view class="uni-flex">
						<view class="" v-for="(item,index) in skuNameList" :key="index">
							<scroll-view scroll-y="true" @click.stop='stopPrevent' style="height:500rpx;" :class="[index==0?'attr-list-bg':'']">
								<view class="" style="height: 100%;">
									<view class="item-list-con " v-for="(m,n) in item.dataList" :key='n'>
										<view class="item-list-title uni-flex-item" v-if="index==0" :class="[active==n?'selected':'']">
											{{m.value}}
										</view>
										<view class="uni-flex-item" v-if="index==1">
											{{m.value}}
										</view>
										<view class="" v-if="index==1">
											{{m.price}}
										</view>
										<view class="" v-if="index==1">
											<uni-number-box :min="0" :max="m.stock" :value="m.num" :index="n" :parsentIndex="index"></uni-number-box>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
				<view style="padding:10upx 0">
					<text>阶梯价:￥{{currentObj.discount}}</text>
					<text style="color: #FF4848;margin-left: 20upx;">商品数量>={{currentObj.qty}}将享有阶梯价</text>
				</view>
				<view style="padding:10upx 0">
					<text>起订量:{{currentObj.minQty}}</text>
				</view>
				<view class="uni-flex bottom-btn">
					<view class="btn one" hover-class="btn-hover" @click.stop="finishChose(0)">加入购物车</view>
					<view class="btn two" hover-class="btn-hover" @click.stop="finishChose(1)">立即购买</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import eva from "@/components/mycom/goodEva.vue"
	import uniGoodsNav from "@/components/uni-goods-nav/uni-goods-nav.vue"
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
			uniNumberBox,
			eva,
			uniGoodsNav,
			jyfParser
		},
		data() {
			return {
				active: 0,
				productId: '',
				specClass: 'none',
				subIndex: [],
				current: [],
				content: '',
				dataObj: {
					area: '',
					skuList: [],
					productId: '',
					logo: "", // 列表图
					title: "", // 名称
					images: [],
					price: "",
					unit: "",
					sales: "",
					freight: "",
					brand: "",
					url: '', // 详情
					collect: "", // 收藏 0否 1是
					shopId: "", // 店铺ID
					type: "", // 类型 1店铺 2餐厅 3酒店
					qty: "", //阶梯数量
					collect: 0 //   收藏  1   未收藏 0
				},
				skuNameList: [],
				currentObj: {},
				evaList: [],
				useType: 0,
				shopId: '',
				showPrice: false
			};
		},
		watch: {
			dataObj(newVal) {
				if (newVal.shopId == uni.getStorageSync('shopId')) {
					this.showPrice = true
				} else {
					if (this.useType == 2 && uni.getStorageSync('type') == 1) {
						this.showPrice = false
					} else {
						this.showPrice = true
					}
				}
			}
		},
		onLoad(options) {
			this.productId = options.id;
			this.loadData();
			this.getEvalist();
			if (uni.getStorageSync('useType')) {
				this.useType = uni.getStorageSync('useType')
			}
		},
		methods: {
			stopPrevent() {},
			loadData() {
				let parmas = {
					productId: this.productId,
					uid: uni.getStorageSync('uid')
				}
				this._reqw.ipost(parmas, 'productDetail').then(res => {
					res.result == 0 ? (this.dataObj = res, this.content = this.$api.formText(res.content), res.skuList.forEach(item => {
						item.specification = JSON.parse(item.specification)
					}), this.FormData(res.skuList, res.skuNameList)) : this.$api.tip(res.resultNote)
				}).catch(err => {})
			},
			numberChange(e) {
				this.num = e.number;
			},
			moreEva() {
				this.$api.navTo(`/pagesE/shop/evaList?id=${this.productId}`)
			},
			//  底部操作栏
			onClick(e) {
				console.log(e)
				if (this.showPrice) {
					if (e.index == 1) {
						if (!uni.getStorageSync('uid')) {
							this.$api.loginType();
						} else {
							let type;
							this.dataObj.collect == 1 ? type = 0 : type = 1
							let parmas = {
								uid: uni.getStorageSync('uid'),
								productId: this.productId,
								type: type
							}
							console.log(parmas);
							this._reqw.ipost(parmas, 'collectProduct').then(res => {
								if (res.result == 0) {
									this.dataObj.collect == 1 ? (this.dataObj.collect = 0, this.$api.tip('取消收藏成功!')) : (this.dataObj.collect = 1,
										this.$api.tip('收藏成功!'))
								} else {
									this.$api.tip(res.resultNote)
								}
							}).catch(err => {})
						}

					} else if (e.index == 0) {
						uni.redirectTo({
							url: `/pagesE/shop/shopDetails?id=${this.dataObj.shopId}`
						})
					} else {
						uni.switchTab({
							url: '/pages/tabbar/cart'
						})
					}
				}

			},
			buttonClick(e) {
				if (this.showPrice) {
					this.toggleSpec(e.index)
				}
			},
			FormData(skuList, skuNameList) {
				for (let i = 0; i < skuNameList.length; i++) {
					skuNameList[i].dataList = [];
					for (let j = 0; j < skuList.length; j++) {
						if (JSON.stringify(skuNameList[i].dataList).indexOf(JSON.stringify(skuList[j].specification[i])) == -1) {
							skuNameList[i].dataList.push(skuList[j].specification[i]);
						}
					}
				}
				skuNameList[0].dataList.forEach(item => {
					item.skuList = this.getSKuListPrice(item, skuNameList[skuNameList.length - 1].dataList, skuList)
				})
				this.skuNameList = skuNameList;
				console.log(skuNameList)
			},
			getSKuListPrice(item, arry, skuList) {
				for (let i = 0; i < arry.length; i++) {
					let specification = [{
						id: item.id,
						value: item.value
					}, arry[i]];
					for (let j = 0; j < skuList.length; j++) {
						if (JSON.stringify(specification).indexOf(JSON.stringify(skuList[j].specification[i])) == -1) {
							arry[i].discount = skuList[j].discount;
							arry[i].minQty = skuList[j].minQty;
							arry[i].price = skuList[j].price;
							arry[i].stock = skuList[j].stock;
							arry[i].num =0;
						}
					}
				}
				return arry
			},
			//规格弹窗开关
			toggleSpec(n) {
				if (!uni.getStorageSync('uid')) {
					this.$api.loginType();
				} else {
					if (this.showPrice) {
						n != undefined && n == 0 ? this.btnText = '加入购物车' : this.btnText = '立即购买';
						if (this.specClass === 'show') {
							this.specClass = 'hide';
							setTimeout(() => {
								this.specClass = 'none';
							}, 250);
						} else if (this.specClass === 'none') {
							this.specClass = 'show';
						}
					}

				}
			},
			finishChose(index) {
				let n = this.active,
					price = 0,
					num = 0;
				//  特价
				if (this.dataObj.area == 1 || this.dataObj.area == 2) {
					price = this.dataObj.skuList[n].price;
				} else {
					if (this.num >= this.currentObj.qty) {
						price = this.dataObj.skuList[n].discount;
					} else {
						price = this.dataObj.skuList[n].price;
					}

				}
				//   买送
				if (this.dataObj.area == 2) {
					num = this.num + this.num * this.dataObj.give
				} else {
					num = this.num
				}
				if (num > this.dataObj.skuList[n].stock) {
					this.$api.tip('该规格商品数量有限,请确认!')
				} else if (num < this.currentObj.minQty) {
					this.$api.tip(`该商品最小购买数量为${this.currentObj.minQty}件`)
				} else {
					if (index == 1) {
						let skuName = '';
						this.current.forEach(item => {
							skuName += item.value + ','
						})
						let arry = [{
							shopName: this.dataObj.shopName,
							shopId: this.dataObj.shopId,
							fee: this.$api.parsePrice(this.dataObj.freight),
							totalCount: num,
							totalPrice: this.$api.parsePrice(price * 100 * this.num / 100 + (this.dataObj.freight - 0)),
							content: '', //   留言
							cartList: [{
								productId: this.productId,
								skuId: this.dataObj.skuList[n].skuId,
								logo: this.dataObj.images[0],
								title: this.dataObj.title,
								skuName: skuName.slice(0, skuName.length - 1),
								qty: num,
								price: this.$api.parsePrice(price)
							}]
						}];
						this.specClass = 'none';
						this.$api.navTo(`/pagesD/order/finishOrder?good=${JSON.stringify(arry)}&type=0&buyType=1`)
					} else {
						let parmas = {
							uid: uni.getStorageSync('uid'),
							productId: this.productId,
							skuId: this.dataObj.skuList[n].skuId,
							qty: num
						}
						console.log(parmas)
						this._reqw.ipost(parmas, 'addCart').then(res => {
							res.result == 0 ? (this.$api.tip('加入购物车成功'), this.specClass = 'none') : this.$api.tip(res.resultNote)
						}).catch(err => {})
						this.$api.tip('加入购物车')
					}
				}

			},
			getEvalist() {
				console.log(111)
				let parmas = {
					productId: this.productId,
					uid: uni.getStorageSync('uid'),
					type: '',
					pageNo: 1,
					pageSize: '10'
				};
				this._reqw.ipost(parmas, 'productCommentList').then(res => {
					console.log(res)
					res.result == 0 ? this.evaList = res.dataList : this.$api.tip(res.resultNote)
				}).catch(err => {})
			}
		}
	}
</script>

<style lang="scss">
	.item-list-title {
		line-height: 80rpx;
		// width: 140rpx;
	}

	.attr-list-bg {
		background: #F6F6F6;
		width: 140rpx;
		text-align: center;
	}

	.item-list-con {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		text-align: center;
	}

	.one {
		background: linear-gradient(90deg, rgba(255, 181, 66, 1) 0%, rgba(254, 148, 33, 1) 100%);
		border-radius: 100upx 0 0 100upx;
	}

	.two {
		background: linear-gradient(90deg, rgba(255, 91, 99, 1) 0%, rgba(255, 15, 15, 1) 100%);
		border-radius: 0 100upx 100upx 0;
	}

	.choseNum {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
		border-top: 2upx solid #EEEEEE;
		border-bottom: 2upx solid #EEEEEE;
	}

	.container {
		padding-bottom: 50px;
	}

	page {
		background: #f8f8f8;
	}

	.icon-you {
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx;

		.title {
			font-size: 30upx;
			font-weight: bold;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			color: $page-color-light;
		}

		.price {
			font-size: 36upx;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			color: #333333;

			text {
				flex: 1;
			}
		}
	}

	.c-list {
		margin-top: 20upx;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.con {
			flex: 1;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;

			.tit {
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding-left: 26upx;

			.con {
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		padding-bottom: 80upx;

		.d-header {
			display: flex;
			align-items: center;
			height: 80upx;
			position: relative;
			padding: 0 30upx;
		}
	}

	/* 规格选择弹窗 */
	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;
		width: 100%;
		box-sizing: border-box;

		.a-t {
			display: flex;
			justify-content: space-between;
			border-bottom: 2upx solid #EEEEEE;
			padding: 30upx 0;

			image {
				width: 200upx;
				height: 200upx;
				flex-shrink: 0;
				border-radius: 8upx;
			}

			.right {
				display: flex;
				flex: 1;
				flex-direction: column;
				justify-content: space-around;
				padding-left: 24upx;
				line-height: 42upx;

				.price {
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}
		.item-list {
			line-height: 80rpx;
			text-align: center;
			width: 140rpx;
		}

		.selected {
			color: $page-color-light;
			background: #FFFFFF;
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;

			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			border-radius: 40upx 40upx 0 0;
			background-color: #fff;

			.bottom-btn {
				margin: 30upx auto;
				border-radius: 100upx;
				height: 80upx;
				width: 640upx;
				;
			}

			.btn {
				width: 50%;
				line-height: 80upx;
				text-align: center;
				color: #fff;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100upx;
		background: #FFFFFF;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 96upx;
			height: 80upx;
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, 0.5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28upx;
				width: 180upx;
				height: 100%;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
</style>
