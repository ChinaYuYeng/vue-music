const axios = require('axios');

let commonParamsQQ = {
	  inCharset: 'utf-8',
	  outCharset: 'utf-8',
	  notice: 0,
	  format: 'json',
	  needNewCode:0,
	  loginUin:0,
	  hostUin:0,
	  platform:'yqq',
	  g_tk:5381,
}

let cache = {};

function routers(app){
		//获取推荐列表
	app.get('/api/getRecommendList',function(req,res){
		if(cache.recommendList){
			res.json(cache.recommendList);
			console.log('from cache');
			return;
		}
		axios.get('https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',{
				params:Object.assign({},commonParamsQQ,{
					uin:0,
					platform:'h5',
					needNewCode:1,
					_:1513853686310
				}),
				headers: {
			      referer: 'https://m.y.qq.com/',
			    }
			}).then((response)=>{
			cache.recommendList = response.data;
			res.json(response.data);
		}).catch((err)=>{
			res.json(err);
		})
	})
	//获取歌单
	app.get('/api/getPlaylist',function(req,res){
		if(cache.playlist){
			res.json(cache.playlist);
			console.log('from cache');
			return;
		}
		axios.get('https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',{
				params:Object.assign({},commonParamsQQ,{
					picmid:1,
					rnd:Math.random(),
					categoryId:10000000,
					sortId:5,
					sin:0,
					ein:29
				}),
				headers: {
			      referer: 'https://y.qq.com/portal/playlist.html',
			    }
			}).then((response)=>{
			cache.playlist = response.data;
			res.json(response.data);
		}).catch((err)=>{
			res.json(err);
		})
	})
	
	//获取歌手列表
	app.get('/api/getSingerlist',function(req,res){
		if(cache.singerlist){
			res.json(cache.singerlist);
			console.log('from cache');
			return;
		}
		axios.get('https://c.y.qq.com/v8/fcg-bin/v8.fcg',{
				params:Object.assign({},commonParamsQQ,{
					channel:'singer',
					page:'list',
					key:'all_all_all',
					pagesize:100,
					pagenum:1,
				}),
				headers: {
			      referer: 'https://y.qq.com/portal/singer_list.html',
			    }
			}).then((response)=>{
			cache.singerlist = response.data;
			res.json(response.data);
		}).catch((err)=>{
			res.json(err);
		})
	})
	
	//获取排行榜
	app.get('/api/getToplist',function(req,res){
		if(cache.toplist){
			res.json(cache.toplist);
			console.log('from cache');
			return;
		}
		axios.get('https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',{
				params:Object.assign({},commonParamsQQ,{
					uin: 0,
			    needNewCode: 1,
			    platform: 'h5'
				}),
				headers: {
			      referer: 'https://m.y.qq.com/',
			    }
			}).then((response)=>{
			cache.toplist = response.data;
			res.json(response.data);
		}).catch((err)=>{
			res.json(err);
		})
	})
	
	//获得排行榜歌曲
	app.get('/api/getTopSonglist',function(req,res){
		let topid = req.query.topid;
		if(cache['toplist'+topid]){
			res.json(cache['toplist'+topid])
				console.log('from cache');
				return ;
		}
		axios.get('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',{
			params:Object.assign({},commonParamsQQ,{
					uin:0,
					platform:'h5',
					needNewCode:1,
					tpl:3,
					page:'detail',
					type:'top',
					topid:topid
			}),
			header:{
				referer:'https://y.qq.com/w/toplist.html'
			}
		}).then(response=>{
			cache['toplist'+topid] = response.data;
			res.json(response.data);
		}).catch(err=>{
			res.json(err);
		})
	})
	


	
		//获取搜索关键字
	app.get('/api/getHotkey',function(req,res){
		if(cache.hotkey){
			res.json(cache.hotkey);
			console.log('from cache');
			return;
		}
		axios.get('https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',{
				params:Object.assign({},commonParamsQQ,{
					uin:0,
					platform:'h5',
					needNewCode:1,
					_:1513684395945,
				}),
				headers: {
			      referer: 'https://m.y.qq.com/',
			    }
			}).then((response)=>{
			cache.hotkey = response.data;
			res.json(response.data);
		}).catch((err)=>{
			res.json(err);
		})
	})
	
	//搜索关键字
	app.get('/api/searchMusic',function(req,res){
		axios.get('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',{
				params:Object.assign({},commonParamsQQ,{
					g_tk:5381,
					uin:0,
					platform:'h5',
					needNewCode:1,
					w:'双世宠妃',
					zhidaqu:1,
					catZhida:1,
					t:0,
					flag:1,
					ie:'utf-8',
					sem:1,
					aggr:0,
					perpage:20,
					n:20,
					p:1,
					remoteplace:'txt.mqq.all',
					_:1513684504083
				}),
				headers: {
			      referer: 'https://m.y.qq.com/',
			    }
			}).then((response)=>{
			res.json(response.data);
		}).catch((err)=>{
			res.json(err);
		})
	})
	
	//获得歌手详情
	app.get('/api/getSingerDetail',function(req,res){
		let id = req.query.id;
		if(cache['singer'+id]){
			res.json(cache['singer'+id]);
			console.log('from cache');
			return;
		}
		axios.get('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',{
			params:{
				singerid:id,
				uin:0,
				format:'json',
				platform:'h5',
				needNewCode:1,
				order:'listen',
				from:'h5',
				num:30,
				begin:0,
				_:1514189524301
			},
			headers:{
				referer:'https://y.qq.com/'
			}
		}).then(response=>{
			cache['singer'+id]= response.data;
			res.json(response.data);
		}).catch(err=>{
			res.json(err);
		})

	})
	
		//获取歌词
	app.get('/api/getLyric',function(req,res){
		let mid = req.query.mid;
		if(cache['lyric'+mid]){
			res.json(cache['lyric'+mid]);
			console.log('from cache');
			return ;
		}
		axios.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',{
			params:Object.assign({},commonParamsQQ,{
					callback:'MusicJsonCallback_lrc',
					pcachetime:+new Date(),
					songmid:mid,
					jsonpCallback:'MusicJsonCallback_lrc',
					platform:'yqq'
				}),
				headers: {
			      referer: 'https://y.qq.com/portal/player.html',
			   }
		}).then(response=>{
			cache['lyric'+mid] = response.data;
			res.json(response.data);
		}).catch(err=>{
			res.json(err);
		})
	})
	
	//获得歌单详情
	app.get('/api/getRecommandSonglist',function(req,res){
		let disstid = req.query.disstid;
		axios.get('https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',{
			params:Object.assign({},commonParamsQQ,{
				type:1,
				json:1,
				utf8:1,
				onlysong:0,
				disstid:disstid,
			}),
			headers: {
	      referer: 'https://y.qq.com/portal/playlist.html',
	    }
		}).then(respones=>{
			res.json(respones.data);
		}).catch(err=>{
			res.json(err);
		})
	})
	
}

module.exports = routers;
