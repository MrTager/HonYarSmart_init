<template>
    <div class="BottomSwitch" @click="change()">
        <div class="BottomSwitch_name">解绑</div>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"BottomSwitch",
    props:[
        "value"
    ],
    data(){
        return {
            open:"",
            close:"",
            state:0,
        }
    },
    methods:{
        change(){
            this.state == 0 ? this.state = 1 : this.state = 0;
        }
    },
    mounted(){

    },
    created(){
        //console.log(this.value)
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
.BottomSwitch{
    position: relative;
    width: 590px;
    height: 85px;
    border-radius: 50px;
    background-color: #33d9c8;
    -moz-box-shadow:0px 0px 20px #c6c6c6;
    -webkit-box-shadow:0px 0px 20px #c6c6c6;
    box-shadow:0px 0px 20px #c6c6c6;
    color: white;
    &_name{
        position: absolute;
        font-size: 30px;
        width: 100%;
        height: 85px;
        line-height: 85px;
        @include text_limit();
        text-align: center;
    }
}
.BottomSwitch:active{
    background-color: white;
    color: #33d9c8;
}

</style>