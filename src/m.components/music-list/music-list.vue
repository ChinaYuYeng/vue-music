<template>
	<div class="music">
		<loading :show='!songlist'></loading>
		<div class="music-detail" ref='musicDetail'>
			<div class="music-top" ref='musicTop'>
				<a href="" @click.stop.prevent="goback">返回</a>
				<p v-text="music.name"></p>
			</div>
			<div class="music-content" ref='musicContent'>
				<div class="content-left left">
					<img :src="music.imgurl"/>
				</div>
				<div class="content-right right">
					<p v-html="music.desc"></p>
				</div>
			</div>
			<button class="btn btn-default" ref='playall' @click="playAll">播放全部</button>
		</div>
		<div class="song-list-wrap" ref='songWrap'>
			<scroll @scroll='onscroll' :probeType='3' :data='songlist' ref='_scroll'>
				<songlist :songlist='songlist'></songlist>
			</scroll>
		</div>
	</div>
</template>

<script>
	import scroll from 'base/scroll/scroll'
	import loading from 'mc/loading/loading'
	import songlist from 'mc/songlist/songlist'
	import {playlistMixin} from 'mc/mixin/mixin'
	export default {
		name:'music',
		mixins:[playlistMixin],
		props:{
			songlist:{
				type:Array,
				default:null
			},
			music:{
				type:Object,
				default:null
			}
		},
		methods:{
			goback(){
				this.$router.back();
			},
			playAll(){
				this.$store.dispatch('playMusic',this.songlist);
			},
			onscroll(pos){
				let y = pos.y;
				let maxTop = this.$refs.musicDetail.offsetHeight - this.$refs.musicTop.offsetHeight;
				let rate = Math.abs(y/maxTop);
				if(y<0){
					this.$refs.musicContent.style = `filter: blur(${Math.min(rate*10,10)}px);`
					if(y<-maxTop){
						this.$refs.musicTop.style.zIndex = 2;
					}
					this.$refs.playall.style.transform = `scale(${Math.max(1-rate*1.2,0.5)})`
				}else{
					this.$refs.musicContent.style = `filter: blur(0px);`

					this.$refs.playall.style.transform = `scale(${Math.min(1+rate*0.4,1.3)})`
				}
			},
			resizeScroll(playlist){
				if(playlist&&playlist.length>0){
					this.$refs.songWrap.style.height = `calc(100% - 5.94rem)`;
				}else{
					this.$refs.songWrap.style.height = '';
				}
				this.$refs._scroll.refresh();
			}
		},
		components:{
			scroll,
			loading,
			songlist
		}
	}
</script>

<style lang='less' scoped>
	@import '../../util/tool.less';
	.music-detail{
		padding-bottom: .3rem;
		height: 4.54rem;
	}
	.music{
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 10;
		background-color: #333;
		overflow: hidden;
		}
	.music-top{
			height: 1rem;
			text-align:  center;
			line-height: 1rem;
			position: relative;
			background-color: #333;
			a{
				display: inline-block;
				color: yellow;
				width: 1.5rem;
				float: left;
				margin-right: -1.5rem;
			}
			p{
				width: 100%;
				color: #fff;
				font-size: .36rem;
				text-transform: uppercase;
			}
		}
	.music-content{
		.left-right(2rem);		
		padding:.3rem;
		.content-left{
			overflow: hidden;
			border-radius: 100%;
		}
		.content-right{
			color: #fff;
			font-size: .25rem;
			padding-left: .3rem;
			line-height: 1.6;
			height: 2rem;
			overflow: hidden;
		}
	}
	
	.btn-default{
		margin: 0 auto;
		display: block;
		border: none;
		width: 3rem;
		border-radius: 1.5rem;
		color: #333;
		background-color:yellow;
		
	}
	
	.song-list-wrap{
		position: relative;
		height: ~'calc(100vh - 4.54rem)';
	}
</style>