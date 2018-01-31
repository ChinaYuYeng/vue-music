<template>
	<div class="dialog-white-mask" v-show="show">
        <div class="toast">
            <p class="yd-toast-content" v-html="mes"></p>
        </div>
    </div>
</template>

<script>
	export default {
		name:'toast',
		props:{
			mes:{
				type:String,
				default:''
			},
			show:{
				type:Boolean,
				default:true
			}
		}
	}
</script>

<style lang="less" scoped>
	.dialog-white-mask{
		position: fixed;
		z-index: 99;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		padding: .4rem .8rem;
		background-color: rgba(0,0,0,.7);
		color: #fff;
		font-size: .3rem;
		border-radius: .4rem;
	}
</style>