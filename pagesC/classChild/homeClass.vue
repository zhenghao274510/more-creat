<template>
	<view class="content">
		<!-- 占位 -->
		<view class="place"></view>

		<div class="cascad-menu" ref="cascadMenu">
			<scroll-view class="left-menu" scroll-y>
				<div class="left-menu-container">
					<ul>
						<li class="left-item uni-ellipsis" ref="leftItem" @click="selectLeft(index)" v-for="(item, index) in dataList"
						 :class="{'current': actindex === index}" :key="index">{{item.title}}</li>
					</ul>
				</div>
			</scroll-view>
			<scroll-view class="right-menu" @scroll="scrollHeight" :scroll-into-view="contentId" scroll-y>
				<div class="right-menu-container">
					<ul>
						<li class="right-item">
							<div class="title" v-if="title!=''">{{title}}</div>
							<ul>
								<li v-for="(v, k) in rightDataList" :key="k" @click="goGoods(v)">
									<img :src="v.childIcon" alt style="width:50px;height:50px;border-radius: 50%;" v-if="v.childIcon!=undefined" />
									<img :src="v.logo" alt style="width:50px;height:50px;border-radius: 50%;" v-else />
									<span v-if='v.childName!=undefined' class="uni-two-cut">{{v.childName}}</span>
									<span class="uni-two-cut" v-else>{{v.title}}</span>
								</li>
							</ul>
							<div style="height:20px"></div>
						</li>
					</ul>
				</div>
			</scroll-view>
		</div>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				tabCurrent: 0,
				actindex: 0,
				categoryId: '',
				dataList: [],
				rightDataList: [],
				title: ''
			}
		},
		onLoad(options) {
			this.categoryId = options.id;
			this.LoadData(this.categoryId);
		},
		methods: {
			goGoods(e) {
				console.log(e)
				if (e.productId) {
					this.$api.navTo(`/pagesE/shop/goodsDetails?id=${e.productId}`)
				} else {
					this.$api.navTo(`/pagesC/classChild/threeClass?id=${e.childId}&title=${e.childName}&type=1`)
				}
			},
			clear() {
				this.rightDataList = [];
				this.getRightData()
			},
			async getRightData() {
				let n = this.actindex,
					data = this.dataList[n];
				if (data.childList.length == 0) {
					this.title = '';
					let parmas = {
						uid: uni.getStorageSync('uid'),
						categoryId: data.categoryId
					}
					const res = await this._reqw.ipost(parmas, "productList");
					if (res.result != 0) {
						this.$api.tip(res.resultNote);
						return
					}
					this.rightDataList = res.dataList
				} else {
					this.title = data.title;
					this.rightDataList = data.childList
				}
				console.log(this.rightDataList)
			},
			async LoadData(id) {
				const res = await this._reqw.ipost({
					categoryId: id
				}, "productCategoryList");
				if (res.result != 0) {
					this.$api.tip(res.resultNote);
					return
				}
				this.dataList = res.dataList;
				this.getRightData();
			},
			selectLeft(index) {
				console.log(index)
				this.actindex = index;
				this.clear()
			},


		}
	}
</script>
<style lang="scss">
	page {
		width: 100%;
		height: 100%;
	}

	.content {
		width: 100%;
		height: 100%;
	}

	//   导航  部分
	.navTabBox {
		width: 100vw;
		color: #151624;
		font-size: 30upx;
		font-weight: bold;
		background-color: #F8F8F8;
		padding: 0 30upx;
		box-sizing: border-box;
		height: 90upx;

		.click {
			color: $page-color-light;
			// border-bottom: 2px solid #007AFF;
		}

		.longTab {
			width: 50%;
			margin: 0 auto;
			// height: 90upx;

			.longItem {
				// height: 90upx;
				width: 100upx;
				display: inline-block;
				line-height: 90upx;
				text-align: center;
				position: relative;
			}

			.underlineBox {
				position: absolute;
				bottom: 2px;
				left: 10%;
				height: 2px;
				width: 80%;
				transition: 0.5s;
				background-color: $page-color-light;
			}
		}
	}

	//   列表 部分
	.cascad-menu {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 100%;

		.left-menu {
			width: 260upx;
			height: 100%;
			background: #f5f5f5;
			z-index: 999;

			.left-item {
				height: 80upx;
				width: 100%;
				text-align: center;
				line-height: 80upx;
				color: #333;

				&.current {
					background: #fff;
					color: #FF4848;
					width: 100%;
				}
			}
		}

		.right-menu {
			width: 100%;

			.right-item {
				height: 100%;

				.title {
					height: 40upx;
					line-height: 40upx;
					padding-left: 20upx;
					margin: 10upx 0;
					// color: #FFFFFF;
				}

				ul {
					display: flex;
					flex-wrap: wrap;

					li {
						width: 33%;
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-top: 20upx;
						color: #333;

						img {
							width: 100upx;
							height: 100upx;
							margin-bottom: 20upx;
							border-radius: 20px;
						}

						span {
							width: 160upx;
							font-size: 24upx;
							text-align: center;
						}
					}
				}
			}
		}
	}
</style>
