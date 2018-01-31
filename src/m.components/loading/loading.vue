<template>
	<div class="loading" v-if="show">
		<div class="info">
			<img src="./load.gif"/>
			<p v-text="text"></p>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			text:{
				type:String,
				default:'正在加载中...'
			},
			show:{
				type:Boolean,
				default:true
			}
		}
	}
</script>

<style lang="less" scoped>
	.loading{
		position: absolute;
		left: 0 ;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: -1;
		background-color: rgba(0,0,0,.5);
		.info{
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			width: .8rem;
			height: .8rem;
			margin: auto;
			text-align: center;
			p{
				margin-top: .1rem;
				color: #999;
				font-size: .25rem;
			}
		}
	}
</style>