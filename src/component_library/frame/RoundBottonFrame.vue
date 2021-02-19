<template>
  <div class="container">
    <div class="switch">
        <Round-Switch type="child_lock"></Round-Switch>
    </div>
    <span class="nickName">
        客厅吊灯
    </span>
    <span class="productName">
        开关一
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
            position: absolute;
            top: 130px;
            background-color: yellow;
            @include oneLineTextStyle(100%, 30px, 28px, rgba(0, 0, 0, 1))
        }
        .productName{
            position: absolute;
            top: 170px;
            @include oneLineTextStyle(100%, 25px, 22px, rgba(191, 191, 191, 1))
        }
    }
</style>