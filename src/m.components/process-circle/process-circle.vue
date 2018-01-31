<template>
	<div class="process-circle" ref='processCircle'>
		<svg :width='radius' :height='radius' viewBox='0 0 100 100' version="1.1" xmlns="http://www.w3.org/2000/svg">
			<circle class='progress-background' r='42' cx='50' cy='50' fill='transparent'></circle>
			<circle class='progress-bar' r='42' cx='50' cy='50' fill='transparent' :stroke-dasharray='dashArray' :stroke-dashoffset='dashOffset'></circle>
		</svg>
		<div class="slot-wrap">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name:'processCircle',
		props:{
			radius:{
				type:Number,
				default:40
			},
			percent:{
				type:Number,
				default:0
			}
		},
		computed:{
			dashArray(){
				return 2*Math.PI * (this.radius+8);
			},
			dashOffset(){
				return (1 - this.percent) * this.dashArray;
			}
		}
	}
</script>

<style lang='less' scoped>
	.process-circle{
		position: relative;
		width: 100%;
		height: 100%;
		line-height: 1rem;
		svg{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			transform: rotate(-90deg);
		}
		circle{
			stroke-width: 8px;
			&.progress-background{
				stroke: #ccc;
			}
			&.progress-bar{
				stroke: #003A8F;
			}
		}
		.slot-wrap{
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 2;
			border-radius: 50%;
		}
	}
</style>