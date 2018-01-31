<template>
	<div class="suggest-wrap" ref='suggestWrap'>
		<scroll :data='songs' ref='scroll'  @loadData='loadMore'>
			<ul class="res-list">
				<li class="res-item" v-for="item in songs" @click="selectItem(item)">
					<span class="ff" v-if='item.type'>&#xe619;</span>
					<span class="ff" v-if='!item.type'>&#xe642;</span>
					<p  v-html="format(item)"></p>
					<div class="control-list" v-if="!item.type">
						<i class="ff" @click.stop='addSong(item)'>&#xe67a;</i>
					</div>
				</li>
				<li class="load-more" :show='hasMore'>
					<img src="../loading/load.gif"/>
				</li>
			</ul>
			<div class="no-result" v-show='!songs.length'>暂无搜索结果！</div>
		</scroll>
		<router-view></router-view>
		<toast mes='添加成功！' :show='showDilog'></toast>
	</div>
</template>

<script>
	import scroll from 'base/scroll/scroll'
	import {mapMutations,mapActions} from 'vuex'
	import {search} from 'api'
	import toast from 'base/toast/toast'
	import {playlistMixin} from 'mc/mixin/mixin'
	import loading from 'mc/loading/loading'
	export default {
		name:'suggest',
		mixins:[playlistMixin],
		props:{
			query:{
				type:String,
				default:''
			}
		},
		data(){
			return {
				page:1,
				result:null,
				songs:null,
				showDilog:false,
			}
		},
		computed:{
			hasMore(){
				return this.page*20 < this.result.totalnum;
			}
		},
		components:{
			scroll,
			toast,
			loading
		},
		methods:{
			...mapMutations({
				setSinger:'setsinger'
			}),
			search(val){
				if(val === '') return;
				search(val,this.page,20,true).then(res=>{
					console.log(res);
					this.result = res;
					this.songs = res.list;
				})
			},
			format(item){
				if(item.type){
					return item.name;
				}
				return `${item.name} - ${item.singerName}`;
			},
			selectItem(item){
				this.cacheHistory();
				if(item.type){
					this.setSinger(item);
					this.$router.push({path: `/search/${item.id}`});
				}else{
					this.addAndPlay(item);
				}
			},
			addSong(item){
				this.cacheHistory();
				this.insertSong(item).then((isfirst)=>{
					if(isfirst) return;
					this.showDilog = true;
					if(this.dalogTimer) clearTimeout(this.dalogTimer);
					this.dalogTimer = setTimeout(()=>{
						this.showDilog = false;
					},2000)
				})
			},
			cacheHistory(){
				this.addHistory(this.query).then((list)=>{
					this.$cache.set('__history__',list);
				})
			},
			resizeScroll(playlist){
				if(playlist&&playlist.length>0){
					this.$refs.suggestWrap.style.height = `calc(100% - 1.2rem)`;
				}else{
					this.$refs.suggestWrap.style.height = '';
				}
				this.$refs.scroll.refresh();
			},
			...mapActions([
		        'insertSong',
		        'addAndPlay',
		        'addHistory'
		      ]),
		      loadMore(){
		      	if(!this.hasMore) return;
		      	this.page++;
		      	search(this.query,this.page,20,true).then(res=>{
					console.log(res);
					this.songs = this.songs.concat(res.list);
					res.list = this.songs;
					this.result = res;
				})
		      }
		},
		watch:{
			query(newVal,old){
				this.search(newVal);
			}
		}
	}
</script>

<style lang="less" scoped>
	.suggest-wrap{
		height: 100%;
		padding: 0 .3rem;
		overflow: hidden;
	}
	.res-item{
		height: .8rem;
		line-height: .6rem;
		padding: .1rem 0;
		position: relative;
		span,p{
			display: inline-block;
			vertical-align: middle;
		}
		span{
			font-size: .3rem;
			margin-right: .2rem;
		}
		p{
			width: 5.2rem;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
		.control-list{
			float: right;
			i{
				display: inline-block;
				font-size: .38rem;
				color: #ccc;
				vertical-align: middle;
				&:last-of-type{
					margin-right: 0;
				}
			}
		}
	}
	.no-result{
		text-align: center;
		line-height: 2;
		font-size: .3rem;
		color: #000;
	}
	.load-more{
		height: .5rem;
		position: relative;
		img{
			width: .5rem;
			height: .5rem;
		}
	}
</style>