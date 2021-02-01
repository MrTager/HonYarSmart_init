<template>
  <div class="Timing" ref="container" @touchstart="container_touchstart" @touchmove="container_touchmove" @touchend="container_touchend">
      <Header-Bar @back="back()" :titleName="titleName" :type="headerType" icon="add" @event="addCloudTime"></Header-Bar>
      <Blank-Dividing-Strip></Blank-Dividing-Strip>
      <Animation-Frame v-show="addTime_flag">
        <DropDown-Refresh :on-refresh="action_Refresh" :startRefresh_flag="startRefresh_flag">
          <List-Item-Timing time="07:00" info="周一 开启开关一 开启开关二 开启开关三" @delete="delClould" v-for="(item,i) in new Array(10)" :key="i"></List-Item-Timing>
        </DropDown-Refresh>
      </Animation-Frame>
      <Animation-Frame v-show="addTime_flag == false">
        <Select-Panel setTypes="1"></Select-Panel>
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
      addTime_flag:true,
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
    };
  },
  computed: {
    ...mapState({
      state: (state) => {
        return state;
      },
      deviceInfo: (state) => {
        return state.pubilc.attribute.deviceInfo
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
    }
  },
  methods: {
    back(){
      this.$router.replace({ path: "/" });
    },
    delClould(){
      alert("删除")
    },
    addCloudTime(){
      //this.showtime = !this.showtime
      if(this.addTime_flag){
        //this.showtime = false
        this.$set(this,"addTime_flag",false)
        this.$set(this,"titleName",'添加定时')
        this.$set(this,"headerType",'')
      }else{
        //this.showtime = true
        this.$set(this,"addTime_flag",true)
        this.$set(this,"titleName",'定时')
        this.$set(this,"headerType",'add')
      }
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
@mixin text_limit() {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>