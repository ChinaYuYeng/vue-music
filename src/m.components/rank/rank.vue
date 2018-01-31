<template>
	<div class="rank-wrap" ref='rankwrap'>
		<scroll :data='toplist' ref='scroll'> 
			<ul>
				<li v-for='item in toplist' @click="selectTop(item)">
					<img v-lazy='item.picUrl'/>
					<div class="info">
						<h5 v-text="item.topTitle"></h5>
						<p v-for="(val,index) in item.songList" v-html="filterName(val,index)"></p>
					</div>
				</li>
			</ul>
		</scroll>
		<router-view></router-view>
	</div>
</template>

<script>
	import commonTransition from 'mc/transition/transition'
	import {getToplist} from 'api'
	import scroll from 'base/scroll/scroll'
	import {playlistMixin} from 'mc/mixin/mixin'
	export default {
		name:'rank',
		mixins:[playlistMixin],
		data:function(){
			return{
				toplist:null
			}
		},
		created(){
			this.getToplist();
		},
		components:{
			commonTransition,
			scroll
		},
		methods:{
			getToplist(){
				getToplist().then(res=>{
					this.toplist = res.data.data.topList;
				})
			},
			filterName(item,index){
				return `${index+1} <span style='color:#333;margin: 0 .05rem;'>${item.songname}</span> -${item.singername}`;
			},
			selectTop(top){
				this.$router.push({
					path:`/rank/${top.id}`,
					query:{topid:top.id}
				})
			},
			resizeScroll(playlist){
				if(playlist.length>0){
					this.$refs.rankwrap.style.height = `calc(100% - 1.4rem)`;
					this.$refs.scroll.refresh();
				}else{
					this.$refs.rankwrap.style.height = '';
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.rank-wrap{
		height: 100%;
		width: 100%;
		padding:.2rem .3rem;
		overflow: hidden;
		background: #f1f1f1;
		ul{
			li{
				margin-bottom: .2rem;
				background-color: #fff;
				img{
					display: inline-block;
					width: 2rem;
					height: 2rem;
				}
				.info{
					display: inline-block;
					padding: .15rem .15rem 0;
					vertical-align: middle;
					width: 4.8rem;
					h5,p{
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
						margin-bottom: .17rem;
						line-height: 1;
					}
					h5{
						font-weight: normal;
						font-size: .32rem;
					}
					p{
						font-size: .3rem;
						color: #999;
					}
				}
			}
		}
	}
</style>