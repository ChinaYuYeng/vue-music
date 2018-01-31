<template>
	<transition>
		<slot></slot>
	</transition>
</template>

<script>
	export default {}
</script>

<style lang='less' scoped>
	.v-enter{
		transform: translateX(100%);
	}
	.v-enter-to{
		transform: translateX(0px);
	}
	.v-leave{
		opacity: 1;
		transform: translateX(0px);
	}
	.v-leave-to{
		transform: translateX(-100%);
		opacity: 0;
	}
	.v-leave-active{
		transition: all .3s ease-in-out;
	}
	
	.v-enter-active{
		transition: all .3s ease-in-out;
	}
</style>