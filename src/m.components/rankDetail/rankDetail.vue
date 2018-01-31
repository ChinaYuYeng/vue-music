<template>
	<music-list :music='music' :songlist='songlist'></music-list>
</template>

<script>
	import musicList from 'mc/music-list/music-list'
	import {getTopSonglist} from 'api'
	export default {
		name:'rankDetail',
		props:{
			topid:{
				type:Number,
				default:-1
			}
		},
		data(){
			return{
				songlist:null,
				music:{}
			}
		},
		created(){
			this.getTopSonglist();
		},
		methods:{
			getTopSonglist(){
				getTopSonglist(this.topid).then(res=>{
					this.songlist = res.songs;
					this.music.desc = res.desc;
					this.music.imgurl = this.songlist[0].image;
					this.music.name = res.name;
				})
			}
		},
		components:{
			musicList
		}
	}
</script>

<style>
</style>