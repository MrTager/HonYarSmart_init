<template>
  <div class="Timing" ref="container" @touchstart="container_touchstart" @touchmove="container_touchmove" @touchend="container_touchend">
      <Header-Bar @back="back()" :titleName="titleName" :type="headerType" icon="add" @event="addCloudTime"></Header-Bar>
      <Blank-Dividing-Strip></Blank-Dividing-Strip>
      <Animation-Frame v-if="addTime_flag === false">
        <DropDown-Refresh :on-refresh="action_Refresh" :startRefresh_flag="startRefresh_flag">
          <div v-if="nullDataFlag" class="nullData"><span>无定时数据,请添加定时</span></div>
          <!-- <List-Item-Timing time="07:00" info="周一 开启开关一 开启开关二 开启开关三" @delete="delClould" v-for="(item,i) in new Array(10)" :key="i"></List-Item-Timing> -->
        </DropDown-Refresh>
      </Animation-Frame>
      <Animation-Frame v-if="addTime_flag">
        <Select-Panel setTypes="1" :chooseCloudHour="cloudDataInfo.time.hour" :chooseCloudMin="cloudDataInfo.time.min" @selectTimeHour="selectTimeHour_cloud" @selectTimeMin="selectTimeMin_cloud"></Select-Panel>
        <Gray-Dividing-Strip></Gray-Dividing-Strip>
        <List-Item type="normal" title="重复" value="周一" @event="chooseWeek"></List-Item>
        <Gray-Dividing-Strip></Gray-Dividing-Strip>
        <List-Item :type="propActionListType" v-for="(item,i) in actionModal_data.arr" :key="i" :title="item.propName" :value="item.flag ? '开启' : '关闭'" :enable="item.enable"  @event="chooseAction(i)" @enableEvent="propActionEnable(i, arguments)"></List-Item>
        <List-Modal v-show="weekModal" @cancel="weekModalCancel">
          <List-Item-Chick v-for="(item,i) in weekModal_data.arr" :key="i" :title="item.name" :state="item.flag" @event="changeWeek(i)"></List-Item-Chick>
        </List-Modal>
        <List-Modal v-show="actionModal" @cancel="actionModalCancel">
          <List-Item-Value v-for="(item,i) in actionModal_data.arr[nowChooseActionIndex].value" :key="i" :state="true" :value="item" @event="changeAction(nowChooseActionIndex,i,arguments)"></List-Item-Value>
        </List-Modal>
      </Animation-Frame>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HonYar from "@/utils/WebAPI";
import axios from "axios";
import HeaderBar from "@/component_library/module/HeaderBar";
import { BlankDividingStrip,ListItemTiming,DropDownRefresh,AnimationFrame,SelectPanel,GrayDividingStrip,ListItem,ListModal,ListItemChick,ListItemValue } from "@/component_library";

export default {
  name: "Timing",
  components: {
    "Header-Bar": HeaderBar,
    "Blank-Dividing-Strip":BlankDividingStrip,
    "List-Item-Timing":ListItemTiming,
    "DropDown-Refresh":DropDownRefresh,
    "Animation-Frame":AnimationFrame,
    "Select-Panel":SelectPanel,
    "Gray-Dividing-Strip":GrayDividingStrip,
    "List-Item":ListItem,
    "List-Modal":ListModal,
    "List-Item-Chick":ListItemChick,
    "List-Item-Value":ListItemValue
  },
  data() {
    return {
      startRefresh_flag:false,//下拉刷新开始刷新标识符
      titleName:'定时',
      headerType:'add',
      addTime_flag:false,
      weekModal:false,
      actionModal:false,
      weekModal_data:{
        arr:[
          {name:'仅一次',flag:true},
          {name:'周日',flag:false},
          {name:'周一',flag:false},
          {name:'周二',flag:false},
          {name:'周三',flag:false},
          {name:'周四',flag:false},
          {name:'周五',flag:false},
          {name:'周六',flag:false}]
      },
      actionModal_data:{
        arr:[
          {propName:'开关一',enable:0,flag:true,value:['开启','关闭']},
          {propName:'开关二',enable:1,flag:true,value:['开启','关闭']}
        ]
      },
      nowChooseActionIndex:0,
      timeList:[],//定时列表
      cloudDataInfo:{ //ui组件数据格式
        time:{
          hour:"0",
          min:'0'
        },
        mode:{
          arr:[
          {name:'仅一次',flag:true,index:0},
          {name:'周日',flag:false,index:1},
          {name:'周一',flag:false,index:2},
          {name:'周二',flag:false,index:3},
          {name:'周三',flag:false,index:4},
          {name:'周四',flag:false,index:5},
          {name:'周五',flag:false,index:6},
          {name:'周六',flag:false,index:7}]
        },
        action:{
          arr:[
            {propName:'开关一',enable:0,flag:true,value:['开启','关闭']},
            {propName:'开关二',enable:1,flag:true,value:['开启','关闭']}
          ]
        }
      },
      cloudDataInfoSave:{
        "gatewayIotId":"lF6IHhV8KpjT1GVOvKfy000000",//未获取
        "enable":true,//使能
        "triggers":{
            "items":[
                {
                    "params":{
                        "cron":"",//已生成
                        "cronType":"quartz",
                        "timezoneID":"Asia/Shanghai",
                        "appShow":{
                            "content":"" //已生成
                        }
                    },
                    "url":"trigger/timer"
                }
            ],
            "url":"logical/or"
        },
        "actions":[
            {
                "params":{
                    "iotId":"lF6IHhV8KpjT1GVOvKfy000000", //未获取
                    "appShow":{
                        "content":" 关闭" //未生成
                    },
                    "propertyName":"S2", //开关属性名 未获取
                    "propertyValue":0,
                    "productKey":"a1EEiVZcMd9", //pk 未获取
                    "deviceName":"" //设备DN选填
                },
                "url":"action/device/setProperty"
            }
        ]
      }
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
      homeInfo: (state) => {
        return state.pubilc.attribute.homeInfo;
      },
      bindingDevList: (state) => {
        return state.pubilc.attribute.bindingDevList;
      },
      user_info: (state) => {
        return state.pubilc.attribute.user_info;
      },
      devBindingUserList: (state) => {
        return state.pubilc.attribute.devBindingUserList;
      },
      appKey: (state)=>{
        return state.pubilc.attribute.appKey;
      }
    }),
    propActionListType(){
      if(this.actionModal_data.arr.length > 1){
        return 'check'
      }else{
        return 'normal'
      }
    },
    nullDataFlag(){
      if(this.timeList.length == 0){
        return true
      }else{
        return false
      }
    },
    cloudSelectTime(){
      let hour = Number(HonYar.getTime().hour);
      let min = Number(HonYar.getTime().min) + 2;
      if(min + 2 > 59){
        min = min + 2 -60
        hour += 1
        if(hour > 23){
          hour = hour - 24
        }
      }
      return {
        hour,
        min
      }
    }
  },
  methods: {
    //生成cron
    createCron(arr){
      let _this = this;
      let weekFlagArr = arr;
      let cron = "";
      let weekArr = [];
      let weekNameArr = [];
      let once = true
      let showTimeContent = ""
      for(let i = 0;i<weekFlagArr.length;i++){
        if(weekFlagArr[i].index === 0){ 
          if(weekFlagArr[i].flag){//仅一次
            once = true
            break;
          }
        }else{
          once = false
          if(weekFlagArr[i].flag){//其他重复
            weekArr.push(weekFlagArr[i].index)
            weekNameArr.push(weekFlagArr[i].name)
          }
        }
      }
      if(once){
        let setTime =  Number(_this.cloudDataInfo.time.hour)*60 + Number(_this.cloudDataInfo.time.min);
        let nowTime = Number(HonYar.getTime().hour)*60 + Number(HonYar.getTime().min);
        //判断选定时间是否大于当前时间
        if(setTime > nowTime){
          cron = "0 " + _this.cloudDataInfo.time.min + " " + _this.cloudDataInfo.time.hour + " " + HonYar.getTime().day + " " + HonYar.getTime().mon + " ? " + HonYar.getTime().year
        }else{
          cron = "0 " + _this.cloudDataInfo.time.min + " " + _this.cloudDataInfo.time.hour + " " + HonYar.getTime().nextday + " " + HonYar.getTime().nextmonth + " ? " + HonYar.getTime().nextyear
        }
        showTimeContent = _this.cloudDataInfo.time.hour + " : " + _this.cloudDataInfo.time.min + "仅一次"
      }else{
        let weekArrStr = weekArr.join(",");
        let weekNameArrStr = weekNameArr.join(" ");
        cron = "0 " + _this.cloudDataInfo.time.min + " " + _this.cloudDataInfo.time.hour + " ? * " + weekArrStr + " *"
        showTimeContent = _this.cloudDataInfo.time.hour + " : " + _this.cloudDataInfo.time.min + "重复" + weekNameArrStr
      }
      _this.cloudDataInfoSave.triggers.items[0].params.cron = cron
      _this.cloudDataInfoSave.triggers.items[0].params.appShow.content = showTimeContent
    },
    //初始化表单
    initCloudDataInfo(){
      let _this = this;
      console.log("iotId",_this.deviceInfo.iotId)
      
      _this.cloudDataInfo.time.hour = _this.cloudSelectTime.hour
      _this.cloudDataInfo.time.min = _this.cloudSelectTime.min
      //初始化cron
      _this.createCron(_this.cloudDataInfo.mode.arr)
      HonYar.getlistTslAbility(2,_this.deviceInfo.iotId)
      .then(res => {
        //console.log("action列表",res)
      })
    },
    //定时选择小时回调
    selectTimeHour_cloud(hour){
      this.cloudDataInfo.time.hour = String(hour)
      this.createCron(this.cloudDataInfo.mode.arr)
    },
    //定时选择分钟回调
    selectTimeMin_cloud(min){
      this.cloudDataInfo.time.min = String(min)
      this.createCron(this.cloudDataInfo.mode.arr)
    },
    back(){
      if(this.addTime_flag){
        this.$set(this,"addTime_flag",false)
        this.$set(this,"titleName",'定时')
        this.$set(this,"headerType",'add')
      }else{
        this.$router.replace({ path: "/" });
      }
    },
    delClould(){
      alert("删除")
    },
    addCloudTime(){
      this.$set(this,"addTime_flag",true)
      this.$set(this,"titleName",'添加定时')
      this.$set(this,"headerType",'')

    },
    propActionEnable(){
      const index = arguments[0];
      const enable = arguments[1][0]
      this.actionModal_data.arr[index].enable = enable
    },
    weekModalCancel(){
      this.$set(this,"weekModal",false)
    },
    actionModalCancel(){
      this.$set(this,"actionModal",false)
    },
    changeWeek(index){
      const oldState = this.weekModal_data.arr[index].flag
      let newState = !oldState
      if(index === 0){
        for(let i=0;i<this.weekModal_data.arr.length;i++){
          this.$set(this.weekModal_data.arr[i],"flag",false)
        }
        this.$set(this.weekModal_data.arr[0],"flag",newState)
      }else{
        this.$set(this.weekModal_data.arr[0],"flag",false)
        this.$set(this.weekModal_data.arr[index],"flag",newState)
      }
    },
    chooseWeek(){
      this.weekModal = !this.weekModal
    },
    chooseAction(index){
      this.actionModal = !this.actionModal;
      this.nowChooseActionIndex = index
    },
    changeAction(actionArrIndex,propIndex){
      console.log("选择动作",arguments)
      for(let i =0; i<this.actionModal_data.arr[actionArrIndex].prop.length;i++){
        this.actionModal_data.arr[actionArrIndex].prop[i].flag = false;
      }
      this.actionModal_data.arr[actionArrIndex].prop[propIndex].flag = true;

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
  },
  activated() {},
  mounted() {
    let _this = this;
    HonYar.show_Loading();
    let waitTimeList = setInterval(() => {
      if(JSON.stringify(_this.deviceInfo) !== '{}'){
        HonYar.getCloudTiming(_this.deviceInfo.iotId)
        .then(res => {
          HonYar.stop_Loading();
          let list = JSON.parse(res).data
          _this.$store.dispatch("changeDate",{
            cloudTimeList:list
          }).then(res => {
            _this.$set(_this,"timeList",list)
          })
        })
        _this.initCloudDataInfo();
        clearInterval(waitTimeList)
      }
    }, 1);
    HonYar.getCloudTiming()
  },
  created() {
    let _this = this;
  },
  beforeDestroy(){
    let _this = this;

  }
};
</script>
<style lang="scss" scoped>

.Timing{
  width: 100%;
  height: calc(100% - 200px);
}
.nullData{
  position: relative;
  width: 100%;
  height: 100%;
  span{
    position: absolute;
    left: 25%;
    top: 40%;
    @include oneLineTextStyle(50%,40px,35px,rgba(182,182,182,0.5))
  }
}
</style>