<template>
	<view class="content">
		<block v-for="(v, k) in dataObj.itemList" :key="k">
			<view class="uni-second-list" v-if="k==0">
				<view class="uni-second">
					<view class="image-second">
						<image class="uni-second-image" :src="v.productLogo"></image>
					</view>
					<view class="uni-second-title">{{ v.productTitle }}</view>
				</view>
			</view>
		</block>
		<view class="uni-second-price">
			<view class="">退款金额</view>
			<view class="">￥{{dataObj.amount}}</view>
		</view>
		<view class="tui-inter">
			<view class="inter-title">申请原因</view>
			<textarea placeholder="请填写退款说明" v-model="content"></textarea>
		</view>
		<view class="tui-inter">
			<view class="inter-title">上传凭证(最多上传3张)</view>
			<view class="img-list">
				<view class="img" @click="uploads" v-if="imgList.length<3">
					<image src="/static/img/shangchuandianpu@2x.png" mode="scaleToFill"></image>

				</view>
				<view class="img" v-for="(v, k) in imgList" :key="k">
					<image src="/static/img/guanbi@2x.png" mode="" class="del-icon" @click="delImg(k)"></image>
					<image :src="v" mode="scaleToFill"></image>
				</view>
			</view>
		</view>
		<view class="btn" @click="SubChange">提交</view>
	</view>
</template>

<script>
	import bassUrl from "@/common/js/config.js"
	export default {
		data() {
			return {
				active: 1,
				imgList: [],
				id: '',
				dataObj: {
					orderId: '',
					adtime: '',
					name: '',
					phone: '',
					address: '',
					itemList: [{
						itemId: "", // 订单项ID
						productTitle: "", // 商品名称
						productLogo: "" // 商品图片

					}]
				},
				content: ''
			};
		},
		onLoad(options) {
			this.dataObj = JSON.parse(options.id);
			console.log(this.dataObj)
		},
		methods: {
			uploads() {
				console.log('上传');
				let that = this;
				uni.chooseImage({
					count: 3-that.imgList.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						// tempFilePath可以作为img标签的src属性显示图片
						console.log(res);
						res.tempFiles.forEach(item => {
							that.formImg(item)
						})
					}
				})
			},
			delImg(k) {
				this.imgList.splice(k,1)
			},
			formImg(res) {
				console.log(res);
				this._reqw
					.iupfile(res)
					.then(res => {
						console.log(res);
						let r = JSON.parse(res);
						r.result == 0 ? (this.imgList.push(bassUrl.bass + r.url)) : this.$api.tip(r.resultNote);
					})
					.catch(err => {})
			},
			SubChange() {
				let parmas = {
					uid:getApp().globalData.uid,
					orderId: this.dataObj.orderId,
					content: this.content,
					images: this.imgList.join('|')
				};
				console.log(parmas)
				this.content == '' ?
					this.$api.tip('请输入相关说明') :
					this.imgList.length == 0 ?
					this.$api.tip('请上传相关凭证!') :
					this._reqw
					.ipost(parmas, 'addRefundOrder')
					.then(res => {
						res.result == 0 ?
							(this.$api.tip('提交成功!'),
								setTimeout(() => {
									this.$api.back();
								}, 300)) :
							this.$api.tip(res.resultNote);
					})
					.catch(err => {});
			}
		}

	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0 20px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.uni-second-price {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.img-list {
		display: flex;
		width: 100%;
		flex-wrap: wrap;

		.img {
			width: 160upx;
			padding: 0 20upx;
			height: 160upx;
			position: relative;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.tui-inter {
		margin: 10px 0;
	}

	.inter-title {
		line-height: 30px;
		color: #333333;
	}

	.uni-second-title {
		margin-left: 20upx;
	}

	.uni-second-list-top {
		display: flex;
		height: 40px;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 0 5px;
		border-radius: 10px 10px 0 0;
	}

	.uni-second-list {
		display: flex;
		width: 100%;
		margin: 0 auto;
		margin-bottom: 10px;
		flex-direction: column;
		background: #fff;
		border-radius: 0 0 10px 10px;
	}

	.uni-second {
		padding: 20upx;
		display: flex;
	}

	.image-second {
		height: 180upx;
		width: 180upx;
		margin: 12upx 0;
	}

	.uni-second-image {
		height: 180upx;
		width: 180upx;
	}

	.uni-second-title {
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		color: #333333;
	}

	.uni-second-price {
		flex: 1;
		margin-top: 10upx;
		font-size: 28upx;
		position: relative;
	}
	.uni-second-price-favour {
		color: #888888;
		text-decoration: line-through;
		margin-left: 10upx;
	}

	.del-icon {
		width: 40upx !important;
		height: 40upx !important;
		position: absolute;
		top: 0;
		right: 0;
		transform: translateY(-50%);
	}

	.btn {
		width: 400upx;
		margin: 0 auto;
		margin-top: 40upx;
		height: 40px;
		line-height: 40px;
		text-align: center;
		color: #fff;
		border-radius: 22px;
		font-size: 18px;
		background-color: #ff3333;
	}
</style>
