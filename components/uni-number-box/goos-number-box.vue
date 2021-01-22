<template>
	<view class="uni-numbox">
		<view :class="{'uni-numbox--disabled': inputValue <= min || disabled}" class="uni-numbox__minus" @click="_calcValue('minus')">-</view>
		<input :disabled="disabled" v-model="inputValue" class="uni-numbox__value" type="number" @blur="_onBlur">
		<view :class="{'uni-numbox--disabled': inputValue >= max || disabled}" class="uni-numbox__plus" @click="_calcValue('plus')">+</view>
	</view>
</template>
<script>
	export default {
		name: 'UniNumberBox',
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 1
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			index:{
				type:Number,
				default:0
			},
			active:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				inputValue: 0
			}
		},
		watch: {
			value(val) {
				this.inputValue = +val
			},
			inputValue(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					let obj={
						active:this.active,
						number:newVal,
						index:this.index,
						step:this.step
					}
					this.$emit('change', obj)
				}
			}
		},
		created() {
			this.inputValue = +this.value
		},
		methods: {
			_calcValue(type) {
				if (this.disabled) {
					return
				}
				let value = this.inputValue
				if (type === 'minus') {
					value --
				} else if (type === 'plus') {
					value++
				}
				if (value < this.min || value > this.max) {
					return
				}
				this.inputValue = value
			},
			_onBlur(event) {
				let value = event.detail.value
				if (!value) {
					this.inputValue = 0
					return
				}
				value = +value
				if (value > this.max) {
					value = this.max
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			}
		}
	}
</script>
<style>
	@charset "UTF-8";

	.uni-numbox {
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 50upx;
		position: relative
	}

	.uni-numbox:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		/* border: 1px solid #c8c7cc; */
		/* border-radius: 12upx; */
		transform: scale(.5)
	}

	.uni-numbox__minus,
	.uni-numbox__plus {
		background-color: #f8f8f8;
		width: 50upx;
		font-size: 40upx;
		height: 100%;
		line-height: 50upx;
		text-align: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: #333;
		position: relative
	
	}
	.uni-numbox__value {
		position: relative;
		background-color: #f8f8f8;
		width:50upx;
		height: 100%;
		text-align: center;
		margin:0 10upx;
	}

	.uni-numbox__value:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		/* border-style: solid;
		border-color: #c8c7cc;
		border-left-width: 1px;
		border-right-width: 1px;
		border-top-width: 0;
		border-bottom-width: 0;
		transform: scale(.5) */
	}

	.uni-numbox--disabled {
		color: silver
	}
</style>