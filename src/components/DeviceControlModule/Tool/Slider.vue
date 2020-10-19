<template>
    <div class="sliderBox" >
        <div class="slide" ref="slide" @touchstart="touchstart()" @touchmove="touchmove()" @touchend="touchend()">
            <div class="slide_cover" :style="{'width':position/window_proportion+'rem'}"></div>
            <div class="scale-1"></div>
            <div class="scale-2"></div>
            <div class="scale-3"></div>
            <div class="scale-4"></div>
        </div>
    </div>
</template>
<script>
export default {
    name:'sliderBox',
    data(){
        return {
            position:0,
            slide_prop:{},//slide节属性
            window_proportion:10,
        }
    },
    props:["per"],
    watch:{
        per:{
            handler(newVal,oldVal){
                let _this = this;
                _this.position = newVal/100*_this.slide_prop.width
            },
            immediate: true,
           deep: true,
            
        }
        
    },
    methods:{
        touchstart(e){
            let _this = this;
            e = event || window.event
            e.preventDefault();   
            e.stopPropagation(); //阻止冒泡事件
            _this.position = parseInt(e.changedTouches[0].clientX - e.target.offsetLeft - _this.slide_prop.x)
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
            _this.position = parseInt(e.changedTouches[0].clientX - e.target.offsetLeft - _this.slide_prop.x)
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
            _this.$emit('percent',percent)
        }
    },
    mounted(){
        let _this = this;
        //获取sliderBox相对于屏幕的位置
        _this.slide_prop = _this.$refs.slide.getBoundingClientRect();
    },
    created(){
        let s_width = Number(window.screen.width);
    //设置自适应比例
    this.window_proportion = (s_width / 1280) * 10;
    }
}
</script>
<style lang="scss" scoped>
    .sliderBox{
        position: relative;
        width: 100%;
        height: 8rem;
    }
    .slide{
        position: absolute;
        width: 32.6rem;
        height: 8rem;
        border-radius: 1rem;
        background-color: rgba(0,0,0,0.3);
        top: 7.2rem;
        left: 2.2rem;
        overflow: hidden;
    }
    .slide_cover{
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;
        border-radius: 1rem;
        background-color: rgba(255,255,255,0.3);
    }
    @for $i from 1 through 4
    {
        .scale-#{$i}
        {
            position: absolute;
            width: 0.1rem;
            height: 3rem;
            background-color: rgba(255,255,255,0.3);
            left: calc(#{$i}*20%) ;
            top: calc(50% - 1.5rem);
          }
    }
</style>