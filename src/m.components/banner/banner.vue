<template>
	<div class="banner">
		<div class="swiper-container" v-show="!loading" ref='container'>
			<div class="swiper-wrapper">
				<div class="swiper-slide slide-inner" v-for="item in dataList">
					<a :href="item.linkUrl"><img :src="item.picUrl" /></a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import Swiper from 'swiper'
	import 'swiper/dist/css/swiper.min.css'
	
	export default {
		data(){
			return {
				dataList:null,
				loading:true
			}
		},
		created:function(){
			this.getData();
		},
		activated :function(){
			this.swiper&&this.swiper.startAutoplay();
		},
		deactivated :function(){
			this.swiper&&this.swiper.stopAutoplay();
		},
		methods:{
			getData(){
				axios.get('/api/getRecommendList').then(res=>{
					this.dataList = res.data.data.slider;
					this.loading = false;
				})	
			},
			creatSwiper(){
				this.swiper = new Swiper(this.$refs.container,{
					slidesPerView : 1,
					spaceBetween : 0,
					autoplay:1000,
				})
			}
		},
		watch:{
			loading: function(){
				this.$nextTick(()=>{
					this.creatSwiper();
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.banner{
		position: relative;
		width: 7.5rem;
		margin: 0 auto;
		.slide-inner img{
			width: 100%;
			height: 100%;
		}
	}
</style>