<template>
    <div class="InsideLineDividingStrip">
    </div>
</template>
<script>
/**
 * 底部分割线组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name: "InsideLineDividingStrip",
    props:[],
    data(){
        return {
        }
    },
    methods:{
    },
    mounted(){

    },
    created(){
    }
}
</script>
<style lang="scss" scoped>
.InsideLineDividingStrip{
    position: absolute;
    width: 90%;
    height: 1px;
    bottom: 0px;
    left: 5%;
    background-color: rgba(238, 238, 238, 1);
}
</style>