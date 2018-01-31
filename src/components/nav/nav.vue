<template>
	<!--<div class="g-container">
		<div class="logo"><img :src="logUrl"/></div>
		<ul class="nav-list">
			<li v-for="item in items"><a v-bind:href="item.src" v-text="item.text"></a></li>
		</ul>
	</div>-->
	<div class="header">
		<div class="g-container">
			<div class="logo">
				<a href=""><img :src="logUrl"/></a>
			</div>
			<div class="nav-bar">
				<div class="bar">
					<a href="" style="border-right: 1px solid #fff"><span class="ff">&#xe6dd;</span>联系科度</a><a href=""><span class="ff">&#xe649;</span>经销商登陆</a>
				</div>
				<ul class="nav clearfix">
					<li v-for="item in items" :class="{on:item.index == currentPage}" ><router-link :to="item.src" v-text="item.text" @click.native="chanceNav(item.index)"></router-link></li>
				</ul>
				
			</div>
		</div>
	</div>
</template>

<script>
	import logo from './img/logo.png'
	export default {
		name: 'Nav',
		data (){
			return {
				items: [
			      { text: '首页', src:'/',index:0},
			      { text: '关于我们', src:'/about',index:1},
			      { text: '联系我们', src:'/contact',index:2},
			      { text: '新闻中心', src:'/news',index:3},
			      { text: '技术支持', src:'/service',index:4}
			    ],
			    logUrl:logo,
			    currentPage:0
			}
		},
		methods:{
			chanceNav:function(i){
				this.currentPage = i;
			}
		}
		
	}
</script>

<style lang="less" scoped>
@themeColor:#0071ff;
.header{
    line-height: 80px;
    .g-container{
        border-bottom: 1px solid #ddd;
    }
    .logo{
        width: 174px;
        float: left;
        margin-right: -175px;
        text-align: center;
        border-right: 1px solid #ddd;
        img{
            display: inline-block;
        }
    }
    .nav-bar{
        margin-left: 175px;
        
        .bar{
            width: 182px;
            float: right;
            margin-left: -182px;
            a{
                display: inline-block;
                width: 49.7%;
                line-height: 1.4;
                height: 80px;
                background-color: #e1e1e1;
                text-align: center;
                font-size: 12px;
                vertical-align: middle;
                margin-top: -2px;
                span{
                    display: block;
                    font-size: 24px;
                    color: @themeColor;
                    font-weight: bold;
                    padding-top: 10px;
                    margin-bottom: 5px;
                }
            }
        }
        .nav{
            margin-right: 182px;
            li{
                text-align: center;
                font-size: 16px;
                float: left;
                width: 20%;
            }
            a:hover{
                color: @themeColor;
            }
            .on{
                display: inline-block;
                vertical-align: middle;
                -webkit-transform: perspective(1px) translateZ(0);
                transform: perspective(1px) translateZ(0);
                box-shadow: 0 0 1px rgba(0,0,0,0);
                position: relative;
                &:before{
                    content: "";
                    position: absolute;
                    z-index: -1;
                    left: 0;
                    right: 0;
                    bottom: 3px;
                    background: #d10e2c;
                    height: 4px;
                    -webkit-transform: translateY(4px);
                    transform: translateY(4px);
                    -webkit-transition-property: transform;
                    transition-property: transform;
                    -webkit-transition-duration: .3s;
                    transition-duration: .3s;
                    -webkit-transition-timing-function: ease-out;
                    transition-timing-function: ease-out;
                }
            }
        }
    }
}
	
</style>