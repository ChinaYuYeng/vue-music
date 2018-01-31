export default function(arr){
	let _arr = Array.of(...arr);
	for(let i = 0; i<_arr.length; i++){
		let rand = Math.random()*(_arr.length-1)|0;
		let temp = _arr[i];
		_arr[i] = _arr[rand];
		_arr[rand] = temp;
	}
	return _arr;
}

