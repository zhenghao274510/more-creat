<template>
	<view class="box">
		<!--主体-->
		<view class="meMain">
			<!-- <image src="/static/icon/meBg.png"></image> -->
			<view class="mePosition">
				<view class="meMainBox">
					<!--头部-->
					<view class="meHead" @click="gotoOther(5)">
						<view class="" style="display: flex;align-items: center;">
							<view class="meHeadAvatar">
								<image src="/static/img/touxiang@2x.png" mode="aspectFill" v-if="icon == ''"></image>
								<image :src="icon" mode="aspectFill" v-else></image>
							</view>
							<view class="meHeadName">
								<view class="useInfo">{{ nickname }}</view>
								<view class="useInfo" v-if="phone != ''">{{ phone }}</view>
							</view>
						</view>
						<view style="color: #FFFFFF;" v-if="useType==1||useType==3||useType==4">
							商家
						</view>
						<view style="color: #FFFFFF;" v-if="useType==2">
							供应商
						</view>
						<view style="color: #FFFFFF;" v-if="useType==5">
							合伙人
						</view>
						<view style="color: #FFFFFF;" v-if="useType==6">
							业务员
						</view>
						<view class="iconfont icon-youjiantou"></view>
					</view>
					<!--头部-->

					<!--模板-->
					<view class="meOverBg">
						<view class="meVisitor">
							<view class="meVisitorLt" @click="gotoOther(6)">
								<view class="" style="margin-right: 10px;">
									<view class="meVisitorTxt_02">{{msgs}}
										<view class="clore" v-if="msgs!=0">
										</view>
									</view>

									<view class="meVisitorTxt_01">消息</view>
								</view>
							</view>
							<view class="meVisitorLt" @click="gotoOther(7)">
								<view class="" style="margin-right: 10px;">
									<view class="meVisitorTxt_02">{{products}}</view>
									<view class="meVisitorTxt_01">收藏夹</view>
								</view>
							</view>
							<view class="meVisitorLt" @click="gotoOther(8)">
								<view class="" style="margin-right: 10px;">
									<view class="meVisitorTxt_02">{{shops}}</view>
									<view class="meVisitorTxt_01">店铺收藏</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="meOverBgOne">
			<!-- <view class="businessList top" @click="gotoOther(4)">
				<view class="businessListTxt">{{text}}</view>
				<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
			</view> -->
			<view class="businessList top" @click="gotoOther(4)" v-if="useType==1||useType==2||useType==3||useType==4">
				<view class="businessListTxt">{{text}}</view>
				<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
			</view>
			<view class="businessList " @click="gotoOther(0)">
				<view class="businessListTxt">我的地址</view>
				<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
			</view>
			<view class="businessList" @click="gotoOther(1)">
				<view class="businessListTxt">我的账户</view>
				<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
			</view>
			<view class="businessList" @click="gotoOther(2)">
				<view class="businessListTxt">联系我们</view>
				<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
			</view>
			<view class="businessList" @click="gotoOther(3)">
				<view class="businessListTxt">商家合作</view>
				<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
			</view>
			<!-- v-if="type==5||type==6" -->
			<view class="businessList" @click="gotoOther(9)" v-if="useType==5||useType==6">
				<view class="businessListTxt">收入明细</view>
				<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
			</view>
			<view class="businessList" @click="infoDetail" v-if="useType!=0">
				<view class="businessListTxt" v-if="useType==''">

				</view>
				<view class="businessListTxt" v-if="useType==1||useType==3||useType==4">商家</view>
				<view class="businessListTxt" v-if="useType==2">供应商</view>
				<!-- <view class="businessListTxt" v-if="type==5">合伙人</view>
				<view class="businessListTxt" v-if="type==6">业务员</view> -->
				<view class="iconfont icon-youjiantou" style="color: #333333;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				icon: "", // 头像
				nickname: "点击登录", // 昵称
				phone: "", // 手机号
				msgs: "", // 未读消息数量
				products: "", // 收藏商品数量
				shops: "", // 收藏店铺数量
				text: '',
				type: '',
				useType: ''
			};
		},
		onShow() {
			if (uni.getStorageSync('uid')) {
				this.loadDate();
			}
			if (uni.getStorageSync('type')) {
				this.type = uni.getStorageSync('type');
				this.type == 0 ? this.text = '供应商中心' : this.text = "普通商城"
			}
		},
		methods: {
			loadDate() {
				let parmas = {
					uid: uni.getStorageSync('uid')
				};
				this._reqw
					.ipost(parmas, 'userInfo')
					.then(res => {
						// console.log(res);
						if (res.result == 0) {
							this.nickname = res.nickname;
							this.icon = res.icon;
							this.msgs = res.msgs;
							this.products = res.products;
							this.shops = res.shops;
							this.useType = res.type;
							if (res.phone != '') {
								this.phone = this.$api.formPhone(res.phone);
							}
							if (res.shopId) {
								uni.setStorageSync('shopId', res.shopId);
							}
							uni.setStorageSync('useType', res.type);

						} else {
							this.$api.tip(res.resultNote);
						}
					})
					.catch(err => {});
			},
			infoDetail() {
				this.$api.navTo(`/pagesA/mine/shopInfo?type=${this.type}`);
			},
			store(k) {
				console.log(this.useType)
				if (this.useType != 2) {
					k == 0 ? this.$api.navTo('/pagesA/mine/goodStore') : this.$api.navTo('/pagesA/mine/shopStore');
				}
			},
			gotoOther(num) {
				if (!uni.getStorageSync('uid')) {
					this.$api.loginType()
				} else {
					// console.log(num);
					switch (num) {
						case 0:
							this.$api.navTo('/pagesA/mine/address?source=0');
							break;
						case 1:
							this.$api.navTo('/pagesA/mine/account');
							break;
						case 2:
							this.$api.navTo('/pagesA/mine/Contact');
							break;
						case 3:
							this.$api.navTo('/pagesA/mine/shopenter');
							break;
						case 4:
							getApp().globalData.tabIndex = 0;
							this.type == 0 ? uni.setStorageSync('type', '1') : uni.setStorageSync('type', '0');
							uni.showLoading({
								title: '初始化..'
							});
							setTimeout(() => {
								uni.hideLoading();
								uni.reLaunch({
									url: './home'
								});
							}, 1000)
							break;
							//  个人资料
						case 5:
							this.$api.navTo('/pagesA/mine/person_msg');
							break;
						case 6:
							this.$api.navTo('/pagesA/mine/message');
							break;
							//  消息
						case 7:
							this.store(0)
							break;
						case 8:
							this.store(1)
							break;
						case 9:
							this.$api.navTo('/pagesA/mine/income');
							break;
					}
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	//   ziti

	.icon-youjiantou {
		font-size: 38upx;
		color: #ffffff;
	}

	.clore {
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		position: absolute;
		right: 0;
		top: 0;
		border: 1px solid #FFFFFF;
	}

	.box {
		display: flex;
		flex-direction: column;
	}

	.top {
		margin-top: 30px;
	}

	.kefuIcon {
		width: 25px;
		height: 22px;
	}

	.kefuIcon>image {
		width: 100%;
	}

	.useInfo {
		text-align: left;
	}

	.imageConOne {
		width: 28px;
		height: 34px;
		margin-right: 5px;
	}

	.imageConTwo {
		width: 30px;
		height: 26px;
		margin-right: 5px;
	}

	.imageConOne>image {
		width: 100%;
		height: 100%;
	}

	.imageConTwo>image {
		width: 100%;
		height: 100%;
	}

	.meMain {
		width: 100%;
		position: relative;
		// padding-bottom: 30px;
		background-color: $page-color-light;
	}

	.meMain>image {
		width: 100%;
		height: 280upx;
		display: block;
	}

	.meMainBox {
		width: 92%;
		margin: 0 auto;
	}

	.mePosition {
		// position: absolute;
		// top: 0;
		// left: 0;
		width: 100%;
	}

	.meHead {
		overflow: hidden;
		position: relative;
		padding: 20px 0 0 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.meHeadAvatar {
		margin-top: 10upx;
	}

	.meHeadAvatar image {
		width: 110upx;
		height: 110upx;
		display: block;
		border-radius: 50%;
	}

	.meHeadName {
		color: #ffffff;
		font-size: 28upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: flex;
		flex-direction: column;
		margin-left: 10px;
	}

	.meOverBgOne {
		// overflow: hidden;
		flex: 1;
		margin-top: -30px;
		padding: 0 30upx;
		z-index: 999;
		background-color: #ffffff;
		border-radius: 30px 30px 0 0;
	}

	.meOverBg {
		overflow: hidden;
		border-radius: 10upx;
		margin-bottom: 30px;
		padding: 15px 0;
		color: #ffffff;
	}

	.meVisitor {
		display: flex;
		flex-direction: row;
	}

	.meVisitorLt {
		width: 33.3%;
		text-align: center;
		margin: 30upx 0;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.meVisitorTxt_01 {
		font-size: 28upx;
		// color: #A4A4A5;
		text-align: center;
	}

	.meVisitorTxt_02 {
		font-size: 36upx;
		font-weight: bold;
		position: relative;
		text-align: center;
	}

	.meVisitorTitle {
		font-size: 30upx;
		color: #333333;
		border-bottom: 1px #e7e7e9 solid;
		padding: 20upx 30upx;
	}

	.meOrderLt {
		width: 25%;
		text-align: center;
		padding: 30upx 0;
		transition: all 0.4s;
	}

	.meOrderLt:active {
		background: #e2e2e2;
	}

	.meOrderTxt_01 {}

	.meOrderTxt_01 image {
		width: 40upx;
		height: 40upx;
		display: block;
		margin: 0 auto 6upx;
	}

	.meOrderTxt_02 {
		font-size: 24upx;
		color: #666666;
	}

	.businessList {
		overflow: hidden;
		padding: 30upx 0;
		transition: all 0.4s;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.businessList:active {
		background: #e2e2e2;
	}

	.businessListTxt {
		font-size: 28upx;
		color: #333333;
	}
</style>
