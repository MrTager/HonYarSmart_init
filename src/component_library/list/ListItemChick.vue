<template>
    <div class="ListItemChick" @click="change">
        <div class="title" :style="{color:check_show == 1 ? 'rgba(102, 102, 102, 1)' : 'rgba(187, 187, 187, 1)'}">{{title_content}}</div>
        <img v-if="check_show == 1" class="check" src="../../assets/images/icon/check.png" alt="">
        <div class="bottom"></div>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"ListItemChick",
    components:{
    },
    props:[
        "title",
        "state"
    ],
    watch:{
        title:{
            handler(newVal,oldVal){
                this.title_content = newVal
            }
        },
        state:{
            handler(newVal,oldVal){
                console.log("状态",newVal)
                this.check_show = newVal
            }
        }
    },
    data(){
        return {
            aspect_ratio:0,
            title_content:this.title,
            bottom_show:true,
            check_show:this.state
        }
    },
    methods:{
        change(){
            this.$emit("event")
            //this.check_show == 0 ? this.check_show = 1 : this.check_show = 0;
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
.ListItemChick{
    position: relative;
    width: 100%;
    height: 100px;
    background-color: white;
}
.title{
    position: absolute;
    width: 300px;
    height: 50px;
    top: calc(50% - 25px);
    left: 40px;
    line-height: 50px;
    font-size: 35px;
    @include text_limit();
    text-align: left;
}
.check{
    position: absolute;
    width: 40px;
    height: 32px;
    right: 60px;
    top: calc(50% - 16px);
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