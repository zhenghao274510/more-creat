<template>
	<div class="rescenter">
		<div class="res-container">
			<div class="persion top">
				<ul class="upimg">
					<li @click="upFile(2)">
						<div>
							<img :src="logo" alt v-if="logo != ''" class="img" />
							<img class="img" src="/static/img/shangchuandianpu@2x.png" v-else></img>
						</div>
						<p>上传店铺招牌</p>
					</li>
				</ul>
			</div>

			<ul class="star">
				<li>
					<span>店铺名称：</span>
					<input type="text" v-model="title"  placeholder="请输入店铺名称" />
				</li>
				<li @click="choseCity(0)">
					<span>请选择所在城市：</span>
					<div style="display: flex;align-items: center;">
						<span style="color: #999999;font-weight: 500" v-if="city==''">请选择</span>
						<span style="color: #999999;font-weight: 500" v-else>{{city}}</span>
						<view class="iconfont icon-youjiantou"></view>
					</div>
				</li>
				<li>
					<span>店铺地址：</span>
					<div style="display: flex;align-items: center;">
						<input type="text" v-model="address" placeholder="请输入店铺地址" />
						<view class="iconfont icon-youjiantou"></view>
					</div>
				</li>
				<li @click="choseCity(1)">
					<span>选择商家分类：</span>
					<div style="display: flex;align-items: center;">
						<span style="color: #999999;font-weight: 500;">{{classFify}}</span>
						<view class="iconfont icon-youjiantou"></view>
					</div>
				</li>
				<li>
					<span>法人姓名：</span>
					<input type="text" v-model="username" placeholder="请输入您的真实姓名" />
				</li>
				<li>
					<span>联系电话：</span>
					<input type="number" v-model="phone" placeholder="请输入您的联系方式" />
				</li>
				<li>
					<span>邀请码：</span>
					<input type="number" v-model="inviteCode" placeholder="请输入邀请码 ( 选填 ) " />
				</li>
				<li>
					<span>身份证号：</span>
					<input type="idcard" v-model="idcard" placeholder="请输入您的身份证号" />
				</li>
			</ul>
			<div class="persion">
				<h4>证件照片</h4>
				<ul class="upimg">
					<li @click="upFile(0)">
						<div>
							<img class="img" src="/static/img/shangchuanshenfenz@2x.png" v-if="faceImg==''"></img>
							<img class="img" :src="faceImg" v-else></img>

						</div>
						<p>身份证正面</p>
					</li>
					<li @click="upFile(1)">
						<div>
							<img class="img" src="/static/img/shangchuanshenfenz@2x.png" v-if="backImg==''"></img>
							<img class="img" :src="backImg" v-else></img>
						</div>
						<p>身份证反面</p>
					</li>
				</ul>
			</div>
			<div class="persion">
				<h4>营业证照:</h4>
				<ul class="upimg">
					<li @click="upFile(3)">
						<div>
							<img class="img" :src="license" alt v-if="license != ''" />
							<img class="img" src="/static/img/shangchuanyingyezhizhao@2x.png" v-else></img>
						</div>

						<p>营业证照正面</p>
					</li>
				</ul>
			</div>
			<div class="green" style="margin-top:10px;">
				<div class="choose" @click="changChoose">
					<view class="iconfont icon-circle" v-if="!check"></view>
					<view class="iconfont icon-xuanzhong" style="color: #ff4848;" v-else></view>
				</div>
				<p>我已同意</p>
				<i class="greenxieyi" @click="xie">《用户协议》</i>
			</div>
			<div class="button" @click="sub"><span>提交</span></div>
			<city-picker ref="picker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#038980'
			 @onCancel="onCancel"></city-picker>
			<lb-picker :list="shopList"  model='multiSelector' level='1' ref="shopClass" :props="myProps" @confirm="choseShopClass"></lb-picker>
		</div>
	</div>
</template>

<script>
	//import 《组件名称》 from '《组件路径》';
	import bassUrl from '@/common/js/config.js'
	import cityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import LbPicker from '@/components/lb-picker'
	import QQMapWX from "@/common/js/qqmap-wx-jssdk";
	export default {
		data() {
			return {
				check: false,
				myProps: {
					label: 'title',
					value: 'categoryId'
				},
				title: '',
				classFify:'请选择',
				logo: '',
				city: '',
				address: '',
				lon: '',
				lat: '',
				categoryId: '',
				username: '',
				phone: '',
				idcard: '',
				pickerValueDefault: [0, 0],
				cityPickerValueDefault: [0, 0, 0],
				cardImages: [],
				faceImg: '',
				backImg: '',
				shopList: [],
				license: '',
				inviteCode: '',
				qqMapSdk: ''
			}
		},
		onLoad(options) {
			this.type = options.type;
			this.qqMapSdk = new QQMapWX({
				key: "GQZBZ-3CECD-BP443-PBQEY-4R3M6-QMFBO"
			});
			this.getShopClass()
		},
		components: {
			cityPicker,
			LbPicker
		},
		methods: {
			getShopClass() {
				this._reqw.ipost({
					type: 1
				}, 'shopCategoryList').then(res => {
					console.log(res)
					res.result == 0 ? this.shopList =res.dataList  : this.$api.tip(res.resultNote)
				}).catch(err => {})
			},
			choseCity(type) {
				if (type == 0) {
				this.$api.navTo('/pages/tabbar/position?type=1')
				} else if (type == 1) {
					this.$refs.shopClass.show();
				}
			},
			onConfirm(e) {
				this.city = e.label;
				console.log(e)
			},
			choseShopClass(e) {
				let text=[],len=e.value.length;
				this.categoryId=e.value[len-1];
				e.item.forEach(item=>{
					text.push(item.title)
				})
				this.classFify=text.join('-');
			},
			changChoose() {
				this.check = !this.check;
			},
			upFile(type) {
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: function(res) {
						console.log(res);
						that._reqw
							.iupfile(res.tempFiles[0])
							.then(res => {
								console.log(res);
								let r = JSON.parse(res);
								r.result == 0 ? that.formImg(r.url, type) : that.$api.tip(r.resultNote);
							})
							.catch(err => {});
					}
				})
			},
			formImg(url, type) {
				let a = bassUrl.bass + url
				switch (type) {
					case 0:
						this.faceImg = a;
						this.$set(this.cardImages, 0, a);
						break;
					case 1:
						this.backImg = a;
						this.$set(this.cardImages, 1, a);
						break;
					case 2:
						this.logo = bassUrl.bass + url;
						break;
					case 3:
						this.license = bassUrl.bass + url;
						break;
				}
			},
			sub() {
				if (this.city == '') {
					this.$api.tip('请选择所在城市!')
				} else if (this.address == '') {
					this.$api.tip('请输入详细地址!')
				} else if (this.title == "") {
					this.$api.tip('请输入店铺名称!')
				} else if (this.logo == '') {
					this.$api.tip('请上传店铺招牌!')
				} else if (this.categoryId == '') {
					this.$api.tip('请选择商家分类!')
				} else if (!this.$api.regName) {
					this.$api.tip('请输入正确名称!')
				} else if (!this.$api.regPhone(this.phone)) {
					this.$api.tip('请输入正确的联系方式!')
				} else if (!this.$api.formCard(this.idcard)) {
					this.$api.tip('身份证号码格式不对!请确认')
				} else if (this.cardImages.length < 2) {
					this.$api.tip('请完善身份证照信息!')
				} else if (this.license == '') {
					this.$api.tip('请上传营业资质!')
				} else if(!this.check){
					this.$api.tip('请勾选用户协议!')
				}else{
					let parmas = {
						uid: uni.getStorageSync('uid'),
						title: this.title,
						logo: this.logo,
						city: this.city,
						address: this.address,
						lon: this.lon,
						lat: this.lat,
						categoryId: this.categoryId,
						username: this.username,
						phone: this.phone,
						idcard: this.idcard,
						cardImages: this.cardImages.join('|'),
						license: this.license,
						inviteCode: this.inviteCode,
						type: 1
					}
					this._reqw.ipost(parmas, 'addShop').then(res => {
						res.result == 0 ? (this.$api.tip('提交成功！请耐心等待。。'), setTimeout(() => {
							this.$api.back()
						}, 30)) : this.$api.tip(res.resultNote)
					}).catch(err => {})
				}

			},
			xie(){
				let url=bassUrl.bass+'/display/agreement?id=1'
				uni.setStorageSync('url',url);
				setTimeout(()=>{
					this.$api.navTo('/pages/tabbar/newwebview')
				},30)
			}
		}
	};
</script>
<style scoped lang="scss">
	.iconfont {
		color: #333333;
	}
	.noInverCode {
		color: #333333;
		font-size: 12px;
		line-height: 25px;
		margin: 10px 0;
		display: flex;
	}

	.top {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}


	.button {
		padding: 0 20px;
		box-sizing: border-box;
		margin: 50px 0;

		span {
			display: block;
			height: 40px;
			background: $page-color-light;
			border-radius: 20px;
			color: #fff;
			line-height: 45px;
			text-align: center;
			font-size: 17px;
		}
	}

	.res-container {
		.title {
			font-size: 16px;
			line-height: 43px;
			background: #fafafa;
			text-align: center;
			font-weight: bold;
		}

		.star {
			padding: 0 15px;

			.noplay {
				align-items: center;
				border-bottom: 1px solid #f0f0f0;
				height: 71px;

				span {
					display: block;
					line-height: 25px;
					font-size: 14px;
					color: #333333;
					font-weight: bold;
					margin-top: 10px;
				}

				input {
					height: 30px;
					font-size: 13px;
					color: #999999;
					margin-top: 10px;

				}
			}

			li {
				display: flex;
				align-items: center;
				justify-content: space-between;
				line-height: 45px;
				border-bottom: 1px solid #f0f0f0;
				position: relative;

				span {
					display: block;
					font-size: 14px;
					color: #333333;
					// font-weight: bold;
				}

				input {
					flex: 1;
					font-size: 13px;
					padding-left: 15px;
					color: #999999;
					text-align: right;
				}

				img {
					width: 15px;
					height: 20px;
					position: absolute;
					top: 10px;
					right: 0;
					z-index: 999;
				}
			}
		}

		.upimg {
			font-size: 0;
			background: #fff;
			display: flex;
			// padding: 15px 0;
			// border-bottom: 1px solid #cccccc;

			li {
				width: 200upx;
				padding-bottom: 10px;
				position: relative;
				margin-right: 10px;

				div {
					position: relative;
					width: 200upx;
					height: 200upx;

					.img {
						width: 200upx;
						height: 200upx;
					}
				}

				p {
					font-size: 13px;
					color: #333;
					text-align: center;
					margin-top: 10px; // width: 65px;
				}
			}
		}

		.green {
			display: flex;
			height: 25px;
			line-height: 25px;
			align-items: center;
			margin-top: 15px;
			font-size: 0;
			padding-left: 15px;

			.choose {
				margin-right: 10px;
			}

			.greenxieyi {
				color: $page-color-light;
				font-size: 14px;
				margin-left: 10px;
			}
		}
	}

	.persion {
		padding: 0 20px;

		h4 {
			margin-top: 10px;
			font-size: 14px;
			color: #333;
			line-height: 35px;
			// font-weight: bold;
		}
	}
</style>
