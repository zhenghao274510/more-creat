<template>
	<view class="uni-searchbar">
		<view :style="{borderRadius:radius+'px',backgroundColor: bgColor}" class="uni-searchbar__box" @click="searchClick">
			<!-- #ifdef MP-ALIPAY -->
			<view class="uni-icon uni-icon-search">

			</view>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<view class="uni-icon uni-icon-search" :style="{'color':fontColor}">

			</view>
			<!-- #endif -->
			<input v-if="showSync" :focus="showSync"  :placeholder="placeholder" confirmType='search' :maxlength="maxlength"  @confirm="confirm"   class="uni-searchbar__box-search-input"
			 confirm-type="search" type="text" v-model="searchVal" />
			<text v-else class="uni-searchbar__text-placeholder" :style="{'color':fontColor}">{{ placeholder }}</text>
			<view v-if="show && (clearButton==='always'||clearButton==='auto'&&searchVal!=='')" class="uni-searchbar__box-icon-clear"
			 @click="clear">
				<!-- <uni-icons color="#999999" class="" size="24" type="clear" /> -->
				<view class="uni-icon uni-icon-close" v-if="show && (clearButton==='always'||clearButton==='auto'&&searchVal!=='')" @click="clear">
				
				</view>
			</view>
		</view>
		<!-- <text @click="cancel" class="uni-searchbar__cancel" v-if="cancelButton ==='always' || show && cancelButton ==='auto'">{{cancelText}}</text> -->
	</view>
</template>

<script>
	import uniIcons from "../uni-icons/uni-icons.vue";
	export default {
		name: "UniSearchBar",
		components: {
			uniIcons
		},
		props: {
			type:{
				type:[Number,String],
				default:0
			},
			placeholder: {
				type: String,
				default: "请输入搜索内容"
			},
			radius: {
				type: [Number, String],
				default: 5
			},
			clearButton: {
				type: String,
				default: "auto"
			},
			cancelButton: {
				type: String,
				default: "auto"
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			fontColor: {
				type: String,
				default: "#888888"
			},
			bgColor: {
				type: String,
				default: "#FFFFFF"
			},
			maxlength: {
				type: [Number, String],
				default: 100
			}
		},
		data() {
			return {
				show: false,
				showSync:false,
				searchVal: ""
			}
		},
		watch: {
			searchVal() {
				this.$emit("input", {
					value: this.searchVal
				})
			},
			showSync(n){
				console.log(n)
				n?this.show=true:this.show=false;
			}
		},
		methods: {
			searchClick() {
				if(uni.getStorageSync('uid')){
					if(this.type==0){
						if (this.show) {
							return
						}
						this.searchVal = ""
						this.show = true;
						this.$nextTick(() => {
							this.showSync = true;
						})
					}else if(this.type==1){
						this.$api.navTo(`/pages/search/search`)
					}else {
						this.$api.back()
					}
				}else{
					this.$api.navTo("/pages/author")
				}
				
			},
			keyboardheightchange(){
				
			},
			clear() {
				this.searchVal = "";
				this.$emit("clear");
			},
			cancel() {
				this.$emit("cancel", {
					value: this.searchVal
				});
				this.searchVal = ""
				this.show = false
				// #ifndef APP-PLUS
				uni.hideKeyboard()
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
			},
			confirm() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				this.searchVal==''?this.$api.tip('请输入搜索内容!'):
				this.$emit("confirm", {
					value: this.searchVal
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	$uni-searchbar-height: 72upx;
    .uni-icon-search{
		margin-left: 20upx;
	}
	.uni-icon{
		font-size: 36upx;
		color: #999999;
	}

	.uni-searchbar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		position: relative;
		padding: $uni-spacing-col-base;
	}

	.uni-searchbar__box {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		overflow: hidden;
		position: relative;
		flex: 1;
		// justify-content: center;
		flex-direction: row;
		align-items: center;
		height: $uni-searchbar-height;
		padding: 10upx 16upx 10upx 30upx;
		// border-width: 0.5px;
		// border-style: solid;
		// border-color: $uni-border-color;
	}

	.uni-searchbar__box-icon-search {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 64upx;
		justify-content: center;
		align-items: center;
		color:#888888;
	}

	.uni-searchbar__box-search-input {
		flex: 1;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		padding-left: 40upx;
	}

	.uni-searchbar__box-icon-clear {
		align-items: center;
		line-height: 48upx;
		padding-left: 10upx;
	}

	.uni-searchbar__text-placeholder {
		font-size: $uni-font-size-base;
		color: $uni-text-color-placeholder;
		margin-left: 10upx;
	}

	.uni-searchbar__cancel {
		padding-left: 20upx;
		line-height: $uni-searchbar-height;
		font-size: 28upx;
		color: $uni-text-color;
	}
</style>
