<template>
<!-- @touchstart="del_start" @touchmove="del_move" @touchend="del_end" -->
    <div class="ListItemTiming" ref="ListItemTiming" @touchstart="del_start" @touchmove="del_move" @touchend="del_end">
        <div class="time" :style="{color:enable === 0 ? 'rgba(191, 191, 191, 1)' : 'rgba(51, 51, 51, 1)'}">{{timeValue}}</div>
        <div class="modeInfo" :style="{color:enable === 0 ? 'rgba(191, 191, 191, 1)' : 'rgba(51, 51, 51, 1)'}">{{modeInfo}}</div>
        <div class="info" :style="{color:enable === 0 ? 'rgba(203, 203, 203, 1)' : 'rgba(102, 102, 102, 1)'}">{{timeInfo}}</div>
        <div class="switch">
            <Chick-Switch :enable="enable"   @event="setState"></Chick-Switch>
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
        "info",
        "state",
        "mode"
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
        },
        mode:{
            handler(newVal,oldVal){
                this.modeInfo = newVal
            },
            immediate:true,
            deep:true
        },
        state:{
            handler(newVal,oldVal){
                if(newVal !== undefined){
                    //this.enable = JSON.parse(newVal) ? 1 : 0
                    this.$set(this,"enable",JSON.parse(newVal) ? 1 : 0)
                }
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
            modeInfo:this.mode,
            enable:0,
        }
    },
    methods:{
        del_start(e){
            let _this = this;
            // _this.$nextTick(()=>{
            //     _this.$refs.ListItemTiming.style.backgroundColor = 'rgba(211, 211, 211,0.5)'
            // })
        },
        del_move(e){
            let _this = this;
            // _this.$nextTick(()=>{
            //     _this.$refs.ListItemTiming.style.backgroundColor = 'rgba(255, 255, 255,1)'
            // })
        },
        del_end(e){
            let _this = this;
            // _this.$nextTick(()=>{
            //     _this.$refs.ListItemTiming.style.backgroundColor = 'rgba(255, 255, 255,1)'
            // })
        },
        setState(val){
            //this.$set(this,"enable")
            this.$emit("checkSwitchEvent")
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
.ListItemTiming:active{
    background-color: $buttonActiveColor;
}
.time{
    position: absolute;
    @include oneLineTextStyle_noColor(170px,50px,50px);
    top: 20px;
    left: 30px;
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
.modeInfo{
    position: absolute;
    @include oneLineTextStyle_noColor(400px,60px,20px);
    text-align: left;
    left: 40px;
    top: 55px;
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