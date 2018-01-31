<template>
	<music-list :music='singer' :songlist='songlist'></music-list>
</template>

<script>
	import {getSingerDetail} from 'api'
	import musicList from 'mc/music-list/music-list'
	export default {
		name:'singer',
		data:function(){
			return {
				singer:null,
				songlist:null
			}
		},
		created:function(){
			this.singer = this.$store.getters.singer;
			if(!this.singer.id){
				this.$router.push({
					path:'/singerlist'
				})
			}else{
				this.getSingerDetail();
			}
		},
		methods:{
			getSingerDetail(){
				getSingerDetail(this.singer.id).then(res=>{
					this.songlist = res.songs;
					this.singer.desc = res.singerDesc.substr(0,90)+' . . .';
				})
			},		
		},
		components:{
			musicList
		}
	}
</script>

<style lang='less' scoped>
</style>