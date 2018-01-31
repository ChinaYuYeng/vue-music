<template>
	<div class="history-wrap">
		<transition-group name="list" tag="ul" class="history-list">
			<li v-for="(item,index) in history" :key='item' @click="selectItem(index,item)">
				<span v-text='item' class="text"></span>
				<span class="ff icon" @click.stop="deleteItem(index,item)">&#xe62a;</span>
			</li>
		</transition-group>
	</div>
</template>

<script>
	export default {
		name:'historylist',
		props:{
			history:{
				type:Array,
				default:null
			}
		},
		methods:{
			deleteItem(index,item){
				this.$emit('delete',index,item);
			},
			selectItem(index,item){
				this.$emit('select',index,item)
			}
		}
	}
</script>

<style lang="less" scoped>
.history-wrap{
	height: 100%;
}

li{
	height: .8rem;
	line-height: .8rem;
	font-size: .28rem;
	text-align: left;
	overflow: hidden;
	.icon{
		float: right;
	}
}


 .list-enter-active, 
 .list-leave-active{
 	transition: all .5s;
 }
 .list-enter,
 .list-leave-to{
 	height: 0;
 }
       
</style>