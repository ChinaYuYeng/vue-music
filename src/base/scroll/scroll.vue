<template>
	<div ref='wrapper' class="wrapper">
		<slot></slot>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	export default {
		props:{
			data: {
		        type: Array,
		        default: null
		     },
		     listenEnd:{
		     	type:Boolean,
		     	default:false
		     },
		     pullUpLoad:{
		     	type:Boolean,
		     	default:false
		     },
		     autoLoad:{
		     	type:Boolean,
		     	default:function(){
		     		return !this.pullUpLoad;
		     	}
		     },
		     probeType:{
		     	type:Number,
		     	default:0
		     }
		},
		mounted:function(){
			this.$nextTick(()=>{
				this._initScroll();
			})
		},
		methods:{
			_initScroll:function(){
				this.scroll = new BScroll(this.$refs.wrapper,{
				    click: true,
				    probeType:this.probeType
				})
				
				if(this.listenEnd){
					this.scroll.on('scrollEnd',(msg)=>{
						this.$emit('scrollEnd',msg);
					})
				}
				
				//下拉刷新
				if(this.pullUpLoad){
					this.scroll.on('touchEnd',(pos)=>{
						if(pos.y - this.scroll.maxScrollY <= -50){
							this.$emit('loadData');
						}
					})
				}
				
				//滚到底部附近自动刷新
				if(this.autoLoad){
					this.scroll.on('scrollEnd',(pos)=>{
						if(pos.y < this.scroll.maxScrollY + 50){
							this.$emit('loadData');
						}
					})
				}
				
				this.scroll.on('refresh',function(){
				})
				
				this.scroll.on('scroll',(pos)=>{
					this.$emit('scroll',pos);
				})
			},
			scrollToElement() {
		        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
		    },
		    scrollTo(){
		    	this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);
		    },
		    scrollToEnd(x,y,time){
		    	//x是横向end，y是纵向end
		    	this.scroll && this.scroll.scrollTo(x&&this.scroll.maxScrollX,y&&this.scroll.maxScrollY,time);
		    },
		    refresh() {
		        this.scroll && this.scroll.refresh()
		     }
			
		},
		watch: {
			data:function(){
				this.scroll.refresh();
			}
		}
		
	}
	
</script>

<style lang="less" scoped>
	.wrapper{
		width: 100%;
		height: 100%;
	}
	
	
</style>