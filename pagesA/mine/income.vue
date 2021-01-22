<template>
	<view class="content">
		<view class="income-top">
			<view class="uni-flex top-pad">
				<view class="uni-flex-item uni-center">
					<view class="top-red-text">
						{{todayCount}}
					</view>
					<view class="">
						今日单量
					</view>
				</view>
				<view class="uni-flex-item uni-center">
					<view class="top-red-text">
						￥{{todayAmount}}
					</view>
					<view class="">
						今日收益
					</view>
				</view>
				<view class="uni-flex-item uni-center">
					<view class="top-red-text">
						￥{{totalAmount}}
					</view>
					<view class="">
						历史收益
					</view>
				</view>
			</view>
			<view class="splace-line">

			</view>
			<view class="income-nav">
				<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex == index}"
				 @click="tabClick(index)">
					<text class="nav-title" :class="{colorfT:tabCurrentIndex == index}">{{item.text}}</text>
				</view>
			</view>
		</view>

		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true" top='280'>
			<view class="com-list" v-for="(v,k) in dataList" :key="k">
				<!-- <view class="com-list-left"> -->
				<view class="com-list-left-info">
					<view class="list-top uni-ellipsis" v-if="tabCurrentIndex==0">{{v.orderId}}</view>
					<view class="list-top uni-ellipsis" v-else>{{v.shopTitle}}</view>
					<view class="list-bottom" style="color: #999999;">{{v.createDate}}</view>
				</view>
				<view class="com-list-right-info">
					<view class="" v-if="tabCurrentIndex==0">订单金额: <text class="colorfT">￥{{v.fee}}</text> </view>
					<view class=" " v-else>开户费:<text class="colorfT">￥{{v.amount}}</text> </view>
					<view class="list-bottom" style="color: #666666;">产生佣金: <text class="colorfT">￥{{v.fmoney}}</text></view>
				</view>
				<!-- </view> -->
			</view>
		</s-pull-scroll>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabCurrentIndex: 0,
				todayCount: "0", // 
				todayAmount: "0.00", // 
				totalAmount: "0.00", // 
				dataList: [],
				navList: [{
					text: '订单收益'
				}, {
					text: '开户收益'
				}]
			}
		},
		onLoad() {
			this.refresh();
		},
		methods: {
			tabClick(index) {
				this.tabCurrentIndex = index;
				this.refresh()
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
				let parmas = {
					uid: uni.getStorageSync('uid'),
					type: Number(this.tabCurrentIndex) + 1,
					pageNo: pullScroll.page,
					pageSize: '10'
				};
				const res = await this._reqw.ipost(parmas, "incomeList");
				const curList = [];
				if (res.result != 0) {
					this.$api.tip(res.resultNote);
					return
				}
				if (pullScroll.page == 1) {
					this.todayCount = res.todayCount;
					this.todayAmount = res.todayAmount;
					this.totalAmount = res.totalAmount;
				}
				res.dataList.length == 0 ? (pullScroll.empty()) : res.dataList.forEach(item => {
						curList.push(item)
					}), this.dataList = this.dataList.concat(curList), pullScroll.page >= res.totalPage ? pullScroll.finish() :
					pullScroll.success()
			}
		}
	}
</script>
<style>
	page {
		background-color: #F6F6F6;
	}
</style>

<style lang="scss" scoped>
	.splace-line {
		height: 10upx;
		background: #f7f7f7;
	}

	.top-red-text {
		color: #ea0000;
		margin-bottom: 20upx;
	}

	.top-pad {
		padding: 50upx 0;
	}

	.colorfT {
		color: #ea0000 !important;
	}

	.list-top {
		color: #333333;
		font-weight: bold;
	}

	.nav-title {
		font-size: 30upx;
		color: #333333;
		font-weight: bold;
	}

	.nav-title-state {
		font-size: 26upx;
		color: #666666;
		margin-left: 10upx;
	}

	.com-list {
		width: 90%;
		height: 200upx;
		margin: 20upx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #FFFFFF;
		border-radius: 6upx;
		padding: 0 20upx;
	}

	.com-list-left-info {
		width: 65%;
	}

	.com-list-right-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}


	.income-top {
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		width: 100%;

		.income-details {
			padding: 50upx 30upx;
			display: flex;
		}

		.income-nav {
			height: 80upx;
			display: flex;

			.nav-item {
				width: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				font-size: 30upx;
				color: #333333;
				position: relative;

				&.current {
					&:after {
						content: '';
						position: absolute;
						left: 50%;
						bottom: -2upx;
						transform: translateX(-50%);
						width: 100%;
						height: 0;
						border-bottom: 2upx solid #ea0000;
					}
				}
			}
		}


	}
</style>
