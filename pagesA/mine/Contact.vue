<template>
	<div class="service-box">
		<div class="service-zi">
			<div class="Qr-code">
				<div>
					<img src="/static/img/logo@2x.png" alt />
				</div>
			</div>
			<ul>
				<li>
					<span class="one-list">软件版权</span>
					<span class="two-list">{{dataobject.copyright}}</span>
				</li>
				<li @click="tell(dataobject.phone)">
					<span class="one-list">客服电话</span>
					<span class="two-list">{{dataobject.phone}}</span>
				</li>
				<li @click="tell(dataobject.company)">
					<span class="one-list">入驻咨询</span>
					<span class="two-list">{{dataobject.company}}</span>
				</li>

				<li>
					<span class="one-list">微信号</span>
					<span class="two-list">{{dataobject.wx}}</span>
				</li>

				<li>
					<span class="one-list">投诉电话</span>
					<span class="two-list">{{dataobject.complaint}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Request from '@/common/js/request';

	export default {
		data() {
			return {
				dataobject: {
					copyright: "", // 版权
					phone: "", // 电话
					wx: "", // 微信
					company: "", // 入驻咨询
					complaint: "" //投诉电话'
				}
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			 async loadData() {
				 const res=await this._reqw.ipost({}, 'customer');
				 if(res.result != 0){
					 this.$api.tip(res.resultNote);
					 return
				 }
				 this.dataobject=res;
			},
			tell(phone) {
				this.$api.callPhone(phone)
			}
		}
	};
</script>

<style scoped lang="scss">
	.service-zi,
	// padding: 72px 10px 0;
	.Qr-code {
		div {

			width: 300upx;
			margin: 120upx auto;
			text-align: center;
		}

		img {
			width: 200upx;
			height: 200upx;
		}
	}

	li {
		line-height: 80upx;
		padding: 0 20upx;
		display: flex;
		justify-content: space-between;
		position: relative;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.one-list {
		// font-weight: 500;
		color: #666666;
	}

	.two-list {
		color: #333333;
		// font-weight: 600;
	}
</style>
