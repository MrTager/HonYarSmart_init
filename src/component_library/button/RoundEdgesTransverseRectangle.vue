<template>
    <div class="RoundEdgesTransverseRectangle" ref="roundEdgesTransverseRectangle" :class="{'open':state == 1,'close':state == 0}" @click="change()">
        <div class="changeColor" >
            <span >{{switch_title}}</span>
        </div>
    </div>
</template>
<script>
/**
 * 圆形电源开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"RoundEdgesTransverseRectangle",
    props:[
        "type",
        "title",
        "state"
    ],
    watch:{
        state:{
            handler(newVal,oldVal){
                let _this = this
                if(newVal !== undefined){
                    this.$set(this,"enable",newVal)
                    _this.changeStyle(newVal);
                }
            }
        }
    },
    data(){
        return {
            open:"",
            close:"",
            enable:0,
            switch_title:this.title,

        }
    },
    methods:{
         changeStyle(state){
            let _this = this;
            state === 0 ? _this.$set(this,"enable",0) : _this.$set(this,"enable",1);
             if(state === 0){
                 _this.$nextTick(()=>{
                     _this.$refs.roundEdgesTransverseRectangle.style.backgroundColor = "rgba(255, 255, 255, 1)"
                 })
            }else{
                _this.$nextTick(()=>{
                    _this.$refs.roundEdgesTransverseRectangle.style.backgroundColor = "rgba(0, 208, 186, 1)"
                })
            }
        },
        change(){
            let _this = this
            this.enable == 0 ? this.enable = 1 : this.enable = 0;
            this.$emit("event",_this.enable)
        }
    },
    mounted(){

    },
    created(){

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
.RoundEdgesTransverseRectangle{
    position: relative;
    width: 180px;
    height: 76px;
    border-radius: 38px;
    overflow: hidden;
    @include switchBoxShadow();
    transform: all 0.3s;
    span{
        position: absolute;
        top: calc(50% - 15px);
        @include oneLineTextStyle_noColor(100%,30px,28px)
    }
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
    color: white;
}
.close{
    background-color: white;
    color: black;
}
</style>