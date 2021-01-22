<template>
	<view class="content">
		<view class="one-info">
			<view class="one-info-top">
				<text class="tit">联系人</text>
				<input class="input" type="text" v-model="addressData.username" placeholder="收货人姓名" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="row b-b">
			<text class="tit">电 话：</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="请输入联系电话" placeholder-class="placeholder"
			 maxlength="11" />
		</view>
		<view class="row b-b">
			<text class="tit">地 址：</text>
			<text @click="chooseLocation" class="input" >
				{{addressData.city}}
			</text>
			<view class="address-pos" @click="getPosition">
				 <image src="/static/img/dizhidingwei@2x.png" mode=""></image>
				 <text class="address-pos-text">定位</text>
			</view>

		</view>
		<view class="row b-b">
			<text class="tit">详细地址：</text>
			<input class="input" type="text" v-model="addressData.detail" placeholder="请输入详细地址，如门牌号" placeholder-class="placeholder" />
		</view>
		<view class="row default-row" @click="choseDefault">
			<view class="" style="margin-right: 10px;">
			
				<view class="iconfont icon-circle" v-if="addressData.state==0" style="color: #303133;">
			
				</view>
				<view class="iconfont icon-xuanzhong" v-else style="color:#ff4848;">
			
				</view>
			</view>
			<view class="tit">设为默认</view>
			
		</view>
		<button class="add-btn" @click="confirm">保 存</button>
		<picker-city ref='picker' :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#038980'
		 @onCancel="onCancel"></picker-city>
	</view>
</template>

<script>
	import pickerCity from "@/components/mpvue-citypicker/mpvueCityPicker.vue"
		import QQMapWX from "@/common/js/qqmap-wx-jssdk.js"
	export default {
		data() {
			return {
				qqMapSdk:'',
				addressData: {
					addressId:'',	
					username:'',
					phone:"",	
					city:"请选择省/市/区"	,
					detail:'',	
					state:0
				},
				cityPickerValueDefault: [0, 0, 1],
				showPicker: false,
				type: 0 // 0  修改   1  添加
			}
		},
		components: {
			pickerCity
		},
		onLoad(options) {
			this.qqMapSdk = new QQMapWX({
				key: 'GQZBZ-3CECD-BP443-PBQEY-4R3M6-QMFBO'
			});
			let title = ""
			options.type == "edit" ? (title = "修改地址", this.addressData = JSON.parse(options.id), this.type = 0) : (title =
				"添加地址", this.type = 1);
			console.log(title, options)
			this.$api.setNav(title);
		},
		methods: {
			
			getPosition() {
				uni.showLoading({
					title:'定位中....'
				})
				let self = this;
				uni.getLocation({
					type: "gcj02", 
					success(res) {
						uni.hideLoading();
						console.log(res)
						self.latitude = res.latitude;
						self.longitude = res.longitude;
						self.qqMapSdk.reverseGeocoder({
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success: function(res) {
								console.log(res.result);
								var result = res.result;
								self.addressData.city = result.address_component.province+result.address_component.city+result.address_component.district;
								self.addressData.detail=result.address_component.street_number;
							}
						});
					},
					complete() {
						uni.hideLoading()
					}
				})
			},
			//选择地址
			chooseLocation() {
				this.$refs.picker.show()
			},
			onConfirm(e) {
				console.log(e)
				let address = this.addressData
				address.city = e.label;
			},
			onCancel() {
				this.showPicker = false;
			},
			choseDefault() {
				this.addressData.state == 0 ? this.addressData.state = 1 : this.addressData.state = 0;
			},

			//提交
			confirm() {
				let data = this.addressData;
				if (!data.username) {
					this.$api.tip('请填写收货人姓名');
					return;
				}
				if (!this.$api.regPhone(data.phone)) {
					this.$api.tip('请输入正确的手机号码');
					return;
				}
				if (data.city=='请选择省/市/区') {
					this.$api.tip('请在选择所在省市');
					return;
				}
				if (!data.detail){
					this.$api.tip('请填写详细信息');
					return;
				} else{
					let parmas = {
						uid:uni.getStorageSync('uid'),
						addressId:data.addressId,
						username:data.username,
						phone:data.phone,
						city:data.city,
						detail:data.detail,
						state:data.state
					};
					console.log(parmas)
					this._reqw.ipost(parmas, "saveAddress").then(res => {
						res.result == 0 ? (this.$api.tip('提交成功!'), setTimeout(() => {
							this.$api.back()
						}, 300)) : this.$api.tip(res.resultNote)
					}).catch(err => {})

				}
			},
			getLocation(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-pos{
		width:60upx ;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.address-pos image{
		width: 22upx;
		height: 30upx;
	}
	.address-pos-text{
		color: #FF4848;
		font-size: 22upx;
		margin-top: 10upx;
	}
	.content {
		padding: 10px;
	}
	.row {
		height: 110upx;
		border-bottom: 1px solid #E7E7E7;
	}

	.one-info {
		border-bottom: 1px solid #E7E7E7;
		padding: 10px 0;
	}

	.iconfont {
		font-size: 40upx;
		margin-left: 10px;
	}

	.row,
	.one-info-top {
		display: flex;
		align-items: center;
		position: relative;

		.tit {
			flex-shrink: 0;
			width: 152upx;
			font-size: 30upx;
			color: #000;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: #999999;
			padding-left: 15px;
		}

	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		border-radius: 22px;
		height: 40px;
		margin: 50px auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $page-color-light;
	}
</style>
