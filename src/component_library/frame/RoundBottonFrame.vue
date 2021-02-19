<template>
  <div class="container">
    <div class="switch">
        <Round-Switch type="power" :state="enable" @event="changeSwitch(state)"></Round-Switch>
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
    },
    props:[
        "state"
    ],
    watch:{
        state:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal !== undefined){
                    _this.$set(_this,'enable',newVal)
                }
            },
            immediate:true,
            deep:true
        }
    },
    data(){
        return {
            enable:0
        }
    },
    methods:{
        changeSwitch(state){
            const powerState = state
            this.$emit("event",powerState)
        }
    }

}
</script>

<style lang="scss">
    .container{
        width: 150px;
        height: 200px;
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
            @include oneLineTextStyle(100%, 30px, 28px, rgba(0, 0, 0, 1))
        }
        .productName{
            position: absolute;
            top: 170px;
            @include oneLineTextStyle(100%, 25px, 22px, rgba(191, 191, 191, 1))
        }
    }
</style>