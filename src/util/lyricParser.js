const STATE_PLAYING = 1;
const STATE_PAUSE = 0;

function noop(){
	
}

export default class lyric {
	constructor(lyric,callback = noop){
		this.lyric = lyric;
		this.callback = callback;
		this.tags = {};
		this.lines = [];
		this.state = STATE_PAUSE;
		this.curline = 0;
		this.timestamp = 0;
		this._init();
	}
	
	_init(){
		this._parseTags();
		this._parseLines();
	}
	
	//解析歌词特殊标记
	_parseTags(){
		let tags = ['ti','ar','al','by','offset'];
		for(let t of tags){
			let matchs = this.lyric.match(new RegExp(`\\[${t}:([^\\]]*)\\]`),'i');
			this.tags[t] = matchs&&matchs[1] || '';
		}
	}
	
	//解析每行歌词
	_parseLines(){
		let lyrics = this.lyric.split('\n');
		let reg = /\[(\d{2}):(\d{2})(?:\.(\d{2}))?\]/
		this.lines = lyrics.map((v,i)=>{
			let matchs = v.match(reg);
			if(matchs){
				let txt = v.replace(matchs[0],'').trim();
				if(txt){
					let res = {};
					res.time = matchs[1]*60*1000+matchs[2]*1000+matchs[3]*10;
					res.txt = txt;
					return res;
				}
			}
			return '';
		}).filter(k=>k);
	}
	
	
	//根据时间获得当前歌词行
	_getLineByTime(time){
		for(let i = 0; i<this.lines.length; i++){
			if(this.lines[i].time>time){
				return i;
			}
		}
		return this.lines.length-1;
	}
	
	//歌词一定时间后自动切换
	_play(){
		let line = this.lines[this.curline];
		if(!line){
			console.log('over');
			return;
		}
		let delay = line.time - this.timestamp;
		this.timer = setTimeout(()=>{
			this.timestamp = +new Date() - this.startTime;
			this.callback(this.lines[this.curline],this.curline);
			this.curline++;
			this._play();
		},delay)
	}
	
	//停止播放
	stop(){
		this.state = STATE_PAUSE;
		this.timestamp = +new Date() - this.startTime;
		clearTimeout(this.timer);
		console.log('is stoping...')
	}

	togglePlay(){
		if(this.state == STATE_PLAYING){
			this.stop();
		}else{
			this.play();
		}
	}
	
	play(lastshow){
		this.startTime = +new Date() - this.timestamp;
		
		if(this.lines.length == 0) return;
		
		if(this.curline == this.lines.length) return;
		
		if(lastshow&&this.curline>1){
			this.callback(this.lines[this.curline-1],this.curline-1);
		}
		
		this.state = STATE_PLAYING;
		
		this._play();
		
	}
	
	//特定时间开始
	seek(time){
		this.timer&&clearTimeout(this.timer);
		this.timestamp = time;
		this.curline = this._getLineByTime(time);
		this.play(true);
	}
	
}
