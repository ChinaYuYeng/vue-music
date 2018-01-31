import {mapGetters, mapMutations, mapActions} from 'vuex'
import shuffle  from '@/util/shuffle'
import {playMode} from '@/config/playMode'

export const playlistMixin = {
	mounted(){
		this.resizeScroll(this.playlist);
	},
	computed:{
		...mapGetters(['playlist'])
	},
	activated(){
		this.resizeScroll(this.playlist);
	},
	methods:{
		resizeScroll(playlist){
			throw new Error('component must implement resizeScroll method')
		}
	},
	watch:{
		playlist(newval,oldval){
			this.resizeScroll(newval);
		}
	}
}

export const musicPlayer = {
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
		...mapActions(['deleteAllSong','deleteSong','changeSong']),
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
	    }
	}
}
