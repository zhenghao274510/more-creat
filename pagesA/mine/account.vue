<template>
	<view class="">
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true">
			<view class="con" v-for="(v,k) in dataList" :key="k">
				<view class="left">
					<view class="left-top">订单 {{v.orderId}}</view>
					<view class="left-end">{{v.createDate}}</view>
				</view>
				<view class="right" style="color: #FF4848;" v-if="v.type==1">+{{v.amount}}</view>
				<view class="right" v-else>-{{v.amount}}</view>
			</view>
		</s-pull-scroll>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import empty from '@/components/mycom/empty.vue'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				page: 1,
				totalPage: 1,
				dataList: [],
				status: 'loading'
			}
		},
		onLoad() {
			this.refresh()
		},
		methods: {
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
				if(pullScroll.page==1){
					this.dataList=[];
				}
				let parmas = {
					uid: uni.getStorageSync('uid'),
					pageNo: pullScroll.page,
					pageSize: '10'
				}
				console.log(parmas)
				
				const curList = [];
				const res = await this._reqw.ipost(parmas, 'orderLogList');
				if (res.result != 0) {
					this.$api.tip(res.resultNote)
					return
				}
				res.dataList.length == 0 ? (pullScroll.empty()) : res.dataList.forEach(item => {
						curList.push(item)
					}), this.dataList = this.dataList.concat(curList), pullScroll.page >= res.totalPage ? pullScroll.finish() :
					pullScroll.success();
			}
		}
	}
</script>

<style scoped lang="scss">
	.con {
		/* width: 100%; */
		padding: 20upx;
		// height: 100upx;
		margin-bottom: 20upx;
		border-bottom: 1px solid #F8F8F8;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left {
			.left-top {
				color: #1A1a1a;
				font-size: 32upx;
			}

			.left-end {
				color: #C8C7CC;
			}
		}

		.right {
			font-size: 32upx;
			font-weight: bold;
		}

		.one {
			color: $page-color-light;
		}
	}
</style>
