<template>
    <div class="ListItemTiming" @touchstart="del_start" @touchmove="del_move" @touchend="del_end">
        <div class="time" :style="{color:enable === 0 ? 'rgba(191, 191, 191, 1)' : 'rgba(51, 51, 51, 1)'}">{{timeValue}}</div>
        <div class="info" :style="{color:enable === 0 ? 'rgba(203, 203, 203, 1)' : 'rgba(102, 102, 102, 1)'}">{{timeInfo}}</div>
        <div class="switch">
            <Chick-Switch :enable="enable"  @state="setState" @event="switchEvent"></Chick-Switch>
        </div>
        <InsideLine-DividingStrip></InsideLine-DividingStrip>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";
import { ChickSwitch,InsideLineDividingStrip } from "@/component_library";

export default {
    name: "ListItemTiming",
    components: {
        "Chick-Switch":ChickSwitch,
        "InsideLine-DividingStrip":InsideLineDividingStrip
    },
    props:[
        "time",
        "info"
    ],
    watch:{
        time:{
            handler(newVal,oldVal){
                this.timeValue = newVal
            },
            immediate:true,
            deep:true
        },
        info:{
            handler(newVal,oldVal){
                this.timeInfo = newVal
            },
            immediate:true,
            deep:true
        }
    },
    data(){
        return {
            aspect_ratio:0,
            loop:null,
            timeValue:this.time,
            timeInfo:this.info,
            enable:0,
        }
    },
    methods:{
        del_start(){
            var _this = this;
            clearTimeout(this.loop); 
            this.loop = setTimeout(() => {
                this.$emit("delete")
            }, 600);
        },
        del_move(){
            clearTimeout(this.loop);
        },
        del_end(){
            var that = this;
            clearTimeout(this.loop);
        },
        setState(val){
            this.$set(this,"enable",val)
        },
        switchEvent(){
            console.log("下发开关指令",this.enable)
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
  //white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
.ListItemTiming{
    position: relative;
    width: 100%;
    height: 150px;
    background-color: white;
    //border-bottom: 1px solid #ccc;
}
.time{
    position: absolute;
    // width: 160px;
    // height: 50px;
    // left: 30px;
    // top: 25px;
    // font-size: 50px;
    // line-height: 50px;
    // text-align: center;
    background-color: cadetblue;
    @include oneLineTextStyle_noColor(420px,50px,50px);
    top: 20px;
    left: 20px;
    text-align: left;
    transition: all 0.5s;
    -moz-transition: all 0.5s;	/* Firefox */
    -webkit-transition: all 0.5s;	/* Safari 和 Chrome */
    -o-transition: all 0.5s;	/* Opera */
}
.info{
    position: absolute;
    @include oneLineTextStyle_noColor(550px,60px,20px);
    text-align: left;
    left: 40px;
    bottom: 5px;
    transition: all 0.5s;
    -moz-transition: all 0.5s;	/* Firefox */
    -webkit-transition: all 0.5s;	/* Safari 和 Chrome */
    -o-transition: all 0.5s;	/* Opera */
}
.switch{
    position: absolute;
    width: 100px;
    height: 50px;
    right: 30px;
    top: calc(50% - 25px);
}
</style>