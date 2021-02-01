<template>
    <div class="RectangularSwitch" >
        <div class="SquareSwitch" :class="{'open':state == 1,'close':state == 0}"  v-if="show == 0" @click="change()">
            <img v-if="now_icon !== ''" class="SquareSwitch_icon"  :src="require('@/assets/images/icon/button/'+now_icon)" alt="按钮图标" >
            <div class="state_value" :class="{'open_text':state == 1,'close_text':state == 0}">{{state_value}}</div>
        </div>
        <div class="RectangleSwitch" :class="{'open':state == 1,'close':state == 0}"  v-else @click="change()">
            <img v-if="now_icon !== ''" class="icon"  :src="require('@/assets/images/icon/button/'+now_icon)" alt="按钮图标" >
            <div class="state_value" :class="{'open_text':state == 1,'close_text':state == 0}">{{state_value}}</div>
        </div>
    </div>
</template>
<script>
/**
 * 矩形电源开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"RectangularSwitch",
    props:[
        "type",
        "category"
    ],
    data(){
        return {
            open:"",
            close:"",
            now_icon:"",
            state:0,
            state_value:"打开",
            show:0,
        }
    },
    methods:{
        change(){
            this.state == 0 ? this.state = 1 : this.state = 0;
            this.state == 0 ? this.$set(this,"now_icon",this.close) : this.$set(this,"now_icon",this.open)
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
        if(this.category == "Square"){
            this.show = 0;
        }else
        {
            this.show = 1;
        }
    }
}
</script>
<style lang="scss" scoped>
div,span {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
@mixin text_limit() {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.SquareSwitch{
    position: relative;
    width: 195px;
    height: 185px;
    border-radius: 30px;
    -moz-box-shadow:0px 0px 20px #c6c6c6;
    -webkit-box-shadow:0px 0px 20px #c6c6c6;
    box-shadow:0px 0px 20px #c6c6c6;
    .icon{
        position: absolute;
        width: 50px;
        height: 50px;
        left: calc(50% - 25px);
        top: 40px;
    }
    .state_value{
        position: absolute;
        width:100%;
        font-size: 30px;
        top: 110px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        pointer-events: none;
    }
}
.RectangleSwitch{
    position: relative;
    width: 135px;
    height: 250px;
    border-radius: 30px;
    -moz-box-shadow:0px 0px 20px #c6c6c6;
    -webkit-box-shadow:0px 0px 20px #c6c6c6;
    box-shadow:0px 0px 20px #c6c6c6;
    .icon{
        position: absolute;
        width: 50px;
        height: 50px;
        left: calc(50% - 25px);
        top: 80px;
    }
    .state_value{
        position: absolute;
        width:100%;
        font-size: 25px;
        top: 150px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        pointer-events: none;
    }
}
.open{
    background-color: #00d0ba;
}
.close{
    background-color: white;

}
.open_text{
    color: white;
}
.close_text{
    color: black;
}
</style>