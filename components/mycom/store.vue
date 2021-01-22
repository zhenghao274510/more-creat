<template>
	<view class="uni-list">
		<view class="list-top-title">附近店铺</view>
		<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(v, k) in productList" :key="k" @click="goDetail(v)">
			<view class="uni-media-list">
				<image class="uni-media-list-logo" :src="v.img"></image>
				<view class="uni-media-list-body">
					<view class="uni-media-list-text-top">{{ v.name }}</view>
	
					<text>{{ v.slogan }}</text>
				</view>
				<view class="uni-media-list-text-bottom">
					<text>{{ v.price }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		
	}
</script>

<style lang="scss" scoped>
	/* 附近商店 */
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
	
	.uni-pull-right > .uni-media-list-logo {
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
	
	.uni-media-list-text-bottom {
		width: 120upx;
		text-align: right;
	}
</style>
