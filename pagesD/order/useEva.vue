<template>
	<view class="content">
		<block v-for="(item,index) in order.itemList" :key="index">
			<view class="order-info-product">
				<view class="product-image">
					<image :src="item.productLogo" mode="scaleToFill"></image>
				</view>
				<view class="info-product">
					<view class="info-title">{{ item.productTitle}}</view>
					<sx-rate :value="item.productScore" @change="changeOrder" :current="index" style="margin-top: 20upx;"></sx-rate>
				</view>
			</view>
			<view class="eva-content">
				<textarea value="" placeholder="请输入您的评价" class="textarea" v-model="item.content" />
				<view class="img-list">
					<view class="img" @click="uploads(index)" v-if="item.imgList.length<3">
						<image src="/static/img/paizhao2@2x.png" mode="scaleToFill"></image>
					</view>
					<view class="img" v-for="(v, k) in item.imgList" :key="k" @click="seeDetails(index,k)">
						<image :src="v" mode="scaleToFill"></image>
					</view>
				</view>
			</view>
		</block>
		<view class="server-val">
			<text class="server-class" style="color: #111111;font-weight: bold;">店铺评分：</text>
		</view>
		<view class="server-val">
			<text class="server-class">店铺服务：</text>
			<sx-rate :value="shopVal" @change="changShop"></sx-rate>
			
		</view>
		<view class="server-val">
			<text class="server-class">物流评分：</text>
			<sx-rate :value="servceVal" @change="changPerson"></sx-rate>
		</view>
		<view class="footer-btn" hover-class="btn-hover" @click.stop="sub">提 交</view>
	</view>
</template>

<script>
	import sxRate from '@/components/uni-rate/uni-rate.vue';
	import bassUrl from "@/common/js/config.js"
	export default {
		data() {
			return {
				shopVal: 5,
				servceVal: 5,
				orderId: '',
				order: {
					itemList: []
				}
			};
		},
		components: {
			sxRate
		},
		onLoad(options) {
			this.orderId = options.id;
			this.loadData();
		},
		methods: {
			changeOrder(e) {
				console.log(e);
				let n=e.index;
				this.order.itemList[n].productScore=e.value;
			},
			changShop(e) {
				this.shopVal=e.value;
			},
			changPerson(e) {
				console.log(e);
				this.servceVal=e.value;
			},
			uploads(k){
					let that = this;
					uni.chooseImage({
						count: 3-that.order.itemList[k].imgList.length, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: function(res) {
							console.log(res);
							res.tempFiles.forEach(item=>{
								that.formImg(item,k)
							})
					
					}
				})
			},
			formImg(res,k){
					console.log(res);
					this._reqw
						.iupfile(res)
						.then(res => {
							console.log(res);
							let r = JSON.parse(res);
							r.result == 0 ? (this.order.itemList[k].imgList.push(bassUrl.bass+r.url)) : this.$api.tip(r.resultNote);
						})
						.catch(err => {});
				},
				sub(){
					let items = [];
					this.order.itemList.forEach((item,index)=>{
						items.push({
							itemId:item.itemId,	
							productScore:item.productScore,	
							content:item.content,
							images:item.imgList.join('|')
						})
					})
					let parmas = {
						uid: getApp().globalData.uid,
						orderId: this.orderId,
						shopScore: this.shopVal,
						logisticsScore:this.servceVal,
						items: items
					};
					console.log(parmas);
					this._reqw
						.ipost(parmas, 'addOrderComment')
						.then(res => {
							res.result==0?
								(this.$api.tip('提交成功!'),
									setTimeout(() => {
										this.$api.back();
									}, 300)) :
								this.$api.tip(res.resultNote);
						})
						.catch(err => {});
				},
				loadData() {
					let parmas = {
						orderId: this.orderId
					};
					this._reqw
						.ipost(parmas, 'orderDetail')
						.then(res => {
							res.result == 0 ? (res.itemList.forEach(item=>{item.productScore=5,item.imgList=[],item.content=''}),this.order=res) : this.$api.tip(res.resultNote);
						})
						.catch(err => {});
				},
				seeDetails(k,ind){
					
				}
			}
			

	}
</script>

<style scoped lang="scss">
	button {
		background-color: none;
		border: none;
	}

	.content {
		padding: 15px;
	}

	.eva-content {
		width: 100%;
		background-color: #F8F9FB;
		margin: 20px 0;
	}

	.server-val {
		display: flex;
		align-items: center;
		padding: 10px 0;
	}

	.server-class-title {
		font-weight: bold;
		color: rgba(17, 17, 17, 1);
		line-height: 40px;
		font-size: 28upx;
	}

	.server-class {
		font-size: 24upx;
		color: #6d6c6c;
		margin-right: 10px;
	}

	.order-info-product {
		display: flex;
		align-items: center;
		border-radius: 2px;
		padding: 7px 14px;

		.product-image {
			width: 60px;
			height: 68px;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-product {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-left: 10px;

			.info-title {
				color: #6d6c6c;
				font-size: 13px;
				height: 100%;
				line-height: 100%;
			}
		}
	}

	.footer-btn {
		width: 260px;
		height: 44px;
		background: $page-color-light;
		box-shadow: 0px 1px 4px 0px $page-color-light;
		border-radius: 22px;
		margin: 50px auto 0;
		font-size: 17px;
		color: #ffffff;
		font-weight: bold;
		text-align: center;
		line-height: 44px;
	}

	.textarea {
		padding: 10px;
		width: 100%;
		height: 80px;
		box-sizing: border-box;
		border-radius: 4px;
		font-size: 11px;
		border-radius: 2px;
		color: #a4a4a5;
	}

	.img-list {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		padding: 10px 0;
		// height: ;

		.img {
			width: 160upx;
			padding: 0 20upx;
			height: 160upx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
