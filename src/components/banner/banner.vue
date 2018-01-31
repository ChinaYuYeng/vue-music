<template>
	<div class="g-container">
		<div class="swiper-container">
		  <div class="swiper-wrapper">
		    <div class="swiper-slide"  v-for="banner in banners"><img :src="banner.src"/></div>
		  </div>
		</div>
	</div>
</template>

<script>
	//目前的版本是3，4居然不能自动滚
	import Swiper from 'swiper'
	import $ from 'jquery'
	import 'swiper/dist/css/swiper.min.css';
	import b1 from './img/banner1.jpg'
	import b2 from './img/banner2.jpg'
	export default {
		name:'banner',
		data(){
			return {
				banners:null
			}
		},
		created:function(){
			$.get('/api/banner',(res)=>{
				this.banners = res.data;
			})
		},
		mounted:function(){
			this.$nextTick(()=>{
				let swiper1 = new Swiper('.swiper-container', {
					autoplay: 1000,
				})
			})
		},
		watch:{
			banners(){
				console.log(this.banners);
			}
		}
	}
</script>

<style scoped>
	.swiper-slide{
		height: 500px;
		text-align: center;
		line-height: 500px;
		font-size: 50px;
		color: #555;
	}
</style>