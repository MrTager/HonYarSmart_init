<template>
    <div class="HeaderBar">
        <img class="back" src="@/assets/images/icon/header/back.png" alt="后退" @click="back()">
        <div class="title">{{titleName}}</div>
        <img v-if="type === 'add'" class="rightImg" :src="require(`../../assets/images/icon/header/${icon}.png`)"  @click="event()">
        <div v-if="type === 'save'" class="textOptionValue" @click="textOptionEvent">{{textOption}}</div>
    </div>
</template>
<script>
import Honyar from "@/utils/WebAPI";

export default {
    name:"HeaderBar",
    props:[
        "titleName",
        "type",
        "icon",
        "textOptionValue",
    ],
    watch:{
        type:{
            handler(newVal,oldVal){
                if(newVal !== undefined){
                    this.type_flag = newVal
                }
            },
            immediate:true,
            deep:true
        }
    },
    data(){
        return {
            type_flag:"",
            textOption:'保存'

        }
    },
    methods:{
        textOptionEvent(){
            this.$emit("textOptionEvent")
        },
        back(){
          this.$emit("back");
        },
        event(){
            this.$emit("event")
          
        }
    },
    mounted(){
        
    },
    created(){
        this.hide_more = Number(this.type)
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
.HeaderBar{
    width: 100%;
    height: 80px;
    background-color: white;
    position: fixed;
    left: 0;
    top: 0;
    // -moz-box-shadow:2px 2px 20px #dfdfdf;
    // -webkit-box-shadow:2px 2px 20px #dfdfdf;
    // box-shadow:2px 2px 20px #dfdfdf;
    @include switchBoxShadow();
    z-index: 777;
}
.back{
    position:absolute;
    width: 22px;
    height: 38px;
    left: 40px;
    top: calc(50% - 19px);
}
.title{
    position: absolute;
    width: 560px;
    font-size: 36px;
    font-family: PingFang SC;
    font-weight: 500;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #131313;
    left: calc(50% - 280px);
    top: calc(50% - 18px);
    @include text_limit();
}
.rightImg{
    position: absolute;
    width: 43px;
    height: 40px;
    right: 40px;
    top: calc(50% - 20px);
}
.textOptionValue{
     position: absolute;
    width: 80px;
    height: 40px;
    right: 40px;
    top: calc(50% - 20px);
    font-size: 40px;
    color: $honyarColor;
}
</style>