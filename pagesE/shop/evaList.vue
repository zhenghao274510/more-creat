<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex == index }"
			 @click="tabClick(index)">{{ item.text }}</view>
		</view>
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true" top='90'>
			<eva :list="dataList"></eva>
		</s-pull-scroll>
	</view>
</template>

<script>
	import eva from '@/components/mycom/eva.vue';
	export default {
		components: {
			eva
		},
		data() {
			return {
				show: false,
				tabCurrentIndex: 0,
				productId: '',
				dataList: [],
				navList: [{
					text: '好评'
				}, {
					text: '中评'
				}, {
					text: '差评'
				}]
			};
		},

		onLoad(options) {
			this.productId = options.id;
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
				if (pullScroll.page == 1) {
					this.dataList = [];
				}
				let parmas = {
					productId: this.productId,
					uid: uni.getStorageSync('uid'),
					type: Number(this.tabCurrentIndex) + 1,
					pageNo: pullScroll.page,
					pageSize: '10'
				};

				const res = await this._reqw.ipost(parmas, 'productCommentList');
				if (res.result != 0) {
					this.$api.tip(res.resultNote)
					return
				}
				const curList = [];
				res.dataList.length == 0 ? pullScroll.empty() : res.dataList.forEach(item => {
					curList.push(item)
				}), this.dataList = this.dataList.concat(curList);
				pullScroll.page >= res.totalPage ? pullScroll.finish() :
					pullScroll.success();
			},
			//顶部tab点击
			tabClick(k) {
				this.tabCurrentIndex = k;
				this.refresh();
			}
		}
	};
</script>

<style lang="scss">
	.navbar {
		display: flex;
		height: 80upx;
		width: 100%;
		box-sizing: border-box;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1upx 5upx rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 999;
		position: fixed;
		top: 0;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
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
</style>
