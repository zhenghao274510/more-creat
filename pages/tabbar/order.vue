<template>
	<view class="content">
		<view class="header" :style="{'padding-top':top+'px'}">
			<finsed-select :list="keepList" :clearable="false" :listShow="false" :isCanInput="false" ref="finsedSelect" :placeholder="'placeholder'"
			 initValue="商品订单" :listTop="10" :selectHideType="'hideAll'" @change="choseItem"></finsed-select>
		</view>
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex == index }"
			 @click="tabClick(index)">{{ item.text }}</view>
		</view>
		<s-pull-scroll ref="pullScroll" class="list-scroll-content" :pullDown="pullDown" :pullUp="loadData" :back-top="true"
		 :top="fixedtop">
			<!-- 订单列表 -->
			<view v-for="(item, index) in dataList" :key="index" class="order-item">
				<view class="i-top b-b">
					<view class="time" style="display: flex;align-items: center;">
						<image src="/static/img/dianpu@2x.png" class="shopIcon"></image>
						<text style="color: #333333;font-weight: bold;"> {{item.shopName}}</text>
					</view>
					<view class="">

					</view>
				</view>
				<view class="i-top b-b">
					<view class="time" style="display: flex;align-items: center;">
						<text style="color: #333333;font-weight: bold;">订单编号: {{item.orderId}}</text>
					</view>
					<!-- // 状态 0待支付 1待发货 2待收货 3待评价 4已完成 5已取消 6退款中 7已退款 8拒绝退款 -->
					<view class="order-status-right" v-if="topActive==0">
						<view class="order-status-right-one">
							{{item.state == 0?'待付款':item.state == 1?'待发货':item.state == 2?'待收货':item.state == 3?'待评价':
									item.state == 4?'已完成':item.state == 5?'已取消':item.state == 6?'退款中':item.state == 7?'已退款':
									item.state == 8?'拒绝退款':''}}
						</view>
					</view>
					<!-- 外卖订单：0待支付 1待接单 2备餐中 3派送中 4待评价 5已完成 6已取消 7退款中  -->
					<view class="order-status-right" v-if="topActive==1">
						<view class="order-status-right-one">
							{{item.state == 0?'待付款':item.state == 1?'待接单':item.state == 2?'备餐中':item.state == 3?'派送中':
									item.state == 4?'待评价':item.state == 5?'已完成':item.state == 6?'已取消':item.state == 7?'退款中':
									item.state == 8?'拒绝退款':''}}
						</view>
					</view>
					<!-- 酒店订单：0待支付 1待入住 2入住中 3待评价 4已评价 5已取消 6退款中 -->
					<view class="order-status-right" v-if="topActive==2">
						<view class="order-status-right-one">
							{{item.state == 0?'待付款':item.state == 1?'待入住':item.state == 2?'入住中':item.state == 3?'待评价':
									item.state == 4?'已评价':item.state == 5?'已取消':item.state == 6?'退款中':item.state == 7?'已退款':
									item.state == 8?'拒绝退款':''}}
						</view>
					</view>
				</view>
				<view class="goods-box-single" v-for="(v, k) in item.itemList" :key="k" @click.stop="gotoDetails(item)">
					<image class="goods-img" :src="v.productLogo" mode="aspectFill"></image>
					<view class="right">
						<text class="title uni-two-cut">{{ v.productTitle}}</text>
						<view class="">
							<text class="attr-box uni-ellipsis" v-if="topActive!=2">规格:{{ v.skuName }}</text>
							<text class="attr-box uni-ellipsis" v-else>入驻时间:{{ v.skuName }}</text>
						</view>

						<view class="price-box">
							<view class="price">￥{{v.price}}</view>
							<view class="count">× {{v.qty}}</view>
						</view>
					</view>
				</view>
				<!-- 数量 价格  统计 -->
				<view class="" v-if="topActive==2">
					<view class="list-end" style="text-align: right;">
						预订人:{{item.username}} 联系方式:{{item.phone}}
					</view>
					<view class="list-end" style="text-align: right;">
						共{{item.totalCount}}件商品 合计: ￥{{item.amount}}
					</view>
				</view>

				<view class="list-end" style="text-align: right;" v-else>
					共{{item.totalCount}}件商品 合计: ￥{{item.amount}}
				</view>
				<view class="" v-if="topActive==0">
					<view class="action-box b-t" v-if="item.state!=1&&item.state!=6">
						<view class=""></view>
						<view class="order-btn">
							<view class="action-btn pay" v-if="item.state==0" @click.stop="payOrder(item.orderId,index)">立即支付</view>
							<view class="action-btn pay" v-if="item.state==2" @click.stop="deleteOrder(item.orderId,k,'收货')">确认收货</view>
							<view class="action-btn del" v-if="item.state==0" @click.stop="deleteOrder(item.orderId,k,'取消')">取消订单</view>
							<view class="action-btn del" v-if="item.state==5||item.state==4" @click.stop="deleteOrder(item.orderId, k,'删除')">删除订单</view>
							<view class="action-btn pay" v-if="item.state==3" @click.stop="eva(item.orderId, k)">去评价</view>
						</view>
					</view>
				</view>
				<!-- 外卖订单：0待支付 1待接单 2备餐中 3派送中 4待评价 5已完成 6已取消 7退款中  -->
				<view class="" v-if="topActive==1">
					<view class="action-box b-t" v-if="item.state!=1&&item.state!=2&&item.state!=6">
						<view class=""></view>
						<view class="order-btn">
							<view class="action-btn pay" v-if="item.state==0" @click.stop="payOrder(item.orderId,index)">立即支付</view>
							<view class="action-btn pay" v-if="item.state==3" @click.stop="deleteOrder(item.orderId,k,'收货')">确认收货</view>
							<view class="action-btn del" v-if="item.state==0" @click.stop="deleteOrder(item.orderId,k,'取消')">取消订单</view>
							<view class="action-btn del" v-if="item.state==5" @click.stop="deleteOrder(item.orderId, k,'删除')">删除订单</view>
							<view class="action-btn pay" v-if="item.state==4" @click.stop="eva(item.orderId, k)">去评价</view>
						</view>
					</view>
				</view>
				<view class="" v-if="topActive==2">
					<view class="action-box b-t" v-if="item.state!=1&&item.state!=6">
						<view class=""></view>
						<view class="order-btn">
							<view class="action-btn pay" v-if="item.state==0" @click.stop="payOrder(item.orderId,index)">立即支付</view>
							<view class="action-btn pay" v-if="item.state==2" @click.stop="deleteOrder(item.orderId,k,'收货')">确认入驻</view>
							<view class="action-btn del" v-if="item.state==0" @click.stop="deleteOrder(item.orderId,k,'取消')">取消订单</view>
							<view class="action-btn del" v-if="item.state==5||item.state==4" @click.stop="deleteOrder(item.orderId, k,'删除')">删除订单</view>
							<view class="action-btn pay" v-if="item.state==3" @click.stop="eva(item.orderId, k)">去评价</view>
						</view>
					</view>
				</view>

			</view>
		</s-pull-scroll>
	</view>
</template>

<script>
	import finsedSelect from "@/components/finsed-select.vue"
	export default {
		components: {
			finsedSelect
		},
		data() {
			return {
				fixedtop: uni.getSystemInfoSync()['statusBarHeight'] + 210,
				top: uni.getSystemInfoSync()['statusBarHeight'],
				useType: 0,
				tabCurrentIndex: 0,
				totalPage: 1,
				page: 1,
				change: false,
				topActive: 0,
				dataList: [],
				keepList: [{
						value: '商品订单',
						type: 1
					},
					{
						value: '外卖订单',
						type: 2
					},
					{
						value: '酒店订单',
						type: 3
					}
				],
				navList: [{
						text: '全部',
						type: ''
					},
					{
						text: '待付款',
						type: 0
					},
					{
						text: '待发货',
						type: 1
					},
					{
						text: '待收货',
						type: 2
					},
					{
						text: '待评价',
						type: 3
					},
					{
						text: '退款',
						type: 6
					}
				]
			};
		},

		onLoad(options) {
			if (options.id) {
				this.tabCurrentIndex = options.id;
			}
		},
		onShow() {
			if (uni.getStorageSync('useType')) {
				this.useType = uni.getStorageSync('useType')
			}
			if (uni.getStorageSync('uid')) {
				if (this.useType != 2) {
					this.refresh()
				}

			} else {
				this.$api.loginType()
			}
			this.topActive = getApp().globalData.tabIndex;

		},
		watch: {
			topActive(n) {
				console.log(n)
				this.$refs['finsedSelect'].setInput(n==0?'商品订单':n==1?'外卖订单':n==2?'酒店订单':'');
				if (n == 1) {
						this.navList = [{
								text: '全部',
								type: ''
							},
							{
								text: '待支付',
								type: 0
							},
							{
								text: '待接单',
								type: 1
							},
							{
								text: '备餐中',
								type: 2
							},
							{
								text: '派送中',
								type: 3
							},
							{
								text: '待评价',
								type: 4
							}
						]
				} else if (n == 2) {
						this.navList = [{
								text: '全部',
								type: ''
							},
							{
								text: '待支付',
								type: 0
							},
							{
								text: '待入住',
								type: 1
							},
							{
								text: '入住中',
								type: 2
							},
							{
								text: '待评价',
								type: 3
							},
							{
								text: '退款',
								type: 6
							}
						]
				} else {
						this.navList = [{
								text: '全部',
								type: ''
							},
							{
								text: '待付款',
								type: 0
							},
							{
								text: '待发货',
								type: 1
							},
							{
								text: '待收货',
								type: 2
							},
							{
								text: '待评价',
								type: 3
							},
							{
								text: '退款',
								type: 6
							}
						]
				}
			}
		},
		methods: {
			eva(id) {
				this.$api.navTo(`/pagesD/order/useEva?id=${id}`)
			},
			choseItem(e) {
				console.log(e)
				this.topActive = e.index;
				if (!uni.getStorageSync('uid')) {
					this.$api.loginType()
				} else {
					this.refresh();
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
				if (!uni.getStorageSync('uid')) {
					pullScroll.empty();
					return
				}
				if (pullScroll.page == 1) {
					this.dataList = [];
				}
				let state, num = this.tabCurrentIndex;
				let parmas = {
					uid: uni.getStorageSync('uid'),
					state: this.navList[num].type,
					type: Number(this.topActive) + 1,
					pageNo: pullScroll.page
				};
				console.log(parmas)
				const res = await this._reqw.ipost(parmas, 'orderList');
				const curList = [];

				if (res.result != 0) {
					this.$api.tip(res.resultNote);
					return
				}
				if (res.dataList.length == 0) {
					pullScroll.empty();
					return
				}
				res.dataList.forEach(item => {
					item.totalCount = 0,
						item.itemList.forEach(e => {
							item.totalCount += e.qty - 0
						})
					curList.push(item)
				});
				this.dataList = this.dataList.concat(curList);
				pullScroll.page >= res.totalPage ? pullScroll.finish() : pullScroll.success()
			},
			//顶部tab点击
			tabClick(k) {
				this.tabCurrentIndex = k;
				if (this.useType != 2) {
					this.refresh()
				}
			},
			//删除订单
			deleteOrder(id, k, type) {
				let num = this.tabCurrentIndex,
					status = 0
				// 1删除 2取消 3确认收货
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
					success: async (res) => {
						if (res.confirm) {
							// 1删除 2取消 3确认收货
							let parmas = {
								uid: uni.getStorageSync('uid'),
								orderId: id,
								type: status
							};
							const res = await _this._reqw.ipost(parmas, 'editOrder');
							if (res.result != 0) {
								_this.$api.tip(res.resultNote);
								return
							}
							_this.$api.tip(`${type}成功！`);
							_this.refresh();
						}
					}
				});
			},
			applyShouhuo(item) {
				console.log(item)
				this.$api.navTo(`/pagesD/order/subTui?id=${JSON.stringify(item)}`);
			},
			gotoDetails(item) {
				this.$api.navTo(`/pagesD/order/orderDetails?id=${item.orderId}&type=${this.topActive}`);
			},
			payOrder(id, k) {
				console.log(id);
				let parmas = {
					orderId: id,
					uid: uni.getStorageSync('uid')
				};
				this._reqw
					.ipost(parmas, 'orderPay')
					.then(res => {
						res.result == 0 ? this.$api.PayBywx(res.body, k) : this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			},
			PayBywx(data, k) {
				uni.requestPayment({
					timeStamp: data.timestamp,
					nonceStr: data.noncestr,
					package: data.prepayid,
					signType: data.signType,
					paySign: data.sign,
					success(res) {},
					fail(res) {
						console.log(res)
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.order-btn {
		display: flex;
		align-items: center;
	}

	.header {
		position: fixed;
		width: 100%;
		z-index: 999;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100upx;
		background-color: #F8F8F8;
	}

	.time {
		font-size: 12px;
	}

	.list-end {
		text-align: right;
		border-bottom: 1px solid #efefef;
		padding: 20upx 0;
	}

	page,
	.content {
		background: #f6f6f6;
		height: 100%;
	}

	.order-status-right {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		.order-status-right-one {
			color: #fe2c2c;
		}
	}

	.swiper-box {
		height: calc(100% - 250upx);
		padding-top: 250upx;
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
		top: 180upx;

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

	.order-item {
		display: flex;
		flex-direction: column;
		padding: 0 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 50upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;
			justify-content: space-between;

			.goods-img {
				display: block;
				width: 90px;
				height: 90px;
				border-radius: 10upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: 14px;
					color: #111111;
				}

				.attr-box {
					font-size: 11px;
					color: #666666;
					line-height: 40upx;
					margin: 10upx 0;
					background-color: #edecf1;
				}
			}
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 20upx 0;

			.price {
				color: $page-color-light;
			}
		}

		.action-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-left: 30upx;
		}

		.del {
			border: 1px solid #DCDCDC;
		}

		.pay {
			background-color: $page-color-light;
			color: #fff !important;
		}

		.action-btn {
			height: 50upx;
			padding: 0 30upx;
			margin-left: 24upx;
			text-align: center;
			line-height: 50upx;
			font-size: 24upx;
			border-radius: 8upx;
			color: #333333;
		}
	}
</style>
