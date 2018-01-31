<template>
	<div class="tab-list">
		<router-link tag="div" class="tab-item" to="/recommend">
	      <span class="tab-link">推荐</span>
	    </router-link>
	    <router-link tag='div' class='tab-item' to='/singerlist'>
	    	<span class="tab-link">歌手</span>
	    </router-link>
	    <router-link tag='div' class='tab-item' to='/rank'>
	    	<span class="tab-link">排行榜</span>
	    </router-link>
	    <router-link tag='div' class='tab-item' to='/search'>
	    	<span class="tab-link">搜索</span>
	    </router-link>
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style lang="less" scoped>
	.tab-list{
		background-color: #fff;
		.tab-item{
			float: left;
			line-height: .9rem;
			text-align: center;
			color: #333;
			width:25%;
			span{
				width: 100%;
				display: inline-block;
				font-size: .3rem;
			}
		}
		&:after{
			content: '';
			display: table;
			clear: both;
		}
		.router-link-active{
			color: #fff;
			background-color: #003A8F;
		}
	}
</style>