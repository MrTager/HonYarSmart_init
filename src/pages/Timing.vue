<template>
  <div class="Timing" ref="container" @touchstart="container_touchstart" @touchmove="container_touchmove" @touchend="container_touchend">
      <Header-Bar @back="back()" :titleName="titleName" :type="headerType" icon="add" @textOptionEvent="saveCloudTime" @event="addCloudTime"></Header-Bar>
      <Blank-Dividing-Strip></Blank-Dividing-Strip>
      <Animation-Frame v-if="showExitPage === false">
        <DropDown-Refresh :on-refresh="action_Refresh" :startRefresh_flag="startRefresh_flag">
          <div v-if="nullDataFlag" class="nullData"><span>无定时数据,请添加定时</span></div>
          <div v-if="nullDataFlag === false">
            <List-Item-Timing ref="ListItemTiming" :time="item.time" :info="item.content" :state="item.enable" :mode="item.mode" @click.native="changeTimeListData(item.completeData)" v-for="(item,i) in cloudList" :key="i" @checkSwitchEvent="changeCloudEnable(item.completeData)"  @touchstart.native="timeListTouchStart(item.ruleId)" @touchmove.native="timeListTouchMove" @touchend.native="timeListTouchEnd"></List-Item-Timing>
          </div>
        </DropDown-Refresh>
      </Animation-Frame>
      <Animation-Frame v-if="showExitPage">
        <Select-Panel setTypes="1" :chooseCloudHour="cloudDataInfo.time.hour" :chooseCloudMin="cloudDataInfo.time.min" @selectTimeHour="selectTimeHour_cloud" @selectTimeMin="selectTimeMin_cloud"></Select-Panel>
        <Gray-Dividing-Strip></Gray-Dividing-Strip>
        <List-Item type="normal" :title="timeModeTitleValue.title" :value="timeModeTitleValue.value" @click.native="chooseWeek"></List-Item>
        <Gray-Dividing-Strip></Gray-Dividing-Strip>
        <div v-if="cloudDataInfo.action.arr.length > 0">
          <List-Item :type="propActionListType" v-for="(item,i) in cloudDataInfo.action.arr" :key="i" :title="item.propName" :value="item.value" :enable="item.enable"  @event="chooseAction(i)" @enableEvent="propActionEnable(i, arguments)"></List-Item>
        </div>
        <List-Modal v-show="weekModal" @cancel="weekModalCancel" @confirm="weekModalConfirm">
          <List-Item-Chick v-for="(item,i) in cloudDataInfo.mode.arr_backup" :key="i" :title="item.name" :state="item.flag" @event="changeWeek(i,item.flag)"></List-Item-Chick>
        </List-Modal>
        <div v-if="cloudDataInfo.action.arr.length > 0">
          <List-Modal v-show="actionModal" @cancel="actionModalCancel" @confirm="actionModalConfirm">
          <List-Item-Value v-for="(item,i) in cloudDataInfo.action.arr[nowChooseActionIndex].action" :key="i" :state="cloudDataInfo.action.arr[nowChooseActionIndex].actionProp === item.prop ? true : false" :value="item.value" @click.native="changeAction(nowChooseActionIndex,i,item)"></List-Item-Value>
        </List-Modal>
        </div>
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
      headerType:'add', //add save
      cloudTimeTouchloop:null,//列表长按事件
      showExitPage:false,//是否显示定时编辑页面
      addTime_flag:false, //是否是增加定时
      changeTime_flag:false, //是否是修改定时
      now_ruleId:"",
      weekModal:false,
      actionModal:false,
      changeCloudData_temporaryData:{},//临时保存要修改的数据
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
                  "content":"" 
              },
              "propertyName":"", //开关属性名
              "propertyValue":0,
              "productKey":"", //pk 
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
        showTimeContent = _this.transitionTime(Number(_this.cloudDataInfo.time.hour)) + " : " + _this.transitionTime(Number(_this.cloudDataInfo.time.min)) + "仅一次"
      }else{
        let weekArrStr = weekArr.join(",");
        let weekNameArrStr = weekNameArr.join(" ");
        cron = "0 " + _this.transitionTime(_this.cloudDataInfo.time.min) + " " + _this.transitionTime(_this.cloudDataInfo.time.hour) + " ? * " + weekArrStr + " *"
        showTimeContent = _this.transitionTime(Number(_this.cloudDataInfo.time.hour)) + " : " + _this.transitionTime(Number(_this.cloudDataInfo.time.min)) + "重复" + weekNameArrStr
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
      let _this = this;
      // arr:[
      //       {propName:'开关一',enable:false,value:"打开",action:[{"prop":'1',"value":"打开"}]}
      //     ]
      const newData = data
      let arr = [];
      const simplifyAbilityDTOs = newData.simplifyAbilityDTOs
      const properties = newData.abilityDsl.properties
      simplifyAbilityDTOs.forEach((value,index) => {
        let obj = new Object();
        const propArr = _this.deviceChildProps
        propArr.forEach(item2 => {
          if(value.identifier === item2.identifier){
            obj["propName"] = item2.nickName === "" ?  item2.name : item2.nickName
          }
        })
        
        obj["identifier"] = value.identifier
        obj["enable"] = 0;
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
      if(arr.length === 1){
        arr[0].enable = 1
      }
      this.$set(this.cloudDataInfo.action,"arr",arr)
      this.$set(this.cloudDataInfo.action,"arr_backup",arr)
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
    //删除定时
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
    //时间列表触摸事件
    timeListTouchStart(ruleId){
      let _this = this;
      //_this.$refs.ListItemTiming.style.backgroundColor = 'rgba(211, 211, 211,0.5)'
      clearTimeout(this.cloudTimeTouchloop); 
      this.cloudTimeTouchloop = setTimeout(() => {
      //alert(ruleId)
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
      }, 600);
   
    },
    timeListTouchMove(e){
      clearTimeout(this.cloudTimeTouchloop); 
    },
    timeListTouchEnd(e){
      clearTimeout(this.cloudTimeTouchloop); 
    },
   
    changeTimeListData(completeData){
      let _this = this;
      let data =  completeData
      _this.$set(_this,"changeCloudData_temporaryData",completeData)
      let time = {};
      let mode = {};
      let action = {};
      let dataTime = _this.cloudDataInfo.time
      let dataMode = _this.cloudDataInfo.mode.arr
      let dataAction = _this.cloudDataInfo.action.arr
      let exist_cron = data.triggers.items[0].params.cron.split(" ");
      let exist_actions = data.actions;
      _this.$set(_this.cloudDataInfo.time,'hour',exist_cron[2]);
      _this.$set(_this.cloudDataInfo.time,'min',exist_cron[1])
      //无重复情况下
      if (exist_cron[5] === "?") {
        //仅一次
        dataMode.map((item)=>{
          if(item.index === 0){
            item.flag = true
          }else{
            item.flag = false
          }
        })
      }else{
        //重复
        let week = exist_cron[5];
        let weekArr = week.split(',')
        dataMode.map(item => {
          item.flag = false
          weekArr.forEach(item2 => {
            if(item.index === Number(item2)){
              item.flag = true
            }
          })
        })
      }
      _this.$set(_this.cloudDataInfo.mode,'arr',dataMode)
      dataAction.map(item => {
        item.enable = 0;
        try {
          exist_actions.forEach(item2 => {
            if(item2.params.propertyName === item.identifier){
              item.value = item2.params.appShow.content;
              item.enable = 1;
              item.actionProp = String(item2.params.propertyValue);
              item.type = item2.params.propertyValue
              throw Error();
            }
          })
        }catch (e) {

        }
        
      })
      _this.$set(_this.cloudDataInfo.action,'arr',dataAction)
      _this.Exit_Add_CloudTime_Func("change")
      // _this.$set(_this,"changeTime_flag",true)
    },
    /**
     * 
     * type 为类型 change add
     */
    Exit_Add_CloudTime_Func(type){
      let _this = this;
      //this.showExitPage = true;
      this.$set(this,"showExitPage",true)
      if(type === "change"){
        this.$set(this,"addTime_flag",false)
        this.$set(this,"changeTime_flag",true)
      }else if(type === "add"){
        this.$set(this,"addTime_flag",true)
        this.$set(this,"changeTime_flag",false)
      }
      this.$set(this,"titleName",'添加定时')
      this.$set(this,"headerType",'save')
          //备份初始状态
      _this.cloudDataInfo_backup = JSON.parse(JSON.stringify(_this.cloudDataInfo))
    },

    addCloudTime(){
      let _this = this;
      _this.Exit_Add_CloudTime_Func("add")
    },


    weekModalCancel(){
      this.weekModal = !this.weekModal
    },
    weekModalConfirm(){
      this.weekModal = !this.weekModal
      this.cloudDataInfo.mode.arr = this.cloudDataInfo.mode.arr_backup
      let _this = this;
      _this.cloudDataInfoSave.gatewayIotId = _this.deviceInfo.iotId
      // _this.cloudDataInfo.time.hour = _this.cloudSelectTime.hour
      // _this.cloudDataInfo.time.min = _this.cloudSelectTime.min
      //初始化cron
      _this.createCron(_this.cloudDataInfo.mode.arr)
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
      let actionArr = [];
      let isAction = false;//action是否为空
      newData.action.arr.forEach((item)=>{
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
        if(_this.changeTime_flag){
          HonYar.show_Loading("设置中...")
          setData["delete"] = _this.changeCloudData_temporaryData.delete
          setData["order"] = 0
          setData["ruleId"] = _this.changeCloudData_temporaryData.ruleId
          setData["sceneId"] = _this.changeCloudData_temporaryData.sceneId
          setData["type"] = _this.changeCloudData_temporaryData.type
          HonYar.getServer("/appScene/updateTiming",setData,(res)=>{
            if(JSON.parse(res).code === 200){
              _this.refreshCloudList()
              _this.backInit()
            }else{
              HonYar.show_toast(res)
            }
          })
          return
        }
        if(_this.addTime_flag){
          HonYar.show_Loading("设置中...")
          HonYar.getServer("/appScene/addTiming",setData,(res)=>{
            if(JSON.parse(res).code === 200){
              _this.refreshCloudList()
              _this.backInit()
            }else{
              HonYar.show_toast(res)
            }
          })
          return
        }
        
      }else{
        HonYar.show_toast("至少选择一个动作")
      }
      
    },
    refreshCloudList(){
      let _this = this;
    //   HonYar.getServer("/appScene/getTimings", {"gatewayIotId": _this.deviceInfo.iotId},(res)=>{
    //   _this.$store.dispatch("changeDate",{
    //     cloudTimeList:JSON.parse(res).data
    //   }).then(res => {
    //     //渲染列表
    //     _this.loadCloudTimeList()
    //     HonYar.stop_Loading();
    //   })
    // })

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

    },

    loadCloudTimeList(){
      let _this = this;
      let list = _this.cloudTimeList
      let showArr = [];
      list.forEach(item => {
        let listItem = item;
        let obj = new Object();
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




    //切换云端定时使能按钮
    changeCloudEnable(data){
      let _this = this;
      HonYar.show_Loading("设置中...")
      let setData = data;
      let enable = !setData.enable;//需要下发的enable
      setData.enable = enable
      //创建新的cron
      let exist_cron = setData.triggers.items[0].params.cron.split(" ");
      //无重复情况下
      if (exist_cron[5] === "?") {
        //重新生成时间
        let today = new Date();
        let cron_day = parseInt(exist_cron[3]) + parseInt(exist_cron[4]) * 100 + parseInt(exist_cron[6]) * 10000;
        let now_day = today.getDate() + (today.getMonth() + 1) * 100 + today.getFullYear() * 10000;
        if (now_day > cron_day) {
            exist_cron[3] = today.getDate();
            exist_cron[4] = today.getMonth() + 1;
            exist_cron[6] = today.getFullYear();
        } else {
          let   cron_time = parseInt(exist_cron[1]) + parseInt(exist_cron[2]) * 100;
          let   now_time = today.getMinutes() + today.getHours() * 100;
          if (now_time > cron_time) {
              exist_cron[3] = today.getDate() + 1;
              exist_cron[4] = today.getMonth() + 1;
              exist_cron[6] = today.getFullYear();
          }
        }
        setData.triggers.items[0].params.cron = exist_cron.join(" ");

        HonYar.getServer("/appScene/updateTiming",setData,(res)=>{
          _this.refreshCloudList();
          HonYar.stop_Loading()
        })
      }else{
        HonYar.getServer("/appScene/updateTiming",setData,(res)=>{
          _this.refreshCloudList();
          HonYar.stop_Loading()
        })
      }
      

    },


    backInit(){
      let _this = this;
      HonYar.show_Loading("加载中...")
      _this.cloudDataInfo = JSON.parse(JSON.stringify(_this.cloudDataInfo_backup))
      _this.createActionArray();
      _this.$set(this,"showExitPage",false)
      // _this.$set(this,"addTime_flag",false)
      // _this.$set(this,"changeTime_flag",false)
      _this.$set(this,"titleName",'定时')
      _this.$set(this,"headerType",'add')
      _this.changeCloudData_temporaryData = {}
      HonYar.stop_Loading()
    },
    back(){
      let _this = this;
      if(this.showExitPage){
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
     /**********************************************************监听上报********************************************************** */
    monitor_report() {
      let _this = this;
      this.$bridge.registerHandler("nativeSignal", (data, responseCallback) => {
        //console.log("上报1", JSON.parse(data));
        let _data = JSON.parse(data);
        //监听返回键
        if(_data.request.signalType){
          if(_data.request.signalType == 'back'){
            
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
        this.refreshCloudList();
      }
    },
  },
  mounted() {
    let _this = this;
    this.monitor_report();
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
  // height: 100%;
  min-height: 100%;
}
.nullData{
  // position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-content: center;
  padding-top: 200px;
  span{
    //position: absolute;
    // left: 25%;
    // top: 40%;
    @include oneLineTextStyle(50%,40px,35px,rgba(182,182,182,0.5))
  }
}
</style>