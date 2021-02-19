<template>
    <div class="RoundSwitch" ref="roundSwitch" :class="{'open':enable == 1,'close':enable == 0}" @click="change()">
        <div class="changeColor">
            <img v-if="now_icon !== ''" class="RoundSwitch_icon"  :src="require('@/assets/images/icon/button/'+now_icon)" alt="按钮图标" >
        </div>
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
        "type",
        "state"
    ],
    watch:{
        state:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.$set(_this,'enable',newVal)
                    _this.changeStyle(newVal);
                }
            },
            immediate:true,
            deep:true
        }
    },
    data(){
        return {
            open:"",
            close:"",
            now_icon:"",
            enable:0,
        }
    },
    methods:{
        changeStyle(state){
            let _this = this;
            state === 0 ? _this.$set(this,"enable",0) : _this.$set(this,"enable",1);
             if(state === 0){
                 _this.$nextTick(()=>{
                     _this.$refs.roundSwitch.style.backgroundColor = "rgba(255, 255, 255, 1)"
                 })
            }else{
                _this.$nextTick(()=>{
                    _this.$refs.roundSwitch.style.backgroundColor = "rgba(0, 208, 186, 1)"
                })
            }
        },
        change(){
            let _this = this
            this.enable == 0 ? this.$set(this,"now_icon",this.close) : this.$set(this,"now_icon",this.open);
            _this.enable === 0 ? _this.$set(this,"enable",1) : _this.$set(this,"enable",0);
            this.$emit("event",_this.enable)
           
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
            case "power":
                this.open = "power_icon_white.png";
                this.close = "power_icon_black.png";
                this.now_icon = "power_icon_black.png"
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
    overflow: hidden;
    @include switchBoxShadow();
}
.RoundSwitch_icon{
    position: absolute;
    width: 50px;
    height: 50px;
    left: calc(50% - 25px);
    top: calc(50% - 25px);
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
}
.close{
    background-color: white;
}
</style>