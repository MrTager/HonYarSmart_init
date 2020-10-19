<template>
    <div class="news">
        <div class="position_value">
            <!-- <router-link :to="{path:'/main'}" replace></router-link> -->
            <img class="back" src="../assets/images/back.png" @click="goBack()">
        </div>
        <div class="position_value_panel">
        </div>
        <iframe id="newsWindow" :src="url" frameborder="0">
            
        </iframe>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Tool from '@/utils/Tool';
import axios from 'axios'
export default {
    name:'news',
    data() {
        return {
            url:'',
        }
    },
    methods:{
        registerJs () {
            let _this = this
            this.$bridge.registerHandler('nativeSignal', (data, responseCallback) => {
                this.$store.dispatch('updateNativeSignal', data)
                _this.dealDate(data);
                responseCallback('{"errCode": 0}') // 回复给Native,data为回复数据
            })
            this.$bridge.registerHandler('subAllEvent', (data, responseCallback) => {
                this.$store.dispatch('updateEvent', data)
                _this.dealDate(data);
                responseCallback('{"errCode": 0}') // 回复给Native,data为回复数据
            })
        },
        dealDate(res){
            let _this = this;
            let _data = JSON.parse(res);
            //监听返回键
            if(_data.request.signalType){
                if(_data.request.signalType == 'back'){
                //_this.$router.go(-1);
                //_this.$router.push('/home');
                //this.$router.push({path:'Main'})
                this.$router.replace({ path: '/main'})
                }
            }
        },
        goBack(){
            this.$router.replace({ path: '/main'})
        }
    },
    mounted () {
        this.registerJs()
    },
    created(){
        this.url = this.$route.query.url;
    } 
}
</script>
<style lang="scss" scoped>
html,body,#app{
    height: 100%;
    width: 100%;
}
.news{
    width: 100%;
    height: 100%;
    background-color: black;
    color: white;
    $position_valueHeight:6rem;
    overflow: hidden;
    .position_value{
        width: 100%;
        height: $position_valueHeight;
        position: fixed;
        left: 0;
        top: 0;
        background-color: white;
    }
    .position_value_panel{
        width: 100%;
        height: $position_valueHeight;
        background-color: white;
    }
    .back{
        position: absolute;
        width: 1.46rem;
        height: 2.76rem;
        left: 3.42rem;
        top: 1.5rem;
    }
}
#newsWindow{
    //width: 37.12rem;
    width: 100%;
    height: calc(100% - 3.1rem);
    //margin-left: 13.44rem;
}
</style>