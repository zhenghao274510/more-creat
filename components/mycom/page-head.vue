<template name="page-head">
		<view class="uni-page-head" :style="{'padding-top':top+'px'}">
			
			<!-- <view class="topnav" >
				
			</view> -->
			<view class="uni-page-head-con"   @click="onClick">
				<view class="uni-page-head-left">
					<image src="/static/img/back.png" mode="" style="width: 30upx;height: 38upx;"></image>
					<view class="uni-page-head-title">{{title}}</view>
				</view>
			</view>
		</view>
	
</template>
<script>
	export default {
		name: "page-head",
		props: {
			title: {
				type: String,
				default: ""
			},
			newcolor:{
				type:String,
				default:''
			},
			rightTxt:{
				type:String,
				default:""
			},
			showRightText:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
				top:uni.getSystemInfoSync()['statusBarHeight'],
			}
		},
		methods:{
			onClick(){
				this.$emit("click")
			},
		
		}
	}
</script>
<style scoped>
	.topnav{
		height: 50upx;
	}

	.uni-page-head {
		background:linear-gradient(90deg,rgba(255,82,26,1) 0%,rgba(254,39,37,1) 100%);
		width: 100%;
		box-sizing: border-box;
		position: fixed;
		z-index: 999999 !important;
	}
	
	.uni-page-head-con {
		/* background: #fff; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 80upx;
		box-sizing: border-box;
	}
	
	.uni-page-head-left {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.uni-page-head-title {
		font-size: 30upx;
		line-height: 88upx;
		color: #fff;
		font-weight: bold;
		flex: 1;
		margin-left: -30upx;
	}
	
	.uni-page-head-right {
		font-size: 30upx;
		line-height: 88upx;
		color: #ff8300;
		font-weight: bold;
	}
	
</style>

