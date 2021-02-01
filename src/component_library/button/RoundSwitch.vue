<template>
    <div class="RoundSwitch" :class="{'open':state == 1,'close':state == 0}" @click="change()">
        <img v-if="now_icon !== ''" class="RoundSwitch_icon"  :src="require('@/assets/images/icon/button/'+now_icon)" alt="按钮图标" >
    </div>
</template>
<script>
/**
 * 圆形电源开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"RoundSwitch",
    props:[
        "type"
    ],
    data(){
        return {
            open:"",
            close:"",
            now_icon:"",
            state:0,
        }
    },
    methods:{
        change(){
            this.state == 0 ? this.state = 1 : this.state = 0;
            this.state == 0 ? this.$set(this,"now_icon",this.close) : this.$set(this,"now_icon",this.open);
        }
    },
    mounted(){

    },
    created(){
        switch(this.type){
            case "child_lock":
                this.open = "child_lock_white.png";
                this.close = "child_lock_black.png";
                this.now_icon = "child_lock_black.png";
                break;
        }
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
.RoundSwitch{
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50px;
    -moz-box-shadow:0px 0px 20px #c6c6c6;
    -webkit-box-shadow:0px 0px 20px #c6c6c6;
    box-shadow:0px 0px 20px #c6c6c6;
}
.RoundSwitch_icon{
    position: absolute;
    width: 50px;
    height: 50px;
    left: calc(50% - 25px);
    top: calc(50% - 25px);
}
.open{
    background-color: #00d0ba;
}
.close{
    background-color: white;
}
</style>