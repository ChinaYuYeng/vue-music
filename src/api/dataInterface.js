import axios from 'axios';
import { Base64 } from 'js-base64';
import {jsonp} from './jsonp'

class singer {
	constructor(name,url,id){
		this.name = name;
		this.imgurl = 'https://y.gtimg.cn/music/photo_new/T001R150x150M000'+url+'.jpg';
		this.id = id;
	}
}

//获得歌手列表
export const getSingerList = function(){
	return new Promise(function(resolve,reject){
		axios.get('/api/getSingerlist').then(res=>{
			let originData = res.data.data.list;
			let transformData = {};
			let hot = [];
			let result = [];
			for(let i = 0;i<originData.length;i++){
				let v = originData[i];
				if(i<10){
					hot.push(new singer(v.Fsinger_name,v.Fsinger_mid,v.Fsinger_id));
				}else{
					(transformData[v.Findex]||(transformData[v.Findex] = []))
							.push(new singer(v.Fsinger_name,v.Fsinger_mid,v.Fsinger_id));
				}
			}
			for(let el in transformData){
				result.push({
					key:el,
					data:transformData[el]
				})
			}
			result.sort((a,b)=>a.key.localeCompare(b.key)).unshift({key:'热门',data:hot});
			resolve(result);
		})
	})
	
}

//获得歌手详情
export const getSingerDetail = function(id){
	return new Promise((resolve,reject)=>{
		axios.get('/api/getSingerDetail',{
			params:{
				id:id
			}
		}).then(res=>{
			var data = res.data.data;
			resolve({
				singerDesc:data.SingerDesc,
				songs:data.list.map(e=>songFactory(e.musicData))
			});
			
		})
	})
}

//获取歌单详情
export function getRecommandDetail(disstid){
	return axios.get('/api/getRecommandSonglist',{
		params:{
			disstid
		}
	}).then(res=>{
		var data = res.data.cdlist[0];
		return {
			desc:data.desc,
			songs:data.songlist.map(e=>songFactory(e))
		}
	})
}

//获得歌曲排行榜
export function getToplist(){
	return axios.get('/api/getToplist').then(res=>{
		return res;
	})
}

//获得排行榜歌曲
export function getTopSonglist(topid){
	return axios.get('/api/getTopSonglist',{
		params:{
			topid
		}
	}).then(res=>{
		let songs = res.data.songlist;
		songs = songs.map(m=>{
			return songFactory(m.data);
		})
		return{
			desc:res.data.topinfo.info,
			name:res.data.topinfo.ListName,
			songs
		};
	})
}

//获取搜索关键字
export function getHotKey(){
	return jsonp('https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',{
		inCharset: 'utf-8',
	  outCharset: 'utf-8',
	  notice: 0,
	  format: 'jsonp',
	  loginUin:0,
	  hostUin:0,
	  g_tk:5381,
		uin: 0,
	    needNewCode: 1,
	    platform: 'h5'
	})
}

//获得搜索结果
export function search(query, page, perpage, zhida){
	return jsonp('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',{
		w: query,
	    p: page,
	    perpage,
	    n: perpage,
	    catZhida: zhida ? 1 : 0,
	    zhidaqu: 1,
	    t: 0,
	    flag: 1,
	    ie: 'utf-8',
	    sem: 1,
	    aggr: 0,
	    remoteplace: 'txt.mqq.all',
	    uin: 0,
	    needNewCode: 1,
	    platform: 'h5',
	      g_tk: 5381,
		  inCharset: 'utf-8',
		  outCharset: 'utf-8',
		  notice: 0,
		  format: 'jsonp'
	}).then(res=>{
		let data = res.data;
		let zhida = data.zhida;
		let list = data.song.list;
		list = list.map((v,i)=>{
			return songFactory(v)
		})
		if(zhida && zhida.singerid){
			list.unshift({...{type:'SINGER'},...new singer(zhida.singername,zhida.singermid,zhida.singerid)});
		}
		data.song.list = list;
		return data.song;
	})
}


export const getLyric = function(mid){
	return new Promise((resolve,reject)=>{
		axios.get('/api/getLyric',{
			params:{
				mid:mid
			}
		}).then(res=>{
			let data = res.data;
			let reg = /^\w+\((\{.*\})\)$/;
			let matchs = null;
			if(matchs = data.match(reg)){
				let res = JSON.parse(matchs[1]);
				res.lyric = Base64.decode(res.lyric);
				resolve(res);
			}else{
				reject(data);
			}
		})
	})
}


class song {
	constructor({id, mid, singer, name, album, duration, image, url}){
		this.id = id
	    this.mid = mid
	    this.singerName = singer
	    this.name = name
	    this.album = album
	    this.duration = duration
	    this.image = image
	    this.url = url
	}
}

function songFactory(musicData){
	return new song({
	    id: musicData.songid,
	    mid: musicData.songmid,
	    singer: filterSinger(musicData.singer),
	    name: musicData.songname,
	    album: musicData.albumname,
	    duration: musicData.interval,
	    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
	    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
	})
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
