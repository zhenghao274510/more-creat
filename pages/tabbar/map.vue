<template>
	<view class="map_container">
		<view class="map-top" :style="{'padding-top':top+'px'}">
			<view class="map-top-warp">
				<view class="iconfont icon-dizhi" style="color:#ff4848;font-size: 34upx;"></view>
				<view  class="address uni-ellipsis">{{ address }}</view>
			</view>
		</view>
		<map class="map" :longitude="longitude" :latitude="latitude" :markers="markers" @markertap="markertap">
			<cover-view class="map-tab-bar" :style="{'top':lintop+'px'}">
				<cover-view class="map-tab-li" :class="{zero:k==0,one: k ==1,two:k==2 }" v-for="(v, k) in aroundList" :key="k" 
				@click.stop="getType(v)">{{ v.name }}</cover-view>
			</cover-view>
	<!-- 		<cover-view class="popup-map-close">
				<cover-view @click="goHome(0)" style="line-height:70rpx;border-bottom: 2upx dashed #f2f2f2;">普通商城</cover-view>
				<cover-view @click="goHome(1)" style="line-height:70rpx;">供应商商城</cover-view>
			</cover-view> -->
			
			<cover-view class="map-foot">
				
				<cover-view class="map-foot-item" @click.stop="goScan">
					<cover-image src="/static/img/saoyisao@2x.png" class="map-foot-item-img" />
					<cover-view class="map-text">扫一扫</cover-view>
				</cover-view>
				<cover-view class="map-foot-item" @click.stop="goHome(0)">
					<cover-image src="/static/img/shouye@2x.png" class="map-foot-item-img" />
					<cover-view class="map-text">商城</cover-view>
					
				</cover-view>
				<cover-view class="map-foot-item" @click.stop="goHome(1)">
					<cover-image src="/static/img/shouye@2x.png" class="map-foot-item-img" />
					<cover-view class="map-text">供应商商城</cover-view>
					
				</cover-view>
			</cover-view>
		</map>
	</view>
</template>
<script>
	import QQMapWX from "@/common/js/qqmap-wx-jssdk.js"
	import bassUrl from '@/common/js/config.js'
	export default {
		data() {
			return {
				city: '',
				top:uni.getSystemInfoSync()['statusBarHeight'],
				lintop:uni.getSystemInfoSync()['statusBarHeight']+ 60,
				goToHome: false,
				aroundList: [{
						name: '商铺',
						id: '1'
					},
					{
						name: '餐厅',
						id: '2'
					},
					{
						name: '酒店',
						id: '3'
					}
				],
				status: 0,
				latitude: null,
				longitude: null,
				isShow: false,
				markers: [],
				points: [],
				location: '',
				name: '',
				address: '定位中....',
				qqMapSdk: ''
			};
		},
		onLoad() {
			this.qqMapSdk = new QQMapWX({
				key: 'GQZBZ-3CECD-BP443-PBQEY-4R3M6-QMFBO'
			});
			this.getPosition();
		},
		methods: {
			goScan() {
				let that=this;
				uni.scanCode({
					success(res) {
						console.log(res);
					   if(res.result.indexOf(bassUrl.bass)!=-1){
						   let id=res.result.split('?')[1];
						   that.$api.navTo(`/pagesE/shop/shopDetails?id=${id}`);
					   }else{
						   that.$api.tip('二维码不合法，请确认!');
					   }
					}
				});
			},
			goHome(ind) {
				if(uni.getStorageSync('uid')){
					uni.setStorageSync('type',ind+'');
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/tabbar/home'
						});
					}, 30)
				}else{
					this.$api.navTo('/pages/tabbar/author')
				}
				

			},
			getPosition() {
				let self = this;
				uni.getLocation({
					type: "gcj02", 
					success(res) {
						console.log(res)
						self.latitude = res.latitude;
						self.longitude = res.longitude;
						uni.setStorageSync('point', JSON.stringify(res));
						self.qqMapSdk.reverseGeocoder({
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success: function(res) {
								console.log(res.result);
								var result = res.result;
								self.address = result.address;
								self.city=result.ad_info.city;
								uni.setStorageSync('city', result.ad_info.district);
								self.getType({
									id: 1
								})
							}
						});
					}
				})
			},
			getType(e) {
				console.log(e)
				let parmas = {
					uid: uni.getStorageSync('uid'),
					city: this.city,
					type: e.id
				}
				console.log(parmas)
				this._reqw.ipost(parmas, 'mapShopList').then(res => {
					console.log(res)
					res.result == 0 ? this.formData(res.dataList) : this.$api.tip(res.resultNote)
				}).catch(err => {})
			},
			formData(arry) {
				this.markers=[];
				let iconPath = '';
				if (this.status == 0) {
					iconPath = '/static/img/shangp1@2x.png'
				} else if (this.status == 1) {
					iconPath = '/static/img/shangp2@2x.png'
				} else {
					iconPath = '/static/img/shangp3@2x.png'
				}
				for (var i = 0; i < arry.length; i++) {
					this.markers.push({
						// 获取返回结果，放到markers数组中
						id:arry[i].shopId,
						latitude: arry[i].lat,
						longitude: arry[i].lon,
						iconPath: arry[i].logo, //图标路径
						width: 56,
						height: 56,
						label:{
							content: arry[i].title,
							anchorX:-25,
							anchorY:10,
							textAlign:"left",
							color:'#333'
						}
					});
				}
			},
			markertap(e) {
				console.log(e);
				this.$api.navTo(`/pagesE/shop/shopDetails?id=${e.markerId}`)
			}
		},

	}
</script>
<style lang="scss" scoped>
	// 弹出层 显示
	.popup-map-close {
		position: fixed;
		right: 7.5%;
		bottom: 240upx;
		width: 42.5%;
		text-align: center;
		color: #FFFFFF;
		height: 140upx;
		padding: 10upx 0;
		background:rgba(0,0,0,.6);
	}
   .address{
	   width: 500upx;
	   margin-left: 20upx;
   }
	.popup-map-content {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 400upx;
		display: flex;
	}

	.popup-map {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, .9);
	}

	.map-top {
		height: 100upx;
		padding: 0 20upx;
		background-color: #ffffff;
	}

	.map_container {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.one {
		background:#00CB7D;
	}

	.two {
		background:#FFA61F;
	}

	.map {
		width: 100%;
		height: 100%;
	}

	.map-top-warp {
		display: flex;
		align-items: center;
		height: 80upx;
	}

	.map-tab-bar {
		position: fixed;
		left: 2%;
		width: 96%;
		font-size: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		// background-color: #fff;
	}

	.map-hide {
		display: none;
	}

	.map-foot {
		bottom:100upx;
		left: 7.5%;
		width: 85%;
		background-color: #ffffff;
		position: fixed;
		display: flex;
		align-items: center;
		height:180upx;
	}

	.map-foot-item {
		width: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.map-foot-item-img {
		height: 100upx;
		width: 100upx;
	}

	.map-foot-item-del {
		height: 70upx;
		width: 70upx;
	}

	.map-text {
		color: #333333;
		font-size: 26upx;
		// font-weight: 600;
		margin-top: 20upx;
	}

	.map-tab-li {
		display: inline-block;
		width: 25%;
		overflow: hidden;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		font-size: 30rpx;
		color: #FFFFFF;
		border-radius: 20px;
	}

	.zero {
		background:#F14D23;
	}
</style>
