<template>
	<transition name='fade'>
		<div class="playlist-mask" v-show="flag" @click.stop='hide()'>
			<div class="playlist-wrap" @click.stop>
				<div class="playlist-top">
					<div class="play-mode" ref='playMode' @click="changeMode">
						<span class="ff" v-if='playMode.sequence === mode'>&#xe606;</span>
						<span class="ff" v-if='playMode.random === mode'>&#xe622;</span>
						<span class="ff" v-if='playMode.loop === mode'>&#xe61e;</span>
						<i v-text="getPlayModeName()"></i>
					</div>
					<div class="clear" @click="deleteAll">
						<span class="ff">&#xe608;</span>
					</div>
				</div>
				<scroll class="play-list" :data='sequenceList' ref='scroll'>
					<ul>
						<li v-for="item in sequenceList" @click="playOne(item)">
							<p class="name">
								<span class="ff play-icon" v-show='isPlay(item)'>&#xe607;</span>
								<i v-html="item.name"></i>
							</p>
							<div class="control">
								<span class="ff">&#xe605;</span>
								<span class="ff" @click.stop="deleteOne(item)">&#xe62a;</span>
							</div>
						</li>
					</ul>
				</scroll>
			</div>
			<comfirm ref='comfirm' text='do you 确定？' @confirm='clear'></comfirm>
		</div>
	</transition>
</template>

<script>
	import scroll from 'base/scroll/scroll'
	import {musicPlayer} from 'mc/mixin/mixin'
	import comfirm from 'base/comfirm/comfirm'
	export default{
		name:'playlist',
		mixins:[musicPlayer],
		data(){
			return {
				flag:false
			}
		},
		methods:{
			show(){
				this.flag = true;
			},
			hide(){
				this.flag = false;
			},
			isPlay(item){
				return item.id === this.currentSong.id;
			},
			getPlayModeName(){
				let name = '';
				switch (this.mode){
					case this.playMode.sequence:
						return name = '顺序播放';
					case this.playMode.loop:
						return name = '循环播放';
					case this.playMode.random:
						return name = '随机播放';
				}
				return name;
			},
			deleteAll(){
				this.$refs.comfirm.show();
			},
			clear(){
				this.deleteAllSong();
			},
			deleteOne(song){
				this.deleteSong(song);
			},
			playOne(item){
				this.changeSong(item);
			}
		},
		components:{
			scroll,
			comfirm
		},
		watch:{
			flag(newval,old){
				if(newval){
					this.$nextTick(()=>{
						this.$refs.scroll.refresh();
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.fade-enter-active,
	.fade-leave-active{
			/*内层时间必须小于外层,经过试验一旦完成外层动画就会移除相应clss,导致内层动画强制停止*/
			transition:opacity .4s;
			.playlist-wrap{
				transition:transform .4s;
			}
	}
	.fade-enter,
	.fade-leave-to{
			opacity:0;
			.playlist-wrap{
				transform: translate3d(0,100%,0);
			}
	}
	.playlist-mask{
		background: rgba(0,0,0,.4);
		position: fixed;
		z-index: 20;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	.playlist-wrap{
		background-color: #333;
		position: fixed;
		z-index: 1;
		left: 0;
		right: 0;
		bottom: 0;
		top: 5rem;
		padding:.2rem .3rem;
		.playlist-top{
			height: 1rem;
			.play-mode{
				display: inline-block;
				line-height: 1rem;
				span,i{
					display: inline-block;
					vertical-align: middle;
				}
				span{
					font-size: .36rem;
					color: yellow;
				}
				i{
					font-size: .3rem;
					color: #fff;
				}
			}
			.clear{
				float: right;
				color: #fff;
				line-height: 1rem;
				font-size: .3rem;
			}
		}
		.play-list{
			overflow: hidden;
			height: ~'calc(100% - 1rem)';
			ul{
				li{
					height: .8rem;
					line-height: .8rem;
					position: relative;
					.name{
						display: inline-block;
						position: relative;
						padding-left: .5rem;
						height: 100%;
						width: 82%;
						.play-icon{
							position: absolute;
							display: block;
							left: 0;
							top: 0;
							bottom: 0;
							width: .5rem;
							text-align: left;
							font-size: .3rem;
							color: yellow;
						}
						i{
							display: inline-block;
							width: 100%;
							color: #fff;
							font-size: .28rem;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}
					.control{
						position: absolute;
						right: 0;
						top: 0;
						bottom: 0;
						span{
							display: inline-block;
							width: .5rem;
							text-align: right;
							color: #fff;
							font-size: .3rem;
						}
					}
				}
			}
		}
	}
</style>