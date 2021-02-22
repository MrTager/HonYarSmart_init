<template>
    <div class="ListItem" :class="{bottom_line:bottom_line}">
        <div class="roundChick" v-if="item_type === 'check' ">
            <Round-Chick :enable="check_enable" @event="enableChange"></Round-Chick>
        </div>
        <div class="img" v-if="item_type === 'imgItem' ">
            <img :src="require(`../../assets/images/icon/module/${imageUrl}.png`)" alt="">
        </div>
        <div class="title" :style="{left:item_type === 'check' ? `${80*aspect_ratio}px` : ( item_type === 'imgItem' ? `${120*aspect_ratio}px` : `${30*aspect_ratio}px`)}">
            {{title_content}}
        </div>
        <div class="value" :style="{right:showArrow ? `${60*aspect_ratio}px` : `${35*aspect_ratio}px`}" @click="click">
            {{value_content}}
        </div>
        <img class="arrow" v-if="showArrow"  src="../../assets/images/icon/gray_arrow.png" alt="" @click="click">
        <Inside-Line-Dividing-Strip></Inside-Line-Dividing-Strip>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";
import { RoundChick,InsideLineDividingStrip } from "@/component_library"

export default {
    name:"ListItem",
    components:{
        "Round-Chick":RoundChick,
        "Inside-Line-Dividing-Strip":InsideLineDividingStrip
    },
    props:[
      "iconName",
      "type",
      "title",
      "value",
      "enable",
      "bottomLine",
      "arrow"
    ],
    watch:{
        iconName:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.imageUrl = newVal
                }
            },
            immediate:true,
            deep:true,
        },
        type:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.item_type = newVal
                }
            },
            immediate:true,
            deep:true,
        },
        title:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.title_content = newVal
                }
            },
            immediate:true,
            deep:true,
        },
        value:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.value_content = newVal
                }
            },
            immediate:true,
            deep:true,
        },
        enable:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.check_enable = newVal;
                }
            },
            immediate:true,
            deep:true,
        },
        bottomLine:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.bottom_line = JSON.parse(newVal);
                }
            },
            immediate:true,
            deep:true,
        },
        arrow:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    if(newVal == ""){
                        _this.showArrow = true;
                        return
                    }
                    if(JSON.parse(newVal)){
                        _this.showArrow = true;
                    }else{
                        _this.showArrow = false;
                    }
                    
                }else{
                    _this.showArrow = false;
                }
            },
            immediate:true,
            deep:true,
        }
    },
    data(){
        return {
            aspect_ratio:0,
            bottom_line:true,
            item_type:"imgItem",//check imgItem noValue
            right_arrow:false,
            title_content:"",
            value_flag:false,
            value_content:"",
            imageUrl:"",
            check_enable:0, //0  1
            showArrow:true
        }
    },
    methods:{
        click(){
            this.$emit("event")
        },
        enableChange(val){
            this.$emit("enableEvent",val)
        }
    },
    mounted(){

    },
    created(){
        let _this = this;
        let s_width = Number(window.screen.width);
        _this.aspect_ratio = s_width/750;
        
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
.ListItem{
    position: relative;
    width: 100%;
    height: 100px;
    background-color: white;
}
.bottom_line{
    border-bottom: 1px solid rgba(238, 238, 238, 1);
}
.roundChick{
    position: absolute;
    width: 38px;
    height: 38px;
    left: 30px;
    top: calc(50% - 19px);
}
.title{
    position: absolute;
    width: 300px;
    height: 50px;
    top: calc(50% - 25px);
    line-height: 50px;
    font-size: 30px;
    @include text_limit();
    text-align: left;
    color: rgba(49, 49, 49, 1);
    font-family: 'PingFang-SC-Medium';
}
.value{
    position: absolute;
    width: 300px;
    height: 50px;
    top: calc(50% - 25px);
    line-height: 50px;
    font-size: 35px;
    @include text_limit();
    text-align: right;
    right: 60px;
    color: rgba(102, 102, 102, 1);
}
.arrow{
    position: absolute;
    width: 13.6px;
    height: 26.4px;
    top: calc(50% - 13.2px);
    right: 35px;
}
.img{
    position: absolute;
    width: 40px;
    height: 40px;
    left: 60px;
    top: calc(50% - 22px);
    img{
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>