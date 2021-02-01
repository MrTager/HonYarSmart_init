<template>
    <div class="ChickSwitch" :class="{'open':state == 1,'close':state == 0}" @click="change()">
        <!-- <img v-if="now_icon !== ''" class="RoundSwitch_icon"  :src="require('@/assets/images/icon/button/'+now_icon)" alt="按钮图标" > -->
        <div class="ChickSwithGuide" ref="ChickSwithGuide">
            <div class="ChickSwithBlock" ref="ChickSwithBlock" :style="{left:(blockLeft === 0 ? '0px' : `${58*aspect_ratio}px`)}"></div>
        </div>
    </div>
</template>
<script>
/**
 * 圆形电源开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"ChickSwitch",
    props:[
        "type",
        "enable"
    ],
    watch:{
        enable:{
            handler(newVal,oldVal){
                this.state = newVal
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
            state:this.enable,
            blockLeft:0,
            aspect_ratio:0,
            loop:null,
        }
    },
    methods:{
        change(){
            let _this = this;
            // this.state == 0 ? this.state = 1 : this.state = 0;
            // this.state == 0 ? this.$set(this,"now_icon",this.close) : this.$set(this,"now_icon",this.open);

            //console.log(_this.blockLeft)
            _this.blockLeft === 0 ? _this.$set(this,"blockLeft",1) : _this.$set(this,"blockLeft",0);
            if(_this.blockLeft === 0){
                //_this.$refs.ChickSwithBlock.style.left = "0px";
                _this.$refs.ChickSwithGuide.style.backgroundColor = "#c5c5c5"
                _this.$refs.ChickSwithBlock.style.backgroundColor = "#FFFFFF"
                _this.$refs.ChickSwithGuide.style.boxShadow = `inset 0px 0px ${5*_this.aspect_ratio}px ${1*_this.aspect_ratio}px rgb(187, 187, 187)`
                _this.$emit("state",0)
            }else{
                //_this.$refs.ChickSwithBlock.style.left = "58px";
                _this.$refs.ChickSwithGuide.style.backgroundColor = "#83e4de"
                _this.$refs.ChickSwithBlock.style.backgroundColor = "#00d0ba"
                _this.$refs.ChickSwithGuide.style.boxShadow = `inset 0px 0px ${5*_this.aspect_ratio}px ${1*_this.aspect_ratio}px rgb(0, 208, 186)`
                _this.$emit("state",1)
            }
            /**延时下发指令，避免用户频繁触发 */
            clearTimeout(_this.loop)
            _this.loop = setTimeout(()=>{
                this.$emit("event",this.state)
            },400)
        }
    },
    mounted(){

    },
    created(){
        let _this = this;
        let s_width = Number(window.screen.width);
        _this.aspect_ratio = s_width/750
        // switch(this.type){
        //     case "child_lock":
        //         this.open = "child_lock_white.png";
        //         this.close = "child_lock_black.png";
        //         this.now_icon = "child_lock_black.png";
        //         break;
        // }
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
.ChickSwitch{
    position: relative;
    width: 100px;
    height: 40px;
}
.ChickSwithGuide{
    position: absolute;
    width: 98px;
    height: 15px;
    border-radius: 7.5px;
    left: calc(50% - 49px);
    top: calc(50% - 7.5px);
    background-color: #c5c5c5;
    box-shadow:inset 0px 0px 5px 1px rgb(187, 187, 187);
    transition: all 0.5s;
    -moz-transition: all 0.5s;	/* Firefox */
    -webkit-transition: all 0.5s;	/* Safari 和 Chrome */
    -o-transition: all 0.5s;	/* Opera */
}
.ChickSwithBlock{
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: #FFFFFF;
    -moz-box-shadow:0px 0px 20px #929292;
    -webkit-box-shadow:0px 0px 20px #929292;
    box-shadow:0px 0px 20px #929292;
    top: calc(50% - 20px);
    transition: all 0.5s;
    -moz-transition: all 0.5s;	/* Firefox */
    -webkit-transition: all 0.5s;	/* Safari 和 Chrome */
    -o-transition: all 0.5s;	/* Opera */
}
.RoundSwitch_icon{
    position: absolute;
    width: 50px;
    height: 50px;
    left: calc(50% - 25px);
    top: calc(50% - 25px);
}
.open{
    //background-color: #00d0ba;
}
.close{
    //background-color: white;
}
</style>