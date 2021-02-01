<template>
    <div class="OffLine">
        <img class="icon" src="@/assets/images/icon/off_line.png" alt="离线">
    </div>
</template>
<script>
import Honyar from "@/utils/WebAPI";

export default {
    name:"OffLine",
    props:[
      
    ],
    data(){
        return {

        }
    },
    methods:{
      
    },
    mounted(){
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
.OffLine{
    position: relative;
    width: 100%;
    height: 100%;
}
.icon{
    position: absolute;
    width: 200px;
    height: 500px;
    left: calc(50% - 100px);
    top: 200px;
}
</style>