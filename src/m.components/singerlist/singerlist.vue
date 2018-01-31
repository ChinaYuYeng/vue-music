<template>
	<div class="singer-detal-wrap">
		<commonTransition><router-view></router-view></commonTransition>
		<div class="singer-wrap" ref='singerWrap'>
			<ul class="key-list" ref='keyList' @touchstart.stop.prevent='ontouchStart' @touchmove.stop.prevent='ontouchMove'>
				<li v-for="(group,index) in singerlist" v-text="group.key[0]" :class='{active:index == currentIndex}' :data-index='index'></li>
			</ul>
			<div class="key-view" v-text="currentkey" v-show="showKeyview" ref='keyView'></div>
			<scroll :data='singerlist' @scroll='onscroll' :probeType='3' ref='_scroll'>
				<div class="singers" ref='singers'>
					<dl class="singer-group" v-for="group in singerlist" ref='singerGroup'>
						<dt v-text="group.key"></dt>
						<dd v-for='item in group.data' @click="scanSinger(item)">
							<img v-lazy='item.imgurl'/><span v-text="item.name"></span>
						</dd>
					</dl>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
	import {getSingerList} from 'api'
	import scroll from 'base/scroll/scroll'
	import {SETSINGER} from '@/store/mutation-types'
	import commonTransition from 'mc/transition/transition'
	import {playlistMixin} from 'mc/mixin/mixin'
	export default {
		name:'singerlist',
		mixins:[playlistMixin],
		data(){
			return {
				singerlist:null,
				currentIndex:0,
				showKeyview:true
			}
		},
		created:function(){
			getSingerList().then(res=>{
				this.singerlist = res;
			})
		},
		mounted:function(){
			this.titleHeight = this.getKeyView.offsetHeight*0.8;
		},
		computed:{
			currentkey(){
				return (this.singerlist&&this.singerlist[this.currentIndex].key)||'热门';
			},
			getKeyView(){
				return this.$refs.keyView;
			}
		},
		methods:{
			getPosOfGroup(){
				this.poss = this.$refs.singerGroup.map(e => {
					return e.offsetTop - this.titleHeight;
				})
			},
			onscroll(pos){
				let posMap = this.poss;
				for(let i = posMap.length;i--;){
					if(pos.y>0){
						this.showKeyview = false;
					}else{
						this.showKeyview = true;
					}
					
					if(-pos.y<posMap[1]){
						this.currentIndex = 0;
						this.getKeyView.style.transform = 'translate3d(0,0,0)';	
						return;
					}else if(-pos.y>posMap[i]){
						let diff = -pos.y-posMap[i];
						if(diff<=this.titleHeight){
							this.getKeyView.style.transform = 'translate3d(0,'+(-diff)+'px,0)'
							return;
						}
						this.getKeyView.style.transform = 'translate3d(0,0,0)';	
						this.currentIndex = i;
						return;
					}else if(-pos.y<posMap[i]&&-pos.y>=posMap[i-1]){
						let diff = -pos.y-posMap[i-1];
						if(diff<=this.titleHeight){
							this.getKeyView.style.transform = 'translate3d(0,'+(-diff)+'px,0)'
							return;
						}
						this.getKeyView.style.transform = 'translate3d(0,0,0)';	
						this.currentIndex = i-1;
						return;
					}else {
						continue;
					}
				}
			},
			ontouchStart(e){
				this.touchy1 = e.touches[0].pageY;
				this.touchindex = +e.target.dataset.index;
				this.$refs._scroll.scrollToElement(this.$refs.singerGroup[e.target.dataset.index],800);
			},
			ontouchMove(e){
				this.touchy2 = e.touches[0].pageY;
				let dalt = this.touchy2 - this.touchy1;
				this.$refs._scroll.scrollToElement(this.$refs.singerGroup[this.touchindex + dalt/e.target.offsetHeight>>0],800);
			},
			scanSinger(singer){
				this.$store.commit(SETSINGER,singer);
				this.$router.push({
		          path: `/singerlist/${singer.id}`
		        })
			},
			resizeScroll(playlist){
				if(playlist&&playlist.length>0){
					this.$refs.singerWrap.style.height = `calc(100% - 1.4rem)`;
				}else{
					this.$refs.singerWrap.style.height = '';
				}
				this.$refs._scroll.refresh();
			}
		},
		watch:{
			singerlist(){
				this.$nextTick(()=>{
					this.getPosOfGroup();
				})
			}
		},
		components:{
			scroll,
			commonTransition
		}
	}
</script>

<style lang="less" scoped>
	.key-list{
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		background-color: #fff;
		li{
			line-height: .35rem;
			font-size: 12px;
			color: #003A8F;
			width: .35rem;
			font-family: arial;
		}
		.active{
			color: #42B983;
		}
	}
	.key-view{
		text-indent: .5rem;
		line-height: 1.2rem;
		background-color: #ccc;
		color: #fff;
		position: absolute;
		top: -0.2rem;
		left: .3rem;
		right: .3rem;
		height: 1rem;
		z-index: 1;
	}
	.singer-detal-wrap{
		height: 100%;
		padding-top: .2rem;
	}
	.singer-wrap{
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
	.singers{
		padding:0 .3rem .3rem;
		.singer-group{
			padding-bottom:.2rem;
			dt{
				text-indent: .5rem;
				line-height: .8rem;
				background-color: #ccc;
				color: #fff;
			}
			dd{
				margin-top: .2rem;
				img{
					display: inline-block;
					width: 1rem;
					height: 1rem;
					border-radius: 100%;
				}
				span{
					display: inline-block;
					margin-left: .5rem;
				}
			}
		}
		
	}
</style>