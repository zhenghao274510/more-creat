<script>
	export default {
		globalData: {
			// a5421a3c4a9d426abea075fdad427e8c
			uid: '',
			id: '',
			type:1,
			tabIndex:0,
		},
		//页面中获取 和  更改
		onLaunch: function() {
			console.log('App Launch');
			uni.getSystemInfo({
				success(res) {
					console.log(res)
					uni.setStorageSync('screen', res)
				}
			})
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	@import './common/uni.css';

	/* 字体图标 */
	@font-face {
		font-family: "iconfont";
		src: url('./static/myicon/iconfont.ttf');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 32upx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #333333;
	}

	.icon-youjiantou:before {
		content: "\e61f";
	}

	.icon-dianpu:before {
		content: "\e7d6";
	}

	.icon-xiajiantou:before {
		content: "\e629";
	}

	.icon-shangjiantou:before {
		content: "\e62c";
	}

	.icon-dizhi3:before {
		content: "\e632";
	}

	.icon-circle:before {
		content: "\e80c";
	}

	.icon-shanchu:before {
		content: "\e611";
	}

	.icon-hezuohuoban:before {
		content: "\e74e";
	}

	.icon-xuanzhong:before {
		content: "\e639";
	}

	.icon-saoma:before {
		content: "\e637";
	}

	.icon-daohang:before {
		content: "\e624";
	}

	.icon-ziyuan:before {
		content: "\e649";
	}

	.icon-dizhi:before {
		content: "\e612";
	}

	.icon-phone:before {
		content: "\e50a";
	}

	.icon-zuo:before {
		content: "\e631";
	}

	.icon-yewuyuanguanli:before {
		content: "\e63a";
	}

	.icon-you:before {
		content: "\e610";
	}

	.icon-renzheng-:before {
		content: "\e60c";
	}

	.icon-xuanzhong1:before {
		content: "\e6a0";
	}

	.icon-bianji:before {
		content: "\e651";
	}

	.icon-baozheng:before {
		content: "\e73a";
	}

	.guge-price {
		font-size: 34upx;
		color: #FF4848;
		font-weight: bold;
	}

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		color: #333333;
	}

	.shopIcon {
		width: 30upx;
		height: 28upx;
		margin-right: 15upx;
	}

	.ql-container {
		min-height: 0;
		height: 160upx !important;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	view {
		-webkit-overflow-scrolling: touch;
	}
	.imgs {
		width: 100%;
		touch-action: none;
		height: 100%;
	}



	.btn-hover {
		opacity: 0.8;
	}

	.uni-second-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.uni-second-tip-two {
		color: #ff2f5c;
		padding: 0 5px;
		border-radius: 3px;
		border: 1px solid #ff2f5c;
		font-size: 10px;
	}

	.list-top {
		color: #151624;
		font-size: 15px;
		font-weight: bold;
	}

	.list-bottom {
		color: #666666;
		margin-top: 10px;
	}


	/* 文本溢出隐藏 */
	.uni-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.uni-two-cut {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
