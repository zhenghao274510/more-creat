<template>
	<view class="box">
		<view class="meOverBgOne">
			<view class="businessList top" @click="gotoOther(0)">
				<view class="businessListTxt">
					<image src="/static/img/shangjiaruzhu@2x.png"></image>
					商家申请
				</view>
				<view class="iconfont icon-youjiantou">

				</view>
			</view>
			<view class="businessList" @click="gotoOther(1)">
				<view class="businessListTxt">
					<image src="/static/img/jiudianruzhu@2x.png"></image>酒店申请
				</view>
				<view class="iconfont icon-youjiantou">

				</view>
			</view>
			<view class="businessList" @click="gotoOther(2)">
				<view class="businessListTxt">
					<image src="/static/img/cantingruzhu@2x.png"></image>餐厅申请
				</view>
				<view class="iconfont icon-youjiantou">

				</view>
			</view>
			<view class="businessList" @click="gotoOther(3)">
				<view class="businessListTxt">
					<image src="/static/img/gongyingshangruzhu@2x.png"></image>供应商申请
				</view>
				<view class="iconfont icon-youjiantou">

				</view>
			</view>
			<view class="businessList" @click="gotoOther(4)">
				<view class="businessListTxt">
					<image src="/static/img/chengshihehuor@2x.png"></image>城市合伙人申请
				</view>
				<view class="iconfont icon-youjiantou">

				</view>
			</view>
			<view class="businessList" @click="gotoOther(5)">
				<view class="businessListTxt">
					<image src="/static/img/chengshiyewuyuan@2x.png"></image>城市业务员申请
				</view>
				<view class="iconfont icon-youjiantou">

				</view>
				<!-- <image src="/static/img/you.png"></image> -->
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			gotoOther(num) {
				switch (num) {
					case 0:
						this.$api.navTo('/pagesB/enterform/Merchant');
						break;
					case 1:
						this.$api.navTo('/pagesB/enterform/Hotel');
						break;
					case 2:
						this.$api.navTo('/pagesB/enterform/Restaurant');
						break;
						//   供应商
					case 3:
						this.$api.navTo('/pagesB/enterform/Supplier');
						break;
						//  合伙人
					case 4:
						this.$api.navTo('/pagesB/enterform/partners');
						break;
						// 业务员
					case 5:
						this.$api.navTo('/pagesB/enterform/salesman')
						break;
				}

			}
		}
	}
</script>

<style scoped lang="scss">
	.box {
		display: flex;
		flex-direction: column;
	}

	.iconfont {
		font-size: 26upx;
		color: #333333;
	}

	.meOverBgOne {
		flex: 1;
		padding: 0 30upx;
		z-index: 999;
	}

	.businessList {
		// overflow: hidden;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx 0;
		border-bottom: 1px #E7E7E9 solid;
		transition: all 0.4s;
	}

	.businessList:active {
		background: #E2E2E2;
	}

	.businessListTxt {
		font-size: 28upx;
		color: #333333;
	}

	.businessListTxt image {
		width: 35upx;
		height: 35upx;
		vertical-align: middle;
		margin: 0 10upx 4upx 0;
	}
</style>
