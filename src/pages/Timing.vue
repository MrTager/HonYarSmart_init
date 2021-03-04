<template>
  <div class="Timing" ref="container" @touchstart="container_touchstart" @touchmove="container_touchmove" @touchend="container_touchend">
      <Header-Bar @back="back()" :titleName="titleName" :type="headerType" icon="add" @textOptionEvent="saveCloudTime" @event="addCloudTime"></Header-Bar>
      <Blank-Dividing-Strip></Blank-Dividing-Strip>
      <Animation-Frame v-if="addTime_flag === false">
        <DropDown-Refresh :on-refresh="action_Refresh" :startRefresh_flag="startRefresh_flag">
          <div v-if="nullDataFlag" class="nullData"><span>无定时数据,请添加定时</span></div>
          <div v-if="nullDataFlag === false">
            <List-Item-Timing :time="item.time" :info="item.content" :state="item.enable" :mode="item.mode" @delete="delClould(item.ruleId)" v-for="(item,i) in cloudList" :key="i" @checkSwitchEvent="changeCloudEnable(item.completeData)"></List-Item-Timing>
          </div>
        </DropDown-Refresh>
      </Animation-Frame>
      <Animation-Frame v-if="addTime_flag">
        <Select-Panel setTypes="1" :chooseCloudHour="cloudDataInfo.time.hour" :chooseCloudMin="cloudDataInfo.time.min" @selectTimeHour="selectTimeHour_cloud" @selectTimeMin="selectTimeMin_cloud"></Select-Panel>
        <Gray-Dividing-Strip></Gray-Dividing-Strip>
        <List-Item type="normal" :title="timeModeTitleValue.title" :value="timeModeTitleValue.value" @click.native="chooseWeek"></List-Item>
        <Gray-Dividing-Strip></Gray-Dividing-Strip>
        <List-Item :type="propActionListType" v-for="(item,i) in cloudDataInfo.action.arr" :key="i" :title="item.propName" :value="item.value" :enable="item.enable"  @event="chooseAction(i)" @enableEvent="propActionEnable(i, arguments)"></List-Item>
        <List-Modal v-show="weekModal" @cancel="weekModalCancel" @confirm="weekModalConfirm">
          <List-Item-Chick v-for="(item,i) in cloudDataInfo.mode.arr_backup" :key="i" :title="item.name" :state="item.flag" @event="changeWeek(i,item.flag)"></List-Item-Chick>
        </List-Modal>
        <List-Modal v-show="actionModal" @cancel="actionModalCancel" @confirm="actionModalConfirm">
          <List-Item-Value v-for="(item,i) in cloudDataInfo.action.arr[nowChooseActionIndex].action" :key="i" :state="cloudDataInfo.action.arr[nowChooseActionIndex].actionProp === item.prop ? true : false" :value="item.value" @click.native="changeAction(nowChooseActionIndex,i,item)"></List-Item-Value>
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
      actionModal_data:{
        arr:[
          {propName:'开关一',enable:0,flag:true,value:['开启','关闭']},
          {propName:'开关二',enable:1,flag:true,value:['开启','关闭']}
        ]
      },
      nowChooseActionIndex:0,
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
          {name:'周六',flag:false,index:7}],
          arr_backup:[
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

          ],
          arr_backup:[

          ]
        }
      },
      cloudDataInfo_backup:{
      },
      cloudDataInfoSave:{
        "gatewayIotId":"",//设备IOTID
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
              "iotId":"", //设备IOTID
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
      },
      cloudList:[],//定时列表
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
      },
      cloudTimeList: (state) => {
        return state.pubilc.attribute.cloudTimeList;
      },
      deviceChildProps: (state) => { 
        return state.pubilc.attribute.deviceChildProps
      },
    }),
    propActionListType(){
      if(this.cloudDataInfo.action.arr.length > 1){
        return 'check'
      }else{
        return 'normal'
      }
    },
    nullDataFlag(){
      if(this.cloudList.length == 0){
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
    },
    timeModeTitleValue(){
      let arr = this.cloudDataInfo.mode.arr
      let obj = {
        title:'仅一次',
        value:''
      }
      let weekNameArr = []
      for(let i=0;i<arr.length;i++){
        if(arr[i].index === 0){
          if(arr[i].flag){
            obj.title = "仅一次"
            obj.value = ''
          }
        }else{
          if(arr[i].flag){
            weekNameArr.push(arr[i].name)
            obj.title = "重复"
            obj.value = weekNameArr.join(",")
            
          }
        }
      }
      return obj
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
          cron = "0 " + _this.transitionTime(_this.cloudDataInfo.time.min) + " " + _this.transitionTime(_this.cloudDataInfo.time.hour) + " " + HonYar.getTime().day + " " + HonYar.getTime().mon + " ? " + HonYar.getTime().year
        }else{
          cron = "0 " + _this.transitionTime(_this.cloudDataInfo.time.min) + " " + _this.transitionTime(_this.cloudDataInfo.time.hour) + " " + HonYar.getTime().nextday + " " + (Number(HonYar.getTime().nextmonth)+ 1)+ " ? " + HonYar.getTime().nextyear
        }
        showTimeContent = _this.transitionTime(_this.cloudDataInfo.time.hour) + " : " + _this.transitionTime(_this.cloudDataInfo.time.min) + "仅一次"
      }else{
        let weekArrStr = weekArr.join(",");
        let weekNameArrStr = weekNameArr.join(" ");
        cron = "0 " + _this.transitionTime(_this.cloudDataInfo.time.min) + " " + _this.transitionTime(_this.cloudDataInfo.time.hour) + " ? * " + weekArrStr + " *"
        showTimeContent = _this.transitionTime(_this.cloudDataInfo.time.hour) + " : " + _this.transitionTime(_this.cloudDataInfo.time.min) + "重复" + weekNameArrStr
      }
      _this.cloudDataInfoSave.triggers.items[0].params.cron = cron
      _this.cloudDataInfoSave.triggers.items[0].params.appShow.content = showTimeContent
    },
    //初始化表单
    initCloudDataInfo(){
      let _this = this;
      //_this.cloudDataInfoSave.actions[0].params.iotId = _this.deviceInfo.iotId
      _this.cloudDataInfoSave.gatewayIotId = _this.deviceInfo.iotId
      _this.cloudDataInfo.time.hour = _this.cloudSelectTime.hour
      _this.cloudDataInfo.time.min = _this.cloudSelectTime.min
      //初始化cron
      _this.createCron(_this.cloudDataInfo.mode.arr)
      _this.createActionArray()
    },
    transitionTime(num){
      let str =''
      if(Number(num) < 10){
        str = '0'+ num
      }else{
        str = num
      }
      return str
    },
    //生成action数组
    createActionArray(){
      let _this = this;
      HonYar.getlistTslAbility(2,_this.deviceInfo.iotId)
      .then(res => {
        _this.createUIActiveArr(JSON.parse(res).data)
      })
    },
    //生成UI层需要渲染饿格式
    createUIActiveArr(data){
      // arr:[
      //       {propName:'开关一',enable:false,value:"打开",action:[{"prop":'1',"value":"打开"}]}
      //     ]
      const newData = data
      let arr = [];
      const simplifyAbilityDTOs = newData.simplifyAbilityDTOs
      const properties = newData.abilityDsl.properties
      console.log("信息",simplifyAbilityDTOs,properties)
      simplifyAbilityDTOs.forEach((value,index) => {
        let obj = new Object();
        obj["propName"] = value.name
        obj["identifier"] = value.identifier
        obj["enable"] = false;
        obj["action"] = [];
        obj["type"] = value.type
        obj["actionProp"] = "0"; //当前动作选中prop
        for(let i = 0;i<properties.length;i++){
          if(properties[i].identifier === value.identifier){
            let specs = properties[i].dataType.specs
            for(let key in specs){
              let actionObj = new Object();
              if(key === String(value.type)){
                obj["value"] = specs[key]
              }
              actionObj["prop"] = key
              actionObj["value"] = specs[key]
              obj.action.push(actionObj)
            }
            break;
          }
        }
        arr.push(obj)
      });
      // this.cloudDataInfo.action.arr = arr
      this.$set(this.cloudDataInfo.action,"arr",arr)
    },
    //action enable事件
    propActionEnable(){
      const index = arguments[0];
      const enable = arguments[1][0]
      this.cloudDataInfo.action.arr[index].enable = enable
      this.actionUpdateData(index)
    },
    //选择动作
    chooseAction(index){
      this.actionModelTogger()
      this.actionUpdateData(index)
    },
    actionUpdateData(index){//在点击action动作时更新数据
      this.nowChooseActionIndex = index
      this.cloudDataInfo.action.arr_backup = JSON.parse(JSON.stringify(this.cloudDataInfo.action.arr))
      this.$set(this.cloudDataInfo.action.arr[index],"actionProp",String(this.cloudDataInfo.action.arr[index].type))
    },
    actionModelTogger(){
      this.actionModal = !this.actionModal;
    },
    //改变动作
    changeAction(nowChooseActionIndex,actionIndex,item){
      this.$set(this.cloudDataInfo.action.arr[nowChooseActionIndex],"actionProp",item.prop)
      this.$set(this.cloudDataInfo.action.arr[nowChooseActionIndex],"value",item.value)
      this.$set(this.cloudDataInfo.action.arr[nowChooseActionIndex],"type",Number(this.cloudDataInfo.action.arr[nowChooseActionIndex].actionProp))
    },
    //取消改变动作
    actionModalCancel(){
      this.$set(this,"actionModal",false)
      this.cloudDataInfo.action.arr = JSON.parse(JSON.stringify(this.cloudDataInfo.action.arr_backup))
    },
    //确定保存改变动作
    actionModalConfirm(){
      this.$set(this,"actionModal",false)
      this.cloudDataInfo.action.arr_backup = JSON.parse(JSON.stringify(this.cloudDataInfo.action.arr))
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
   
    delClould(ruleId){
      let _this = this;
      HonYar.show_alert(
        true,
        "删除定时",
        "info",
        "确认要删除这条定时吗？",
        "取消",
        "确定",
      ).then((res) => {
        if (JSON.parse(res).data.inputData == "confirm") {
          HonYar.show_Loading("删除中...")
          HonYar.getServer("/appScene/deleteTiming", { "ruleId": ruleId },(res2)=>{
            if(JSON.parse(res2).code === 200){
            HonYar.show_toast("定时删除成功")
            _this.refreshCloudList();
            }
          })
        }
      })
    },

   



    weekModalCancel(){
      this.weekModal = !this.weekModal
    },
    weekModalConfirm(){
      this.weekModal = !this.weekModal
      this.cloudDataInfo.mode.arr = this.cloudDataInfo.mode.arr_backup
      this.initCloudDataInfo()
    }, 
    chooseWeek(){
      this.weekModal = !this.weekModal
      this.cloudDataInfo.mode.arr_backup = JSON.parse(JSON.stringify(this.cloudDataInfo.mode.arr));
    },
    changeWeek(index,flag){
      let _this = this;
      if(index === 0){
        for(let i=0;i<_this.cloudDataInfo.mode.arr_backup.length;i++){
          _this.$set(_this.cloudDataInfo.mode.arr_backup[i],"flag",false)
        }
        _this.$set(_this.cloudDataInfo.mode.arr_backup[0],"flag",true)
      }else{
        _this.$set(_this.cloudDataInfo.mode.arr_backup[0],"flag",false)
        _this.$set(_this.cloudDataInfo.mode.arr_backup[index],"flag",!flag)
        let noOnce = false;
        for(let i=0;i<_this.cloudDataInfo.mode.arr_backup.length;i++){
          if(_this.cloudDataInfo.mode.arr_backup[i].flag){
            noOnce = true
          }
        }
        if(noOnce){

        }else{
          _this.$set(_this.cloudDataInfo.mode.arr_backup[0],"flag",true)
        }
      }
    },

    saveCloudTime(){
      let _this = this;
      let newData = _this.cloudDataInfo;
      let setData = _this.cloudDataInfoSave;
      //遍历action 形成要下发的json数据
      console.log("newData",newData)
      let actionArr = [];
      let isAction=false;//action是否为空
      newData.action.arr.forEach((item)=>{
        console.log("item",item)
        if(item.enable === 1){
          isAction = true
          let obj = new Object();
          obj["params"] = {};
          obj.params.iotId = _this.deviceInfo.iotId;
          obj.params["appShow"] = {};
          obj.params.appShow["content"] = item.value;
          obj.params["propertyName"] = item.identifier;
          obj.params["propertyValue"] = Number(item.actionProp);
          obj.params["productKey"] = _this.deviceInfo.productKey;
          obj.params["deviceName"] = _this.deviceInfo.deviceName;
          obj["url"] = "action/device/setProperty"
          actionArr.push(obj)
        }
      })
      setData.actions = actionArr;
      if(isAction){
        HonYar.show_Loading("设置中...")
        HonYar.getServer("/appScene/addTiming",setData,(res)=>{
          if(JSON.parse(res).code === 200){
            _this.refreshCloudList()
            _this.backInit()
          }else{
            HonYar.show_toast(res)
          }
        })
      }else{
        HonYar.show_toast("至少选择一个动作")
      }
      
    },
    refreshCloudList(){
      let _this = this;
      HonYar.getServer("/appScene/getTimings", {"gatewayIotId": _this.deviceInfo.iotId},(res)=>{
        console.log("获取到的列表",JSON.parse(res))
      _this.$store.dispatch("changeDate",{
        cloudTimeList:JSON.parse(res).data
      }).then(res => {
        //渲染列表
        _this.loadCloudTimeList()
        HonYar.stop_Loading();
      })
    })

    },

    loadCloudTimeList(){
      let _this = this;
      let list = _this.cloudTimeList
      console.log("list",list)
      let showArr = [];
      list.forEach(item => {
        let listItem = item;
        let obj = new Object();
        console.log("是啊集",listItem.triggers.items[0].params.appShow.content)
        obj["time"] = listItem.triggers.items[0].params.appShow.content.slice(0,7)
        obj["mode"] = listItem.triggers.items[0].params.appShow.content.slice(7)
        obj["ruleId"] = listItem.ruleId
        obj["enable"] = listItem.enable
        obj["completeData"] = listItem
        let contentArr2=[]
        for(let i=0;i<listItem.actions.length;i++){
          const propArr = _this.deviceChildProps
          let contentArr = []
          propArr.forEach(item2 => {
              if(listItem.actions[i].params.propertyName === item2.identifier){
                contentArr.push(listItem.actions[i].params.appShow.content)
                contentArr.push(item2.nickName === "" ?  item2.name : item2.nickName)
              }
          })
          contentArr2.push(contentArr.join(""))
        }
        obj["content"] = contentArr2.join(",");
        showArr.push(obj)
      })
      _this.$set(_this,"cloudList",showArr)
    },


    addCloudTime(){
      let _this = this;
      this.$set(this,"addTime_flag",true)
      this.$set(this,"titleName",'添加定时')
      this.$set(this,"headerType",'save')
          //备份初始状态
      _this.cloudDataInfo_backup = JSON.parse(JSON.stringify(_this.cloudDataInfo))
    },

    //切换云端定时使能按钮
    changeCloudEnable(data){
      console.log("全部数据",data)
    },


    backInit(){
      let _this = this;
      _this.cloudDataInfo = JSON.parse(JSON.stringify(_this.cloudDataInfo_backup))
      _this.$set(this,"addTime_flag",false)
      _this.$set(this,"titleName",'定时')
      _this.$set(this,"headerType",'add')
    },
    back(){
      let _this = this;
      if(this.addTime_flag){
          HonYar.show_alert(
              true,
              "解绑",
              "info",
              "此页数据未保存，确定要退出吗？",
              "取消",
              "确定",
            ).then((res) => {
              if (JSON.parse(res).data.inputData == "confirm") {
                _this.backInit()
              }
            })
        
        
         
        
      }else{
        this.$router.replace({ path: "/" });
      }
    },

    action_Refresh(done) {
      this.refreshCloudList();
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
          HonYar.getServer("/appScene/getTimings", {"gatewayIotId": _this.deviceInfo.iotId},(res)=>{
            _this.$store.dispatch("changeDate",{
              cloudTimeList:JSON.parse(res).data
            }).then(res => {
              //渲染列表
              _this.loadCloudTimeList()
            })
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