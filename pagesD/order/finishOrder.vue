<template>
	<view class="content-warpe">
		<!-- type==1  外卖  type==0   商品  type==2    酒店 -->


		<view class="" v-if="type==1">
			<view class="top-cont" @click="choseActive">
				<view class="icon-content" v-if="topcheck">
					<view class="iconfont icon-xuanzhong" style="color:#FF4848;font-size:38upx;">
					</view>
					到店自提
				</view>
				<view class="icon-content" v-else>
					<view class="iconfont icon-circle" style="font-size:38upx;">
					</view>
					到店自提
				</view>
			</view>
			<!-- 地址 -->
			<view class="address-section" @click="choseAddress" v-if="!topcheck">
				<view class="order-content">
					<text class="iconfont icon-dizhi3" style="font-size: 50upx;color:#FF4848 ;"></text>
					<view class="cen" v-if="addressData.addressId != ''">
						<view class="top">
							<text class="name">{{ addressData.username }}</text>
							<text class="mobile">{{ addressData.phone }}</text>
						</view>
						<text class="address">{{ addressData.city}}{{ addressData.detail }}</text>
					</view>
					<view class="cen" v-else>请选择收货地址</view>
					<view class="iconfont icon-youjiantou" style="font-size: 30upx;color: #CCCCCC;"></view>
				</view>
			</view>
		</view>
		<!-- 地址 -->
		<view class="address-section" @click="choseAddress" v-if="type==0">
			<view class="order-content">
				<text class="iconfont icon-dizhi3" style="font-size: 50upx;color:#FF4848 ;"></text>
				<view class="cen" v-if="addressData.addressId != ''">
					<view class="top">
						<text class="name">{{ addressData.username }}</text>
						<text class="mobile">{{ addressData.phone }}</text>
					</view>
					<text class="address">{{ addressData.city}}{{ addressData.detail }}</text>
				</view>
				<view class="cen" v-else>请选择收货地址</view>
				<view class="iconfont icon-youjiantou" style="font-size: 30upx;color: #CCCCCC;"></view>
			</view>
		</view>
		<view class="address-section" v-if="type==2||topcheck">
			<view class="order-content">
				<view class="cen">
					<view class="top" style="display: flex;align-items: center;">
						<image src="/static/img/dianpu@2x.png" class="shopIcon"></image>
						<text class="shopName" style="color: #000000;font-weight: bold;">{{shopAddress.name}}</text>
					</view>
					<text class="address">{{shopAddress.address}}</text>
				</view>
				<view class="iconfont icon-phone" style="color: #FFB441;font-size:60upx;" @click="callPhone"></view>
			</view>
		</view>

		<view class="" v-for="(item,index) in dataList" :key="index">
			<view class="goods-section">
				<!-- 商品列表 -->
				<view class="yt-list-cell b-b">
					<image src="/static/img/dianpu@2x.png" class="shopIcon"></image>
					<text style="color: #000000;font-weight: bold;">{{item.shopName}}</text>

				</view>
				<view class="g-item" v-for="(v,k) in item.cartList" :key="k">
					<image :src="v.logo" class="product-img"></image>
					<view class="right">
						<text class="title clamp">{{ v.title }}</text>
						<view style="margin: 5px 0;">
							<text class="spec" v-if="v.skuName">{{ v.skuName }}</text>
						</view>

						<view class="price-box">
							<text class="price">￥{{ v.price }}</text>
							<text class="number">x {{ v.qty }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 金额明细 -->
			<view class="yt-list" v-if="type!=2">
				<view class="yt-list-cell b-b">
					<text class="cell-tip">商品数量</text>
					<view class="cell-tit clamp">{{ item.totalCount }}</view>
				</view>
				<view class="yt-list-cell b-b" v-if="!topcheck">
					<text class="cell-tip" v-if="type==0">运费</text>
					<text class="cell-tip" v-if="type==1">配送费</text>
					<view class="cell-tit icon-swiper">
						<view class="clamp">￥{{ item.fee }}</view>
					</view>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tip"> 订单总额</text>
					<view class="cell-tit clamp">￥{{ item.totalPrice }}</view>
				</view>
			</view>
			<view class="yt-list" v-else>
				<view class="yt-list-cell b-b">
					<text class="cell-tip">预定人</text>
					<input type="text" placeholder="请输入姓名" v-model="usename" class="input" />
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tip">联系电话</text>
					<input type="number" placeholder="请输入联系电话" v-model="phone" class="input" />
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tip">商品数量</text>
					<view class="cell-tit clamp">{{ item.totalCount }}</view>
				</view>
				<view class="yt-list-cell b-b" v-if="!topcheck">
					<text class="cell-tip">单价</text>
					<view class="cell-tit icon-swiper">
						<view class="clamp">￥{{ item.price }}</view>
					</view>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tip">共计</text>
					<view class="cell-tit clamp">￥{{ item.totalPrice }}</view>
				</view>
			</view>
			<!-- 备注 -->
			<view class="remark-con">
				<view class="remark-con-tit">留言</view>
				<editor class="remark-con-info" placeholder="请输入你的特殊需求" :id="index" @input="getRemark" />
			</view>
		</view>


		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>合计</text>
				<text class="price-tip" v-if="endPrice != 0">￥</text>
				<text class="price">{{ endPrice }}</text>
			</view>
			<text class="submit" @click="submit" hover-class="btn-hover">提交订单</text>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				topcheck: false,
				addressData: {
					addressId: "", // 地址ID
					username: "", // 收货人
					phone: "", // 收货电话
					city: "", // 省市区
					detail: "", // 街道地址
					state: "", // 默认 0否 1是
				},
				shopAddress: {
					name: '',
					address: '',
					lat: '',
					lon: ''
				},
				usename: '',
				phone: '',
				dataList: [],
				type: 0,  // 0 商品  1  餐饮  2  酒店
				buyType: 1 //   0   购物车结算   1   立即购买
			};
		},
		computed: {
			endPrice() {
				let price = 0;
				this.dataList.forEach(item => {
					price += item.totalPrice - 0
				});
				return this.$api.parsePrice(price);
			},
		},
		onLoad(options) {
			this.dataList = JSON.parse(options.good);
			this.type = options.type;
			if (this.type != 0) {
				this.getShopLocation()
			}
			if (this.type != 2) {
				this.getDefaultAddress();
			}
			this.buyType = options.buyType;
		},
		methods: {
			callPhone() {
				this.$api.callPhone(this.shopAddress.phone)
			},
			getShopLocation() {
				let shopId = '';
				this.dataList.forEach(item => {
					shopId = item.shopId;
				})
				let parmas = {
					shopId: shopId,
					uid: uni.getStorageSync('uid')
				};
				console.log(parmas);
				this._reqw.ipost(parmas, 'shopInfo')
					.then(res => {
						console.log(res, '商家信息');
						if (res.result == 0) {
							this.shopAddress.name = res.title;
							this.shopAddress.address = res.address;
							this.shopAddress.phone = res.phone;
							this.shopAddress.lon = res.lon;
							this.shopAddress.lat = res.lat
						} else {
							this.$api.tip(res.resultNote)
						}
					})
					.catch(res => {});
			},
			getDefaultAddress() {
				let parmas = {
					uid: uni.getStorageSync('uid')
				}
				this._reqw.ipost(parmas, 'addressList').then(res => {
					if (res.result == 0) {
						if (res.dataList.length != 0) {
							if (res.dataList[0].state == 1) {
								this.addressData = res.dataList[0];
							}
						}
					}
				}).catch(err => {})
			},
			//   外卖
			choseActive() {
				this.topcheck = !this.topcheck;
				if (this.topcheck) {
					this.dataList.forEach(item => {
						item.totalPrice = (item.totalPrice * 100 - item.fee * 100) / 100
					});
				} else {
					this.dataList.forEach(item => {
						item.totalPrice = ((item.totalPrice - 0) * 100 + (item.fee - 0) * 100) / 100
					});
				}

			},
			getRemark(e) {
				let n = e.target.id;
				this.dataList[n].content = e.detail.text;
				console.log(e)
			},
			submit() {
				this.addressId == '' ? this.$api.tip('请选择收货地址!') : this.getOrderId();
			},
			//  默认地址
			getDefault() {
				this._reqw
					.ipost({
							uid: uni.getStorageSync('uid')
						},
						'findDefaultAddr'
					)
					.then(res => {
						console.log(res);
						res.result == 0 ? ((this.addrId = res.addrId), (this.addressData = res)) : this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			},
			choseAddress() {
				this.$api.navTo(`/pagesA/mine/address?source=1`);
			},
			goodSub() {
				if (this.dataList[0].content.length > 150) {
					this.$api.tip('留言最多150个字符')
				} else {
					let url="";
					// <!-- type==1  外卖  type==0   商品  type==2    酒店 -->
					let parmas = {
						uid: uni.getStorageSync('uid'),
						productId: this.dataList[0].cartList[0].productId,
						remarks: this.dataList[0].content,
					}
					
					if(this.dataList[0].skuList){
						parmas.skuList=this.dataList[0].skuList;
						url='addProductOrders';
						
					}else{
						url='addProductOrder';
						parmas.qty=this.dataList[0].cartList[0].qty;
					}
					if (this.type != 2) {
						if(!this.dataList[0].skuList){
							parmas.skuId = this.dataList[0].cartList[0].skuId;
						}
						if (this.type == 1) {
							parmas.addressId = this.addressData.addressId;
							this.topcheck ? parmas.choose = 1 : parmas.choose = 0;
						} else {
							parmas.addressId = this.addressData.addressId
						}
						this.sub(parmas, url);
					} else if (this.type == 2) {
						if (this.usename == '') {
							this.$api.tip('请填写预订人姓名!')
						} else if (this.phone == '') {
							this.$api.tip('请填写预订人联系方式!')
						} else if (!this.$api.regPhone(this.phone)) {
							this.$api.tip('请输入正确的手机号码!')
						} else {
							parmas.beginDate = this.dataList[0].beginDate;
							parmas.endDate = this.dataList[0].endDate;
							parmas.username = this.usename;
							parmas.phone = this.phone;
							this.sub(parmas, url);
						}

					}
					console.log(parmas)
				}
			},
			cartSub() {
				let shops = [],
					len = 0;
				this.dataList.forEach(item => {
					if (item.content.length > 150) {
						len += 1
					}
					shops.push({
						shopId: item.shopId,
						remarks: item.content,
						cartIds: item.cartIds
					})
				})
				if (len > 0) {
					this.$api.tip('留言最多150个字符');
				} else {
					let parmas = {
						uid: uni.getStorageSync('uid'),
						addressId: this.addressData.addressId,
						type:this.type-0+1,
						shops: shops
					}
					this.sub(parmas, 'submitCart');
				}
			},
			sub(e, url) {
				console.log(e)
				if(this.type==0){
					let _this = this;
					uni.showActionSheet({
						itemList: ['在线支付', '货到付款'],
						success(res) {
							if (res.tapIndex == 0) {
								e.payType = 0
							} else {
								e.payType = 1
							}
							_this.userPay(e,url,'good')
						}
					})
				}else{
					this.userPay(e,url)
				}
				
			},
			async  userPay(e,url,type){
				
				const res=await this._reqw.ipost(e, url);
				if(res.result!=0){
					this.$api.tip(res.resultNote);
					return
				}
				if(type){
					e.payType == 0 ? this.wxPay(res.orderId) : uni.redirectTo({
						url: '/pagesD/order/paySuccess'
					})
				}else{
					this.wxPay(res.orderId)
				}
			},
			getOrderId() {
				// <!-- type==1  外卖  type==0   商品  type==2    酒店 -->
				console.log(this.topcheck)
				if (this.type == 0 && this.addressData.addressId == '') {
					this.$api.tip("请选择地址!")
				} else if (this.type == 1 && !this.topcheck && this.addressData.addressId == '') {
					this.$api.tip("请选择地址!")
				} else {
					this.buyType == 0 ? this.cartSub() : this.goodSub();
				}
			},
			wxPay(id) {
				let parmas = {
					orderId: id,
					uid: uni.getStorageSync('uid')
				};
				this._reqw
					.ipost(parmas, 'orderPay')
					.then(res => {
						res.result == 0 ? this.$api.PayBywx(res.body, '确认订单') : this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			}
		}
	};
</script>

<style lang="scss">
	.input {
		text-align: right;
	}

	.pay-pad {
		padding: 10upx 0;
	}

	.shopName {
		color: #000000;
		font-weight: bold;
		font-size: 32upx;
	}

	.shopIcon {
		width: 32upx;
		height: 32upx;
		margin-right: 10upx;
	}

	.top-cont {
		// display: flex;
		padding: 20upx 0;
	}

	.icon-content {
		display: flex;
		align-items: center;
	}

	.iconfont {
		margin-right: 20upx;

		color: #CCCCCC;
	}

	page {
		background-color: #F8F8F8;
	}

	.content-warpe {
		width: 95%;
		margin: 0 auto;
	}

	.remark-con {
		padding: 20upx;
		margin-top: 20upx;
		background-color: #ffffff;
		color: #333333;
	}

	.remark-con-tit {
		margin: 20upx 0;
	}

	.remark-con-info {
		padding: 20upx;
		color: #333333;
	}

	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.tishiimg {
		width: 14px;
		height: 14px;
		margin-left: 5px;
	}

	.icon-swiper {
		display: flex;
		align-items: center;
	}

	.icon-dizhi01 {
		font-size: 30px;
		color: #8c8c8c;
		margin: 0 15px;
	}

	.address-section {
		height: 180upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		position: relative;
		margin-top: 20upx;
		padding: 0 20upx;

		.order-content {
			width: 100%;
			display: flex;
			align-items: center;

		}

		.icon-danseshixintubiao- {
			color: #038980;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-zuojiantou {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

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

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			padding: 15px;

			.product-img {
				flex-shrink: 0;
				display: block;
				width: 90px;
				height: 90px;
				border-radius: 4px;
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
				color: $font-color-dark;
				word-break: break-all;
				display: -webkit-box;
				overflow: hidden;
				line-height: 1.5;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				font-weight: bold;
				color: #111111;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
				background-color: #edecf1;
			}

			.price-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				margin-topl: 20upx;

				.price {
					font-size: 15px;
					font-weight: bold;
					color: #fe2c2c;
				}

				.number {
					font-size: 13px;
					color: #111111;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
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
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			flex: 1;
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
		padding: 0 10px;
		box-sizing: border-box;

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10upx 30upx;
			margin-right: 8upx;
			color: #fff;
			border-radius: 40upx;
			font-size: 28upx;
			background-color: $page-color-light;
		}
	}
</style>
