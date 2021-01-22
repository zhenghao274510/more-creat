<template>
	<view class="">
		<empty v-if="dataList.length==0"></empty>
		<block v-for="(v,k) in dataList" :key="k">
			<view class="con" @click="chosePart(v)">
				<view class="left">
					<view class="left-end">{{v.username}}</view>
				</view>
				<view class="right" style="color: #FF4848;">{{v.phone}}</view>
			</view>
		</block>
		<uni-load-more :status="status" v-if="dataList.length!=0"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import empty from '@/components/mycom/empty.vue'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				page: 1,
				totalPage: 1,
				dataList: [],
				status: 'loading',
				city:''
			}
		},
		onReachBottom() {
			this.totalPage > this.page ? (this.page += 1, this.loadData()) : setTimeout(() => {
				this.status = "noMore"
			}, 300)
		},
		onLoad(options) {
			this.city=options.id;
			this.loadData()
		},
		methods: {
			loadData() {
				let parmas = {
					city:this.city,
					pageNo: this.page,
					pageSize: '10'
				}
				console.log(parmas)
				this._reqw.ipost(parmas, 'partnerList').then(res => {
					res.result == 0 ? ((res.totalPage == 1 ? this.status = 'noMore' : this.status = 'more'), this.totalPage = res.totalPage,
						res.dataList.forEach(item => {
							this.dataList.push(item)
						})) : this.$api.tip(res.resultNote)
				}).catch(err => {})
			},
			chosePart(e){
				this.$api.prePage().partnerId=e.partnerId;
				this.$api.prePage().partners=e.username;
				setTimeout(()=>{
					this.$api.back();
				})
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.con {
		/* width: 100%; */
		padding:40upx 20upx ;
		// height: 100upx;
		margin-bottom: 20upx;
		border-bottom: 1px solid #F8F8F8;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left {
			.left-top {
				color: #1A1a1a;
				font-size: 32upx;
			}

			.left-end {
				color: #C8C7CC;
			}
		}

		.right {
			font-size: 32upx;
			font-weight: bold;
		}

		.one {
			color: $page-color-light;
		}
	}
</style>
