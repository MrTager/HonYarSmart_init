<template>
    <div class="AnimationFrame" ref="AnimationFrame">
        <slot></slot>
    </div>
</template>
<script>
import Honyar from "@/utils/WebAPI";

export default {
    name:"AnimationFrame",
    props:[
    ],
    watch:{
    },
    data(){
        return {
            aspect_ratio:0,
        }
    },
    methods:{
    },
    mounted(){
        
    },
    created(){
        let _this = this;
        let s_width = Number(window.screen.width);
        _this.aspect_ratio = s_width/750
    }
}
</script>
<style lang="scss" scoped>
@mixin text_limit() {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.AnimationFrame{
    position: relative;
    width: 100%;
    height: 100%;
    animation:create 0.4s 1;
	/*Safari 和 Chrome:*/
	-webkit-animation:create 0.4s 1;
}
@keyframes create
{
	from {left: 750px;}
	to {left: 0px;}
}

/*Safari 和 Chrome:*/
@-webkit-keyframes create
{
	from {left: 750px;}
	to {left: 0px;}
}
// @keyframes destroy
// {
// 	from {right: 0px;}
// 	to {right: -750px;}
// }

// /*Safari 和 Chrome:*/
// @-webkit-keyframes destroy
// {
// 	from {right: 0px;}
// 	to {right: -750px;}
// }
</style>