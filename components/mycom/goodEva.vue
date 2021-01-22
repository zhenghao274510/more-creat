<template>
	<view class="eva-section">
		<view class="e-header">
			<text class="tit">用户评价</text>
			<text class="tip" @click="gotoEva">更多评价</text>
			<text class="iconfont icon-youjiantou"></text>
		</view>
		<block v-for="(v,k) in list" :key="k">
			<view class="eva-top" v-if="k<2">
				<view class="eav-left">
					<image class="img" :src="v.icon" mode="aspectFill"></image>
				</view>
				<view class="eva-right">
					<view class="">
						<view class="">
							<text>{{v.nickname}}</text><text>{{v.goodsname}}</text>
						</view>
						<view class="time">
							{{v.createDate}}
						</view>
					</view>
					<view class="score-con">
						<view class="uni-flex score">
							<view class="" style="font-size: 24upx;margin-right: 20upx;">
								商品评分:
							</view>
							<sx-rate disabled="true" :value='v.productScore'></sx-rate>
						</view>
						<view class="uni-flex score" style="font-size: 24upx;padding: 20upx 0;">
							<view class="" style="font-size: 24upx;margin-right: 20upx;">
								店铺服务:
							</view>
							<sx-rate disabled="true" :value='v.shopScore'></sx-rate>
						</view>
						<view class="uni-flex score">
							<view class="" style="font-size: 24upx;margin-right: 20upx;">
								物流评分:
							</view>
							<sx-rate disabled="true" :value='v.logisticsScore'></sx-rate>
						</view>
					</view>
					<view class="eva-content">
						<text class="con">{{v.content}}</text>
						<view class="eva-img-con " v-if="v.images.length!=0">
							<image class="bigimg" v-for=" (m,n) in v.images" :key="n" :src="m" mode="scaleToFill" @click="ImgDetails(k,n)"></image>
						</view>
					</view>
					<view class="eva-active" v-if="v.reply!=''">
						<view class="con">
							<text style="color: #007AFF;">商家回复:</text>
							<text style="font-size: 26upx;">{{v.reply}}</text>

						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import sxRate from '@/components/uni-rate/uni-rate.vue';
	export default {
		props: {
			list: {
				type: Array,
				dafault: []
			}
		},
		components: {
			sxRate
		},
		data() {
			return {};
		},
		methods: {
			ImgDetails(k, n) {
				uni.previewImage({
					urls: this.list[k].images,
					current: this.list[k].images[n]
				})
			},
			gotoEva(){
				this.$emit('click')
			}
		}
	};
</script>

<style scoped lang="scss">
	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 30upx;
		background: #fff;
		margin-bottom: 16upx;

		.e-header {
			display: flex;
			// align-items: center;
			height: 70upx;

			.tit {
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
				color: #666666;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.score-con {
		padding: 20upx 0;
	}

	.score {
		display: flex;
		align-items: center;
	}

	.eva-active {
		padding: 20upx;
		border-radius: 8upx;
		background-color: #f8f8f8;
	}

	.img {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		margin-right: 10upx;
	}

	.bigimg {
		width: 180upx;
		height: 180upx;
		margin-right: 20upx;
	}

	.eva-img-con {
		display: flex;
		align-items: center;
		padding: 20upx 0;
	}

	.eva-top {
		display: flex;
		justify-content: space-between;
		padding: 20upx;
		margin-bottom: 20upx;
		background: #FFFFFF;
	}

	.eva-right {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.name {
		margin-bottom: 20upx;
	}

	.time {
		color: #333333;
		font-size: 24upx;
	}
</style>
