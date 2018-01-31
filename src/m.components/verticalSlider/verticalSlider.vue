<template>
	<div class="swiper-container">
	  <div class="swiper-wrapper">
	    <div class="swiper-slide"><page></page></div>
	    <div class="swiper-slide"><page></page></div>
	    <div class="swiper-slide"><page></page></div>
	  </div>
	</div>
</template>

<script>
	import Swiper from 'swiper'
	import 'swiper/dist/css/swiper.min.css'
	import page from 'mc/page/page'
	export default {
		name:'vSlider',
		mounted(){
			this.$nextTick(()=>{
				var mySwiper = new Swiper('.swiper-container',{
					direction : 'vertical',
				})
			})
		},
		components:{
			page
		}
	}
</script>

<style>
	.swiper-container{
		height: 100%;
		overflow: hidden;
	}
</style>