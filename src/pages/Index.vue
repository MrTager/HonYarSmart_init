<template>
  <div class="main"  ref="container" @touchstart="container_touchstart" @touchmove="container_touchmove" @touchend="container_touchend">
    <Animation-Frame>
      <Header-Bar @back="back" :titleName="deviceInfo.nickName == '' ? deviceInfo.appProductName : deviceInfo.nickName" type="more" icon="more" @event="header_event"></Header-Bar>
      <div class="online" v-if="dev_props.online">
        <!-- <DropDown-Refresh :on-refresh="action_Refresh" :startRefresh_flag="startRefresh_flag">
        </DropDown-Refresh> -->
        <div class="topClear"></div>
        <List-Modal v-if="flag.showChangeNameModel" title="编辑昵称" @confirm="changeNameConfirm" @cancel="changeNameCancel">
          <List-Item-Input v-for="(value,key,index) in dev_props.childPropName" :key="index" :title="value.propName" :placeholder="value.nickName"  @input="changePropName(key,$event)"></List-Item-Input>
        </List-Modal>
        <div v-if="switchType === 2 || switchType === 3">
          <div class="topSwitchGroup">
          <div class="leftGroup">
            <Module-Frame titleName="开关" titleImg="title_switch.png" type="normal" rightOption=false>
              <div class="leftSwitch">
                <div class="switch">
                  <Round-Edges-Transverse-Rectangle :state="0" @event="changeSwitch(1,'switch_all')" title="全开" ></Round-Edges-Transverse-Rectangle>
                </div>
                <div class="switch">
                  <Round-Edges-Transverse-Rectangle :state="0" @event="changeSwitch(0,'switch_all')" title="全关" ></Round-Edges-Transverse-Rectangle>
                </div>
              </div>
            </Module-Frame>
          </div>
          <div class="rightGroup">
            <Module-Frame titleName="开关类型" titleImg="title_switch.png" type="normal" rightOption=false>
              <div class="rightSwitch">
                <div class="switch">
                  <Rectangular-Switch type="RectangleSwitch" name="翘板按键" :state="dev_props.switch_type === 1 ? 1 : 0" @event="changeSwitch(1,'switch_type')" openIcon="lightCtrlOpen.png" closeIcon="lightCtrlClose.png"></Rectangular-Switch>
                </div>
                <div class="switch">
                  <Rectangular-Switch type="RectangleSwitch" name="自复位按键" :state="dev_props.switch_type === 0 ? 1 : 0" @event="changeSwitch(0,'switch_type')" openIcon="lightCtrlOpen.png" closeIcon="lightCtrlClose.png"></Rectangular-Switch>
                </div>
              </div>
            </Module-Frame>
          </div>
        </div>
        <Module-Frame titleName="开关" titleImg="title_switch.png" type="normal" rightOption=true @rightOptionEvent="superAdmin ? changeNickname(true) : changeNickname(false)">
          <ul class="switchGroup">
            <li>
              <Round-Botton-Frame :propName="dev_props.childPropName.powerstate_1"  :state="dev_props.powerstate_1" @event="changeSwitch($event,'powerstate_1')"></Round-Botton-Frame>
            </li>
            <li v-if="switchType === 2 || switchType === 3">
              <Round-Botton-Frame :propName="dev_props.childPropName.powerstate_2"  :state="dev_props.powerstate_2" @event="changeSwitch($event,'powerstate_2')"></Round-Botton-Frame>
            </li>
            <li v-if="switchType === 3">
              <Round-Botton-Frame :propName="dev_props.childPropName.powerstate_3"  :state="dev_props.powerstate_3" @event="changeSwitch($event,'powerstate_3')"></Round-Botton-Frame>
            </li>
          </ul>
        </Module-Frame>
        </div>
        <div v-if="switchType === 1">
        <Module-Frame titleName="开关" titleImg="title_switch.png" type="normal" rightOption=true @rightOptionEvent="superAdmin ? changeNickname(true) : changeNickname(false)">
          <ul class="switchGroup">
            <li>
              <Round-Botton-Frame :propName="dev_props.childPropName.powerstate_1"  :state="dev_props.powerstate_1" @event="changeSwitch($event,'powerstate_1')"></Round-Botton-Frame>
            </li>
            <li>
              <Rectangular-Switch type="RectangleSwitch" name="翘板按键" :state="dev_props.switch_type === 1 ? 1 : 0" @event="changeSwitch(1,'switch_type')" openIcon="lightCtrlOpen.png" closeIcon="lightCtrlClose.png"></Rectangular-Switch>
            </li>
            <li>
              <Rectangular-Switch type="RectangleSwitch" name="自复位按键" :state="dev_props.switch_type === 0 ? 1 : 0" @event="changeSwitch(0,'switch_type')" openIcon="lightCtrlOpen.png" closeIcon="lightCtrlClose.png"></Rectangular-Switch>
            </li>
          </ul>
        </Module-Frame>
        </div>
        <Module-Frame titleName="指示灯" titleImg="title_switch.png" type="normal">
          <ul class="ledSwitch">
            <li>
              <Round-Edges-Transverse-Rectangle :state="dev_props.indicator === 0 ? 1 : 0" @event="changeSwitch(0,'indicator')" title="关闭" ></Round-Edges-Transverse-Rectangle>
            </li>
            <li>
              <Round-Edges-Transverse-Rectangle :state="dev_props.indicator === 1 ? 1 : 0" @event="changeSwitch(1,'indicator')" title="状态指示" ></Round-Edges-Transverse-Rectangle>
            </li>
            <li>
              <Round-Edges-Transverse-Rectangle :state="dev_props.indicator === 2 ? 1 : 0" @event="changeSwitch(2,'indicator')" title="位置指示" ></Round-Edges-Transverse-Rectangle>
            </li>
          </ul>
        </Module-Frame>
        <Module-Frame titleName="断电记忆" titleImg="title_switch.png" type="normal">
          <ul class="ledSwitch">
            <li>
              <Round-Edges-Transverse-Rectangle :state="dev_props.power_off_memory === 1 ? 1 : 0" @event="changeSwitch(1,'power_off_memory')" title="启动全开"></Round-Edges-Transverse-Rectangle>
            </li>
            <li>
              <Round-Edges-Transverse-Rectangle :state="dev_props.power_off_memory === 0 ? 1 : 0" @event="changeSwitch(0,'power_off_memory')" title="启动全关"></Round-Edges-Transverse-Rectangle>
            </li>
            <li>
              <Round-Edges-Transverse-Rectangle :state="dev_props.power_off_memory === 2 ? 1 : 0" @event="changeSwitch(2,'power_off_memory')" title="断电记忆"></Round-Edges-Transverse-Rectangle>
            </li>
          </ul>
        </Module-Frame>
        <Inside-Line-Dividing-Strip></Inside-Line-Dividing-Strip>
        <div v-if="superAdmin">
          <Module-Frame titleName="定时设置" titleImg="title_switch.png" type="noIcon">
            <List-Item type="imgItem" iconName="Cloud" title="云端定时" arrow @event="timing"></List-Item>
          </Module-Frame>
        </div>
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
import { ModuleFrame,OffLine,HeaderBar,DropDownRefresh,MainPowerSwitch,WideSlider,TimeSelect,ListItem,GrayDividingStrip,ListModal,AnimationFrame,ListItemLarge,RoundSwitch,RoundBottonFrame,RoundEdgesTransverseRectangle,ListItemInput,InsideLineDividingStrip,RectangularSwitch } from "@/component_library";

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
    "Round-Botton-Frame":RoundBottonFrame,
    "Round-Edges-Transverse-Rectangle":RoundEdgesTransverseRectangle,
    "List-Item-Input":ListItemInput,
    "Inside-Line-Dividing-Strip":InsideLineDividingStrip,
    "Rectangular-Switch":RectangularSwitch
  },
  data() {
    return {
      dev_props:{
        online:true,
        powerstate_1:0,
        powerstate_2:0,
        powerstate_3:0,
        switch_type:0,
        indicator:0,
        power_off_memory:0,
        childPropName:{powerstate_1:{propName:"开关一",nickName:"",id:""},powerstate_2:{propName:"开关二",nickName:"",id:""},powerstate_3:{propName:"开关三",nickName:"",id:""}},
        newChildPropName:{}
      },
      compontent_props:{
        headerBar:{
          name:""
        }
      },
      flag:{
        showChangeNameModel:false
      },
      startRefresh_flag:false,//下拉刷新开始刷新标识符
      switchType:1,//1、一键 2、二键 3、三键
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
      },
      deviceChildProps: (state) => { 
        return state.pubilc.attribute.deviceChildProps
      },
      deviceAdmin:(state) => {
        return state.pubilc.attribute.deviceAdmin
      },
      homeAdmin:(state) => {
        return state.pubilc.attribute.homeAdmin
      }
    }),
    superAdmin(){
      if(this.deviceAdmin && this.homeAdmin){
        return true
      }else{
        return false
      }
    }
   },
  methods: {
    /*********************************porivate function****************************************************** */
    changeNameConfirm(){
      let _this = this;
      this.flag.showChangeNameModel = false
      HonYar.changeChildPropName(this.dev_props.newChildPropName).then(()=>{
        HonYar.getDeviceChildPrpps(_this.deviceInfo.iotId)
        .then((res)=>{
          _this.$store.dispatch("changeDate",{
            deviceChildProps:JSON.parse(res).data
          }).then(res => {
            _this.childProphName()
          })
        })
      })
    },
    changeNameCancel(){
      this.flag.showChangeNameModel = false
    },
    childProphName(){
      let _this = this;
      let obj = {}
      let nameArr = ["powerstate_1","powerstate_2","powerstate_3"]
      const propArr = this.deviceChildProps
      propArr.forEach(item => {
        for(let i = 0;i<nameArr.length;i++){
          if(nameArr[i] === item.identifier){
            obj[item.identifier] = new Object();
            obj[item.identifier]["propName"] = item.name
            obj[item.identifier]["nickName"] = item.nickName === "" ?  item.name : item.nickName
            obj[item.identifier]["id"] = item.id
          }
        }
      })
      //调整顺序

      let powerStateArr = [];
      for(let key in obj){
        let obj1 = new Object()
        obj1[key] = obj[key]
        powerStateArr.push(obj1)
      }
      powerStateArr.sort((item1,item2) => {
        let str = ""
        let str2 = ""
        for(let key2 in item1){
          str = key2.slice(11,12);
        }
        for(let key3 in item2){
          str2 = key3.slice(11,12);
        }
        return Number(str) - Number(str2)
      })
      let finalObject = new Object();
      powerStateArr.forEach(iten => {
        finalObject = Object.assign(finalObject,iten)
      })
      _this.$set(_this.dev_props,"childPropName",finalObject)
    },
    //change nickname
    changeNickname(flag){
      let _this = this;
      if(flag){
        this.flag.showChangeNameModel = true
        this.dev_props.newChildPropName = JSON.parse(JSON.stringify(this.dev_props.childPropName))
      }else{
        HonYar.show_toast("非设备管理员没有权限操作")
      }
    },
    changeSwitch(e,propName){
      let _this = this;
      const iotId = _this.deviceInfo.iotId;
      let item = {
        [propName]:e
      }
      HonYar.setDeviceProperties(iotId,item)
      .then(res => {
      })
      .catch(err => {
        HonYar.show_toast(err)
      })
    },
    changeSwitchType(pk){
      switch (pk) {
        case "a1V9RC5hvfW":
          this.switchType = 1;
          break;
        case "a1H5zYD0dI9":
          this.switchType = 2;
          break;
        case "a10rNqQLbXN":
          this.switchType = 3;
          break;
        default:
          this.switchType = 1;
          break;
      }
    },
    changePropName(key,e){
      this.$set(this.dev_props.newChildPropName[key],"nickName",e)
    },
    power_event(state){
    },
    /********************************commment function********************************************************** */
    back(){
      HonYar.finishActivity();
    },
    updateProps(deviceProps){
      let _this = this;
      _this.$set(_this.dev_props,'powerstate_1',deviceProps.powerstate_1)
      _this.$set(_this.dev_props,'powerstate_2',deviceProps.powerstate_2)
      _this.$set(_this.dev_props,'powerstate_3',deviceProps.powerstate_3)
      _this.$set(_this.dev_props,'switch_type',deviceProps.switch_type)
      _this.$set(_this.dev_props,'indicator',deviceProps.indicator)
      _this.$set(_this.dev_props,'power_off_memory',deviceProps.power_off_memory)
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
    /*******************************************************down loader refresh********************************* */
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
    /**********************************************************监听上报********************************************************** */
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
      HonYar.show_toast("无网络,请检查网络连接",(res)=>{})
    }
    this.monitor_report();
    let wait_data = setInterval(()=>{
      if(JSON.stringify(_this.deviceInfo) !== '{}'){
        
        //在线状态
        _this.dev_props.online = Number(_this.deviceInfo.status) == 1 ? true : false
        _this.changeSwitchType(_this.deviceInfo.productKey)
        clearInterval(wait_data)
      }
    },1)
    let wait_data_prop = setInterval(()=>{
      if(JSON.stringify(_this.deviceProps) !== '{}'){
        _this.updateProps(_this.deviceProps)
        clearInterval(wait_data_prop)
      }
    },1)
    let wait_data_childPropName = setInterval(()=>{
      if(_this.deviceChildProps.length > 0){
        _this.childProphName()
        clearInterval(wait_data_childPropName)
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
  height:calc(100% - 80px);
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
  height: calc(100% - 80px);
  //top: 80px;
}
//=========================================================== */
//private css
.topClear{
  width: 100%;
  height: 120px;
}
.topSwitchGroup{
  width: 100%;
  height: 365px;
  display: flex;
  flex-direction: row;
  $switchGroupHeight:150px;
  .leftGroup{
    width: 288px;
    height: 100%;
    .leftSwitch{
      $leftGroupWidth:288px;
      border-right: 1px solid#E5E5E5;
      display: flex;
      flex-direction: column;
      .switch{
        width: $leftGroupWidth;
        height:147.5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .switch:nth-child(1){
        padding-top: 40px;
      }
      .switch:nth-child(2){
        padding-bottom: 40px;
      }
    }
  }
  .rightGroup{
    width: 462px;
    height: 100%;
    .rightSwitch{
      display: flex;
      flex-direction: row;
      .switch{
        width: 231px;
        height: 295px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .switch:nth-child(1){
        padding-left: 50px;
      }
      .switch:nth-child(2){
        padding-right: 50px;
      }
    }
  }
}
.switchGroup{
  width: 100%;
  height: 300px;
  display: flex;
  li{
    margin: 0 auto;
    width: 1/3*100%;
    height: 100%;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.ledSwitch{
  width: 100%;
  height: 160px;
  li{
    width: 1/3*100%;
    height: 100%;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>