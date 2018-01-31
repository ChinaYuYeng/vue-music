<template>
	<div class="header">
		<ul>
			<li><a href="/"><img src="./img/home.jpg"/></a></li>
			<li>doud music</li>
			<router-link tag="li" to="/user">
		      <img src="./img/menu.jpg"/>
		   </router-link>
		</ul>
	</div>
</template>

<script>
	export default {}
</script>

<style lang='less' scoped>
	@import "../../util/tool.less";
	.header{
	    position: relative;
	    z-index: 9;
	    width: 7.5rem;
	    margin: 0 auto;
	    background-color: #fff;
	    ul{
	        .clearfix();
	        li{
	            float: left;
	            line-height: .9rem;
	            text-align: center;
	            height: .9rem;
	            display: inline-block;
	            padding: .1rem 0;
	            img{
	                max-height: 60%;
	                margin-top: .1rem;
	            }
	        }
	        >li:nth-of-type(1){
	            width: 1rem;
	            margin-right: -1rem;
	            position: relative;
	            text-align: left;
	        }
	        >li:nth-of-type(2){
	            width:100%;
	            color: #003a8f;
	            text-transform: uppercase;
	            font-weight: bold;
	            font-size: .4rem;
	            letter-spacing: 1px;
	        }
	        >li:nth-of-type(3){
	            width: 1rem;
	            margin-left: -1rem;
	            text-align: right;
	        }
	    }
	}
	
</style>