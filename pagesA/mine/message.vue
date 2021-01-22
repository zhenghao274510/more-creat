<template>
	<view class="index">
		<!-- 数据列表 -->
		<view class="list-box">
			<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true">
				<uni-swipe-action class="uni-second-list">
					<uni-swipe-action-item  :right-options="options" @click="onClick" @change="change($event,index)"
					 v-for="(item,index) in dataList" :key="index">
						<view class="now-message-info" hover-class="uni-list-cell-hover" @click="getDetail(item)">
							<view class="icon-left">
								<image src="/static/img/xiaoxi@2x.png" mode="" class="img"></image>
							</view>
							<view class="uni-flex-item">
								<view class=" list-right">
									<view class="list-title" v-if="item.title">{{item.title}}</view>
									<view class="list-right-1">
										{{item.createDate | fromData}}
									</view>
								</view>
								<view class="list-detail">{{item.content}}</view>
								
							</view>
							
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</s-pull-scroll>
		</view>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				itemId: '',
				dataList: []
			};
		},
		onLoad() {
			this.refresh();
		},
		filters:{
			fromData(val){
				return val.split(' ')[0]
			}
		},
		methods: {
			change(e, k) {
				console.log(e, k);
				let item = this.dataList[k];
				this.itemId = item.msgId;
			},
			refresh() {
				this.$nextTick(() => {
					this.$refs.pullScroll.refresh();
				});
			},
			pullDown(pullScroll) {
				setTimeout(() => {
					this.loadData(pullScroll);
				}, 200)
			},
			async loadData(pullScroll) {
				if (pullScroll.page == 1) {
					this.dataList = [];
				}
				let parmas = {
					uid: uni.getStorageSync('uid'),
					pageNo: pullScroll.page,
					pageSize: '10'
				}
				console.log(parmas);
				const res = await this._reqw.ipost(parmas, 'msgList');
				if (res.result != 0) {
					this.$api.tip(res.resultNote)
					return
				}
				const curList = [];
				res.dataList.length == 0 ? (pullScroll.empty()) : res.dataList.forEach(item => {
						curList.push(item)
					}), this.dataList = this.dataList.concat(curList), pullScroll.page >= res.totalPage ? pullScroll.finish() :
					pullScroll.success()
			},
			getDetail(e) {
				// "type":"",// 类型 1订单 2富文本
				// "bind":"",//订单ID或富文本链接
				console.log('查看详情')
				if (e.type == 1) {
					this.$api.navTo(`/pagesD/order/orderDetails?id=${e.bind}`)
				} else {
					this.$api.navTo(`/pages/tabbar/newwebview?url=${e.bind}`)
				}
			},
			// 删除
			onClick() {
				let self = this
				console.log('点击删除')
				uni.showModal({
					title: '',
					content: '确定要删除该信息吗？',
					confirmText: '删除',
					confirmColor: '#ff3b32',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
							let parmas = {
								uid:uni.getStorageSync('uid'),
								msgId: self.itemId
							}
							self._reqw.ipost(parmas, 'delMsg').then(res => {
								res.result == 0 ? (self.refresh(), self.$api.tip('操作成功')) : self.$api.tip(res.reultNote)
							}).catch(err => {})
						}
					}
				});
			}
		}
	};
</script>

<style scoped>
	page {
		height: 100%;
		background: #F8F8F8;
	}

	.list-box {
		/* padding: 20upx 0; */
	}
	.slide_list {
		height: 160upx;
	}

	.now-message-info {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		font-size:30upx;
		height: 160upx;
		padding: 0 30upx;
		background: #FFFFFF;
	}
	.icon-left {
		width: 100upx;
		height: 100upx;
		line-height: 100upx;
	}

	.icon-left .img {
		width: 100upx;
		height: 100upx;
	}

	.list-right {
		margin-left: 25upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.list-right-1 {
		color: #A9A9A9;
	}

	.list-title {
		width: 350upx;
		line-height: 1.5;
		overflow: hidden;
		color: #333;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.list-detail {
		font-size:26upx;
		padding: 20upx 0 20upx 20upx ;
		color: #a9a9a9;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.button-box {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		z-index: 998;
		background: #F8F8F8;
	}

	.btn-sub {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		float: left;
		width: 100%;
		height: 100upx;
		background: #F8F8F8;
		color: #7fb2ff;
	}

	.btn-plusempty {
		width: 110upx;
		height: 110upx;
		background: #007bfa;
		position: fixed;
		bottom: 50upx;
		right: 20upx;
		border-radius: 100%;
		overflow: hidden;
		text-align: center;
		line-height: 110upx;
	}

	.empty {
		color: #999999;
	}

	.plusempty-img {
		width: 50upx;
		height: 50upx;
		margin-top: 30upx;
	}

	.scan-box {
		display: block;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 99999;
	}

	.scan-item {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		position: relative;
		margin: 0 auto;
		width: 80%;
		height: 100%;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		opacity: 1;

	}

	.scan-content {
		position: relative;
		width: 400upx;
		height: 500upx;
		background: #FFFFFF;
		border-radius: 20upx;
	}

	.scan-icon {
		position: absolute;
		top: -50upx;
		left: 150upx;
		width: 100upx;
		height: 100upx;
		border-radius: 100%;
		box-sizing: border-box;
		background: #FFFFFF;
		padding: 20upx;
	}

	.scan-icon-img {
		width: 100%;
		height: 100%;
	}

	.scan-text {
		position: absolute;
		bottom: 40upx;
		left: 0;
		width: 100%;
		text-align: center;
		font-size: 14px;
	}

	.scan-share {
		width: 100%;
		height: 100%;
	}

	.scan-img {
		width: 300upx;
		height: 300upx;
		margin: auto;
		display: block;
		position: absolute;
		top: 80upx;
		left: 50upx;
		z-index: 99;
	}

	.scan-btn {
		top: -30upx;
		left: auto;
		right: -30upx;
		bottom: auto;
		position: absolute;
		width: 64upx;
		height: 64upx;
		border-radius: 50%;
		z-index: 99999;
		display: flex;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}

	.bottom-btn-hover {
		background: #0564c7 !important;
		;
	}
</style>
