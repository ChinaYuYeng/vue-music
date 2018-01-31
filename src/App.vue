<template>
  <div id="app">
  	<head-top></head-top>
  	<tab></tab>
  	<div class="router-wrap" ref='routerWrap'>
	  	<transition name='slide' mode='out-in'>
		  	 <keep-alive>
		    		<router-view></router-view>
		     </keep-alive>
	     </transition>
     </div>
     <player></player>
  </div>
</template>

<script>
import headTop from 'mc/header/header'
import tab from 'mc/tab/tab'
import player from 'mc/musicPlayer/musicPlayer'
export default {
  name: 'app',
  components: {
		'head-top':headTop,
		tab,
		player
  }
}
</script>

<style lang="less" scoped> 
	#app{
		perspective: 500px;
		height: 100vh;
	}
  .slide-enter-active, .slide-leave-active{
    transition: all .4s ease-in-out;
    transform-style: preserve-3d;
   }
   .slide-enter{
   	transform: translate3d(0,100%,0) skew(90deg,45deg);
   }
   /*.slide-enter-to{
   	transform: translate3d(0, 0, 0) skew(0,0);
   }
   
   .slide-leave{
   	transform: translate3d(0, 0, 0) rotateY(0);
   }*/
   
  .slide-leave-to{
    transform: translate3d(-110%, 0, -100px) rotateY(90deg);
   }
   
   .router-wrap{
   		height: ~'calc(100vh - 1.8rem)';
   }
   
   
</style>
