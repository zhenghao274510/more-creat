<template>
	<view class="content b-t">
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true">
			<view class="list b-b" v-for="(item, index) in dataList" :key="index" @click.stop="checkAddress(item)">
				<view class="wrapper">
					<view class="u-box-first">
						<text class="name">{{ item.username }}</text>
						<text class="mobile">{{ item.phone | formPhone }}</text>
					</view>
					<view class="address-box">
						<text class="address">{{ item.city }}{{item.detail}}</text>
					</view>
				</view>
				<view class="u-box line">
					<view class="row ">
						<view class="iconfont icon-xuanzhong" v-if="item.state== 1" style="color: #ff4848;"></view>
						<view class="iconfont icon-circle" v-else style="color: #898989;"></view>
						<view class="tit">设为默认</view>
					</view>

					<view class="u-bottom">
						<text class="yticon edmit" @click.stop="addAddress('edit',index)">编辑</text>
						<text class="yticon del" @click.stop="delAddress(item.addressId, k)">删除</text>
					</view>
				</view>
			</view>
		</s-pull-scroll>
		<button class="add-btn" @click="addAddress('add')" hover-class="btn-hover">+新增地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: 0,
				dataList: []
			};
		},
		onLoad(options) {
			console.log(options.source);
			this.source = options.source;
		},
		onShow() {
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
			async loadData(pullScroll) {
				if (pullScroll.page == 1) {
					this.dataList = [];
				}
				let parmas = {
					uid: uni.getStorageSync('uid')
				};

				const res = await this._reqw.ipost(parmas, 'addressList');
				if (res.result != 0) {
					this.$api.tip(res.resultNote)
					return
				}
				res.dataList.length == 0 ? pullScroll.empty():(this.dataList= res.dataList,pullScroll.finish());
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//  上一页实例
					console.log(item);
					this.$api.prePage().addressData = item;
					uni.navigateBack();
				}
			},
			addAddress(type, k) {
				let initList, url;
				if (k != undefined) {
					initList = this.dataList[k];
					url = `/pagesA/mine/addressManage?type=${type}&id=${JSON.stringify(initList)}`
				} else {
					url = `/pagesA/mine/addressManage?type=${type}`
				}

				this.$api.navTo(url);
			},
			delAddress(id, k) {
				let _this = this;
				uni.showModal({
					confirmText: '确定',
					cancelText: '取消',
					confirmColor: "#ff3b32",
					content: '确定删除吗？',
					success: async res => {
						if (res.confirm) {
							let parmas = {
								uid: uni.getStorageSync('uid'),
								addressId: id
							}
							const res = await _this._reqw.ipost(parmas, 'delAddress');
							if (res.result != 0) {
								_this.$api.tip(res.resultNote)
								return
							}
							_this.$api.tip('删除成功'), _this.refresh()
						}
					}
				});
			}
		}
	};
</script>
<style>
	page{
		background: #f6f6f6;
	}
</style>

<style lang="scss" scoped>
	.iconfont {
		font-size: 40upx;
		margin-right: 10upx;
	}

	.line {
		border-top: 1px solid #f0f0f0;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;

		.tit {
			flex-shrink: 0;
			width: 152upx;
			font-size: 26upx;
			color: #333333;
		}
	}

	.list {
		display: flex;
		flex-direction: column;
		width: 90%;
		margin: 0 auto 20upx;
		padding: 0 20upx;
		background: #fff;
		box-shadow: 0px 0px 4upx 0px rgba(0, 0, 0, 0.04);
		border-radius: 20upx;
	}

	.edmit {
		border: 1px solid $page-color-light;
		color: $page-color-light;
	}

	.del {
		border: 1px solid $font-color-light;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 20upx 0;
	}

	.address-box {
		display: flex;
		align-items: center;
		margin-top: 20upx;

		.address {
			font-size: 13px;
			color: #999999;
		}
	}

	.u-box-first {
		font-size: 14px;
		color: $font-color-light;
		// font-weight: bold;
		margin-top: 16upx;
		display: flex;
		align-items: center;

		.name {
			margin-right: 30upx;
			font-weight: bold;
			color: #333333;
		}

		.mobile {
			color: #333333;
		}
	}

	.u-box {
		font-size: 14px;
		color: $font-color-light;
		// font-weight: bold;
		margin-top: 16upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 70%;
		margin: 80upx auto 0 auto;
		height: 80upx;
		font-size: 32upx;
		border-radius: 22px;
		color: #fff;
		background-color: $page-color-light;
		position: fixed;
		left: 15%;
		bottom: 80upx;
	}

	.u-bottom {
		display: flex;
		justify-content: flex-end;
		padding: 10px 0;
	}

	.yticon {
		padding: 3px 8px;
		border-radius: 5px;
		margin-left: 15px;
		font-size: 13px;
	}
</style>
