<template>
    <div class="WideSlider" ref="slide" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
        <div class="slide_cover" :style="{'width':position*aspect_ratio+'px'}"></div>
        <div class="line" :class="`line_${i}`" v-for="(item,i) in new Array(9)" :key="i"></div>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"WideSlider",
    props:[
    ],
    data(){
        return {
            aspect_ratio:0,
            position:0,
            slide_prop:{},//slide节属性
        }
    },
    methods:{
        touchstart(e){
            let _this = this;
            e = event || window.event
            e.preventDefault();   
            e.stopPropagation(); //阻止冒泡事件
            _this.position = parseInt(e.changedTouches[0].clientX - _this.slide_prop.x)
            if(_this.position <= 0){
                _this.position = 0;
            }else if(_this.position >= _this.slide_prop.width){
                _this.position = _this.slide_prop.width;
            }
        },
        touchmove(e){
            let _this = this;
            e = event || window.event
            e.preventDefault();   
            e.stopPropagation(); //阻止冒泡事件
            _this.position = parseInt(e.changedTouches[0].clientX -  _this.slide_prop.x)
             if(_this.position <= 0){
                _this.position = 0;
            }else if(_this.position >= _this.slide_prop.width){
                _this.position = _this.slide_prop.width;
            }
        },
        touchend(e){
            let _this = this;
            e = event || window.event
            let percent = parseInt(_this.position/_this.slide_prop.width*100)
            //_this.$emit('percent',percent)
        }
    },
    mounted(){
        let _this = this;
        //获取sliderBox相对于屏幕的位置
        _this.slide_prop = _this.$refs.slide.getBoundingClientRect();
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
.WideSlider{
    position: relative;
    width: 640px;
    height: 100px;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
    border-radius: 25px;
    overflow: hidden;
    -moz-box-shadow:0px 0px 20px #c6c6c6;
    -webkit-box-shadow:0px 0px 20px #c6c6c6;
    box-shadow:0px 0px 20px #c6c6c6;
}
.line{
    position: absolute;
    top: calc(50% - 17.5px);
    width: 1px;
    height: 35px;
    background-color: gray;
    pointer-events: none;
}
.slide_cover{
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    border-radius: 25px;
    background-color:#83e4de;
}
@for $i from 0 through 9 {
    .line_#{$i}{
        left: ($i+1)*64px;
    }
}
</style>