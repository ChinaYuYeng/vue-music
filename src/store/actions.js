import * as types from "./mutation-types"

export const playMusic = (context,list)=>{
	context.commit('setplaylist',list);
	context.commit('setsequencelist',list);
	context.commit('setplaystate',false);
	context.commit('setfullscreen',true);
	context.commit('setcurrentindex',0);
}

export const exitMusic = ({commit})=>{
	commit('setplaylist',[]);
	commit('setsequencelist',[]);
	commit('setcurrentindex',-1);
	commit('setplaystate',false);
	commit('setfullscreen',false);
}

export const insertSong = ({commit,state},song)=>{
	let playlist = state.playlist.slice(0);
	let sequenceList = state.sequenceList.slice(0);
	playlist.push(song);
	sequenceList.push(song)
	commit('setplaylist',playlist);
	commit('setsequencelist',sequenceList);
	if(playlist.length === 1){
		commit('setcurrentindex',0);
		commit('setfullscreen',true);
		return true; //列表只有一首歌，直接播放
	}
	return false;//添加到列表末端
}

export const changeSong = ({commit,state},song)=>{
	let playlist = state.playlist.slice(0);
	let index = playlist.findIndex((s)=>{
		return s.id === song.id;
	})
	commit('setcurrentindex',index);
}

export const addAndPlay = ({commit,state},song)=>{
	insertSong({commit,state},song);
	let playlist = state.playlist;
	let currentIndex = playlist.length-1;
	commit('setcurrentindex',currentIndex);
	commit('setfullscreen',true);
}

//删除一首歌
export const deleteSong = ({commit,state},song) =>{
	let playlist = state.playlist.slice(0);
	let sequenceList = state.sequenceList.slice(0);
	let currentIndex = state.currentIndex;
	let pindex = playlist.findIndex((s)=>{
		return s.id === song.id;
	})
	let sindex = sequenceList.findIndex((s)=>{
		return s.id === song.id;
	})
	sequenceList.splice(sindex,1);
	playlist.splice(pindex,1);
	if(playlist.length === 0){
		exitMusic({commit});
	}else{
		if(currentIndex > pindex){
			currentIndex--;
		}
		commit('setplaylist',playlist);
		commit('setsequencelist',sequenceList);
		commit('setcurrentindex',currentIndex);
	}
}

export const deleteAllSong = ({commit,state},song)=>{
	exitMusic({commit});
}

export const addHistory = ({commit,state},item)=>{
	let historylist = state.historylist.slice(0);
	let index = historylist.findIndex((v)=>{
		return v === item;
	})
	if(index === 0) return;
	if(index>=1){
		historylist.splice(index,1);
	}
	historylist.unshift(item);
	commit('setHistorylist',historylist);
	return historylist;
}

export const deleteHistory = ({commit,state},item) =>{
	let historylist = state.historylist.slice(0);
	let index = historylist.findIndex((v)=>{
		return v === item;
	})
	historylist.splice(index,1);
	commit('setHistorylist',historylist);
	return historylist;
}

export const clearHistory = ({commit,state}) =>{
	commit('setHistorylist',[]);
	return [];
}


