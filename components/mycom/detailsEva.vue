<template>
	<view class="eva-section">
		<view class="e-header" v-if="show">
			<text class="tit">用户评价</text>
			<text class="tip" @click="gotoEva">更多评价</text>
			<text class="iconfont icon-youjiantou"></text>
		</view>
		<view class="eva-box">
			<block v-for="(v,k) in list" :key="k">
			<view class="eva-top" v-if="k<2">
				<view class="eva-top-left">
					<image class="img" :src="v.img" mode="aspectFill"></image>
					<view class="eva-info">
						<text class="name">{{v.name}}</text>
						<uni-rate :value="v.value" disabled="true"></uni-rate>
					</view>
				</view>
				<view class="time">{{v.evaTime}}</view>
			</view>
			<view class="eva-content">
				<text class="con">{{v.content}}</text>
				<view class="eva-img-con" ><image class="img" v-for=" (m,n) in v.imgList" :key="n" :src="m" mode="scaleToFill" @click="ImgDetails(k,n)"></image></view>
			</view>
			<view class="eva-active">
				<view class="con">
					<text style="color: #007AFF;">商家回复@{{v.name}}:</text>
					 {{v.backContent}}
				</view>
			</view>
		</block>
		</view>
	</view>
</template>

<script>
import uniRate from '@/components/uni-rate/uni-rate.vue';
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		list:{
			type:Array,
			dafault:[]
		}
	},
	components: {
		uniRate
	},
	data() {
		return {
		};
	},
	methods: {
		gotoEva() {
			this.$api.navTo('/pages/shop/evaList');
		}
		ImgDetails(k,n){
			uni.previewImage({
				urls:this.list[k].imgList,
				current:this.list[k].imgList[n]
			})
		}
	}
};
</script>

<style scoped lang="scss">
.eva-active {
	padding: 20upx;
	border-radius: 8upx;
	background-color: #f8f8f8;
}
/* 评价 */
.eva-section {
	display: flex;
	flex-direction: column;
	padding: 0 30upx;
	background: #fff;
	margin-bottom: 16upx;
	.e-header {
		display: flex;
		align-items: center;
		height: 70upx;
		.tit {
			margin-right: 4upx;
		}
		.tip {
			flex: 1;
			text-align: right;
		}
		.icon-you {
			margin-left: 10upx;
		}
	}
}
.eva-box {
	display: flex;
	flex-direction: column;
	.eva-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 160upx;
		.eva-top-left {
			display: flex;
			// justify-content: space-between;
			align-items: center;
			// width: 40%;
			flex: 1;
			.img {
				width: 120upx;
				height: 120upx;
				border-radius: 50%;
				margin-right: 20upx;
			}
			.eva-info {
				display: flex;
				flex-direction: column;
				.name {
					margin-bottom: 20upx;
				}
			}
		}
		.time {
			color: #333333;
		}
	}
	.eva-content {
		margin: 20upx 0;

		.eva-img-con {
			display: flex;
			align-items: center;
			padding: 20upx 0;
			.img {
				width: 160upx;
				height: 160upx;
				border-radius: 10upx;
				margin: 0 20upx;
			}
		}
	}
}
</style>
