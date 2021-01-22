<template>
	<view class="s-page-wrapper">
		<view class="search-pop">
			<xfl-select :list="topList" :clearable="false" :listShow="false" :isCanInput="false" initValue="商品" :selectHideType="'hideAll'"
			 @change="changeChose"></xfl-select>
			<view class="top-input">
				<input type="text" value="" placeholder-style="color:#74738e;font-size:13px;" placeholder="请输入关键字" v-model="keywords" />
			</view>
			<view class="search-btn" @click="submitSearch">
				搜索
			</view>
		</view>
		<view class="search-cat">
			<view class="search-cat-tit"><text class="up-menu">搜索历史</text> <text @click="clear">清空</text></view>
			<view class="src-content">
				<view class="src-item " v-for="(v, k) in searchList" :key="k" @click="hostSearch(v)">
					{{ v }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import xflSelect from "@/components/xfl-select.vue"
	export default {
		data() {
			return {
				keywords: '',
				topList: [{value: '商品'},{value: '供应商'},{value: '餐厅'},{value: '酒店'}],
				current: 0,
				type:0,
				searchList: []
			};
		},
		components: {
			xflSelect
		},
		onShow() {
			uni.getStorageSync('historySearch') ? this.searchList = uni.getStorageSync("historySearch") : this.searchList = [];
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			changeChose(e) {
				this.type=e.index;
				console.log(e)
			},
			//  热门搜索
			loadData() {
				if (uni.getStorageSync("historySearch")) {
					this.searchList = uni.getStorageSync("historySearch")
				}
			},
			submitSearch(){
				for (let i in this.searchList) {
					if (this.searchList[i] == this.keywords) {
						this.searchList.splice(i, 1)
					}
				}
				this.keywords == "" ? this.$api.tip("请输入要搜索的内容!") : (this.searchList.length < 5 ? (this.searchList
					.unshift(this.keywords), uni.setStorageSync(
						"historySearch", this.searchList)) : (this.searchList.pop(), this.searchList.unshift(this.keywords), uni.setStorageSync(
					"historySearch", this.searchList)), this.$api.navTo(
					`/pagesC/search/search_list?id=${this.keywords}&type=${this.type}`))
			},
			clear() {
				this.searchList = [];
				uni.removeStorageSync("historySearch");
			},
			hostSearch(v){
				this.keywords=v;
				this.submitSearch();
			}

		},
		
		onHide() {
			this.keywords=''
		}
	};
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.help-tips {
		font-size: 13px;
		color: #999;
		line-height: 26px;
		padding: 0 0 0 30px;
		margin: 0;
		width: 80%;
		text-align: left;
	}

	.help-tips.color999 {
		color: #999999;
	}

	.search-pop {
		padding: 14px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top-input {
		flex: 1;
		margin-right: 20px;
		height: 30px;
		line-height: 30px;
		display: flex;
		padding-left: 20px;
		box-sizing: border-box;
		background: #FFF8F8;
		color: #74718c;
		align-items: center;
	}

	.top-inptu input {
		height: 100%;
	}

	.search-btn {
		width: 50px;
		height: 100%;
		color: #333333;
		font-size: 27upx;
	}

	.iconfont {
		margin-right: 10px;
	}

	.search-cat {
		padding: 40upx;
	}

	.search-cat .search-cat-tit {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.search-cat .search-cat-tit .up-menu {
		display: block;
		height: 20px;
		line-height: 20px;
		font-size: 0.9em;
		color: #111111;
	}

	.src-content {
		margin: 10px auto;
		display: flex;
		flex-wrap: wrap;
	}

	.src-item {
		border-radius: 22px;
		padding: 0 10px;
		height: 23px;
		line-height: 23px;
		background: #FFF8F8;
		margin: 10px 5px;
		position: relative;
		font-size: 13px;
		color: #000;
	}

	.clear-search {
		padding: 10px 0;
		text-align: center;
		font-size: 16px;
		color: #333;
	}
</style>
