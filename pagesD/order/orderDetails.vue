<template>
	<view>
		<page-head :title="title" @click="back"></page-head>
		<view class="order-status">
			<image src="/static/img/dingdanxiangq@2x.png" class="bg-img"></image>
			<view class="orderState" v-if="type==0">
				<!-- // 状态 0待支付 1待发货 2待收货 3待评价 4已完成 5已取消 6退款中 7已退款 8拒绝退款 -->
				<text v-if="dataObj.state == 0">待付款</text>
				<text v-if="dataObj.state == 1">待发货</text>
				<text v-if="dataObj.state == 2">待收货</text>
				<text v-if="dataObj.state == 3">待评价</text>
				<text v-if="dataObj.state == 4">已完成</text>
				<text v-if="dataObj.state == 5">已取消</text>
				<text v-if="dataObj.state == 6">退款中</text>
				<text v-if="dataObj.state == 7">已退款</text>
				<text v-if="dataObj.state == 8">拒绝退款</text>
			</view>
			<view class="orderState" v-if="type==1">
				<text v-if="dataObj.state == 0">待付款</text>
				<text v-if="dataObj.state == 1">待接单</text>
				<text v-if="dataObj.state == 2">备餐中</text>
				<text v-if="dataObj.state == 3">派送中</text>
				<text v-if="dataObj.state == 4">待评价</text>
				<text v-if="dataObj.state == 5">已完成</text>
				<text v-if="dataObj.state == 6">已取消</text>
				<text v-if="dataObj.state == 7">已退款</text>
				<text v-if="dataObj.state == 8">拒绝退款</text>
			</view>
			<view class="orderState" v-if="type==2">
				<!-- // 状态 0待支付 1待发货 2待收货 3待评价 4已完成 5已取消 6退款中 7已退款 8拒绝退款 -->
				<text v-if="dataObj.state == 0">待付款</text>
				<text v-if="dataObj.state == 1">待入住</text>
				<text v-if="dataObj.state == 2">入住中</text>
				<text v-if="dataObj.state == 3">待评价</text>
				<text v-if="dataObj.state == 4">已完成</text>
				<text v-if="dataObj.state == 5">已取消</text>
				<text v-if="dataObj.state == 6">退款中</text>
				<text v-if="dataObj.state == 7">已退款</text>
				<text v-if="dataObj.state == 8">拒绝退款</text>
			</view>
		</view>
		<!-- 地址 -->
		<view class="address-section" v-if="type==0||dataObj.choose==0">
			<view class="order-content">
				<image src="/static/img/dingwei2@2x.png" style="width: 35upx; height: 46upx;" mode=""></image>
				<view class="cen">
					<view class="top">
						<text class="name">{{ dataObj.username }}</text>
						<text class="mobile">{{ dataObj.phone }}</text>
					</view>
					<text class="address">{{ dataObj.address }}</text>
				</view>
			</view>
		</view>
		<view class="address-section" @click.stop="choseAddress" v-else>
			<view class="order-content">
				<view class="cen">
					<view class="top shopTop">
						<view style="display: flex;align-items: center;">
							<image src="/static/img/dianpu@2x.png" style="width:30upx;height: 28upx;" mode=""></image>
							<text style="color: #1A1A1A;font-weight: bold;margin-left: 10upx;">{{shopInfo.title}}</text>
						</view>
						<view class="tellphone" @click.stop="tellPhone">
							联系商家
						</view>
					</view>
					<text class="address">{{shopInfo.address}}</text>
				</view>
				<view class="iconfont icon-daohang" style="color: #CCCCCC;"></view>
			</view>
		</view>
		<!-- 地址 -->
		<view class="goods-section">
			<!-- 商品列表 -->
			<view class="g-item" v-for="(v, k) in dataObj.itemList" :key="k">
				<image :src="v.productLogo"></image>
				<view class="right">
					<view class="title clamp">{{ v.productTitle }}</view>
					<view>
						<text class="spec">{{ v.skuName }}</text>
					</view>

					<view class="price">￥{{ v.price }}</view>
				</view>
			</view>
		</view>
		<view class="yt-list pad" v-if="type==2">

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">预定人</text>
				<text class="cell-tip">{{dataObj.username}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">联系电话</text>
				<text class="cell-tip">{{dataObj.phone}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">入住时间</text>
				<text class="cell-tip">{{dataObj.itemList[0].skuName}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">入住天数</text>
				<text class="cell-tip">{{dataObj.itemList[0].qty}}天</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单总价</text>
				<text class="cell-tip">￥{{dataObj.amount}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="dataObj.reason!=''">
				<text class="cell-tit clamp">退款理由</text>
				<text class="cell-tip">{{dataObj.reason}}</text>
			</view>
			<view class="yt-list-cell b-b"v-if="dataObj.images.length!=0">
				<view class="" v-for="(v,k) in dataObj.images" :key='k'>
					<image :src="v" class="tuiImg"></image>
				</view>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">备注</text>
				<text class="cell-tip" v-if="dataObj.remarks!=''">{{dataObj.remarks}}</text>
				<text class="cell-tip" v-else>暂无</text>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list pad" v-else>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品总价</text>
				<text class="cell-tip">￥{{dataObj.price}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">{{dataObj.fee}}</text>
			</view>

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单总价</text>
				<text class="cell-tip">￥{{dataObj.amount}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="dataObj.reason!=''">
				<text class="cell-tit clamp">退款理由</text>
				<text class="cell-tip">{{dataObj.reason}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="dataObj.images.length!=0">
				<view class="" v-for="(v,k) in dataObj.images" :key='k'>
					<image :src="v" class="tuiImg"></image>
				</view>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">备注</text>
				<text class="cell-tip" v-if="dataObj.remarks!=''">{{dataObj.remarks}}</text>
				<text class="cell-tip" v-else>暂无</text>
			</view>
		</view>
		<!-- // 状态 0待支付 1待发货 2待收货 3待评价 4已完成 5已取消 6退款中 7已退款 8拒绝退款 -->
		<!-- 订单信息 -->
		<view class="yt-list pad">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单单号</text>
				<text class="cell-tip red">{{ orderId }}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="dataObj.finishDate!=''">
				<text class="cell-tit clamp">成交时间</text>
				<text class="cell-tip">{{dataObj.finishDate}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">下单时间</text>
				<text class="cell-tip">{{ dataObj.createDate }}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="dataObj.payDate!=''">
				<text class="cell-tit clamp">付款时间</text>
				<text class="cell-tip">{{dataObj.payDate}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="dataObj.sendDate!=''&&type==0">
				<text class="cell-tit clamp">发货时间</text>
				<text class="cell-tip">{{dataObj.sendDate}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="dataObj.sendDate!=''&&type==1">
				<text class="cell-tit clamp">派送时间</text>
				<text class="cell-tip">{{dataObj.sendDate}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="dataObj.refundDate!=''">
				<text class="cell-tit clamp">申请退款时间</text>
				<text class="cell-tip">{{dataObj.refundDate}}</text>
			</view>
		</view>

		<!-- 底部 -->
		<!-- // 状态 0待支付 1待发货 2待收货 3待评价 4已完成 5已取消 6退款中 7已退款 8拒绝退款 -->
		<view v-if="type!=1">
			<view class="order-bottom" v-if="dataObj.state == 2">
				<view class="order-bottom-two one" @click="finishOrder('收货')">确认收货</view>
			</view>
			<view class="order-bottom" v-if="dataObj.state == 1">
				<view class="order-bottom-two" @click="getXOrder(0)">申请退款</view>
			</view>
			<view class="order-bottom" v-if="dataObj.state == 3">
				<view class="order-bottom-two one" @click="getXOrder(1)">去评价</view>
			</view>
			<view class="order-bottom-finish" v-if="dataObj.state == 0">
				<view class="order-bottom-finish-left"></view>
				<view class="order-bottom-finish-left">
					<view class="order-bottom-two" @click="finishOrder('取消')">取消订单</view>
					<view class="order-bottom-two one" @click="payOrder">去支付</view>
				</view>
			</view>
			<view class="order-bottom-finish" v-if="dataObj.state == 4||dataObj.state == 5||dataObj.state == 7">
				<view class="order-bottom-finish-left"></view>
				<view class="order-bottom-two" @click="finishOrder('删除')">删除订单</view>
			</view>
		</view>
	<!-- 	<text v-if="dataObj.state == 0">待付款</text>
		<text v-if="dataObj.state == 1">待接单</text>
		<text v-if="dataObj.state == 2">备餐中</text>
		<text v-if="dataObj.state == 3">派送中</text>
		<text v-if="dataObj.state == 4">待评价</text>
		<text v-if="dataObj.state == 5">已完成</text>
		<text v-if="dataObj.state == 6">已取消</text>
		<text v-if="dataObj.state == 7">已退款</text>
		<text v-if="dataObj.state == 8">拒绝退款</text> -->
		<view v-if="type==1">
			<view class="order-bottom" v-if="dataObj.state == 3">
				<view class="order-bottom-two one" @click="finishOrder('收货')">确认收货</view>
			</view>
			<view class="order-bottom" v-if="dataObj.state == 1">
				<view class="order-bottom-two" @click="getXOrder(0)">申请退款</view>
			</view>
			<view class="order-bottom" v-if="dataObj.state == 4">
				<view class="order-bottom-two one" @click="getXOrder(1)">去评价</view>
			</view>
			<view class="order-bottom-finish" v-if="dataObj.state == 0">
				<view class="order-bottom-finish-left"></view>
				<view class="order-bottom-finish-left">
					<view class="order-bottom-two" @click="finishOrder('取消')">取消订单</view>
					<view class="order-bottom-two one" @click="payOrder">去支付</view>
				</view>
			</view>
			<view class="order-bottom-finish" v-if="dataObj.state == 6">
				<view class="order-bottom-finish-left"></view>
				<view class="order-bottom-two" @click="finishOrder('删除')">删除订单</view>
			</view>
		</view>

	</view>
</template>

<script>
	import pageHead from "@/components/mycom/page-head.vue"
	export default {
		data() {
			return {
				title: '订单详情',
				orderId: '',
				type: '',
				dataObj: {
					choose:0,
					images:[],
					reason:'',
					username: "",
					phone: "",
					address: "",
					shopId: "",
					shopName: "",
					price: "", // 商品总额
					fee: "",
					amount: "", // 订单总额
					remarks: "",
					state: "",
					createDate: "", // 下单时间
					payDate: "", // 付款时间
					sendDate: "", // 发货时间
					finishDate: "", // 成交时间
					itemList: [{
						productTitle: "",
						productLogo: "",
						skuName: "",
						price: "",
						qty: ""
					}]
				},
				type: 0,
				shopInfo: {
					title: '',
					address: ''
				}
			}
		},
		onLoad(options) {
			this.orderId = options.id;
			this.type = options.type;

		},
		components: {
			pageHead
		},
		onShow() {
			this.loadData();
		},
		methods: {
			back() {
				console.log(111)
				this.$api.back()
			},
			choseAddress() {
				console.log(111);
				let that = this;
				uni.getLocation({
					success(res) {
						uni.openLocation({
							latitude: that.shopInfo.lat, // 纬度，范围为-90~90，负数表示南纬
							longitude: that.shopInfo.lon, // 经度，范围为-180~180，负数表示西经
							scale: 28, // 缩放比例
							name: that.shopInfo.title,
							address: that.shopInfo.address
						});
					}
				})
			},
			loadData() {
				this._reqw
					.ipost({
							orderId: this.orderId
						},
						'orderDetail'
					)
					.then(res => {
						this.show = true;
						res.result == 0 ? this.formData(res) : this.$api.tip(res
							.resultNote);
					})
					.catch(err => {});
			},
			formData(res) {
				this.dataObj = {
					images:res.images,
					reason:res.reason,
					username: res.username,
					phone: res.phone,
					address: res.address,
					shopId: res.shopId,
					shopName: res.shopName,
					price: res.price, // 商品总额
					fee: res.fee,
					amount: res.amount, // 订单总额
					remarks: res.remarks,
					state: res.state,
					createDate: res.createDate, // 下单时间
					payDate: res.payDate, // 付款时间
					sendDate: res.sendDate, // 发货时间
					finishDate: res.finishDate, // 成交时间
					refundDate:res.refundDate,
					itemList: res.itemList
				}
				this.getShopPosition(res.shopId)
			},
			getShopPosition(id) {
				let parmas = {
					uid: getApp().globalData.uid,
					shopId: id
				}
				this._reqw.ipost(parmas, 'shopInfo').then(res => {
					res.result == 0 ? (this.shopInfo = {
						title: res.title,
						address: res.address,
						phone: res.phone,
						lon: res.lon,
						lat: res.lat
					}) : this.$api.tip(res.resultNote)
				}).catch(err => {})
			},
			//  售后
			getXOrder(n) {
				this.dataObj.orderId = this.orderId;
				if (n == 0) {
					this.$api.navTo(`/pagesD/order/subTui?id=${JSON.stringify(this.dataObj)}`);
				} else {
					this.$api.navTo(`/pagesD/order/useEva?id=${this.orderId}`);
				}
			},
			finishOrder(type) {
				// 1删除 2取消 3确认收货
				let status = 0;
				if (type == '取消') {
					status = 2;
				} else if (type == '删除') {
					status = 1;
				} else {
					status = 3;
				}
				let _this = this;
				uni.showModal({
					title: `确定${type}吗?`,
					confirmText: '确定',
					confirmColor: '#ff4848',
					titleColor: '#ff4848',
					success(res) {
						if (res.confirm) {
							// 1删除 2取消 3确认收货
							let parmas = {
								uid: getApp().globalData.uid,
								orderId: _this.orderId,
								type: status
							};
							_this._reqw.ipost(parmas, 'editOrder').then(res => {
								res.result == 0 ? (_this.$api.tip(`${type}成功！`), setTimeout(() => {
									_this.$api.back()
								})) : _this.$api.tip(
									res.resultNote)
							}).catch(err => {})
						} else if (res.cancel) {
							console.log('取消');
						}
					}
				});
			},
			payOrder() {
				let parmas = {
					orderId: this.orderId,
					uid: getApp().globalData.uid
				};
				this._reqw
					.ipost(parmas, 'orderPay')
					.then(res => {
						res.result == 0 ? this.$api.PayBywx(res.body, '订单详情') : this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			},
			tellPhone() {
				this.$api.callPhone(this.shopInfo.phone)
			}

		}
	}
</script>

<style lang="scss">
	.tuiImg{
		width: 180upx;
		height: 180upx;
		margin-right: 20upx;
	}
	.orderState {
		position: absolute;
		top: 50%;
		left: 30upx;

	}

	.tellphone {
		color: #FF4848;
		border-bottom: 1px solid #FF4848;
	}

	.one {
		background-color: #FF4848;
		color: #FFFFFF !important;
		border: none !important;
	}

	.icon-daohang {
		position: absolute;
		bottom: -20upx;
		right: 0;
	}

	.shopTop {
		display: flex;
		justify-content: space-between;
	}

	page {
		background-color: #f8f8f8;
		min-height: 100%;
		width: 100%;
	}

	.infoCon {
		width: 70%;
	}

	.pad {
		margin-bottom: 20upx;
	}

	.iconfont {
		font-size: 40upx;
	}

	.order-status {
		height: 320upx;
		// background: $page-color-light;
		color: #fff;
		text-align: left;
		// padding: 20upx;
		font-weight: bold;
		position: relative;
		width: 100%;
		margin-top: 50upx;

	}

	.bg-img {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 320upx;
	}

	.order-bottom {
		margin-top: 10px;
		height: 50px;
		background: #fff;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0 15px;
	}

	.order-bottom-orice {
		color: #333333;
		font-size: 13px;
		margin-left: 5px;
	}

	.order-bottom-one {
		color: #999999;
		border: 1px solid #999999;
		border-radius: 16px;
		padding: 5px 10px;
		font-size: 13px;
	}

	.order-bottom-finish {
		margin-top: 10px;
		height: 50px;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 15px;
	}

	.order-bottom-finish-left {
		display: flex;
	}

	.order-bottom-two {
		color: #333;
		border: 1px solid #cccccc;
		border-radius: 16px;
		margin-left: 15px;
		padding: 5px 10px;
		font-size: 13px;
	}

	.address-section {
		padding: 50upx 20upx;
		background: #fff;
		position: relative;
		border-bottom: 1px solid #EEEEEE;

		.order-content {
			display: flex;
			align-items: center;
			position: relative;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			margin-left: 20upx;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
		}
	}

	.goods-section {
		background: #fff;
		border-bottom: 1px solid #EEEEEE;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.g-item {
			display: flex;
			margin: 0 30upx;
			padding: 10px 0;

			image {
				flex-shrink: 0;
				display: block;
				width: 180upx;
				height: 180upx;
				border-radius: 10upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
			}

			.spec {
				font-size: 22upx;
				color: #666666;
				line-height: 40upx;
				background-color: #edecf1;
			}

			.price {
				font-size: 32upx;
				padding-top: 10upx;
				margin-bottom: 4upx;
				color: #fe2c2c;
			}
		}
	}

	.yt-list {
		// margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}
		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			color: #999999;
			font-size: 26upx;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: #333333;
			flex: 1;
			text-align: right;
		}


		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}


	}
</style>
