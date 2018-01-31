<template>
	<div class="search-box">
		<span class="ff icon-left">&#xe623;</span>
		<input type="text" :placeholder='placeholder' v-model="querytext"/>
		<span class="ff icon-right" v-show="querytext" @click="_clear">&#xe612;</span>
	</div>
</template>

<script>
	export default {
		name:'searchBox',
		props:{
			placeholder: {
	        type: String,
	        default: '搜索歌曲、歌手'
	      }
		},
		data(){
			return {
				querytext:''
			}
		},
		created(){
			this.$watch('querytext',this.debounce((newval,old)=>{
				this.$emit('query',newval);
			},300))
		},
		methods:{
			_clear(){
				this.querytext = '';
			},
			setQuery(k){
				this.querytext = k;
			},
			debounce(callback,delay){
				let timer = null;
				return function(...rest){
					if(timer){
						clearTimeout(timer);
					}
					timer = setTimeout(()=>{
						callback(...rest);
					},delay)
				}
			}
		},
		watch:{

		}
	}
</script>

<style lang="less" scoped>
	.search-box{
		width: 100%;
		padding: .2rem .3rem;
		height: .9rem;
		background-color: #739ddc;
		border-radius: .2rem;
	}
	span,input{
		display: inline-block;
		vertical-align: middle;
		height: .5rem;
		line-height: .5rem;
		color: #fff;
	}
	input{
		margin: 0 .1rem;
		width: 5.1rem;
		border: none;
		outline: none;
		background-color: #739ddc;
	}
	input::-webkit-input-placeholder {
	 	color:#fff;
	}
	span{
		text-align: center;
		font-size: .36rem;
	}
</style>