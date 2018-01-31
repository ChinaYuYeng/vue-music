let cache = {
	storage:window.localStorage,
	session:{
		storage:window.sessionStorage
	}
}

const api = {
	disabled:false,
	set(key,val){
		if(this.disabled) return;
		if(val === undefined){
			this.remove(key);
		}else{
			this.storage.setItem(key,serialize(val));
		}
		return val;
	},
	remove(key){
		if(this.disabled) return;
		this.storage.removeItem(key);
	},
	get(key){
		if(this.disabled) return;
		return deserialize(this.storage.getItem(key))
	},
	has(key){
		return this.get(key) !== undefined;
	},
	clear(){
		if(this.disabled) return;
		this.storage.clear();
	},
	getAll(){
		if(this.disabled) return;
		let ret = {};
		this.forEach((key,val)=>{
			ret[key] = val;
		})
		return ret;
	},
	forEach(callback){
		if(this.disabled) return;
		for(let i = this.storage.length;i--;){
			let key = this.storage.key(i);
			let val  = this.get(key);
			callback.call(this,key,val);
		}
	}
	
}


function serialize(val) {
  return JSON.stringify(val)
} 

function deserialize(val){
	try{
		return JSON.parse(val);
	}catch(e){
		return val || undefined;
	}
	
}

Object.assign(cache,api);
Object.assign(cache.session,api);

try{
	const testStorage = '__storejs__';
	cache.set(testStorage,testStorage);
	if(cache.get(testStorage) !== testStorage){
		cache.disabled = true;
		cache.session.disabled = true;
	}
	cache.remove(testStorage);
}catch(e){
	cache.disabled = true;
	cache.session.disabled = true;
}

export default cache;
