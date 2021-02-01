<template>
  <div class="list">
      <Animation-Frame>
          <List-Item-Large v-for="(item,i) in childList" :key="i" :iconUrl="item.categoryImage" type="imgItem" iconType="url" :title="item.nickName === '' ? item.appProductName : item.nickName" bottomLine="false" arrow="false"></List-Item-Large>
      </Animation-Frame>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HonYar from "@/utils/WebAPI";
import axios from "axios";
import { AnimationFrame,ListItemLarge } from "@/component_library";
export default {
    name:'DevList',
    title:'子设备列表',
    components:{
        "Animation-Frame":AnimationFrame,
        "List-Item-Large":ListItemLarge
    },
    data() {
        return {
            childList:[]
        }
    },
    computed: {
    ...mapState({
        state: (state) => {
            return state;
        },
        user_info:(state)=>{
            return state.pubilc.attribute.user_info
        },
        deviceInfo:(state)=>{
            return state.pubilc.attribute.deviceInfo
        }
    })
    },
    methods:{
        /**监听上报 */
        monitor_report() {
        let _this = this;
        this.$bridge.registerHandler("nativeSignal", (data, responseCallback) => {
            //console.log("上报d1", JSON.parse(data));
            let _data = JSON.parse(data);
            //监听返回键
            if(_data.request.signalType){
            if(_data.request.signalType == 'back'){
                _this.back();
            }
            }
            this.$store.dispatch("updateNativeSignal", data);
            responseCallback('{"errCode": 0}'); // 回复给Native,data为回复数据
        });
        this.$bridge.registerHandler("subAllEvent", (data, responseCallback) => {
            //console.log("上报d2", JSON.parse(data));
            let _data = JSON.parse(data);
            //监听返回键
            if(_data.request){
            if(_data.request.signalType){
                if(_data.request.signalType == 'back'){
                }
            }
            }
            this.processing_reported_data(JSON.parse(data));
            this.$store.dispatch("updateEvent", data);
            responseCallback('{"errCode": 0}'); // 回复给Native,data为回复数据
        });
        },
        back(){
            this.$router.go(-1);
        }
    },
    mounted(){
        if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', this.back, false);//false阻止默认事件
        }
    },
    created(){
        let _this = this;
        this.monitor_report();
        
        let wait_data = setInterval(()=>{
        if(JSON.stringify(_this.user_info) !== '{}'){
            if(JSON.stringify(_this.deviceInfo) !== '{}'){
                HonYar.getListSubDevice(_this.user_info.userId,_this.deviceInfo.iotId,_this.deviceInfo.productKey,'1')
                .then(res => {
                    _this.childList = JSON.parse(res).data.records
                })
                .catch(err => {
                    HonYar.show_toast(err)
                })
                clearInterval(wait_data)
            }
        }
        },1)
        
    },
    destroyed(){
        window.removeEventListener('popstate', this.back, false);//false阻止默认事件
    }
}
</script>

<style>

</style>