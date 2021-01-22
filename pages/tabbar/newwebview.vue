<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default{
		data(){
			return{
				url:''
			}
		},
		onLoad() {
			if(uni.getStorageSync('url')){
				this.url=uni.getStorageSync('url');
			}
			
		}
	}
</script>

<style>
</style>
