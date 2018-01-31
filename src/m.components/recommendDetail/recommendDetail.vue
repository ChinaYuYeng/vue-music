<template>
	<music-list :music='rdetail' :songlist='songlist'></music-list>
</template>

<script>
	import {getRecommandDetail} from 'api'
	import musicList from 'mc/music-list/music-list'
	export default {
		name:'recommendDetail',
		props:{
			rdetail:{
				type:Object,
				default:null
			}
		},
		data:function(){
			return {
				songlist:null
			}
		},
		created:function(){
			if(!this.rdetail.dissid){
				this.$router.push({
					path:'/recommend'
				})
			}else{
				this.getRecommandDetail();
			}
		},
		methods:{
			getRecommandDetail(){
				getRecommandDetail(this.rdetail.dissid).then(data=>{
					this.songlist = data.songs;
					this.rdetail.desc = data.desc;
				});
			},		
		},
		components:{
			musicList
		}
	}
</script>

<style lang='less' scoped>
</style>