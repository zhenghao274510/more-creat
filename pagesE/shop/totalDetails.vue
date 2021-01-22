<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400" interval="3000" autoplay="true">
				<swiper-item class="swiper-item" v-for="(item, index) in dataObj.images" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<view class="title">{{ dataObj.title }}</view>
			<view class="price-box" v-if="showPrice==true">
				¥
				<text class="price-tip">{{ dataObj.price }}</text>
			</view>
			<view class="bot-row">
				<text>已售: {{ dataObj.sales }}</text>
			</view>
			<view class="collentContent" @click="collect">
				<image src="/static/img/xiangq_shoucang2@2x.png" v-if="dataObj.collect == 1"></image>
				<image src="/static/img/xiangq_shoucang@2x.png" v-else></image>
			</view>
		</view>

		<date-picker :show="showCaledar" :show-tips="false" :show-seconds="false" @confirm="onConfirm" @cancel="showPicker = false" />
		<view class="" style="background: #FFFFFF;margin-top: 20upx;">
			<view class="c-row b-b" style="padding: 20upx;"><text class="tit">酒店配置</text></view>
			<view class="pzList">
				<view class="c-set" v-for="(v, k) in dataObj.pzList" :key="k">
					<image class="img-warp" :src="v.icon" mode="scaleToFill"></image>
					<text style="font-size: 24upx;">{{ v.title }}</text>
				</view>
			</view>
		</view>
		<view class="c-list" @click="showChose">
			<view class="c-row b-b">
				<view class="tit" style="padding:20upx 0;">
					<rich-text :nodes="dataObj.notice"></rich-text>
				</view>
			</view>
			<view class="">
				<jyf-parser :html="content" ref="article"></jyf-parser>
			</view>
		</view>

		<!-- 评价 -->
		<eva :list="evaList" @click="moreEva"></eva>
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<view class="p-b-btn">
				<text class="">入住时间:{{ starDate }}</text>
				<text v-if="endDate != ''">离开时间:{{ endDate }}</text>
			</view>
			<view class="one" v-if="count != 0">
				<image src="/static/img/gongjiwan@2x.png" class="countimg"></image>
				<text style="color: #FFFFFF;">共{{ count }}晚</text>
			</view>
			<view class="action-btn-group"><button type="primary" class=" action-btn  add-cart-btn" @tap.stop="creatOrder">立即预定</button></view>
		</view>
		<good-date-picker ref="goodDatePicker" @change="changeDate"></good-date-picker>
	</view>
</template>

<script>
	import datePicker from '@/components/datepicker.vue';
	import eva from '@/components/mycom/goodEva.vue';
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
			datePicker,
			jyfParser,
			eva
		},
		data() {
			return {
				dataObj: {
					logo: '', // 列表图
					productId: '',
					title: '', // 名称
					images: [], // 轮播图
					price: '', // 价格
					unit: '', // 单位
					sales: '', // 销量
					collect: '', // 收藏 0否 1是
					shopId: '', // 店铺ID
					skuList: []
				},
				count: '',
				useType: 0,
				content: '',
				evaList: [],
				showCaledar: false,
				showPrice: false,
				endDate: '',
				starDate: this.$api.formatTime(new Date().getTime())
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
			this.showCaledar = true;
			this.loadData();
			this.getEvalist();
			if (uni.getStorageSync('useType')) {
				this.useType = uni.getStorageSync('useType')
			}
		},
		methods: {
			loadData() {
				let parmas = {
					productId: this.productId,
					uid: uni.getStorageSync('uid')
				};
				this._reqw
					.ipost(parmas, 'productDetail')
					.then(res => {
						console.log(res);
						res.result == 0 ?
							(this.dataObj = res, res.notice = res.notice.replace(/\n/g, "<br>"), this.content = this.$api.formText(res.content)) :
							this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			},
			onConfirm(e) {
				console.log(e);
				this.starDate = e.value[0];
				if (e.value.length > 1) {
					this.endDate = e.value[1];
					this.count = this.$api.datedifference(this.starDate, this.endDate);
				} else {
					this.endDate = '';
					this.count = 0;
				}
			},
			collect() {
				if (!uni.getStorageSync('uid')) {
					this.$api.loginType()
				} else {
					let type;
					this.dataObj.collect == 1 ? (type = 0) : (type = 1);
					let parmas = {
						uid:uni.getStorageSync('uid'),
						productId: this.productId,
						type: type
					};
					console.log(parmas);
					this._reqw.ipost(parmas, 'collectProduct').then(res => {
						if (res.result == 0) {
							this.dataObj.collect == 1 ? ((this.dataObj.collect = 0), this.$api.tip('取消收藏成功!')) : ((this.dataObj.collect =
								1), this.$api.tip('收藏成功!'));
						} else {
							this.$api.tip(res.resultNote);
						}
					}).catch(err => {})
				}

			},
			creatOrder() {
				if (this.endDate == '') {
					this.$api.tip('请选择结束日期！');
				} else {
					let arry = [{
						shopName: this.dataObj.shopName,
						shopId: this.dataObj.shopId,
						totalPrice: this.$api.parsePrice((this.dataObj.price * 100 * this.count) / 100),
						price: this.$api.parsePrice(this.dataObj.price),
						totalCount: this.count,
						beginDate: this.starDate,
						endDate: this.endDate,
						fee: 0,
						content: '', //   留言
						cartList: [{
							productId: this.productId,
							logo: this.dataObj.images[0],
							title: this.dataObj.title,
							skuName: `入驻时间：${this.starDate}~${this.endDate}`,
							qty: this.count,
							price: this.$api.parsePrice(this.dataObj.price)
						}]
					}];

					this.$api.navTo(`/pagesD/order/finishOrder?good=${JSON.stringify(arry)}&type=2&buyType=1`);
				}
			},
			moreEva() {
				this.$api.navTo(`/pagesE/shop/evaList?id=${this.productId}`);
			},
			getEvalist() {
				console.log(111);
				let parmas = {
					productId: this.productId,
					uid:uni.getStorageSync('uid'),
					type: '',
					pageNo: 1,
					pageSize: '10'
				};

				this._reqw
					.ipost(parmas, 'productCommentList')
					.then(res => {
						console.log(res);
						res.result == 0 ? (this.evaList = res.dataList) : this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			}
		}
	};
</script>

<style lang="scss">
	.pzList {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
	}

	.collentContent {
		position: absolute;
		top: 30upx;
		right: 30upx;
		width: 51upx;
		height: 48upx;
	}

	.collentContent image {
		width: 51upx;
		height: 48upx;
	}

	.img-warp {
		width: 118upx;
		margin: 0 2%;
		height: 118upx;
		border-radius: 20upx;
		margin-bottom: 10upx;
	}

	.one {
		width: 100upx;
		height: 40upx;
		position: relative;
		text-align: center;
	}

	.price-tip {
		font-size: 36upx;
	}

	.countimg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100upx;
		height: 40upx;
		z-index: -1;
	}

	.c-set {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// width: 18%;
		padding-left: 22upx;
	}

	.container {
		padding-bottom: 100upx;
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

	.tit {
		color: #333333;
		font-weight: bold;
	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;
		margin-bottom: 20upx;
		position: relative;

		.title {
			font-size: 32upx;
			color: #111111;
			height: 50upx;
			line-height: 50upx;
			width: 80%;
			flex-wrap: wrap;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $page-color-light;
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
		padding: 20upx;

		.c-row {
			display: flex;
			align-items: center;
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

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0 20upx;
		box-sizing: border-box;
		height: 100upx;
		background:#FFFFFF;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			// width: 96upx;
			height: 80upx;
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: $page-color-light;
			position: relative;

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
