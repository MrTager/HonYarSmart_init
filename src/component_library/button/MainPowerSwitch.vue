
<template>
    <div class="MainPowerSwitch" ref="mainPowerSwitch" @click="change">
        <div class="close_text">
            <div class="zh">关闭</div>
            <div class="en">OFF</div>
        </div>
        <div class="open_text">
            <div class="zh">开启</div>
            <div class="en">ON</div>
        </div>
        <div class="contianer">
            <div class="sliderBlock" :style="{top:(state === 1 ? `${20*aspect_ratio}px` : `${129*aspect_ratio}px`)}">
                <img class="icon" src="@/assets/images/icon/button/power_icon.png" alt="">
            </div>
        </div>
        
    </div>
</template>
<script>
/**
 * 主电源开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"MainPowerSwitch",
    props:[
        "status"
    ],
    watch:{
        status:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.$set(_this,'state',newVal)
                    _this.changeStyle(newVal);
                }
            },
            deep:true,
            immediate:true
        }
    },
    data(){
        return {
            state:0,
            aspect_ratio:0,
        }
    },
    methods:{
        changeStyle(state){
            let _this = this;
            state === 0 ? _this.$set(this,"state",0) : _this.$set(this,"state",1);
             if(state === 0){
                 _this.$nextTick(()=>{
                     _this.$refs.mainPowerSwitch.style.backgroundColor = "rgba(208, 208, 208, 1)"
                 })
            }else{
                _this.$nextTick(()=>{
                    _this.$refs.mainPowerSwitch.style.backgroundColor = "rgba(205, 244, 242, 1)"
                })
            }
        },
        change(){
            let _this = this
            _this.state === 0 ? _this.$set(this,"state",1) : _this.$set(this,"state",0);
            /**延时下发指令，避免用户频繁触发 */
            clearTimeout(_this.loop)
            _this.loop = setTimeout(()=>{
                this.$emit("event",_this.state)
            },150)
        }
    },
    mounted(){
        let _this = this;
        _this.changeStyle(this.state);
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
.MainPowerSwitch{
    position: relative;
    width: 136px;
    height: 250px;
    margin-left: auto;
    margin-right: auto;
    background-color: rgba(205, 244, 242, 1);
    border-radius: 65.5px;
    transition: all 0.3s;
    -moz-transition: all 0.3s;	/* Firefox */
    -webkit-transition: all 0.3s;	/* Safari 和 Chrome */
    -o-transition: all 0.3s;	/* Opera */
    .close_text{
        position: absolute;
        width: 100%;
        height: 80px;
        top: 36px;
        text-align: center;
        .zh{
            position: absolute;
            width: 100%;
            font-family: 'PingFang-SC-Medium';
            font-size: 30px;
            color: rgba(0, 0, 0, 1);
            top: 0px;
            text-align: center;
        }
        .en{
            position: absolute;
            width: 100%;
            top: 35px;
            text-align: center;
            color: rgba(149, 149, 149, 1);
            font-size: 24px;
            font-family: 'PingFang-SC-Medium';
        }
    }
    .open_text{
        position: absolute;
        width: 100%;
        height: 80px;
        bottom: 36px;
        text-align: center;
        .zh{
            position: absolute;
            width: 100%;
            font-family: 'PingFang-SC-Medium';
            font-size: 30px;
            color: rgba(0, 0, 0, 1);
            bottom: 35px;
            text-align: center;
        }
        .en{
            position: absolute;
            width: 100%;
            bottom: 0px;
            text-align: center;
            color: rgba(149, 149, 149, 1);
            font-size: 24px;
            font-family: 'PingFang-SC-Medium';
        }
    }
    .contianer{
        position: absolute;
        width: 100%;
        height: 100%;
        .sliderBlock{
            position: absolute;
            width: 101px;
            height: 101px;
            background-color: white;
            border-radius: 65.5px;
            left: calc(50% - 50.5px);
            top: 16px;
            box-shadow: 0px 0px 10px #dcdcdc;
            transition: all 0.3s;
            -moz-transition: all 0.3s;	/* Firefox */
            -webkit-transition: all 0.3s;	/* Safari 和 Chrome */
            -o-transition: all 0.3s;	/* Opera */
            .icon{
                position: absolute;
                width: 58px;
                height: 54px;
                left: calc(50% - 29px);
                top: calc(50% - 27px);

            }
        }
    }
}
    
.power{
    width: 100%;
    height: 100%;
}


</style>