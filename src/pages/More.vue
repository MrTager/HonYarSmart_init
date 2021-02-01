<template>
  <div class="more">
    <Animation-Frame>
    <Header-Bar
      @back="back"
      :titleName="compontent_props.headerBar.name"
      type=""
    ></Header-Bar>
    <div v-if="show_page_flag.level_one_page" class="levelOnePage">
      <div class="product_image">
        <img
          class="product_img"
          :src="compontent_props.categoryImage"
          alt=""
        />
      </div>
      <ul class="item_group">
        <li v-if="super_admin" class="item" @click="create_qr_code()">
          <div class="item_name">设备分享二维码</div>
          <img
            class="qr_code"
            src="@/assets/images/icon/qr_code.png"
            alt=""
          />
          <img
            class="item_arrow"
            src="@/assets/images/icon/gray_arrow.png"
            alt="箭头"
          />
        </li>
        <li class="item" @click="change_dev_name()">
          <div class="item_name">设备名称</div>
          <div class="list_text">
            {{compontent_props.devAppName}}
          </div>
          <img
            class="item_arrow"
            src="@/assets/images/icon/gray_arrow.png"
            alt="箭头"
          />
        </li>
        <li class="item" @click="go_member_page()">
          <div class="item_name">设备成员</div>
          <div class="list_text">{{compontent_props.member.number}}</div>
          <img
            class="item_arrow"
            src="@/assets/images/icon/gray_arrow.png"
            alt="箭头"
          />
        </li>
        <li class="item" @click="go_feedback_page()">
          <div class="item_name">意见反馈</div>
          <div class="list_text"></div>
          <img
            class="item_arrow"
            src="@/assets/images/icon/gray_arrow.png"
            alt="箭头"
          />
        </li>
        <li class="item" id="dev_name" @click="device_name_value()">
          <div class="item_name">设备识别码</div>
          <div class="list_text">{{compontent_props.deviceName}}</div>
          <img
            class="item_arrow"
            src="@/assets/images/icon/gray_arrow.png"
            alt="箭头"
          />
        </li>
        <li class="item" v-if="compontent_props.firmwareVersion !== ''">
          <div class="item_name">固件版本</div>
          <div class="list_text">{{compontent_props.firmwareVersion}}</div>
          <img
            class="item_arrow"
            src="@/assets/images/icon/gray_arrow.png"
            alt="箭头"
          />
        </li>
      </ul>
      <div v-if="compontent_props.owner.home_owner === '1'" class="unbind" @click="unbind">解除绑定</div>
    </div>
    <!-- 设备分享界面 -->
    <div v-if="show_page_flag.qr_code_page" class="level_two_page qr_code_page" >
        <div class="share_panel">
            <div class="share_panel_title">分 享 设 备</div>
            <div class="share_panel_smallTitle">分享该设备</div>
            <div class="share_panel_group">
              <div v-if="show_QRCode_cover" class="share_panel_QRCode_cover">
                <img class="share_panel_QRCode_cover_loading" src="@/assets/images/icon/loading.gif" alt="加载中">
              </div>
              <div class="share_panel_QRCode" ref="QR_Code"></div>
            </div>
            <div class="share_panel_describe">二维码将在30分钟后失效，请使用鸿雁智+APP扫码添加</div>
        </div>
    </div>
    <!-- 成员列表 -->
    <div v-if="show_page_flag.member_page" class="level_two_page member">
      <ul class="member_list">
        <li class="member_item" v-for="(item,i) in compontent_props.member.list" :key="i">
          <img
            class="user_icon"
            :src="require(`@/assets/images/icon/${item.pic}`)"
            alt="用户图标"
          />
          <div class="user_name">{{item.name}}</div>
          <div class="role">{{item.identify}}</div>
          <img v-if=" super_admin && item.identify !== '管理员' " class="member_del" src="@/assets/images/icon/delete.png" alt="删除" @click="del_member(item.name,item.userId,item.identityId)">
        </li>
      </ul>
    </div>
    <!-- 意见反馈 -->
    <div v-if="show_page_flag.feedback_page" class="level_two_page feedback">
      <textarea class="feedback_input" v-model="compontent_props.feedback.content" placeholder="说说你的问题..."></textarea>
      <div class="contact_container">
        <div class="contact_txt">联系方式:</div>
        <input
          class="contact_information"
          type="text"
          name="telephone"
          id="contact_information"
          placeholder="请输入联系方式..."
          v-model="compontent_props.feedback.contact"
        />
      </div>
      <div class="feedback_submit" @click="feedback_submit">提交</div>
    </div>
    </Animation-Frame>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HonYar from "@/utils/WebAPI";
import axios from "axios";
import Clipboard from "clipboard";
import QRCode from 'qrcodejs2'
import HeaderBar from "@/component_library/module/HeaderBar";
import { AnimationFrame } from "@/component_library";

export default {
  name: "More",
  components: {
    "Header-Bar": HeaderBar,
    "Animation-Frame":AnimationFrame
  },
  data() {
    return {
      compontent_props: {
        headerBar: {
          name: "更多",
        },
        member:{//成员
            number: "",
            list: [],
            owned: ""
        },
        devAppName:"",      //设备名称
        firmwareVersion:"", //固件版本
        categoryImage:"",   //设备图片地址
        deviceName:"",      //设备DN
        owner:{
          home_owner:"",   //家拥有者
          dev_owner:"",    //设备拥有者
        },
        feedback:{
          content:"",
          contact:""
        },


      },
      show_page_flag: {
        //二级页面显示标识符
        level_one_page: true,   //主页
        qr_code_page: false,    //设备分享页
        member_page: false,     //成员管理页面
        feedback_page: false,   //意见反馈页面
      },
      aspect_ratio:0,//屏幕比例
      show_QRCode_cover:false,//设备分享页加载框
      timer:{       //定时器
        waitIotId:null,
        waitData:null,
      },
      showLoading_flag:false,    //加载框状态
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
      bindingDevList: (state) =>{
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
    /**家拥有者同时又是设备拥有者 */
    super_admin(){
      let _this = this;
      if(_this.compontent_props.owner.home_owner == "1" && _this.compontent_props.owner.dev_owner == "1"){
        return true
      }else{
        return false
      }
    },
  },
  methods: {
    back() {
      let _this = this;
      if (_this.show_page_flag.level_one_page) {
        _this.$router.replace({ path: "/main" });
      } else {
        _this.change_page("level_one_page");
      }
    },
    /**创建分享设备二维码 */
    create_qr_code() {
      let _this = this;
      //if(_this.administrator()){
        _this.change_page("qr_code_page");
        _this.show_QRCode_cover = true;
        //等待iotId数据
        _this.timer.waitIotId = setInterval(()=>{
          if(_this.deviceInfo.iotId !== undefined){
            clearInterval(_this.timer.waitIotId)
            HonYar.getAliServerData("/uc/generateShareQrCode",{"iotIdList": [_this.deviceInfo.iotId],},(res)=>{
                if(JSON.parse(res).code == 200){
                  _this.show_QRCode_cover = false;
                    let data = JSON.parse(res).data.qrKey
                    this.$nextTick(()=>{
                        new QRCode(_this.$refs.QR_Code, {
                            text: data, //需要转换为二维码的内容
                            width:400*_this.aspect_ratio,
                            height:400*_this.aspect_ratio,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.H
                        })
                    })
                    
                }else{
                    HonYar.show_toast("获取分享二维码失败"+res,(res)=>{})
                }
            })
          }
        },1)

      // }else{
      //   HonYar.show_toast("此功能仅允许管理员操作！",(res)=>{})
      // }

    },
    /**更改设备名称 */
    change_dev_name() {
      let _this = this;
      //如果为管理员显示修改弹框，如果为成员显示只读类型的弹框
      if(_this.compontent_props.owner.home_owner !== ""){
        if(_this.compontent_props.owner.home_owner == "1"){
          HonYar.showInputDialog(
            "更改设备名称",
            "最多输入15个字符",
            _this.compontent_props.devAppName,
            (res) => {
              if(JSON.parse(res).code == 200){
                switch(JSON.parse(res).data.inputData){
                  case undefined:
                    HonYar.show_toast("修改失败！",(res)=>{})
                    break;
                  case "":
                    HonYar.show_toast("输入不能为空！",(res)=>{})
                    break;
                  default:
                    if(JSON.parse(res).data.inputData.length <= 15){
                      _this.compontent_props.devAppName = JSON.parse(res).data.inputData;
                      HonYar.show_Loading('修改中...',(res) => {_this.showLoading_flag = true;})
                      HonYar.getAliServerData("/uc/setDeviceNickName",{
                        "iotId": _this.deviceInfo.iotId,
                        "nickName": _this.compontent_props.devAppName
                      },(res)=>{
                          HonYar.stop_Loading((res)=>{_this.showLoading_flag = false;})
                          if(JSON.parse(res).code == 200){
                            HonYar.show_toast("修改成功",(res)=>{})
                          }else{
                            HonYar.show_toast("修改失败"+res,(res)=>{})
                          }
                      })
                    }else{
                      HonYar.show_toast("最多支持输入15个字符",(res)=>{})
                    }
                    break;
                }
              }
            }
          );
        }else{
          HonYar.show_alert(
            false,
            "设备名称",
            "info",
            _this.compontent_props.devAppName,
            "取消",
            "确定",
            (res) => {
              if (JSON.parse(res).data.inputData) {
                if (JSON.parse(res).data.inputData == "confirm") {
                }
              } else {
                //取消
              }
            }
          );
        }
      }else{
        HonYar.show_toast("请求服务器中，请稍后...",(res)=>{})
      }
      
    },
    go_member_page() {
      let _this = this;
      _this.change_page("member_page");
    },
    go_feedback_page() {
      let _this = this;
      _this.change_page("feedback_page");
    },
    /**提交意见 */
    feedback_submit(){
      let _this = this;
      if(_this.compontent_props.feedback.content !== ""){
        if(_this.compontent_props.feedback.contact !== ""){
          //提交
          HonYar.show_Loading('提交中...',(res) => {_this.showLoading_flag = true;})
          HonYar.submit_feedback(_this.compontent_props.feedback.contact,_this.compontent_props.feedback.content,_this.deviceInfo.userId,(res)=>{
            HonYar.stop_Loading((res)=>{_this.showLoading_flag = false;})
            //不管反馈成不成功，先特么感谢一下(～￣▽￣)～ 
            HonYar.show_toast("感谢您的反馈",(res)=>{
              _this.change_page("level_one_page");
              _this.compontent_props.feedback.contact = "";
              _this.compontent_props.feedback.content = "";
            })
          })
        }else{
          HonYar.show_toast("请输入您的联系方式",(res)=>{})
        }
      }else{
        HonYar.show_toast("请输入您的意见",(res)=>{})
      }
    },
    device_name_value() {
      let _this = this;
      HonYar.show_alert(
        false,
        "设备DN",
        "info",
        _this.compontent_props.deviceName,
        "取消",
        "确定",
        (res) => {
          if (JSON.parse(res).data.inputData) {
            //复制
            if (JSON.parse(res).data.inputData == "confirm") {
            }
          } else {
            //取消
          }
        }
      );
    },
    /**删除成员 */
    del_member(name,userId,identityId) {
      let _this = this;
      HonYar.show_alert(
        true,
        "删除成员",
        "info",
        `确定要删除${name}成员吗？`,
        "取消",
        "确定",
        (res) => {
          if (JSON.parse(res).data.inputData) {
            if (JSON.parse(res).data.inputData == "confirm") {
              HonYar.show_Loading('删除中...',(res) => {_this.showLoading_flag = true;})
              HonYar.getAliServerData("/uc/unbindByManager", {
                  "targetIdentityId": identityId,
                  "iotIdList": [_this.deviceInfo.iotId]
              }, function (res) {
                HonYar.stop_Loading((res)=>{_this.showLoading_flag = false;})
                if(JSON.parse(res).code == 200){
                  HonYar.getServer("/appUser/unbindByManager",{
                      "userId": _this.deviceInfo.userId,
                      "targetUserId": userId,
                      "iotIdList": [_this.deviceInfo.iotId]
                  },(res)=>{
                    if(JSON.parse(res).code == 200){
                      HonYar.show_toast("删除成功！",(res)=>{
                        _this.get_memberList_again();
                      })
                    }else{
                      HonYar.show_toast("删除失败!"+res,(res)=>{})
                    }
                  })
                }
              });
            }
          } else {
            //取消
          }
        }
      );
    },
    /**解绑设备 */
    unbind(){
      let _this = this;
      if(_this.compontent_props.owner.home_owner !== ""){
        if(_this.compontent_props.owner.home_owner == "1"){
            HonYar.show_alert(
              true,
              "解绑",
              "info",
              "确定要解绑此设备吗？",
              "取消",
              "确定",
              (res) => {
                if (JSON.parse(res).data.inputData) {
                  if (JSON.parse(res).data.inputData == "confirm") {
                    HonYar.show_Loading('解绑中...',(res) => {_this.showLoading_flag = true;})
                    if (_this.deviceInfo.iotId.indexOf(".") === -1) {
                      HonYar.getAliServerData("/uc/unbindAccountAndDev", {
                        "iotId": _this.deviceInfo.iotId,
                      }, function (res) {
                        if(JSON.parse(res).code == 200){
                          HonYar.getServer("/appUser/unbindIot", {
                              "iotId": _this.deviceInfo.iotId,
                              "appKey": _this.appKey
                          }, function (res) {
                            HonYar.stop_Loading((res)=>{_this.showLoading_flag = false;})
                            if(JSON.parse(res).code == 200){
                              HonYar.show_toast("解绑成功！",(res)=>{
                                HonYar.finishActivity((res)=>{})
                              });
                            }
                          });
                        }
                      })
                    }else{
                      HonYar.getServer("/appUser/unbindIot", {
                          "iotId": _this.deviceInfo.iotId,
                          "appKey": _this.appKey
                      }, function (res) {
                        HonYar.stop_Loading((res)=>{_this.showLoading_flag = false;})
                        if(JSON.parse(res).code == 200){
                          HonYar.show_toast("解绑成功！",(res)=>{
                            HonYar.finishActivity((res)=>{})
                          });
                        }
                      })
                    }
                  }
                } else {
                  //取消
                }
              }
            );
        }
      }else{
        HonYar.show_toast("请求服务器中，请稍后再试...",(res)=>{})
      }
    },
    change_page(flag) {
      let _this = this;
      _this.show_page_flag[flag] = true;
      if (flag == "level_one_page") {
        for (let key in _this.show_page_flag) {
          if (key !== "level_one_page") {
            _this.show_page_flag[key] = false;
          }
        }
      } else {
        for (let key in _this.show_page_flag) {
          if (key !== flag) {
            _this.show_page_flag[key] = false;
          }
        }
      }
    },
    /**监听上报 */
    registerJs() {
      let _this = this;
      this.$bridge.registerHandler("nativeSignal", (data, responseCallback) => {
        console.log("详情页上报1", JSON.parse(data));
        let _data = JSON.parse(data);
        //监听返回键
        if (_data.request.signalType) {
          if (_data.request.signalType == "back") {
          }
        }
        this.$store.dispatch("updateNativeSignal", data);
        responseCallback('{"errCode": 0}'); // 回复给Native,data为回复数据
      });
      this.$bridge.registerHandler("subAllEvent", (data, responseCallback) => {
        console.log("详情页上报2", JSON.parse(data));
        let _data = JSON.parse(data);
        //监听返回键
        if (_data.request) {
          if (_data.request.signalType) {
            if (_data.request.signalType == "back") {
            }
          }
        }

        this.processing_reported_data(JSON.parse(data));
        this.$store.dispatch("updateEvent", data);
        responseCallback('{"errCode": 0}'); // 回复给Native,data为回复数据
      });
    },
    /**处理上报数据 */
    processing_reported_data(resq) {
      let _this = this;
    },
    /**设备成员 */
    dev_member(){
      let _this = this;
      let userName = _this.user_info.userName
      let temp_list = [];
      let datas = _this.devBindingUserList;
      //初始化
      _this.compontent_props.member.number = "";
      _this.compontent_props.member.list = [];
      _this.compontent_props.member.owned = "";
      _this.$set(_this.compontent_props.member, 'number', datas.total);
      for (let i = 0; i < datas.records.length; i++) {
          if (datas.records[i].identityAlias === userName) {
              _this.$set(_this.compontent_props.member, 'owned', datas.records[i].owned === "1");
              if (_this.compontent_props.member.owned) {
                  temp_list.unshift({
                      "name": datas.records[i].identityAlias,
                      "userId": datas.records[i].userId,
                      "identityId": datas.records[i].identityId,
                      "pic": 'admin.png',
                      "identify": "管理员",
                      "owned": 1,
                  })
              } else {
                  temp_list.unshift({
                      "name": datas.records[i].identityAlias,
                      "userId": datas.records[i].userId,
                      "identityId": datas.records[i].identityId,
                      "pic": 'user.png',
                      "identify": "成员",
                      "owned": 0
                  })
              }
          } else {
              if (datas.records[i].owned === "1") {
                  temp_list.push({
                      "name": datas.records[i].identityAlias,
                      "userId": datas.records[i].userId,
                      "identityId": datas.records[i].identityId,
                      "pic": 'admin.png',
                      "identify": "管理员",
                  })
              } else {
                  temp_list.push({
                      "name": datas.records[i].identityAlias,
                      "userId": datas.records[i].userId,
                      "identityId": datas.records[i].identityId,
                      "pic": 'user.png',
                      "identify": "成员",
                  })
              }
          }
          _this.$set(_this.compontent_props.member, 'list', temp_list);
      }
    },
    copy_dn(){
      let _this = this;
      const clipboard = new Clipboard("#dev_name", {
        text: function () {
          return _this.compontent_props.deviceName;
        },
      });
      clipboard.on("success", (e) => {
        HonYar.show_toast("复制成功！",(res)=>{});
      });
      clipboard.on("error", function (e) {
        HonYar.show_toast("复制失败！",(res)=>{});
      });
    },
    get_memberList_again(){
      let _this = this;
      //获取此设备的绑定关系,更新数据
      HonYar.getlistBindingByDev(_this.deviceInfo.iotId,(res)=>{
        if(JSON.parse(res).code == 200){
          _this.$store.dispatch("changeDate", {
            devBindingUserList : JSON.parse(res).data
          });
          _this.dev_member();
        }else{
          HonYar.show_toast("获取此设备的用户绑定关系失败"+res,(res)=>{})
        }
      })
    }
  },
  activated() {},
  mounted() {
    let _this = this;
    _this.copy_dn();
    _this.timer.waitData =  setInterval(()=>{
      if(
        JSON.stringify(_this.user_info) !== '{}' && 
        JSON.stringify(_this.bindingDevList) !== '{}' && 
        JSON.stringify(_this.deviceInfo) !== '{}' &&
        JSON.stringify(_this.homeInfo) !== '{}'
        ){
        clearInterval(_this.timer.waitData);
        _this.dev_member();
        console.log("设备信息",_this.deviceInfo)
        console.log("家信息",_this.homeInfo)
        _this.compontent_props.devAppName = _this.deviceInfo.nickName == "" ? _this.deviceInfo.appProductName : _this.deviceInfo.nickName;
        _this.compontent_props.categoryImage = _this.deviceInfo.categoryImage;
        _this.compontent_props.deviceName = _this.deviceInfo.deviceName;
        _this.compontent_props.owner.home_owner = _this.homeInfo.parent; //管理员
        _this.compontent_props.owner.dev_owner = _this.deviceInfo.owned;
        _this.get_memberList_again();
      }
    },1)
  },
  created() {
    let _this = this;
    let s_width = Number(window.screen.width);
    _this.aspect_ratio = s_width/750
  },
  beforeDestroy(){
    let _this = this;
    //销毁清除定时器
    clearInterval(_this.timer.waitIotId);
    clearInterval(_this.timer.waitData);
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
.more {
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
  color: black;
  overflow-x: hidden;
  overflow-y: scroll;
}
.product_image {
  position: relative;
  width: 100%;
  height: 350px;
  margin-top: 100px;
  background-color: white;
}
.product_img {
  position: absolute;
  width: 290px;
  height: 290px;
  left: calc(50% - 145px);
  top: calc(50% - 145px);
}
.item_group {
  position: relative;
  margin-top: 25px;
  width: 100%;
  height: auto;
  background-color: white;
}
.item {
  position: relative;
  width: 100%;
  height: 100px;
  border-bottom: 1px solid #d7d7d7;
}
.item_name {
  position: absolute;
  width: 250px;
  font-size: 30px;
  color: black;
  height: 40px;
  top: calc(50% - 20px);
  left: 40px;
  line-height: 40px;
  @include text_limit();
}
.qr_code {
  position: absolute;
  width: 40px;
  height: 40px;
  right: 70px;
  top: calc(50% - 20px);
  opacity: 0.5;
}
.item_arrow {
  position: absolute;
  width: 12px;
  height: 30px;
  top: calc(50% - 15px);
  right: 30px;
}
.list_text {
  position: absolute;
  width: 390px;
  font-size: 30px;
  color: #cdcdcd;
  height: 40px;
  top: calc(50% - 20px);
  right: 70px;
  line-height: 40px;
  @include text_limit();
  text-align: right;
}
.unbind {
  position: relative;
  width: 530px;
  height: 90px;
  border-radius: 45px;
  border: 1px solid #00d0ba;
  margin-top: 60px;
  margin-bottom: 220px;
  color: #00d0ba;
  text-align: center;
  font-size: 30px;
  line-height: 90px;
  left: calc(50% - 265px);
}
.unbind:active {
  background-color: #00d0ba;
  color: white;
}
.level_two_page {
  position: relative;
  top: 80px;
  width: 100%;
  height: calc(100% - 80px);
}
.qr_code_page {
}
.member {
  width: 100%;
  margin-top: 20px;
}
.member_item {
  position: relative;
  width: 100%;
  height: 100px;
  background-color: white;
  border-bottom: 1px solid rgb(224, 224, 224);
}
.user_icon {
  position: absolute;
  width: 50px;
  height: 50px;
  left: 40px;
  top: calc(50% - 25px);
}
.user_name {
  position: absolute;
  width: 400px;
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  @include text_limit();
  left: 100px;
  top: calc(50% - 25px);
  color: #cdcdcd;
}
.role {
  position: absolute;
  width: 150px;
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  @include text_limit();
  right: 65px;
  top: calc(50% - 25px);
  color: #000000;
  text-align: right;
}
.member_del{
  position: absolute;
  width: 30px;
  height: 30px;
  right: 20px;
  top: calc(50% - 17px);
}
.feedback_input {
  width: 100%;
  height: 350px;
  font-size: 30px;
  margin-top: 20px;
  border: none;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}
.contact_container {
  position: relative;
  width: 100%;
  height: 80px;
  margin-top: 20px;
  background-color: white;
}
.contact_information {
  position: absolute;
  width: 500px;
  height: 34px;
  line-height: 34px;
  font-size: 30px;
  border: none;
  left: 180px;
  top: calc(50% - 17px);
}
.contact_txt {
  position: absolute;
  width: 150px;
  font-size: 30px;
  color: black;
  height: 80px;
  line-height: 80px;
  text-align: left;
  left: 20px;
}
.feedback_submit{
  position: relative;
  width: 530px;
  height: 90px;
  border-radius: 45px;
  border: 1px solid #00d0ba;
  margin-top: 60px;
  margin-bottom: 220px;
  color: #00d0ba;
  text-align: center;
  font-size: 30px;
  line-height: 90px;
  left: calc(50% - 265px);
}
.feedback_submit:active {
  background-color: #00d0ba;
  color: white;
}
input,
button,
select,
textarea {
  outline: none;
}
textarea {
  resize: none;
}
.share_panel{
    position: relative;
    left: calc(50% - 300px);
    top: 100px;
    width: 600px;
    height: 800px;
    background-color: white;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    overflow: hidden;
    &_title{
        width: 100%;
        height: 100px;
        background-color: #07cabe;
        color: white;
        font-size: 40px;
        line-height: 100px;
        text-align: center;
    }
    &_smallTitle{
        width: 100%;
        height: 100px;
        color: black;
        font-size: 30px;
        line-height: 100px;
        text-align: center;
    }
    &_group{
      position: relative;
      width: 100%;
      height: 400px;
    }
    &_QRCode{
       position:absolute;
        left: calc(50% - 200px);
        width: 400px;
        height: 400px;
    }
    &_QRCode_cover{
        position: absolute;
        width: 400px;
        height: 400px;
        left: calc(50% - 200px);
        // background-color: rgba(145,145,145,0.3);
        border: 1px solid gray;
        &_loading{
          position: absolute;
          width: 50px;
          height: 50px;
          left: calc(50% - 25px);
          top: calc(50% - 25px);
        }
    }
    &_describe{
      width: 390px;
      height: 50px;
      font-size: 30px;
      color: black;
      margin-left: auto;
      margin-right: auto;
      margin-top: 50px;
      text-align: center;
      line-height: 35px;
    }
}

</style>