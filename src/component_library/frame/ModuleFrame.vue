<template>
    <div class="ModuleFrame">
        <div class="title">
            <img v-if="frameType === 'normal'" class="titleImage" :src="require(`../../assets/images/icon/module/${img}`)" alt="">
            <div class="titleName" :style="{left: frameType === 'normal' ? `${120*aspect_ratio}px` : (frameType === 'noIcon' ? `${60*aspect_ratio}px` : `${60*aspect_ratio}px`)}">{{name}}</div>
            <div class="rightOption" v-if="rightOptionFlag" @click="rightOptionEvent">
                <img src="../../assets/images/icon/module/edit_icon.png"/>
                <span>编辑昵称</span>
            </div>
        </div>
        <slot></slot>
    </div>
</template>
<script>
import Honyar from "@/utils/WebAPI";

export default {
    name:"ModuleFrame",
    props:[
        "titleName",
        "titleImg",
        "type",
        "rightOption"
    ],
    watch:{
        type:{
            handler(newVal,oldVal){
                let _this = this;
                _this.frameType = newVal
            },
            immediate:true,
            deep:true,
        },
    },
    data(){
        return {
            aspect_ratio:0,
            img:this.titleImg,
            name:this.titleName,
            frameType:this.type, //normal noIcon
            rightOptionFlag:this.rightOption !== undefined ? true : false
        }
    },
    methods:{
        rightOptionEvent(){
            this.$emit("rightOptionEvent")
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
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ModuleFrame{
    width: 100%;
}
.title{
    position: relative;
    width: 100%;
    height: 50px;
    //margin-top: 40px;
    margin-bottom: 20px;
    .rightOption{
        position: absolute;
        width: 150px;
        height: 30px;
        right: 50px;
        top: calc(50% - 15px);
        img{
            position: absolute;
            width: 27px;
            height: 27px;
            left: 0;
        }
        span{
            position: absolute;
            right: 0;
            @include oneLineTextStyle(118px,30px,28px,rgba(137, 137, 137, 1))
        }
    }
}
.titleImage{
    position: absolute;
    width: 40px;
    height: 40px;
    left: 70px;
    top: calc(50% - 20px);
}
.titleName{
    position: absolute;
    width: 330px;
    height: 40px;
    top: calc(50% - 20px);
    @include text_limit();
    font-size: 30px;
    line-height: 40px;
}

</style>