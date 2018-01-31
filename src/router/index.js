import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'mc/recommend/recommend'
import singerlist from 'mc/singerlist/singerlist'
import rank from 'mc/rank/rank'
import singer from 'mc/singer/singer'
import verticalSlider from 'mc/verticalSlider/verticalSlider'
import recommendDetail from 'mc/recommendDetail/recommendDetail'
import rankDetail from 'mc/rankDetail/rankDetail'
import search from 'mc/search/search'


Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path:'/',
  		name:'home',
  		redirect:'/recommend'
  	},
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      children:[{
  			path:':id',
  			component:recommendDetail,
  			props: (route) => ({ rdetail:route.query })
  		}]
  	},{
  		path:'/singerlist',
  		name:'singerlist',
  		component:singerlist,
  		children:[{
  			path:':id',
  			component:singer
  		}]
  	},{
  		path:'/rank',
  		name:'rank',
  		component:rank,
  		children:[{
  			path:':id',
  			component:rankDetail,
  			props:(route) => ({topid:+route.query.topid})
  		}]
  	},
  	{
  		path:'/search',
  		name:'search',
  		component:search,
  		children:[{
  			path:':id',
  			component:singer
  		}]
  	}
   ]
})
