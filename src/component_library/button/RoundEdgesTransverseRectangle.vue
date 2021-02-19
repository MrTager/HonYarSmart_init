<template>
    <div class="RoundEdgesTransverseRectangle" :class="{'open':state == 1,'close':state == 0}" @click="change()">
        <div class="changeColor" >
            <span >{{switch_title}}</span>
        </div>
    </div>
</template>
<script>
/**
 * 圆形电源开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"RoundEdgesTransverseRectangle",
    props:[
        "type",
        "title"
    ],
    data(){
        return {
            open:"",
            close:"",
            state:0,
            switch_title:this.title,

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
.RoundEdgesTransverseRectangle{
    position: relative;
    width: 180px;
    height: 76px;
    border-radius: 38px;
    overflow: hidden;
    @include switchBoxShadow();
    transform: all 0.3s;
    span{
        position: absolute;
        top: calc(50% - 15px);
        @include oneLineTextStyle_noColor(100%,30px,28px)
    }
}
.changeColor{
    width: 100%;
    height: 100%;
}
.changeColor:active{
    background-color: $buttonActiveColor;
}
.open{
    background-color: #00d0ba;
    color: white;
}
.close{
    background-color: white;
    color: black;
}
</style>