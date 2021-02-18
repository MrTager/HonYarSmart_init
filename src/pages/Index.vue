<template>
  <div class="main"  ref="container" @touchstart="container_touchstart" @touchmove="container_touchmove" @touchend="container_touchend">
    <Animation-Frame>
      <!-- <Header-Bar @back="back" :titleName="deviceInfo.nickName == '' ? deviceInfo.appProductName : deviceInfo.nickName" type="more" icon="more" @event="header_event"></Header-Bar> -->
      <div class="online" v-if="dev_props.online">
        <!-- <DropDown-Refresh :on-refresh="action_Refresh" :startRefresh_flag="startRefresh_flag">
        </DropDown-Refresh> -->
        <Module-Frame titleName="开关" titleImg="title_switch.png" type="normal">
          <ul class="switchGroup">
            <li>
              <Round-Botton-Frame></Round-Botton-Frame>
            </li>
            <li>
              <Round-Botton-Frame></Round-Botton-Frame>
            </li>
            <li>
              <Round-Botton-Frame></Round-Botton-Frame>
            </li>
          </ul>
        </Module-Frame>
      </div>
      <div class="offline" v-else>
        <Off-Line></Off-Line>
      </div>
    </Animation-Frame>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HonYar from "@/utils/WebAPI";
import axios from "axios";
import { ModuleFrame,OffLine,HeaderBar,DropDownRefresh,MainPowerSwitch,WideSlider,TimeSelect,ListItem,GrayDividingStrip,ListModal,AnimationFrame,ListItemLarge,RoundSwitch,RoundBottonFrame } from "@/component_library";

/**
 * 
 * v-if="JSON.stringify(deviceInfo) !== '{}' && JSON.stringify(homeInfo) !== '{}'"
 * 只有管理员可以显示定时倒计时
 */

export default {
  name: "Main",
  title: "Pagination",
  components: {
    "Header-Bar":HeaderBar,
    "Off-Line":OffLine,
    "DropDown-Refresh":DropDownRefresh,
    "Module-Frame":ModuleFrame,
    "Main-Power-Switch":MainPowerSwitch,
    "Wide-Slider":WideSlider,
    "Time-Select":TimeSelect,
    "List-Item":ListItem,
    "Gray-Dividing-Strip":GrayDividingStrip,
    "List-Modal":ListModal,
    "Animation-Frame":AnimationFrame,
    "List-Item-Large":ListItemLarge,
    "Round-Switch":RoundSwitch,
    "Round-Botton-Frame":RoundBottonFrame
  },
  data() {
    return {
      dev_props:{
        online:true,
        powerstate:0,
        temperature:'--',
        humidity:'--',
        electic:'--'
      },
      compontent_props:{
        headerBar:{
          name:""
        }
      },
      startRefresh_flag:false,//下拉刷新开始刷新标识符
    };
  },
  computed: {
    ...mapState({
      state: (state) => {
        return state;
      },
      deviceInfo: (state) => {
        return state.pubilc.attribute.deviceInfo;
      },
      deviceProps: (state) => {
        return state.pubilc.attribute.deviceProps
      }
    }),

   },
  methods: {
    back(){
      HonYar.finishActivity();
    },
    power_event(state){
      let _this = this;
      const iotId = _this.deviceInfo.iotId;
      let item = {
        "powerstate":state
      }
      HonYar.setDeviceProperties(iotId,item)
      .then(res => {
      })
      .catch(err => {
        HonYar.show_toast(err)
      })
    },
    updateProps(deviceProps){
      let _this = this;
      _this.$set(_this.dev_props,'temperature',String(deviceProps.CurrentTemperature))
      _this.$set(_this.dev_props,'humidity',String(deviceProps.CurrentHumidity))
      _this.$set(_this.dev_props,'electic',String(deviceProps.BatteryPercentage))
    },
    header_event(){
      this.$router.replace({ path: "/more" });
    },
    getChildDev(){
      this.$router.replace({ path: "/devlist" });
    },
    timing(){
      this.$router.replace({ path: "/timing" });
    },
    action_Refresh(done) {
      done();
    },
    container_touchstart(e) {
      e = event || window.event;
      if (this.$refs.container.scrollTop == 0) {
        this.startRefresh_flag = true;
      } else {
        this.startRefresh_flag = false;
      }
    },
    container_touchmove(e) {
      e = event || window.event;
      if (this.$refs.container.scrollTop == 0) {
        this.startRefresh_flag = true;
      } else {
        this.startRefresh_flag = false;
      }
    },
    container_touchend(e){

    },
    /**监听上报 */
    monitor_report() {
      let _this = this;
      this.$bridge.registerHandler("nativeSignal", (data, responseCallback) => {
        //console.log("上报1", JSON.parse(data));
        let _data = JSON.parse(data);
        //监听返回键
        if(_data.request.signalType){
          if(_data.request.signalType == 'back'){
            HonYar.finishActivity();
          }
        }
        this.$store.dispatch("updateNativeSignal", data);
        responseCallback('{"errCode": 0}'); // 回复给Native,data为回复数据
      });
      this.$bridge.registerHandler("subAllEvent", (data, responseCallback) => {
        //console.log("上报2", data);
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
    /**处理上报数据 */
    processing_reported_data(res) {
      let _this = this;
      if(res.iotId === _this.deviceInfo.iotId){
        switch(res.topic){
          case "/app/down/thing/properties":
            for(let key in res.data.items){
              let obj = new Object();
              obj[key] = res.data.items[key].value
              _this.$store.dispatch("changeProp",obj).then(res => {
                _this.updateProps(_this.deviceProps)
              })
            }
            //_this.$store.dispatch("changeProp",res.items)
            break;
        }
      }
    },
  },
  activated() {},
  mounted() {
    let _this = this;
    //检查网络连接
    if (navigator.onLine) {
    }else{
      HonYar.show_toast("无网络",(res)=>{})
    }
    this.monitor_report();
    let wait_data = setInterval(()=>{
      if(JSON.stringify(_this.deviceInfo) !== '{}'){
        //在线状态
        _this.dev_props.online = Number(_this.deviceInfo.status) == 1 ? true : false
        clearInterval(wait_data)
      }
    },1)
    let wait_data_prop = setInterval(()=>{
      if(JSON.stringify(_this.deviceProps) !== '{}'){
        _this.updateProps(_this.deviceProps)
        clearInterval(wait_data_prop)
      }
    },1)
    //更新设备信息
    HonYar.getDeviceInfo('','1','',(res)=>{
      if(JSON.parse(res).code == 200){
        let data = JSON.parse(res).data
        //data传入store里
        _this.$store.dispatch("changeDate", {
          deviceInfo : data
        });
      }
    })
    if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.back, false);//false阻止默认事件
    }
  },
  created() {
    let _this = this;
  },
  destroyed(){
      window.removeEventListener('popstate', this.back, false);//false阻止默认事件
  }
};
</script>
<style lang="scss" scoped>
//comment css
.main {
  width: 100%;
  height: 100%;
}
.offline{
  position: relative;
  width: 100%;
  height: calc(100% - 80px);
  top: 80px;
}
.online{
  position: relative;
  width: 100%;
  height: 100%;
  //top: 80px;
}
//=========================================================== */
//private css
.switchGroup{
  width: 100%;
  height: 300px;
  background-color: aqua;
  li{
    width: 1/3*100%;
    height: 100%;
    float: left;
    background-color: blueviolet;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>