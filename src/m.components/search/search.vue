<template>
	<div class="search-wrap">
		<search-box ref='searchBox' @query='onQueryChange'></search-box>
		<div class="search-show">
			<suggest :query='query' v-show='query'></suggest>
			<scroll :data='scrollData'  ref='scroll' class='scroll-wrap' v-show='!query'>
				<div class="search-key">
					<div class="hot-search">
						<h5>热门搜索</h5>
						<div class="hot-keys">
							<span v-for="item in hotkeys" v-text="item.k" @click="setQuery(item.k)"></span>
						</div>
					</div>
					<div class="search-history" v-show="historylist.length">
						<h2 class="clearfix">
							<span class="pull-left">搜索历史</span>
							<span class="ff pull-right" style="font-weight: normal;" @click="deleteAll">&#xe608;</span>
						</h2>
						<historylist :history='historylist' @delete='deleteItem' @select='selectItem'></historylist>
					</div>
				</div>
			</scroll>
		</div>
		<comfirm text='Do you 确定？' ref='comfirm' @confirm='oncomfirm'></comfirm>
	</div>
</template>

<script>
	import searchBox from 'mc/search-box/search-box'
	import suggest from 'mc/suggest/suggest'
	import historylist from 'mc/historylist/historylist'
	import {getHotKey} from 'api'
	import {playlistMixin} from 'mc/mixin/mixin'
	import scroll from 'base/scroll/scroll'
	import {mapGetters,mapActions} from 'vuex'
	import comfirm from 'base/comfirm/comfirm'
	export default {
		name:'search',
		mixins:[playlistMixin],
		data(){
			return {
				hotkeys:[],
				query:''
			}
		},
		computed:{
			...mapGetters(['historylist']),
			scrollData(){
				return this.hotkeys.concat(this.history);
			}
		},
		components:{
			searchBox,
			historylist,
			suggest,
			scroll,
			comfirm	
		},
		created(){
			getHotKey().then(res=>{
				this.hotkeys = res.data.hotkey.slice(0,10);
				console.log(res.data);
			});
		},
		methods:{
			setQuery(k){
				this.$refs.searchBox.setQuery(k);
			},
			deleteItem(index,item){
				this.deleteHistory(item).then(list=>{
					this.$cache.set('__history__',list);
				})
			},
			deleteAll(){
				this.$refs.comfirm.show();
			},
			oncomfirm(){
				this.clearHistory().then(list=>{
					this.$cache.remove('__history__');
				})
			},
			selectItem(index,item){
				this.setQuery(item+'');
				setTimeout(()=>{
					this.addHistory(item+'').then((list)=>{
						this.$cache.set('__history__',list);
					})
				},500)
			},
			onQueryChange(query){
				this.query = query;
			},
			resizeScroll(playlist){
				if(playlist&&playlist.length>0){
					this.$refs.scroll.$el.style.height = `calc(100% - 1.2rem)`;
				}else{
					this.$refs.scroll.$el.style.height = '';
				}
				this.$refs.scroll.refresh();
			},
			...mapActions(['deleteHistory','addHistory','clearHistory'])
		},
		watch:{
			query(newval,old){
				//从display：none的状态显示之后，scroll没有被刷新，导致无法滑动，手动添加刷新逻辑
				if(!newval){
					this.$nextTick(function(){
						this.$refs.scroll.refresh();
					})
				}
			}
		}
		
	}
</script>

<style lang="less" scoped>
	.search-wrap{
		height:100%;
		padding: .3rem;
	}
	.search-show{
		height: ~'calc(100% - .9rem)';
	}
	.scroll-wrap{
		overflow: hidden;
	}
	.search-key{
		padding-top: .4rem;
	}
	.hot-search{
		h5{
			font-size: .32rem;
			padding-bottom: .3rem;
		}
	}
	.hot-keys{
		span{
			display: inline-block;
			padding: .1rem .3rem;
			margin-right: .2rem;
			background-color: #739ddc;
			margin-bottom: .2rem;
			border-radius: .1rem;
			color: #fff;
			font-size: .28rem;
		}
	}
	.search-history{
		h2{
			padding: .3rem 0;
			font-size: .32rem;
		}
	}
</style>