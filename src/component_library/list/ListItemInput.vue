<template>
    <div class="ListItemInput">
        <div class="title" :style="{color:chick_flag ? 'rgb(0, 0, 0, 1)' : 'rgba(0, 208, 186, 1)'}">{{title_content}}</div>
        <span>{{titleName}}:</span>
        <input type="text" :placeholder="placeholderValue" v-model="newValue" @input="input">
        <div class="bottom"></div>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"ListItemInput",
    components:{
    },
    props:[
        "title",
        "placeholder"
    ],
    watch:{
        title:{
            handler(newVal,oldVal){
                if(newVal !== undefined){
                    this.titleName = newVal
                }
            },
            immediate:true,
            deep:true
        },
        placeholder:{
            handler(newVal,oldVal){
                if(newVal !== undefined){
                    this.placeholderValue = newVal
                }
            },
            immediate:true,
            deep:true
        }
    },
    data(){
        return {
            aspect_ratio:0,
            title_content:this.value,
            bottom_show:true,
            allow_chick:true,
            chick_flag:this.state,
            titleName:"",
            placeholderValue:"",
            newValue:"",
        }
    },
    methods:{
        input(){
            this.$emit("input",this.newValue)
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
.ListItemInput{
    position: relative;
    width: 100%;
    height: 100px;
    background-color: white;
    padding-bottom: 15px;
    span{
        position: absolute;
        @include oneLineTextStyle(30%,80px,35px,#303942);
        text-align: right;
        padding-right: 10px;
    }
    input{
        position: absolute;
        left: 31%;
        width: 50%;
        height: 70%;
        @include inputStyle();
        @include oneLineTextStyle(60%,80px,35px,#303942);
        text-align: left;
    }
    input:focus{
        @include inputFocusStyle();
    }
}
.title{
    position: absolute;
    width: 100%;
    height: 50px;
    top: calc(50% - 25px);
    line-height: 50px;
    font-size: 35px;
    @include text_limit();
    text-align: center;
    color: black;
}
.bottom{
    position: absolute;
    width: calc(100% - 80px);
    height: 1px;
    left: 40px;
    bottom: 0px;
    background-color: rgb(206, 206, 206);
}

</style>