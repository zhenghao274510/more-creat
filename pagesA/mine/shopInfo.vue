<template>
	<div class="rescenter">
		<div class="res-container">
			<div class="persion top">
				<ul class="upimg" @click="upFile(2)">
					<li>
						<div>
							<img :src="logo" class="img" />
						</div>
						<p>{{text}}招牌</p>
					</li>
				</ul>
			</div>

			<ul class="star">
				<li>
					<span>{{text}}名称：</span>
					<input type="text" v-model="title" placeholder="请输入店铺名称" />
				</li>
				<li @click="choseCity(0)">
					<span>所在城市：</span>
					<text>{{city}}</text>
				</li>
				<li>
					<span>{{text}}地址：</span>
					<input type="text" v-model="address" placeholder="请输入店铺名称" />
				</li>
				<li>
					<span>商家分类：</span>
					<text>{{categoryName}}</text>
				</li>
				<li >
					<span>姓名：</span>
					<input type="text" v-model="username" placeholder="请输入您的真实姓名" />
				</li>
				<li>
					<span>联系电话：</span>
					<text>{{phone}}</text>
				</li>
				<li>
					<span>身份证号：</span>
				<input type="idcard" v-model="idcard" placeholder="请输入您的身份证号" />
				</li>
				<li>
					<span>账号状态：</span>
					<text v-if="state==0">正常</text>
					<text v-else>禁用</text>
				</li>
			</ul>
			<div class="persion">
				<h4>证件照片</h4>
				<ul class="upimg">
					<li v-for="(v,k) in cardImages" :key='k' @click="upFile(k)">
						<div>
							<img class="img" :src="v"></img>
						</div>
					</li>
				</ul>
			</div>
			<div class="persion">
				<h4>营业证照:</h4>
				<ul class="upimg" @click="upFile(3)">
					<li >
						<div>
							<img class="img" :src="license" />
						</div>
					</li>
				</ul>
			</div>
			<div class="button" @click="sub"><span>提交</span></div>
		</div>
	</div>
</template>

<script>
	//import 《组件名称》 from '《组件路径》';
	import bassUrl from '@/common/js/config.js'
	import QQMapWX from "@/common/js/qqmap-wx-jssdk";
	export default {
		data() {
			return {
				title: '',
				categoryName: '',
				categoryId:'',
				logo: '',
				city: '',
				address: '',
				username: '',
				phone: '',
				idcard: '',
				lon:"", //    经度  
				lat:"", //    纬度   
				cardImages: [],
				license: '',
				text: '',
				state:'',
				type:'',
				partner:''
			}
		},
		onLoad(options) {
			this.type = options.type;
			let title;
			if (this.type == 1 || this.type == 2) {
				this.text = '店铺';
				
			} else if (this.type == 3) {
				this.text = '餐厅'
			} else if (this.type == 4) {
				this.text = '酒店'
			}
			this.loadData();
		},
		methods: {
			choseCity() {
				if (this.type!=5&&this.type!=6) {
					this.$api.navTo(`/pages/tabbar/position?type=${this.type}`)
				} else{
					this.$refs.shopClass.show();
				}
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
			onConfirm(e) {
				this.city = e.label;
				console.log(e)
			},
			loadData() {
				let parmas = {
					uid: uni.getStorageSync('uid'),
					type:this.type-0
				}
				this._reqw.ipost(parmas, 'joinInfo').then(res => {
					console.log(res);
					res.result == 0 ? (
						this.title = res.title,
						this.categoryName = res.categoryName,
						this.logo = res.logo,
						this.city = res.city,
						this.lat=res.lat,
						this.lon=res.lon,
						this.address = res.address,
						this.username = res.username,
						this.phone = res.phone,
						this.idcard = res.idcard,
						this.cardImages = res.cardImages,
						this.license = res.license,
						this.state=res.state,
						this.getShopClass()
					) : this.$api.tip(res.resultNote)
				}).catch(err => {})
			},
			getShopClass() {
				this._reqw.ipost({
					type: this.type
				}, 'shopCategoryList').then(res => {
					console.log(res)
					res.result == 0 ?res.dataList.forEach(item=>{item.title==this.categoryName?this.categoryId=item.categoryId:''}) : this.$api.tip(res.resultNote)
				}).catch(err => {})
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
				} else {
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
						type:this.type
					}
					this._reqw.ipost(parmas, 'addShop').then(res => {
						res.result == 0 ? (this.$api.tip('提交成功！'), setTimeout(() => {
							this.$api.back()
						}, 30)) : this.$api.tip(res.resultNote)
					}).catch(err => {})
				}
			
			},
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
