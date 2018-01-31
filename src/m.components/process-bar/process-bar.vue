<template>
	<div class="process-bar"  @click='progressClick' ref='processBar'>
		<div class="bar-inner">
			<div class="progress" ref='progress'></div>
			<div class="progress-btn-wrapper" ref='progressBtn' 
				@touchstart.prevent='btnTouchStart'
				@touchmove.prevent='btnTouchMove'
				@touchend='btnTouchEnd'
			>
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'process-bar',
		props:{
			percentage:{
				type:Number,
				default:0
			}
		},
		created(){
			this.touch = {};
		},
		methods:{
			getPos(val){
				return `${Math.max(1-val,0)*100}%`;
			},
			progressClick(e){
				const rect = this.$refs.processBar.getBoundingClientRect();
				const offsetWidth = e.pageX - rect.left;
				const percentage = offsetWidth / this.$refs.processBar.offsetWidth;
				this.$emit('percentageChange',percentage);
			},
			btnTouchStart(e){
				this.touch.initiated  = true;
				this.touch.startX = e.touches[0].pageX;
				this.$emit('updataTimeStart',true);
			},
			btnTouchMove(e){
				if(!this.touch.initiated){
					return false;
				}
				this.touch.detal = e.touches[0].pageX - this.touch.startX;
				this.percent = this.percentage + this.touch.detal / this.$refs.processBar.offsetWidth
				this.percent = Math.max(0,Math.min(1,this.percent));
				this.changePos(this.getPos(this.percent));
				this.$emit('updataTime',this.percent);
			},
			btnTouchEnd(e){
				if(!this.touch.initiated){
					return false;
				}
				this.$emit('percentageChange',this.percent);
				this.touch.initiated = false;
			},
			changePos(p=this.getPos(this.percentage)){
				this.$refs.progress.style.right = p;
				this.$refs.progressBtn.style.right = `calc(${p} - 15px)`;
			}
		},
		watch:{
			percentage(){
				if(this.touch.initiated) return;
				this.changePos();
			}
		}
		
		
	}
</script>

<style lang="less" scoped>
	.process-bar{
		height: 100%;
	}
	.bar-inner{
		position: relative;
		height: 4px;
		display:block;
		background-color: rgba(255,255,255,.4);
		top: 50%;
		transform: translateY(-50%);
		.progress{
			position: absolute;
			height: 100%;
			background-color: #003A8F;
			left: 0;
			right: 100%;
		}
		.progress-btn-wrapper{
			position: absolute;
			width: 30px;
			height: 30px;
			top:-13px;
			right: ~'calc(100% - 15px)';
			.progress-btn{
				width: 12px;
				height: 12px;
				background-color: #fff;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				border-radius: 50%;
				border: 2px solid #003A8F;
				box-shadow: 0 0 2px 2px #fff;
			}
		}
	}
	
</style>