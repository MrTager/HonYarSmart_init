<template>
    <div class="Setting">
        <div class="header">
            <img class="back" src="../assets/images/back_white.png" alt="返回" @click="goback()">
            <div class="title">设置</div>
        </div>
        <div class="list_group">
            <div class="list_item"  @click="go_account()">
                <div class="item_name">账号</div>
                <img class="arraw" src="../assets/images/gray_arraw.png" alt="">
                <div class="botton_line"></div>
            </div>
            <router-link :to="{path:'/background'}" tag="div" replace>
            <div class="list_item">
                <div class="item_name">背景</div>
                <img class="arraw" src="../assets/images/gray_arraw.png" alt="">
                <div class="botton_line"></div>
            </div>
             </router-link>
            <div class="list_item" @click="go_about()">
                <div class="item_name">关于iHouse APP</div>
                <img class="arraw" src="../assets/images/gray_arraw.png" alt="">
                <div class="botton_line"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Tool from '@/utils/Tool';
import axios from 'axios'
export default {
    name:'Setting',
    data() {
        return {
        }
    },
    methods:{
        goback(){
            this.$router.replace({ path: '/main'})
        },
        go_account(){
             Tool.getAccountSettings((res)=>{
            })
        },
        go_about(){
            Tool.get_aboutAppPage((res)=>{
            })
        }
    },
    mounted () {
     
    },
    created(){
      
    } 
}
</script>
<style lang="scss" scoped>
    .Setting{
        width: 100%;
        height: 100%;
        background-color: black;
        color: white;
    }
    .header{
        position: relative;
        height: 8rem;
        width: 100%;
    }
    .back{
        position: absolute;
        width: 1.45rem;
        height: 2.76rem;
        left: 5rem;
        top: calc(50% - 1.38rem);
    }
    .title{
        position: absolute;
        width: 40%;
        height: 8rem;
        left: 30%;
        text-align: center;
        color: white;
        font-size: 3rem;
        line-height: 8rem;
    }
    .list_group{
        width: 100%;
        height: calc(100% - 11.4rem);
        margin-top: 3.4rem;
    }
    .list_item{
        position:relative;
        width: 100%;
        height: 9rem;
    }
    .item_name{
        position: absolute;
        width: 50%;
        height: 9rem;
        font-size: 2.4rem;
        color: white;
        left: 4.7rem;
        line-height: 9rem;
    }
    .botton_line{
        position: absolute;
        width: calc(100% - 4.7rem);
        height: 1px;
        right: 0rem;
        bottom: 0rem;
        background-color: white;
    }
    .arraw{
        position: absolute;
        width: 1.22rem;
        height: 2.33rem;
        right: 4.8rem;
        top: calc(50% - 1.165rem);
    }
</style>