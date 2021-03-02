<template>
    <div class="ListItemValue" @click="change">
        <div class="title" :style="{color:chick_flag ? 'rgba(0, 208, 186, 1)' : 'rgb(0, 0, 0, 1)'}">{{title_content}}</div>
        <div class="bottom"></div>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"ListItemValue",
    components:{
    },
    props:[
        "state",
        "value"
    ],
    watch:{
        state:{
            handler(newVal,oldVal){
                if(newVal !== undefined){
                    this.chick_flag = newVal
                }
            },
            immediate:true,
            deep:true
        },
        value:{
            handler(newVal,oldVal){
                this.title_content = newVal
            },
            immediate:true,
            deep:true
        }
    },
    data(){
        return {
            aspect_ratio:0,
            title_content:this.value,
            bottom_show:true,
            allow_chick:true,
            chick_flag:false,
        }
    },
    methods:{
        change(){
            
            // if(this.allow_chick){
            //     this.chick_flag = !this.chick_flag
            // }
            this.$emit("event",this.chick_flag)
        }
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
.ListItemValue{
    position: relative;
    width: 100%;
    height: 100px;
    background-color: white;
}
.ListItemValue:active{
    background-color: $buttonActiveColor;
}
.title{
    position: absolute;
    width: 100%;
    height: 50px;
    top: calc(50% - 25px);
    line-height: 50px;
    font-size: 35px;
    @include text_limit();
    text-align: center;
    color: black;
}
.bottom{
    position: absolute;
    width: calc(100% - 80px);
    height: 1px;
    left: 40px;
    bottom: 0px;
    background-color: rgb(206, 206, 206);
}
</style>