<template>
    <div class="HeaderBar">
        <img class="back" src="@/assets/images/icon/header/back.png" alt="后退" @click="back()">
        <div class="title">{{titleName}}</div>
        <img v-if="type !== ''" class="rightImg" :src="require(`../../assets/images/icon/header/${icon}.png`)" alt="更多" @click="event()">
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
    ],
    watch:{
    },
    data(){
        return {

        }
    },
    methods:{
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
    -moz-box-shadow:2px 2px 20px #dfdfdf;
    -webkit-box-shadow:2px 2px 20px #dfdfdf;
    box-shadow:2px 2px 20px #dfdfdf;
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
    font-size: 35px;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: black;
    left: calc(50% - 280px);
    top: calc(50% - 20px);
    @include text_limit();
}
.rightImg{
    position: absolute;
    width: 43px;
    height: 40px;
    right: 40px;
    top: calc(50% - 20px);
}
</style>