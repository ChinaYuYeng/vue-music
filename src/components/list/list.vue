<template>
	<div class="g-container">
		<div class="top" >
			<scroll :data='this.data' :listenEnd='false' @scrollEnd='isEnd' @loadData='loadData'>
				<ul class="base-ul vetical">
					<li v-for='item in data'>
						<img :src="item.imgurl"/>
						<p>{{item.dissname}}</p>
					</li>
				</ul>
			</scroll>
			<div>
					<br />
					<br />
					<br />
				</div>
		</div>
	</div>
</template>

<script>
	import $ from 'axios'
	import scroll from 'base/scroll/scroll'
	export default {
		data:function(){
			return {
				data:[],
				currentPage:1,
			}
		},
		created:function(){
			this.loadData();
		},
		
		methods:{
			isEnd(msg){
				console.log(msg)
			},
			loadData(){
				$.get('/api/searchMusic',{
					params:{
						page:this.currentPage++
					}
				}).then((res)=>{
					function musicLyric(data){
						console.log(data.lyric);
					}
					debugger
					if(res){
						eval(res.data);
//						this.data = this.data.concat(res.data);
					}
				})
			}
		},
		components:{
			scroll
		}
		
	}
</script>

<style lang='less' scoped>
	.base-ul{
		margin: 0 auto;
	}
	
	.horizontal{
		li{
			float: left;
		}
		&:after{
			content: '';
			display: table;
			clear: both;
		}
	}
	
	.top{
		height: 500px;
		width: 360px;
		margin:0 auto;
	}
	
	.vetical{
		li{
			text-align: center;
			background-color: #ccc;
			border-bottom: 1px solid #fff;
			img{
				width: 50px;
				height: 50px;
			}
			p{
				text-align: center;
				font-size: 12px;
				line-height: 1.6;
				color: #fff;
			}
		}
	}
	
</style>