<template>
	<view class="">
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true">
			<view class="all">
				<view class="contains">
					<view class="nav-item" v-for="(v, k) in dataList" :key="k" @tap.stop="classify(v.shopId)">
						<image :src="v.shopLogo" alt lazy-load />
						<text class="uni-ellipsis" style="width: 100%;text-align: center;">{{ v.shopTitle }}</text>
					</view>
					<!-- <view class="nav-item">
						<view class="more">
							<image src="/static/img/more.png" class="img" @tap.stop="classify" lazy-load />
						</view>
						<text>全部</text>
					</view> -->
				</view>
			</view>
		</s-pull-scroll>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				type: ''
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.type = options.type;
			this.refresh();
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
			classify(id) {
				this.$api.navTo(`/pagesE/shop/shopDetails?id=${id}`)
			},
			async loadData(pullScroll) {
				let parmas = {
					categoryId: this.id,
					type: this.type,
					pageNo: pullScroll.page,
					pageSize: '10'
				}
				console.log(parmas);
				const res=await this._reqw.ipost(parmas, 'shopList');
				if (res.result != 0) {
					this.$api.tip(res.resultNote)
					return
				}
				const curList = [];
				res.dataList.length == 0 ? (pullScroll.empty()) : res.dataList.forEach(item => {
						curList.push(item)
					}), this.dataList = this.dataList.concat(curList), pullScroll.page >= res.totalPage ? pullScroll.finish() :
					pullScroll.success()
			}
		}
	}
</script>

<style scoped lang="scss">
	.all {
		position: relative;
		padding: 0 20upx;
		background: $font-color-spec;

		.contains {
			display: flex;
			flex-wrap: wrap;
			position: relative;

			.more {
				background: linear-gradient(-45deg, rgba(255, 137, 64, 1) 0%, rgba(255, 85, 20, 1) 100%);
				box-shadow: 0px 5px 9px 0px rgba(255, 114, 45, 0.5);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 88upx;
				height: 88upx;

				.img {
					width: 60upx;
					height: 60upx;
				}
			}

			.nav-item {
				width: 20%;
				margin-top: 10px;
				margin-bottom: 10px;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;

				image {
					width: 45px;
					height: 45px;
					border-radius: 50%;
				}

				text {
					font-size: 12px;
					color: #666;
					margin-top: 7px;
				}
			}
		}
	}
</style>
