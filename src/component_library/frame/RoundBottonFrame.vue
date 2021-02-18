<template>
  <div class="container">
    <div class="switch">
        <Round-Switch type="child_lock"></Round-Switch>
    </div>
    <span class="nickName">
        客厅吊灯
    </span>
    <span class="productName">

    </span>
  </div>
</template>

<script>
import { RoundSwitch } from '@/component_library'

export default {
    name:'RoundBottonFrame',
    components:{
        "Round-Switch":RoundSwitch
    }

}
</script>

<style lang="scss">
@mixin textStyle($width,$height,$size,$color){

}
    .container{
        width: 150px;
        height: 200px;
        background-color: burlywood;
        position: relative;
        .switch{
            position: absolute;
            width: 100px;
            height: 100px;
            left: calc(50% - 50px);
            top: 10px;
        }
        .nickName{
            display: block;
            margin: 0;
            padding: 0;
            position: absolute;
            width: 100%;
            height: 30px;
            top: 130px;
            background-color: yellow;
            text-align: center;
        }
        .productName{

        }
    }
</style>