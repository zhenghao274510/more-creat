<template>
	<view>
		<!-- 列表 -->
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true">
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(v, k) in dataList" :key="k" @click.stop="gotoDetails(v)">
				<view class="uni-media-list">
					<image class="uni-media-list-logo" :src="v.logo"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{ v.title }}</view>
						<view class="info-bottom">
							<view class="uni-flex-item">
								地址:{{v.address}}
							</view>
							<view class="">
								
							</view>
							
						</view>
						<view class="info-bottom">
							<view class="uni-flex-item"></view>
							<view class="del-btn" @click.stop="delStore(v,k)">取消收藏</view>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		</s-pull-scroll>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: []
			};
		},
		onShow() {
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
				const res=await this._reqw.ipost(parmas, 'collectShopList');
				if (res.result != 0) {
					this.$api.tip(res.resultNote)
					return
				}
				const curList = [];
				res.dataList.length == 0 ? (pullScroll.empty()) : res.dataList.forEach(item => {
						curList.push(item)
					}), this.dataList = this.dataList.concat(curList), pullScroll.page >= res.totalPage ? pullScroll.finish() :
					pullScroll.success();
			},
			//删除收藏
			delStore(e, k) {
				let self = this
				uni.showModal({
					title: '',
					content: '确定要删除该收藏吗？',
					confirmText: '删除',
					confirmColor: '#ff3b32',
					success: function(res) {
						if (res.confirm) {
							let num = self.tabCurrentIndex;
							let parmas = {
								uid: uni.getStorageSync('uid'),
								shopId: e.shopId,
								type: 0
							}
							self._reqw.ipost(parmas, 'collectShop').then(res => {
								res.result == 0 ? (self.refresh(), self.$api.tip('删除成功')) : self.$api.tip(res.reultNote)
							}).catch(err => {})
						} 
					}
				});
			},
			gotoDetails(e) {
				console.log(e);
				this.$api.navTo(`/pagesE/shop/shopDetails?id=${e.shopId}`);
			}
		}
	};
</script>

<style lang="scss">
	.info-bottom{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.del-btn {
		width: 155upx;
		height: 50upx;
		text-align: center;
		line-height: 50upx;
		font-size: 24upx;
		background: rgba(255, 255, 255, 1);
		border: 1px solid rgba(238, 238, 238, 1);
		border-radius: 25upx;
	}

	page,
	.content {
		background: #FAFAFA;
		height: 100%;
	}

	.list-scroll-content {
		height: 100%;
		width: 100%;
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
		top: 0;

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

	.uni-media-list {
		padding: 22upx 30upx;
		box-sizing: border-box;
		display: flex;
		width: 100%;
		flex-direction: row;
	}

	.uni-navigate-right.uni-media-list {
		padding-right: 74upx;
	}

	.uni-pull-right {
		flex-direction: row-reverse;
	}

	.uni-pull-right>.uni-media-list-logo {
		margin-right: 0upx;
		margin-left: 20upx;
	}

	.uni-media-list-logo image {
		height: 100%;
		width: 100%;
		
	}

	.uni-media-list-text-bottom {
		width: 100%;
		line-height: 30upx;
		font-size: 26upx;
		color: #8f8f94;
	}

	.uni-media-list-logo {
		width: 200upx;
		height: 200upx;
		margin-right: 20upx;
		border-radius: 20upx;
	}

	.uni-media-list-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
		height: auto;
	}

	.uni-media-list-text-top {
		width: 100%;
		line-height: 36upx;
		font-size: 30upx;
		height: 74upx;
		font-size: 28upx;
		overflow: hidden;
	}

	.all {
		position: relative;
		width: 100%;
		background: $font-color-spec;

		.contains {
			display: flex;
			flex-wrap: wrap;
			position: relative;

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
