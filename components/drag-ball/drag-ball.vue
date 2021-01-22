<template>
	<view 		@touchstart="drag_start" @touchmove="drag_hmove" @tap.stop="useroptions">
		<view  	class="ball" :style="'left:'+moveX+'px;top :'+moveY+'px;'" v-if="!colse">{{title}}</view>
		<view 	class="ball" :style="'left:'+x+'px;top :'+y+'px;'" v-else>{{title}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			x: {
				type: [Number,String],
				default:uni.getSystemInfoSync().screenWidth - 60
			},
			y: {
				type:[Number,String],
				default:uni.getSystemInfoSync().screenHeight -240
			},
			title: {
				type: String,
				default:'首页'
			}
		},
		data() {
			return {
				start:[0,0],
				moveY:0,
				moveX:0,
				colse:true
			}
		},
		methods: {
			drag_start(event){
				this.start[0]= event.touches[0].clientX-event.target.offsetLeft;
				this.start[1]= event.touches[0].clientY-event.target.offsetTop;
			},
			drag_hmove(event){
					let	 tag 	 = event.touches;
					this.moveX	 = tag[0].clientX-this.start[0];
					this.moveY	 = tag[0].clientY-this.start[1];
					this.colse ? this.colse = false : this.colse;
			},
			useroptions(){
				this.$api.switchTab('/pages/tabbar/home')
			}
		}}
</script>

<style lang="less">
	.ball{
		width: 70upx;height: 70upx;
		background:linear-gradient(to bottom, #F8F8FF,#ff4848);
		border-radius: 50%;
		box-shadow: 0 0 15upx #ff4848;
		color: #fff;
		font-size:26upx;
		display: flex;justify-content: center;align-items: center;
		position: fixed;
		z-index: 9999;
	}
</style>
