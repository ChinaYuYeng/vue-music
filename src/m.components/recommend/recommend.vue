<template>
	<div class="yf-index" ref='yfIndex'>
		<loading :show="loading"></loading>
		<scroll :data='playerlist' ref='scroll'>
			<div class="yf-index-wrap">
				<banner></banner>
				<h2 class="yf-index-title">推荐歌单</h2>
				<ul class="yf-playlist">
					<li v-for="item in playerlist" @click="selectItem(item)">
						<img v-lazy="item.imgurl"/>
						<div class="info">
							<h5 v-text="item.dissname"></h5>
							<p v-text="'创建者：'+item.creator.name"></p>
						</div>
					</li>
				</ul>
			</div>
		</scroll>
		<commonTransition><router-view></router-view></commonTransition>
	</div>
</template>

<script>
	import banner from 'mc/banner/banner'
	import scroll from 'base/scroll/scroll'
	import loading from 'mc/loading/loading'
	import axios from 'axios'
	import commonTransition from 'mc/transition/transition'
	import {playlistMixin} from 'mc/mixin/mixin'
	
	export default {
		name:'recommend',
		mixins:[playlistMixin],
		data(){
			return {
				loading:true,
				playerlist:null
			}
		},
		created:function(){
			this.getPlaylist();
		},
		methods:{
			getPlaylist(){
				axios.get('/api/getPlaylist').then(res=>{
					this.playerlist = res.data.data.list;
					this.loading = false;
				})
			},
			selectItem(item){
				this.$router.push({path:`/recommend/${item.dissid}`, query:{ dissid:item.dissid,imgurl:item.imgurl,name:item.creator.name}});
			},
			resizeScroll(playlist){
				if(playlist&&playlist.length>0){
					this.$refs.yfIndex.style.height = `calc(100% - 1.4rem)`;
				}else{
					this.$refs.yfIndex.style.height = '';
				}
				this.$refs.scroll.refresh();
			}
		},
		components:{
			banner,
			scroll,
			loading,
			commonTransition
		}
	}
</script>

<style lang="less" scoped>
	@import "../../util/tool.less";
	
	.yf-index{
		width: 100%;
		height:100%;
		background-color: #fff;
		overflow: hidden;
	}
	.yf-index-title{
		font-size: .4rem;
		text-align: center;
		color: #003a8f;
		margin-top: .3rem;
	}
	.yf-playlist{
		padding: .3rem 0;
		li{
			padding: 0 .3rem;
			margin-top: 0;
			margin-bottom: .2rem;
			&:nth-of-type(2n+1){
				background-color: #eee;
			}
			&:nth-of-type(2n){
				background-color: #fff;
			}
			img{
				width: 1.5rem;
				height: 1.5rem;
				display: inline-block;
			}
			.info{
				display: inline-block;
				width: 5rem;
				line-height: 1;
				padding: .1rem;
				height: 1rem;
				vertical-align: middle;
			}
			h5{
				font-size: 14px;
				color: #333;
				font-weight: normal;
				.ellisis();
			}
		}
		p{
			font-size: 12px;
			color: #999;
			margin-top: .2rem;
		}
	}

</style>