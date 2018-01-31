import basejsonp from 'jsonp'

let opts ={
	param : 'jsonpCallback'
}

export function jsonp(url,params){
	if(params){
		url += ~url.indexOf('?') ? '&' : '?';
		let URIComponent = [];
		for(let p in params){
			URIComponent.push(p + '=' + encodeURIComponent(params[p]));
		}
		url = url.replace('?&', '?') + URIComponent.join('&');
	}
	return new Promise(function(resolve,reject){
		basejsonp(url,opts,function(err,data){
			if(err){
				reject(err);
			}else{
				resolve(data);
			}
		});
	})
}
