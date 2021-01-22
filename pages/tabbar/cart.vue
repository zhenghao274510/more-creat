<template>
	<view class="container">
		<!-- 列表 -->
		<view class="cart-top">
			<view class="cart-top-main">
				<view class="cart-top-main-item" :class="{ 'cart-top-active': active == k }" v-for="(v, k) in navList" :key="k"
				 @click.stop="changeCart(k)">{{ v.name }}</view>
			</view>
			<view class="cart-status" @click.stop="changDel">{{ topText }}</view>
		</view>
		<cartEmpty v-if="dataList.length == 0" @click="navToLogin"></cartEmpty>
		<view class="cart-list" v-for="(item, index) in dataList" :key="index">
			<view class="cart-item-title" @click.stop="shopDetails(item.shopId, 0)">
				<view class="cart-item-title-top">
					<view class="" @click.stop="check('shopitem', index)">
						<view class="iconfont icon-xuanzhong" style="color: #ff4848;" v-if="item.checked"></view>
						<view class="iconfont icon-circle" style="color: #898989;" v-else></view>
					</view>
					<image src="/static/img/dianpu@2x.png" class="shopIcon" style="margin-left: 10upx;"></image>
					<view class="cart-item-title-top-text">{{ item.shopName }}</view>
				</view>
				<view class="iconfont icon-youjiantou"></view>
			</view>
			<view class="cart-item" v-for="(v, k) in item.cartList" :key="k">
				<view class="cart-item-left">
					<view class="" @tap.stop="check('item', index, k)">
						<view class="iconfont icon-xuanzhong" style="color: #ff4848;" v-if="v.checked"></view>
						<view class="iconfont icon-circle" style="color: #898989;" v-else></view>
					</view>
					<image :src="v.logo" mode="aspectFill" lazy-load class="product-img"></image>
				</view>
				<view class="item-right" @click.stop="shopDetails(v.productId, 1)">
					<view class="item-right-top">
						<text class="clamp title uni-ellipsis">{{ v.title }}</text>
					</view>
					<view class="item-right-top" @click.stop>
						<text class="clamp skuclass">{{ v.skuName }}</text>
						<text class="clamp skuclass" v-if="active==0">起订量:{{ v.minQty }}</text>
					</view>
					<view class="item-right-top" @click.stop>
						<text class="price" >￥{{v.qty>v.maxQty?v.discount:v.price }}</text>
						<uni-number-box class="step" min="1" :value="v.qty" :step="index" :index="k" @change="numberChange"></uni-number-box>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部菜单栏 -->
		<view v-if="dataList.length != 0">
			<view class="action-section" :class="{ 'bottom-width': total == 0 }" v-if="bianji">
				<view class="checkbox" @tap.stop="check('all')" v-if="active == 0">
					<view class="iconfont icon-xuanzhong" style="color: #ff4848;" v-if="allChecked"></view>
					<view class="iconfont icon-circle" style="color: #898989;" v-else></view>
				</view>
				<view class="checkbox" v-else></view>

				<view class="total-box" v-if="total != 0">
					<text class="price">¥{{ total }}</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @tap.stop="createOrder">去结算</button>
			</view>
			<view class="action-section bottom-width" v-else>
				<view class="checkbox" @tap.stop="check('all')">
					<view class="iconfont icon-xuanzhong" style="color: #ff4848;" v-if="allChecked"></view>
					<view class="iconfont icon-circle" style="color: #898989;" v-else></view>
				</view>
				<view class="del-btn" @tap.stop="deleteCartItem">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
	import cartEmpty from '@/components/mycom/cartEmpty';
	export default {
		components: {
			uniNumberBox,
			cartEmpty
		},
		data() {
			return {
				navList: [{
						name: '商城',
						type: 1
					},
					{
						name: '餐厅',
						type: 2
					}
				],
				topText: '编辑',
				bianji: true,
				active: 0,
				total: 0,
				allChecked: false,
				status: 'loading',
				dataList: [],
				useType: 0
			};
		},
		onLoad() {
			if (uni.getStorageSync('useType')) {
				this.useType = uni.getStorageSync('useType')
			}
		},
		onShow() {
			if (uni.getStorageSync('uid')) {
				if (this.useType!=2) {
					this.loadData();
				}
			} else {
				this.$api.loginType();
			}
		},
		methods: {
			shopDetails(id, type) {
				let url = '';
				if (type == 0) {
					url = `/pagesE/shop/shopDetails?id=${id}`;
				} else {
					this.active == 0 ? (url = `/pagesE/shop/goodsDetails?id=${id}`) : (url = `/pagesE/shop/eatDetails?id=${id}`);
				}
				this.$api.navTo(url);
			},
			navToLogin() {
				uni.switchTab({
					url: '/pages/tabbar/home'
				});
			},
			changeCart(ind) {
				this.active = ind;
				if (!uni.getStorageSync('uid')) {
					this.$api.loginType();
				} else {
					this.allChecked = false;
					this.dataList = [];
					if (this.useType!=2) {
						this.loadData();
					}
				}
			},
			loadData() {
				let n = this.active - 0 + 1;
				let parmas = {
					uid: uni.getStorageSync('uid'),
					type: n
				};
				this._reqw
					.ipost(parmas, 'cartList')
					.then(res => {
						if (res.result == 0) {
							res.dataList.length != 0 ? (this.dataList = this.formCartList(res.dataList)) : (this.empty = true);
						} else {
							this.$api.tip(res.resultNote);
						}
					})
					.catch(err => {});
			},
			formCartList(res) {
				for (let i in res) {
					res[i].checked = false;
					for (let j in res[i].cartList) {
						res[i].cartList[j].checked = false;
					}
				}
				return res;
			},
			checkALL(state) {
				const list = this.dataList;
				list.forEach(item => {
					item.checked = state;
					item.cartList.forEach(e => {
						e.checked = state;
					});
				});
			},
			//选中状态处理
			check(type, index, k) {
				if (type == 'all') {
					const checked = !this.allChecked;
					this.checkALL(checked);
					this.allChecked = checked;
				} else {
					const list = this.dataList[index].cartList;
					if (type == 'shopitem') {
						if (this.active == 1) {
							this.checkALL(false);
						}
						this.dataList[index].checked = !this.dataList[index].checked;
						list.forEach(item => {
							item.checked = this.dataList[index].checked;
						});
					} else if (type == 'item') {
						if (this.active == 1 && !this.dataList[index].cartList[k].checked) {
							this.checkALL(false);
						}
						this.dataList[index].cartList[k].checked = !this.dataList[index].cartList[k].checked;
						let num = 0;
						list.forEach(item => {
							if (item.checked) {
								num++;
							}
						});
						if (num == 0 || num == list.length) {
							this.dataList[index].checked = this.dataList[index].cartList[k].checked;
						} else {
							this.dataList[index].checked = false;
						}
					}
					let a = 0;
					this.dataList.forEach(item => {
						if (item.checked) {
							a++;
						}
					});
					if (a == 0 || a == this.dataList.length) {
						this.allChecked = this.dataList[index].checked;
					} else {
						this.allChecked = false;
					}
				}
				this.calcTotal();
			},
			//数量
			numberChange(data) {
				console.log(data);
				let currtCart = this.dataList[data.step].cartList[data.index];
				let parmas = {
					uid: uni.getStorageSync('uid'),
					cartId: currtCart.cartId,
					qty: data.number
				};
				this._reqw
					.ipost(parmas, 'editCart')
					.then(res => {
						res.result == 0 ? ((currtCart.qty = data.number), this.calcTotal()) : this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			},
			//  编辑
			changDel() {
				if (this.dataList.length == 0) {
					return;
				} else {
					this.topText == '完成' ? (this.topText = '编辑') : (this.topText = '完成');
					this.bianji = !this.bianji;
				}
			},
			//删除
			deleteCartItem() {
				let dataList = this.dataList,
					cartId = [],
					_this = this;
				dataList.forEach(item => {
					item.cartList.forEach(e => {
						if (e.checked) {
							cartId.push(e.cartId);
						}
					});
				});
				console.log(cartId);
				if (cartId.length > 0) {
					uni.showModal({
						title: '确定删除吗',
						cancelText: '取消',
						confirmText: '确定',
						confirmColor: '#ff4848',
						titleColor: '#ff4848',
						success(res) {
							if (res.confirm) {
								let parmas = {
									uid: uni.getStorageSync('uid'),
									cartIds: cartId
								};
								_this._reqw.ipost(parmas, 'delCart').then(res => {
									res.result == 0 ? (_this.$api.tip('删除成功!'), _this.initData(), _this.calcTotal()) : _this.$api.tip(res.resultNote);
								});
							} else if (res.cancel) {
								console.log('取消');
							}
						}
					});
				} else {
					this.$api.tip('请选择商品!');
				}
			},
			initData() {
				this.dataList = [];
				this.loadData();
			},
			//计算总价
			calcTotal() {
				let list = this.dataList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				list.forEach(item => {
					item.cartList.forEach(e => {
						if (e.checked) {
							if (e.qty >= e.maxQty) {
								total += e.discount * e.qty;
							} else {
								total += e.price * e.qty;
							}

						}
					});
				});
				this.total = this.$api.parsePrice(total);
			},
			formend(arry) {
				let a = [];
				arry.forEach(item => {
					if (item.fee) {
						item.totalPrice = this.$api.parsePrice(item.totalPrice - 0 + (item.fee - 0));
					}
					if (item != 'empty') {
						a.push(item);
					}
				});
				return a;
			},
			//创建订单
			createOrder() {
				let list = this.dataList,
					arry = [],
					endArry = [],
					len = 0;
				list.forEach((item, index) => {
					let num = 0,
						totalPrice = 0,
						cartList = [],
						cartIds = [];
					item.cartList.forEach((e, k) => {
						console.log(e);

						if (e.checked) {
							if (e.qty >= e.minQty) {
								this.$set(cartList, k, e);
								this.$set(cartIds, k, e.cartId);
								num += e.qty - 0;
								if (e.qty >= e.maxQty) {
									totalPrice += e.qty * (e.discount * 100);
								} else {
									totalPrice += e.qty * (e.price * 100);
								}
								arry[index] = {
									shopId: item.shopId,
									shopName: item.shopName,
									fee: this.$api.parsePrice(item.fee),
									totalPrice: totalPrice / 100,
									totalCount: num,
									content: '',
									cartIds: cartIds,
									cartList: this.formend(cartList)
								};
							} else {
								if (this.active == 0) {
									len += 1;
									uni.showToast({
										title: `第${index+1}下的第${k+1}个商品不满足最小购买数量`,
										icon: 'none'
									})
								}

							}
						}

					});
				});
				if (len == 0) {
					endArry = this.formend(arry);
					if (endArry.length != 0) {
						this.$api.navTo(`/pagesD/order/finishOrder?good=${JSON.stringify(endArry)}&type=${this.active}&buyType=0`);
					} else {
						this.$api.tip('请选择商品!');
					}
				}
			}
		},
		onHide() {
			// this.dataList = [];
			this.allChecked = false;
		}
	};
</script>

<style lang="scss">
	.container {
		padding-bottom: 180upx;
		height: 100%;
		background-color: #f8f8f8;
	}

	.skuclass {
		font-size: 12px;
		background: #edecf1;
		padding: 3px 5px;
		color: #999999;
	}

	.cart-item-title-top-text {
		margin-left: 10upx;
	}

	.cart-item-title {
		width: 95%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		background: #ffffff;
		padding: 8px;
		box-sizing: border-box;
	}

	.cart-top {
		height: 60px;
		position: relative;
		display: flex;
		width: 100%;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		padding: 0 15px;
		text-align: right;
		font-size: 15px;
		color: #ff4848;
	}

	.cart-top-main {
		display: flex;
		width: 30%;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
	}

	.cart-top-main-item {
		width: 40%;
		padding: 10px 0;
		text-align: center;
	}

	.cart-top-active {
		border-bottom: 4upx solid $page-color-light;
	}

	.cart-status {
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translateY(-50%);
	}

	.cart-list {
		margin-bottom: 20upx;
	}

	.cart-item {
		width: 95%;
		margin: 0 auto;
		display: flex;
		position: relative;
		background: #ffffff;
		padding: 8px;
		box-sizing: border-box;
	}

	.item-right-top {
		display: flex;
		flex: 1;
		justify-content: space-between;
		align-items: center;
	}

	.cart-item-title-top {
		display: flex;
		align-items: center;
	}

	.bottom-width {
		width: 100%;
		justify-content: space-between;
		align-items: center;
		color: #ffffff;
	}

	.item-end {
		text-align: right;
		color: #ff4848;
	}

	.price {
		font-size: 32upx;
		color: $page-color-light;
	}

	.cart-item-left {
		// width: 270upx;
		// height: 230upx;
		position: relative;
		display: flex;
		align-items: center;
	}

	.product-img {
		width: 90px;
		height: 90px;
		border-radius: 5px;
		margin-left: 10px;
	}

	.item-right {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		position: relative;
		padding-left: 20upx;
	}

	.title {
		height: 40upx;
		line-height: 40upx;
		flex: 1;
		color: #111111;
	}

	.del-btn {
		padding: 4upx 10upx;
		font-size: 34upx;
		height: 50upx;
		color: $font-color-light;
	}

	.icon-circle,
	.icon-xuanzhong {
		font-size: 40upx;
	}

	/* 底部栏 */
	.action-section {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		align-items: center;
		height: 50px;
		padding: 0 30upx;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);

		.checkbox {
			height: 52upx;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: 0.2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: 30upx;
				color: $page-color-light;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 60upx;
			line-height: 60upx;
			background: #ff4848;
			font-size: 13px;
		}

		.del-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 60upx;
			line-height: 60upx;
			color: #ff4848;
			border: 1px solid #ff4848;
			font-size: 13px;
		}
	}
</style>
