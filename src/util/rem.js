function userem(pageSize=750){
	const resize = function (){
		let width = window.outerWidth;//在chrome手机模拟中innerwidth和outerwidth有差别，outerwidth比较准确
		let rate = width/pageSize;
		document.documentElement.style.fontSize = 100*(rate>1?1:rate)+'px';
	}
	window.addEventListener('resize',resize);
	resize();
}
export default userem;


