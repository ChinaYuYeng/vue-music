<template>
	<div class="player" v-show="playlist.length">
		<transition name='normal'
			@enter='enter'
			@after-enter='afterEnter'
			@leave='leave'
			@after-leave='afterLeave'
			>
			<div class="normal-player" v-show='fullScreen'>
				<div class="background">
		          <img v-lazy='currentSong.image'>
		        </div>
		        <div class="top">
		          <div class="back" @click="minScreen">
		            <span class="ff">&#xe6b8;</span>
		          </div>
		          <h1 class="title" v-text="currentSong.name"></h1>
		          <h2 class="subtitle" v-text="currentSong.singerName"></h2>
		        </div>
		        <div class="middle" 
		        	@touchstart.prevent='middleTouchStart'
		        	@touchmove.prevent='middleTouchMove'
		        	@touchend.prevent='middleTouchEnd'
		        	>
		          <div class="middle-l" ref='midl'>
		            <div class="cd-wrapper" ref='cd'>
		            	<!--已经有旋转效果了，不要再把移动效果放在这了，可以包一层-->
		              <div class="cd play" :class='{pause:!playing}' >
		                <img v-lazy='currentSong.image'/>
		              </div>
		            </div>
		            <div class="playing-lyric-wrapper">
		              <div class="playing-lyric" v-text="currentLyric"></div>
		            </div>
		          </div>
		          <scroll class="middle-r" ref="lyricList" :data='lyriclines'>
		            <div class="lyric-wrapper">
		                <p class="lyc-line" v-for="(item,index) in lyriclines" v-text="item.txt" :class='{current:index === curlyricInx}' ref='lyricline'></p>
		            </div>
		          </scroll>
		          
		        </div>
				<div class="bottom">
		          <div class="dot-wrapper">
		          	<span :class="{on:middleSlide == 'cd'}"></span>
		          	<span :class="{on:middleSlide == 'lrc'}"></span>
		          </div>
		          <div class="progress-wrapper">
		            <span class="time time-l" v-text='formatTime(currentTime)'></span>
		            <div class="progress-bar-wrapper">
		            	<process-bar :percentage='percentage' @percentageChange='_setCurrentTime' @updataTimeStart='updataTimeFlag' @updataTime='updataTime'></process-bar>
		            </div>
		            <span class="time time-r" v-text="formatTime(currentSong.duration)"></span>
		          </div>
		          <div class="operators">
		            <ul>
		            	<li class="ways" @click="changeMode">
		            		<span class="ff sx" v-show="mode===playMode.sequence">&#xe606;</span>
		            		<span class="ff sj" v-show="mode===playMode.random">&#xe622;</span>
		            		<span class="ff xh" v-show="mode===playMode.loop">&#xe61e;</span>
		            	</li>
		            	<li class="pre" @click='pre'><span class="ff">&#xe603;</span></li>
		            	<li class="start" @click="togglePlay">
		            		<span class="ff" v-show='!playing'>&#xe602;</span>
		            		<span class="ff" v-show='playing'>&#xe601;</span>
		            	</li>
		            	<li class="next" @click='next'><span class="ff">&#xe604;</span></li>
		            	<li class="favorite">
		            		<span class="ff">&#xe600;</span>
		            		<!--<span class="ff like">&#xe605;</span>-->
		            	</li>
		            </ul>
		          </div>
		        </div>
			</div>
		</transition>
		<transition name='min'>
			<div class="min-player" v-show='!fullScreen' @click="maxScreen">
				<div class="icon play" :class="{pause:!playing}" ref='minCd'>
					<img v-lazy='currentSong.image'/>
				</div>
				<div class="singer-info">
					<p v-html="currentSong.name"></p>
					<small v-html="currentSong.singerName"></small>
				</div>
				<div class="control min-play" @click.stop="togglePlay">
					<process-circle :radius='0.75*rem' :percent='percentage'>
						<span class="ff" v-show="!playing">&#xe607;</span>
						<span class="ff" v-show="playing">&#xe61d;</span>
					</process-circle>
				</div>	  
				<div class="playlist control" @click.stop="showPlaylist">
					<span class="ff">&#xe613;</span>
				</div>
				<playlist ref='plist'></playlist>
			</div>
		</transition>
		<audio ref="audio" :src="currentSong.url" @timeupdate='updataTime' @canplay="canplay" @ended='end' ></audio>
	</div>
</template>

<script>
	import processBar from 'mc/process-bar/process-bar'
	import {mapGetters,mapMutations} from 'vuex'
	import {playMode} from '@/config/playMode'
	import shuffle  from '@/util/shuffle'
	import lyricParser from '@/util/lyricParser'
	import animations from 'create-keyframe-animation'
	import processCircle from 'mc/process-circle/process-circle'
	import scroll from 'base/scroll/scroll'
	import playlist from 'mc/playlist/playlist'
	import {getLyric} from 'api'
	export default {
		name:'musicPlay',
		
		data:function(){
			return {
				currentTime:0,
				percentage:0,
				//该标记表明进度条是否由用户在操作
				updataTimeStart:false,
				//歌词当前行
				curlyricInx:-1,
				//歌词当前行
				currentLyric:'',
				//歌词所有行
				lyriclines:null,
				//定义cd和歌词切换状态
				middleSlide:'cd'
			}
		},
		created(){
		},
		computed:{
			...mapGetters([
				'currentIndex',
		        'fullScreen',
		        'playing',
		        'currentSong',
		        'playlist',
		        'mode',
		        'sequenceList'
			]),
			playMode(){
				return playMode;
			},
			rem(){
				return Number.parseInt(document.documentElement.style.fontSize);
			}
		},
		methods:{
			...mapMutations({
				setPlayState:'setplaystate',
				setFullScreen:'setfullscreen',
				setCurrentIndex:'setcurrentindex',
				setPlayMode:'setplaymode',
				setPlayList:'setplaylist'
			}),
			enter(el,done){
				const {x,y,scale} = this._animateHelper();
				
				let animation = {
					0:{
						transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
					},
					60:{
						transform:`translate3d(0,0,0) scale(1.1)`
					},
					100:{
						transform:`translate3d(0,0,0) scale(1)`
					}
				}
				animations.registerAnimation({
					name:'move',
					animation,
					presets:{
						duration:600,
						easing:'linear'
					}
				})
				animations.runAnimation(this.$refs.cd,'move',done);
			},
			afterEnter(){
				animations.unregisterAnimation('move')
        		this.$refs.cd.style.animation = ''
			},
			leave(el,done){
				const {x,y,scale} = this._animateHelper();
				this.$refs.cd.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
				this.$refs.cd.style.transition = 'all .4s'
				this.$refs.cd.addEventListener('transitionend',done);
			},
			afterLeave(){
				let cd  = this.$refs.cd;
				cd.style.transform = '';
				cd.style.transition = '';
			},
			_animateHelper(){
				//由于会出现display：none的情况，所以用以下属性去求值会出现问题，display：none的时候，属性会失真
				/*const minCd = this.$refs.minCd;
				const cd = this.$refs.cd;
				const minCdRect = minCd.getBoundingClientRect();
				const cdRect = cd.getBoundingClientRect();
				const minWidth = minCd.offsetWidth;
				const cdWidth = cd.offsetWidth;*/
				let rem = this.rem;
				let minWidth = 1*rem;
				let cdWidth = 6*rem;
				let minLeft = 0.3*rem;
				let minTop = window.innerHeight - 1.2*rem;
				const scale = minWidth/cdWidth;
				const x = minLeft - cdWidth/2;
				const y = minTop - cdWidth/2;
				return {
					x,
					y,
					scale
				}
			},
			minScreen(){
				this.setFullScreen(false);
			},
			maxScreen(){
				this.setFullScreen(true);
			},
			//用于告知当前的控制权在用户点击的歌曲进度小圆
			updataTimeFlag(flag){
				this.updataTimeStart = flag;
			},
			formatTime(time){
				let m = time/60>>0;
				let s = time%60;
				return `${m}:${s<10?'0'+s:s}`;
			},
			updataTime(e){
				//当用户拖动了小圆的时候，阻止默认事件更新时间
				if(this.updataTimeStart && typeof e !== 'number'){
					return;
				}
				if(this.updataTimeStart && typeof e === 'number'){
					this.currentTime = e*this.currentSong.duration | 0;
					return;
				}
				this.currentTime = e.target.currentTime | 0;
				this.percentage = this.currentTime / this.currentSong.duration;
			},
			canplay(){
				//所有的开始操作，所有的操作，都会触发这个事件
				this.setPlayState(true);
			},
			pre(){
				let currentIndex = this.currentIndex - 1;
				if(currentIndex < 0){
					currentIndex = this.playlist.length-1;
				}
				this.setCurrentIndex(currentIndex);
			},
			next(){
				let currentIndex = this.currentIndex + 1;
				if(currentIndex > this.playlist.length-1){
					currentIndex = 0;
				}
				this.setCurrentIndex(currentIndex);
			},
			loop(){
				this._setCurrentTime(0);
				this._commonOperator();
			},
			end(e){
				if(this.mode === playMode.loop){
					this.loop();
					return;
				}
				this.next();
			},
			changeMode(){
				let modes = Object.values(playMode);
				for(let i = 0; i < modes.length; i++){
					if(modes[i] === this.mode) {
						 this.setPlayMode(modes[++i%modes.length]);
						 let list = null;
						 if(!this.playing){
						 	this.setPlayState(true);
						 }
						 if(this.mode === playMode.loop){
						 	return;
						 }else if(this.mode === playMode.random){
						 	//如果是随机模式，对播放列表洗牌
						 	 list = shuffle(this.sequenceList);
						 	
						 }else if(this.mode === playMode.sequence){
						 	//如果是顺序模式，恢复原有的列表
						 	list = this.sequenceList;
						 }
						 this.resetCurrentIndex(list);
						 this.setPlayList(list);
						 return ;
					}
				}
				
			},
			 resetCurrentIndex(list) {
		      let index = list.findIndex((item) => {
		        return item.id === this.currentSong.id
		      })
		      this.setCurrentIndex(index)
		    },
			_setCurrentTime(percentage){
				//结束用户操作标记
				if(this.updataTimeStart) this.updataTimeStart = false;
				this.percentage = percentage;
				this.$refs.audio.currentTime = percentage*this.currentSong.duration;
				//通知歌词时间变更
				this.lyric.seek(percentage*this.currentSong.duration*1000);
			},
			_commonOperator(){
				//所有的结束操作，不直接调用audio的原生api
				this.setPlayState(false);
			},
			togglePlay(){
				this.setPlayState(!this.playing);
				this.lyric.togglePlay()
			},
			//让歌词保持在中间
			lrcKeepMid(){
				if(this.curlyricInx < 6){
					this.$refs.lyricList.scrollTo(0,0,300);
				}else if(this.lyriclines.length-this.curlyricInx<6){
					this.$refs.lyricList.scrollToEnd(0,1,300);
				} else{
					this.$refs.lyricList.scrollToElement(this.$refs.lyricline[this.curlyricInx-6],300);
				}
			},
			showPlaylist(){
				this.$refs.plist.show();
			},
			middleTouchStart(e){
				this.touche = {};
				this.touche.startFlag = true;
				this.touche.width = this.$refs.lyricList.$el.offsetWidth;
				this.touche.startPos = {x:e.touches[0].pageX,y:e.touches[0].pageY};
			},
			middleTouchMove(e){
				if(!this.touche.startFlag) return;
				this.touche.movePos = {x:e.touches[0].pageX,y:e.touches[0].pageY};
				this.touche.deltaX = this.touche.movePos.x - this.touche.startPos.x;
				this.touche.deltay = this.touche.movePos.y - this.touche.startPos.y;
				this.$refs.lyricList.$el.style.transitionDuration = '';
				this.$refs.midl.style.transitionDuration = ''
				//y增量比较大，判定y方向滑动
				if(Math.abs(this.touche.deltay) > Math.abs(this.touche.deltaX)){
					return;
				}else{
					if(this.middleSlide === 'cd' && this.touche.deltaX <0){
						this.touche.offset = this.touche.deltaX;
						this.touche.opacity = 1- Math.abs(this.touche.deltaX/this.touche.width);
					}else if(this.middleSlide === 'lrc' && this.touche.deltaX >0){
						this.touche.offset = this.touche.deltaX - this.touche.width;
						this.touche.opacity = Math.abs(this.touche.deltaX/this.touche.width);
					}
					this.$refs.lyricList.$el.style.transform = `translate3d(${this.touche.offset}px,0,0)`;
					this.$refs.midl.style.opacity = this.touche.opacity;
				}
			},
			middleTouchEnd(e){
				if(!this.touche.startFlag) return ;
				this.touche.startFlag = false;
				if(Math.abs(this.touche.deltaX/this.touche.width)>0.1){
					if(this.middleSlide === 'cd' && this.touche.deltaX <0){
						this.middleSlide = 'lrc';
						this.touche.offset = '-100%';
						this.touche.opacity = 0;
					}else if(this.middleSlide === 'lrc' && this.touche.deltaX >0){
						this.middleSlide = 'cd';
						this.touche.offset = '0';
						this.touche.opacity = 1;
					}
				}else{
					if(this.middleSlide === 'cd' && this.touche.deltaX <0){
						this.touche.offset = '0';
						this.touche.opacity = 1;
					}else if(this.middleSlide === 'lrc' && this.touche.deltaX >0){
						this.touche.offset = '-100%';
						this.touche.opacity = 0;
					}
				}
				this.$refs.lyricList.$el.style.transform = `translate3d(${this.touche.offset},0,0)`;
				this.$refs.midl.style.opacity = this.touche.opacity;
				this.$refs.lyricList.$el.style.transitionDuration = '.4s';
				this.$refs.midl.style.transitionDuration = '.4s';
			}
			
		},
		components:{
			processBar,
			processCircle,
			scroll,
			playlist
		},
		watch:{
			//所有的开始暂停都要通过这里的状态改变，这里的监听的状态如果值传一样并不会监听，想要切换，只能改变状态值
			playing(newval,old){
				let audio = this.$refs.audio;
				this.$nextTick(function(){
					newval ? audio.play() : audio.pause();
				})
			},
			//对于对象来说，相同的值也是可以监听到的，和上面的不同，因此对象需要增加比较
			currentSong(newval,old){
				//切换歌曲是的状态改变
				if(newval.id != old.id){
					this._commonOperator();
					//先停掉前一首歌的歌词,充值所有属性
					this.lyric&&this.lyric.stop();
					this.curlyricInx = 0;
					this.currentLyric = '';
					this.lyriclines=null;
					this.lyric = null;
					
					//获取歌词
					getLyric(newval.mid).then(res=>{
						this.lyric = new lyricParser(res.lyric,(o,i)=>{
							this.curlyricInx = i;
							this.currentLyric = o.txt;
							this.lrcKeepMid();
						});
						this.lyriclines = this.lyric.lines;
						this.lyric.play();
					})
				}
			},
			
		}
	}
</script>

<style lang='less' scoped>
	.normal-player{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 20;
		background-color: #333;
		.background{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter: blur(25px);
			opacity:.4;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.top{
			position: relative;
			.back{
				position: absolute;
				top: .1rem;
				left: .2rem;
				span{
					display: inline-block;
					padding: .1rem;
					font-size: .4rem;
					color: yellow;
				}
			}
			.title{
				width: 70%;
				margin: 0 auto;
				line-height: 1.4;
				padding-top: .3rem;
				font-size: .36rem;
				text-align: center;
				color: #fff;
				font-weight: normal;
			}
			.subtitle{
				text-align: center;
				color: #fff;
				font-size: .28rem;
				font-weight: normal;
				line-height: 1;
				margin-top: .1rem;
			}
		}
		.middle{
			position: absolute;
			top: 1.7rem;
			bottom: 3rem;
			width: 100%;
			font-size: 0;
			.middle-l{
				.cd-wrapper{
					position: relative;
					width: 6rem;
					height: 6rem;
					margin: 0 auto;
					.cd{
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						border: .2rem solid rgba(0,0,0,.5);
						border-radius: 50%;
						background-color: yellow;
						color: #000;
						overflow:hidden;
						img{
							width: 100%;
							height: 100%;
						}
					}
					
                
				}
			}
			
			.middle-r{
				position: absolute;
				height: 100%;
				width: 100%;
				left: 100%;
				top: 0;
				z-index: 2;
				overflow: hidden;
				.lyric-wrapper{
					width: 80%;
					margin: 0 auto;
					text-align: center;
					.lyc-line{
						padding: 5.5px 0;
						color: #fff;
						font-size: .3rem;
					}
					.current{
						color: yellow;
						transition: all .5s;
					}
				}
			}
			
			.playing-lyric-wrapper{
				 width: 80%;
	            margin: .8rem auto 0;
	            overflow: hidden;
	            text-align: center;
	            .playing-lyric{
	            	height: .3rem;
	            	line-height: .3rem;
	            	font-size: .3rem;
	            	color: yellow;
	            }
			}
		}
		.bottom{
			position: absolute;
			bottom: 1rem;
			width: 100%;
			.dot-wrapper{
				font-size:0;
				white-space: nowrap;
				text-align:center;
				span{
					display: inline-block;
					width: 8px;
					height: 8px;
					background-color: rgba(255,255,255,.5);
					margin: 0 2px;
					border-radius: 4px;
				}
				.on{
					width: 16px;
				}
			}
			.progress-wrapper{
				width:6.4rem;
				padding: .1rem 0;
				margin:0 auto;
				.time{
					color: #fff;
					font-size: .25rem;
					display: inline-block;
					width: 12%;
					float: left;
					line-height: 30px;					
				}
				.time-l{
					text-align: left;
				}
				.time-r{
					text-align: right;
				}
				.progress-bar-wrapper{
					float: left;
					display: inline-block;
					width: 76%;
					height: 30px;
				}
				&:after{
					content: '';
					display: table;
					clear: both;
				}
			}
			.operators{
				text-align: center;
				ul{
					line-height: .9rem;
				}
				li{
					display: inline-block;
					color: yellow;
					font-size: .65rem;
					width: 1.35rem;
					vertical-align: middle;
					span{
						display: inline-block;
					}
				}
				.start{
					font-size: .8rem;
					
				}
				
			}
		}
	}
	.min-player{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: .2rem .3rem;
		z-index: 20;
		background-color: #333;
		div{
			float: left;
		}
		.control{
			color: #fff;
			font-size: .75rem;
			width: 1rem;
			height: 1rem;
			text-align: center;
		}
		.min-play{
			font-size: .4rem;
		}
		.singer-info{
			padding-left: .4rem;
			p{
				width: 3.5rem;
				margin-top: .1rem;
				font-size: .3rem;
				color: #fff;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			small{
					display: block;
					color: #999;
					margin-top: .1rem;
					width: 3.5rem;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
		}
		.icon{
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			overflow: hidden;
		}
		&:after{
			content: '';
			display: table;
			clear: both;
		}
	}
	
	.normal-enter-active,.normal-leave-active{
		transition: all .4s ;
		.top,.bottom{
			transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
		}
	}
	
	.normal-enter,.normal-leave-to{
		opacity: 0;
		.top{
			transform: translate3d(0,-100%,0);
		}
		.bottom{
			transform: translate3d(0,100%,0);
		}
	}
	
	.min-enter-active,.min-leave-active{
		transition: all .3s;
	}
	
	.min-enter,.min-leave-to{
		opacity: 0;
	}
	
	.play{
		animation: rotate 20s linear infinite both
	}
	.pause{
		animation-play-state: paused
	}
	
	@keyframes rotate{
		from{
			transform: rotateZ(0deg);
		}
		to{
			transform: rotateZ(360deg);
		}
	}
	audio{
		height: 0;
		width: 0;
		visibility: hidden;
	}
</style>