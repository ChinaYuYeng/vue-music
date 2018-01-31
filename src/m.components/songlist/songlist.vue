<template>
		<ul  v-show="songlist" class="songlist">
			<li v-for="item in songlist">
				<p v-text="item.name"></p>
				<div class="control-list">
					<span class="ff" @click='playMusic(item)'>&#xe647;</span>
					<span class="ff" @click='favorite'>&#xe600;</span>
				</div>
			</li>
		</ul>
</template>

<script>
	import scroll from 'base/scroll/scroll'
	export default {
		name:'songlist',
		props:{
			songlist:{
				type:Array,
				default:''
			}
		},
		methods:{
			playMusic(){
				
			},
			favorite(){
				
			}
		},
		components:{
			scroll
		}
	}
</script>

<style lang="less" scoped>
	.songlist{
		padding: .3rem .5rem;
		background-color: #000;
		li{
			line-height: .7rem;
			height: .7rem;
			color: #fff;
			font-size: .3rem;
			position: relative;
			p{
				display: inline-block;
				width: 5rem;
				text-overflow:ellipsis; 
		        white-space:nowrap; 
		        overflow:hidden;
			}
			.control-list{
				position: absolute;
				right: 0;
				top: 0;
				bottom: 0;
				span{
					display: inline-block;
					font-size: .38rem;
					margin-right: .15rem;
					&:last-of-type{
						margin-right: 0;
					}
				}
			}
		}
	}
</style>