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
			<text class="title">{{dataObj.title}}</text>
			<view class="price-box" v-if="showPrice==true">
				<text class="price-tip">¥</text>
				<text class="price">{{dataObj.price}}</text>
			</view>
			<view class="bot-row">
				<text>配送费: {{dataObj.freight}}</text>
				<text>已售: {{dataObj.sales}}</text>
			</view>
		</view>
		<view class="c-list">
			<!-- <view class="c-row b-b">
				<text class="tit">品牌:</text>
				<text class="con t-r">{{dataObj.brand}}</text>
			</view> -->
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
		<view class="popup spec" :class="specClass" @touchmove.stop  @click.stop="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<block>
				<view class="layer attr-content" @click.stop>
					<view class="a-t">
						<image :src="dataObj.images[0]"></image>
						<view class="right">
							<text class="guge-price">¥{{currentObj.price}}</text>
							<!-- <text class="stock">阶梯价：{{currentObj.discount}}</text> -->
							<text class="stock">库存：{{currentObj.stock}}{{dataObj.unit}}</text>
							<view class="selected">
								已选：
								<text class="selected-text" v-for="(v,k) in current" :key="k">{{v.value}}</text>
							</view>
						</view>
						<view class="iconfont icon-error" style="color: #999999;" @click.stop="showChoose = false"></view>
					</view>
					<scroll-view scroll-y="true" @click.stop='stopPrevent' style="max-height:500rpx;">
						<block v-for="(item,index) in skuNameList" :key="index" class="tit">
							<view class="attr-list">
								<text>{{ item.skuName }}</text>
								<view class="item-list">
									<text v-for="(v,k) in item.dataList" :key="k" class="tit" :class="{ selected: subIndex[index] == k }" @click="testGet(item, index, k)">
										{{ v.value }}
									</text>
								</view>
							</view>
						</block>
					</scroll-view>
					<!-- <view style="margin:10upx 0">
						<text>阶梯价:</text>
						<text style="color: #FF4848;margin-left: 10upx;">商品数量>{{dataObj.qty}}将享有阶梯价</text>
					</view> -->
					<view class="choseNum">
						<view style="margin-bottom: 10upx;">购买数量</view>
						<uni-number-box class="step" min="1" @change="numberChange" :value="num"></uni-number-box>
					</view>
					<view class="uni-flex bottom-btn">
						<view class="btn one" hover-class="btn-hover" @click.stop="finishChose(0)">加入购物车</view>
						<view class="btn two" hover-class="btn-hover" @click.stop="finishChose(1)">立即购买</view>
					</view>
				</view>
			</block>
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
				btnText: '立即购买',
				active: 0,
				num: 1,
				productId: '',
				specClass: 'none',
				subIndex: [],
				current: [],
				content: '',
				dataObj: {
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
					collect: "0", // 收藏 0否 1是
					shopId: "", // 店铺ID
					type: "1", // 类型 1店铺 2供应商 3餐厅 4 酒店
					qty: "10", //阶梯数量
					collect: 0 //   收藏  1   未收藏 0
				},
				skuNameList: [],
				evaList: [],
				useType: 0,
				showPrice: false
			}
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
		computed: {
			currentObj() {
				let n = this.active;
				return this.dataObj.skuList[n]
			}
		},
		onLoad(options) {
			this.productId = options.id;
			this.loadData();
			if (uni.getStorageSync('useType')) {
				this.useType = uni.getStorageSync('useType')
			}
			if (uni.getStorageSync('shopId')) {
				this.shopId = uni.getStorageSync('shopId')
			}
		},
		methods: {
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
				if (this.showPrice) {
					console.log(e)
					if (e.index == 1) {
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
						})
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
				this.toggleSpec(e.index)
			},
			testGet(item, n, i) {
				console.log(this.dataObj.skuNameList[n].skuName, n, i);
				if (this.dataObj.skuNameList[n].skuName == item.skuName) {
					this.current[n] = this.skuNameList[n].dataList[i];
					this.$set(this.subIndex, n, i);
				} else {
					this.$set(this.subIndex, n, -1); //去掉选中颜色
				}
				this.chochItem(this.current);
			},
			chochItem(arry) {
				this.dataObj.skuList.forEach((item, index) => {
					if (JSON.stringify(item.specification) == JSON.stringify(arry)) {
						this.active = index;
					}
				});
			},
			FormData(skuList, skuNameList) {
				for (let i = 0; i < skuNameList.length; i++) {
					skuNameList[i].dataList = [];
					this.subIndex.push(0);
					for (let j = 0; j < skuList.length; j++) {
						if (JSON.stringify(skuNameList[i].dataList).indexOf(JSON.stringify(skuList[j].specification[i])) == -1) {
							skuNameList[i].dataList.push(skuList[j].specification[i]);
						}
					}
					this.current.push(skuNameList[i].dataList[0])
				}
				this.skuNameList = skuNameList;
			},
			//规格弹窗开关
			toggleSpec(n) {
				if (!uni.getStorageSync('uid')) {
					this.$api.loginType();
				} else {
					if (this.showPrice) {
						n && n == 0 ? this.btnText = '加入购物车' : this.btnText = '立即购买';
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
			finishChose() {
				let n = this.active,
					price = 0;
				if (this.type == 2) {
					if (this.num >= this.dataObj.qty) {
						price = this.dataObj.skuList[n].discount;
					} else {
						price = this.dataObj.skuList[n].price;
					}
				} else {
					price = this.dataObj.skuList[n].price;
				}

				if (this.btnText == '立即购买') {
					let skuName = '';
					this.current.forEach(item => {
						skuName += item.value + ','
					})
					let arry = [{
						shopName: this.dataObj.shopName,
						shopId: this.dataObj.shopId,
						fee: this.$api.parsePrice(this.dataObj.freight),
						totalCount: this.num,
						totalPrice: this.$api.parsePrice(price * 100 * this.num / 100 + (this.dataObj.freight - 0)),
						content: '', //   留言
						cartList: [{
							productId: this.productId,
							skuId: this.dataObj.skuList[n].skuId,
							// logo: this.skuList[n].logo,
							logo: this.dataObj.images[0],
							title: this.dataObj.title,
							skuName: skuName.slice(0, skuName.length - 1),
							qty: this.num,
							price: this.$api.parsePrice(price)
						}]
					}];
					this.specClass = 'none';
					this.$api.navTo(`/pagesD/order/finishOrder?good=${JSON.stringify(arry)}&type=1&buyType=1`)
				} else {
					let parmas = {
						uid: uni.getStorageSync('uid'),
						productId: this.productId,
						skuId: this.dataObj.skuList[n].skuId,
						qty: this.num
					}
					console.log(parmas)
					this._reqw.ipost(parmas, 'addCart').then(res => {
						res.result == 0 ? (this.$api.tip('加入购物车成功'), this.specClass = 'none') : this.$api.tip(res.resultNote)
					}).catch(err => {})
					this.$api.tip('加入购物车')
				}
			}
		}
	};
</script>

<style lang="scss">
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
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			/* color: $font-color-dark; */
			height: 50upx;
			line-height: 50upx;
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

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
				font-weight: bold;
			}
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

		.attr-list {
			display: flex;
			flex-direction: column;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				/* background: #eee; */
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 5px;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				border: 1px solid #cccccc;
			}

			.selected {
				border: 1px solid $page-color-light;
				color: $page-color-light;
				/* background: #fbebee; */
			}
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
			min-height: 40vh;
			border-radius: 40upx 40upx 0 0;
			background-color: #fff;

			.bottom-btn {
				margin: 30upx auto;
				border-radius: 100upx;
				height: 80upx;
				width: 640upx;
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
