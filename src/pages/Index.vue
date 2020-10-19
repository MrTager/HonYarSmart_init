<template>
  <div class="main" v-if="theme_img.length > 0">
    <Header
      class="header"
      :user_info="user_info"
      :connect_status="connect_status"
      :message_flag="message_flag"
      @show_message="show_message()"
    ></Header>
    <Loading v-if="loading.show" :loading="loading" @hideLoading="hideLoading"></Loading>
    <MessagePanel :show_msg="show_msg" @hide_message="hide_message"></MessagePanel>
    <Warning
      :warning_msg="message_set[g].warning_msg"
      v-for="(item,g) in message_set"
      :key="g"
      @warn_confrim="warn_confrim(g)"
    ></Warning>
    <swiper
      class="swiper"
      ref="screen"
      :options="swiperOption"
      :style="{ backgroundImage: 'url(' + require('@/assets/themeImg/'+theme_img) + ')',backgroundRepeat: 'no-repeat',backgroundSize: '100% 100%'}"
    >
      <swiper-slide>
        <PageOne></PageOne>
      </swiper-slide>
      <swiper-slide>
        <div class="listGroup">
          <div class="itemBox listItem" v-if="JSON.stringify(short_weather) !== '{}'">
            <router-link :to="{path:'/weather'}" tag="div" replace>
              <div class="newsPanel"></div>
              <div class="itemBox_title_2">天气</div>
              <img class="img_location" src="@/assets/images/location.png" />
              <span class="location_info">{{short_weather.position}}</span>
              <span class="weather_temp">{{short_weather.temp}}°</span>
              <span
                class="weather_quality"
                :style="{'background-color':short_weather.aqiColor}"
              >{{short_weather.aqi_value}}</span>
              <img
                class="weather_icon"
                v-if="short_weather.icon !== ''"
                :src="require(`../assets/weatherImage/W${short_weather.icon}.png`)"
              />
              <span class="weather_name">{{short_weather.condition}}</span>
              <span
                class="weather_info"
              >{{short_weather.windDir}}{{windLevel}}级 | 湿度{{short_weather.humidity}}%</span>
            </router-link>
          </div>
          <div class="itemBox listItem">
            <div class="newsPanel"></div>
            <div class="itemBox_title_2">场景</div>
            <div
              class="itemBox_2 scene_group"
              ref="scene_group"
              v-if="scene_data.data"
              @scene_touchmove="scene_touchstart"
              @touchmove="scene_touchmove"
            >
              <DropDownRefresh :on-refresh="scene_Refresh" :startRefresh_flag="startRefresh_flag">
                <!--  :startPosition="startPosition" -->
                <div
                  class="scene_item"
                  v-for="(item,i) in scene_data.data.records"
                  :key="i"
                  @click="scene_setting(item.sceneId,i,$event)"
                >
                  <div class="scene_item_cover"></div>
                  <img class="scene_item_icon" :src="item.icon" />
                  <div class="scene_item_name">{{item.name}}</div>
                  <div
                    class="scene_item_mode"
                    v-if="Number(item.type) === 1"
                  >{{Number(item.type) === 1 ? "自动" : "手动"}}</div>
                  <div
                    class="scene_item_state"
                    v-if="Number(item.type) === 1"
                  >{{item.enable ? "已开启" : "已关闭"}}</div>
                  <div class="scene_item_bottom"></div>
                </div>
              </DropDownRefresh>
            </div>
          </div>
          <!-- 第一个设备 -->
          <div class="itemBox listItem" v-if="now_group_dev && now_group_dev.length > 0">
            <div class="newsPanel"></div>
            <div class="itemBox_title_2">{{now_group_dev[0].nickName}}</div>
            <div class="itemBox_warning" v-if="Number(now_group_dev[0].status) !== 1">已离线</div>
            <div class="itemBox_2 prop_group">
              <!-- 空调类 -->
              <AirConditioner
                v-if="now_group_dev[0].categoryKey == 'AirConditioning'"
                :prop_data="now_group_dev[0].properties"
                :dev_iotId="now_group_dev[0].iotId"
                :status="Number(now_group_dev[0].status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></AirConditioner>
              <!-- 开关类 -->
              <SwitchDev
                v-if="now_group_dev[0].categoryKey == 'WallSwitch'"
                :prop_data="now_group_dev[0].properties"
                :dev_iotId="now_group_dev[0].iotId"
                :status="Number(now_group_dev[0].status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></SwitchDev>
              <!-- 排插类 -->
              <Socket
                v-if="now_group_dev[0].categoryKey == 'Outlet'"
                :prop_data="now_group_dev[0].properties"
                :dev_iotId="now_group_dev[0].iotId"
                :status="Number(now_group_dev[0].status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></Socket>
              <!-- 地暖类 -->
              <UnderfloorHeating
                v-if="now_group_dev[0].categoryKey == 'FloorHeating'"
                :prop_data="now_group_dev[0].properties"
                :dev_iotId="now_group_dev[0].iotId"
                :status="Number(now_group_dev[0].status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></UnderfloorHeating>
              <!-- 调光类 -->
              <LightModulator
                v-if="now_group_dev[0].categoryKey == 'Light'"
                :prop_data="now_group_dev[0].properties"
                :dev_iotId="now_group_dev[0].iotId"
                :status="Number(now_group_dev[0].status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></LightModulator>
              <!-- 新风类 -->
              <FreshAir
                v-if="now_group_dev[0].categoryKey == 'FAU'"
                :prop_data="now_group_dev[0].properties"
                :dev_iotId="now_group_dev[0].iotId"
                :status="Number(now_group_dev[0].status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></FreshAir>
              <!-- 窗帘类 -->
              <Curtain
                v-if="now_group_dev[0].categoryKey == 'Curtain'"
                :prop_data="now_group_dev[0].properties"
                :dev_iotId="now_group_dev[0].iotId"
                :status="Number(now_group_dev[0].status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></Curtain>
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide v-for="(group,j) in device_grouping" :key="j">
        <div class="listGroup">
          <div class="itemBox listItem" v-for="(dev_item,i) in group" :key="i">
            <div class="newsPanel"></div>
            <div class="itemBox_title_2">{{dev_item.nickName}}</div>
            <div class="itemBox_warning" v-if="Number(dev_item.status) !== 1 ">已离线</div>
            <div class="itemBox_2 prop_group">
              <!-- 空调类 -->
              <AirConditioner
                v-if="dev_item.categoryKey == 'AirConditioning'"
                :prop_data="dev_item.properties"
                :dev_iotId="dev_item.iotId"
                :status="Number(dev_item.status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></AirConditioner>
              <!-- 开关类 -->
              <SwitchDev
                v-if="dev_item.categoryKey == 'WallSwitch'"
                :prop_data="dev_item.properties"
                :dev_iotId="dev_item.iotId"
                :status="Number(dev_item.status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></SwitchDev>
              <!-- 排插类 -->
              <Socket
                v-if="dev_item.categoryKey == 'Outlet'"
                :prop_data="dev_item.properties"
                :dev_iotId="dev_item.iotId"
                :status="Number(dev_item.status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></Socket>
              <!-- 地暖类 -->
              <UnderfloorHeating
                v-if="dev_item.categoryKey == 'FloorHeating'"
                :prop_data="dev_item.properties"
                :dev_iotId="dev_item.iotId"
                :status="Number(dev_item.status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></UnderfloorHeating>
              <!-- 调光类 -->
              <LightModulator
                v-if="dev_item.categoryKey == 'Light'"
                :prop_data="dev_item.properties"
                :dev_iotId="dev_item.iotId"
                :status="Number(dev_item.status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></LightModulator>
              <!-- 新风类 -->
              <FreshAir
                v-if="dev_item.categoryKey == 'FAU'"
                :prop_data="dev_item.properties"
                :dev_iotId="dev_item.iotId"
                :status="Number(dev_item.status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></FreshAir>
              <!-- 窗帘类 -->
              <Curtain
                v-if="dev_item.categoryKey == 'Curtain'"
                :prop_data="dev_item.properties"
                :dev_iotId="dev_item.iotId"
                :status="Number(dev_item.status)"
                @show_stop_setProploading = "show_stop_setProploading"
              ></Curtain>
            </div>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Tool from "@/utils/Tool";
import axios from "axios";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import Loading from "@/components/Loading";
import Header from "@/components/HeaderBar";
import PageOne from "@/components/PageOne";
import DropDownRefresh from "@/components/DropDownRefresh";
import SwitchDev from "@/components/DeviceControlModule/SwitchDev";
import Curtain from "@/components/DeviceControlModule/Curtain";
import Socket from "@/components/DeviceControlModule/Socket";
import UnderfloorHeating from "@/components/DeviceControlModule/UnderfloorHeating";
import LightModulator from "@/components/DeviceControlModule/LightModulator";
import AirConditioner from "@/components/DeviceControlModule/AirConditioner";
import FreshAir from "@/components/DeviceControlModule/FreshAir";
import MessagePanel from "@/components/MessagePanel";
import Warning from "@/components/Warning";

export default {
  name: "Main",
  title: "Pagination",
  components: {
    Swiper,
    SwiperSlide,
    Header,
    PageOne,
    DropDownRefresh,
    SwitchDev,
    Curtain,
    Socket,
    UnderfloorHeating,
    LightModulator,
    AirConditioner,
    FreshAir,
    Loading,
    MessagePanel,
    Warning,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      imgIndex: 0,
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      // themeAddress: "background_img_1.png",
      animation: [],
      connect_status: "",
      message_flag: false, //消息红点是否显示
      show_msg: false, //传入子组件
      message_set: [
        // {
        //   warning_msg: {
        //     title: "烟雾告警",
        //     content: "烟雾浓度超标！",
        //     time: "08:52:00",
        //   },
        // },
      ],
      window_proportion: 0,
      startRefresh_flag: false,
      loading: {
        show: false,
        msg: "加载中",
      },
    };
  },
  computed: {
    ...mapState({
      state: (state) => {
        return state;
      },
      scene_data: (state) => {
        return state.pubilc.attribute.scene_data;
      },
      user_info: (state) => {
        return state.pubilc.attribute.user_info;
      },
      user_all_dev: (state) => {
        return state.pubilc.attribute.user_all_dev;
      },
      user_dev_group: (state) => {
        return state.pubilc.attribute.user_dev_group;
      },
      now_group_dev: (state) => {
        //属性拼接完成后的设备list
        // console.log("设备列表", state.pubilc.attribute.now_group_dev);
        return state.pubilc.attribute.now_group_dev;
      },
      switch_config: (state) => {
        return state.pubilc.switch_config;
      },
      device_config: (state) => {
        return state.pubilc.device_config;
      },
      device_pk_kill: (state) => {
        return state.pubilc.device_pk_kill;
      },
      theme_img: (state) => {
        return state.pubilc.attribute.theme_img;
      },
      short_weather: (state) => {
        return state.pubilc.attribute.short_weather;
      },
    }),
    swiper() {
      if (this.theme_img.length > 0) {
        return this.$refs.screen.$swiper;
      } else {
        return false;
      }
    },
    //将设备分成三个一组
    device_grouping() {
      let _this = this;
      var result = [];
      for (var i = 1; i < _this.now_group_dev.length; i += 3) {
        result.push(_this.now_group_dev.slice(i, i + 3));
      }
      return result;
    },
    /**下拉框起始下拉位置 */
    startPosition() {
      return parseInt(33 * this.window_proportion);
    },
    //风级转换成阿拉伯数字
    windLevel() {
      if (this.short_weather !== undefined) {
        switch (Number(this.short_weather.windLevel)) {
          case 0:
            return 0;
          case 1:
            return "Ⅰ";
          case 2:
            return "Ⅱ";
          case 3:
            return "Ⅲ";
          case 4:
            return "Ⅳ";
          case 5:
            return "Ⅴ";
          case 6:
            return "Ⅵ";
          case 7:
            return "Ⅶ";
          case 8:
            return "Ⅷ";
          case 9:
            return "Ⅸ";
          case 10:
            return "Ⅹ";
          case 11:
            return "Ⅺ";
          case 12:
            return "Ⅻ";
          case 13:
            return "这风也太大了吧";
        }
      }
    },
  },
  methods: {
    hideLoading(){
      let _this = this;
      _this.loading.show = false
    },
    scene_Refresh(done) {
      this.get_Scene_Date((res) => {
        done();
      });
    },
    scene_touchstart(e) {
      e = event || window.event;
      if (this.$refs.scene_group.scrollTop == 0) {
        this.startRefresh_flag = true;
      } else {
        this.startRefresh_flag = false;
      }
    },
    scene_touchmove(e) {
      e = event || window.event;
      if (this.$refs.scene_group.scrollTop == 0) {
        this.startRefresh_flag = true;
      } else {
        this.startRefresh_flag = false;
      }
    },
    /**监听上报 */
    registerJs() {
      let _this = this;
      this.$bridge.registerHandler("nativeSignal", (data, responseCallback) => {
      //  console.log("上报1", JSON.parse(data));
        if (JSON.parse(data).request !== undefined && JSON.parse(data).request.signalType == "showConnectInfo") {
          this.connect_status = JSON.parse(data).params.showMessage;
        }
        let _data = JSON.parse(data);
        //监听返回键
        if(_data.request.signalType){
            if(_data.request.signalType == 'back'){
              _this.loading.show = false
            }
        }
        this.$store.dispatch("updateNativeSignal", data);
        responseCallback('{"errCode": 0}'); // 回复给Native,data为回复数据
      });
      this.$bridge.registerHandler("subAllEvent", (data, responseCallback) => {
      //  console.log("上报2", JSON.parse(data));
        let _data = JSON.parse(data);
        //监听返回键
        if(_data.request){
          if(_data.request.signalType){
            if(_data.request.signalType == 'back'){
              _this.loading.show = false
            }
        }
        }
        
        this.processing_reported_data(JSON.parse(data));
        this.$store.dispatch("updateEvent", data);
        responseCallback('{"errCode": 0}'); // 回复给Native,data为回复数据
      });
    },
    /**下发控制场景 */
    scene_setting(sceneId, i, e) {
      let _this = this;
      Tool.setScene(sceneId, (res) => {
        if (Tool.judge_code(res)) {
        } else {
          Tool.show_toast("设置失败，请重试");
        }
        _this.get_Scene_Date();
      });

      _this.switch_animation(i, e);
    },
    /**滑动动画特效 */
    switch_animation(i, e) {
      let _this = this;
      // 动画
      e.preventDefault();
      if (_this.animation[i] == null) {
        let obj = {};
        _this.animation[i] = null;
        obj["scene_animation"] = null;
        obj["scene_fadeOver"] = null;
        obj["scene_touch"] = true;
        _this.animation[i] = null;
        _this.animation[i] = obj;
      } else {
        clearInterval(_this.animation[i].scene_fadeOver);
        clearInterval(_this.animation[i].scene_animation);
      }
      if (_this.animation[i].scene_touch) {
        let position = 0;
        _this.animation[i].scene_animation = setInterval(() => {
          position += 2;
          e.target.style.background = `linear-gradient(to right, rgba(255,255,255,0.3) 0%,rgba(255,255,255,0.3) ${position}%,rgba(255,255,255,0) ${
            position + 1
          }%,rgba(255,255,255,0) 100%)`;
          if (position >= 100) {
            position = 100;
            let fadeIndex = 0.3;
            _this.animation[i].scene_fadeOver = setInterval(() => {
              fadeIndex = Math.floor((fadeIndex - 0.05) * 100) / 100;
              if (fadeIndex <= 0) {
                fadeIndex = 0;
              }
              e.target.style.background = `linear-gradient(to right, rgba(255,255,255,${fadeIndex}) 0%,rgba(255,255,255,${fadeIndex}) ${position}%,rgba(255,255,255,0) ${
                position + 1
              }%,rgba(255,255,255,0) 100%)`;
              if (fadeIndex == 0) {
                clearInterval(_this.animation[i].scene_fadeOver);
              }
            }, 200);
            clearInterval(_this.animation[i].scene_animation);
          }
        }, 1);
      }
    },
    /**获取场景接口 */
    get_Scene_Date(func) {
      let _this = this;
      //调用场景
      Tool.getSceneList((res) => {
        if (Tool.judge_code(res)) {
          // 传入state管理
          _this.$store.dispatch("changeDate", {
            scene_data: Tool.transition_resq(res),
          });
        //  _this.loading.show = false;
        } else {
          Tool.show_toast(`${Tool.transition_resq(res).code}场景数据获取失败`);
        }
        if (func !== undefined) {
          func(res);
        }
      });
    },
    /**获取常用类的设备列表 */
    get_common_dev() {
      let _this = this;
      _this.get_userInfo((res_1) => {
        _this.get_user_bind_dev((res_2) => {
          _this.get_dev_group_info((res_3) => {
            let _common_groupId = "";
            for (let i = 0; i < res_3.data.length; i++) {
              if (res_3.data[i].groupName == "常用") {
                _common_groupId = res_3.data[i].groupId;
              }
            }
            Tool.getListGroup_Device(_common_groupId, (res_4) => {
              if (Tool.judge_code(res_4)) {
                _this.loading.show = false;
                //筛选出“常用”设备
                _this.$store.dispatch("changeDate", {
                  now_group_dev: _this.device_localdata_add_prop(
                    res_2.data.records,
                    _this.filter_common_dev(Tool.transition_resq(res_4))
                  ),
                });
              } else {
                console.error(
                  `${Tool.transition_resq(res).code}获取分组下设备列表失败！`
                );
              }
            });
          });
        });
      });
    },
    /**获取用户信息 */
    get_userInfo(func) {
      let _this = this;
      Tool.getUserId((res) => {
        if (Tool.judge_code(res)) {
          _this.$store.dispatch("changeDate", {
            user_info: Tool.transition_resq(res),
          });
          if (func !== undefined) {
            func(Tool.transition_resq(res));
          }
        } else {
          console.error(
            `${Tool.transition_resq(res).code}获取用户信息失败${
              Tool.transition_resq(res).message
            }`
          );
        }
      });
    },
    /**获取用户榜定的设备列表用来获取在离线状态 */
    get_user_bind_dev(func) {
      let _this = this;
      Tool.getListBindingByAccount(
        _this.user_info.data.userId,
        1,
        10000,
        _this.user_info.data.appKey,
        (res) => {
          if (Tool.judge_code(res)) {
            _this.$store.dispatch("changeDate", {
              user_all_dev: Tool.transition_resq(res),
            });
            if (func !== undefined) {
              func(Tool.transition_resq(res));
            }
          } else {
            console.error(
              `${Tool.transition_resq(res).code}获取用户下绑定设备信息失败！`
            );
          }
        }
      );
    },
    /**获取设备分组信息 */
    get_dev_group_info(func) {
      let _this = this;
      Tool.getListGroup(_this.user_info.data.userId, (res) => {
        if (Tool.judge_code(res)) {
          _this.$store.dispatch("changeDate", {
            user_dev_group: Tool.transition_resq(res),
          });
          if (func !== undefined) {
            func(Tool.transition_resq(res));
          }
        } else {
          console.error(
            `${Tool.transition_resq(res).code}获取设备分组信息失败！${
              Tool.transition_resq(res).message
            }`
          );
        }
      });
    },
    /**筛选设备 */
    filter_common_dev(res) {
      let _this = this;
      //筛选列表
      let group = res.data;
      let newGroup = [];
      //第一层过滤按品类
      for (let i = 0; i < group.length; i++) {
        let flag = false;
        for (let j = 0; j < _this.device_config.delCategoryKey.length; j++) {
          if (group[i].categoryKey == _this.device_config.delCategoryKey[j]) {
            flag = true;
          }
        }
        if (flag) {
        } else {
          newGroup.push(group[i]);
        }
      }
      let newgroup_2 = [];
      //按PK筛选
      for (let i = 0; i < newGroup.length; i++) {
        let flag = false;
        for (let j = 0; j < _this.device_pk_kill.devicePK.length; j++) {
          if (newGroup[i].productKey == _this.device_pk_kill.devicePK[j]) {
            flag = true;
          }
        }
        if (flag) {
        } else {
          newgroup_2.push(newGroup[i]);
        }
      }
      return newgroup_2;
    },
    /**通过两个接口的数据为设备撮合属性 */
    device_localdata_add_prop(alldev, nowdav) {
      for (let i = 0; i < alldev.length; i++) {
        for (let j = 0; j < nowdav.length; j++) {
          if (alldev[i].productKey == nowdav[j].productKey) {
            nowdav[j]["status"] = alldev[i].status;
          }
        }
      }
      return nowdav;
    },
    /**处理上报数据 */
    processing_reported_data(resq) {
      let _this = this;
      switch (resq.topic) {
        case "/app/down/thing/properties": //属性上报
          //将数据转一下改变一下内存指针
          let now_group_dev_0 = JSON.parse(JSON.stringify(_this.now_group_dev));
          for (let i = 0; i < now_group_dev_0.length; i++) {
            if (now_group_dev_0[i].iotId == resq.iotId) {
              let items = JSON.parse(resq.data).items;
              for (let key in items) {
                for (let j = 0; j < now_group_dev_0[i].properties.length; j++) {
                  if (key == now_group_dev_0[i].properties[j].identifier) {
                    now_group_dev_0[i].properties[j].snapshot.value =
                      items[key].value;
                    break;
                  }
                }
              }
            }
          }
          _this.$store.dispatch("changeDate", {
            now_group_dev: now_group_dev_0,
          });

          //特么的烟雾燃气报警还得从这判断
          let items_0 = JSON.parse(resq.data).items;
          for (let key in items_0) {
            if (key == "GasSensorState") {
              if (Number(items_0[key].value) == 1) {
                let obj = {};
                let obj_2 = {};
                // obj["title"] = resq.data.title;
                // obj["content"] = resq.data.summary;
                obj["title"] = "燃气报警";
                obj["content"] = "燃气浓度超标，请及时处理！";
                obj["time"] =
                  Tool.getTime().hour +
                  ":" +
                  Tool.getTime().min +
                  ":" +
                  Tool.getTime().sec;
                obj_2["warning_msg"] = obj;
                _this.message_set.push(obj_2);
              }
            }
            if (key == "SmokeSensorState") {
              if (Number(items_0[key].value) == 1) {
                let obj = {};
                let obj_2 = {};
                // obj["title"] = resq.data.title;
                // obj["content"] = resq.data.summary;
                obj["title"] = "烟雾报警";
                obj["content"] = "烟雾浓度超标，请及时处理！";
                obj["time"] =
                  Tool.getTime().hour +
                  ":" +
                  Tool.getTime().min +
                  ":" +
                  Tool.getTime().sec;
                obj_2["warning_msg"] = obj;
                _this.message_set.push(obj_2);
              }
            }
          }
          break;
        case "/app/down/notification": //报警推送---这个推送没有表示福判断是告警还是普通场景触发--废弃
          break;
        case "/app/down/app/scene/execute": //场景通知
          break;
        case "/app/down/thing/status": //设备连接状态变更推送
          //将数据转一下改变一下内存指针
          // let now_group_dev_1 = JSON.parse(JSON.stringify(_this.now_group_dev));
          // for (let i = 0; i < now_group_dev_1.length; i++) {
          //   if (now_group_dev_1[i].iotId == resq.iotId) {
          //     let status = String(JSON.parse(resq.data).status.value);
          //     now_group_dev_1[i].status = status;
          //   }
          // }
          // _this.$store.dispatch("changeDate", {
          //   now_group_dev: now_group_dev_1,
          // });
          //会有属性不同步，直接获取一下全部数据吧
          _this.get_common_dev();
          break;
        case "/app/down/thing/events": //网关事件上报
          //全部刷新
          let _identifier = resq.identifier;
          switch (_identifier) {
            case "GateWayInfo":
              //网关添加进设备了
              _this.get_common_dev();
              break;
            default:
              break;
          }
          break;
        case "/app/down/user/bind": //有设备解绑了
          _this.get_common_dev();
          break;
      }
    },
    /**显示消息列表 */
    show_message() {
      this.show_msg = true;
    },
    /**隐藏消息组件 */
    hide_message() {
      this.show_msg = false;
      this.message_flag = false; //隐藏消息红点
    },
    /**获取短时天气 */
    getShotWeather() {
      let _this = this;
      let lat = "";
      let lon = "";
      Tool.getLon_lat((res) => {
        lat = JSON.parse(JSON.parse(res).data).lat;
        lon = JSON.parse(JSON.parse(res).data).lon;
        let obj = {};
        obj["lat"] = lat;
        obj["lon"] = lon;
        let short_weather_obj = {};
        Tool.getShortWeather(String(lon), String(lat), (res) => {
          short_weather_obj["position"] = JSON.parse(res).data.city.name;
          short_weather_obj["temp"] = parseInt(
            JSON.parse(res).data.condition.temp
          );
          short_weather_obj["condition"] = JSON.parse(
            res
          ).data.condition.condition;
          short_weather_obj["icon"] = JSON.parse(res).data.condition.icon;
          short_weather_obj["windDir"] = JSON.parse(res).data.condition.windDir;
          short_weather_obj["humidity"] = JSON.parse(
            res
          ).data.condition.humidity;
          short_weather_obj["windLevel"] = JSON.parse(
            res
          ).data.condition.windLevel;

          /**空气质量 */
          Tool.getWeatherAQI(String(lon), String(lat), (res) => {
            let aqi = JSON.parse(res).data.data.aqi.value;
            if (aqi >= 0 && aqi < 50) {
              short_weather_obj["aqiColor"] = "#4BBB35";
              short_weather_obj["aqi_value"] = "优";
            } else if (aqi >= 50 && aqi < 100) {
              short_weather_obj["aqiColor"] = "#EBCE0D";
              short_weather_obj["aqi_value"] = "良";
            } else if (aqi >= 100 && aqi < 150) {
              short_weather_obj["aqiColor"] = "#E77C25";
              short_weather_obj["aqi_value"] = "轻度污染";
            } else if (aqi >= 150 && aqi < 200) {
              short_weather_obj["aqiColor"] = "#D73838";
              short_weather_obj["aqi_value"] = "中度污染";
            } else if (aqi >= 200 && aqi < 300) {
              short_weather_obj["aqiColor"] = "#950854";
              short_weather_obj["aqi_value"] = "重度污染";
            } else if (aqi >= 300 && aqi < 500) {
              short_weather_obj["aqiColor"] = "#540000";
              short_weather_obj["aqi_value"] = "严重污染";
            } else if (aqi >= 500 && aqi < 100000) {
              short_weather_obj["aqiColor"] = "#670000";
              short_weather_obj["aqi_value"] = "爆表";
            } else {
              short_weather_obj["aqiColor"] = "#230000";
              short_weather_obj["aqi_value"] = "其他";
            }
          //  this.loading.show = false;
            _this.$store.dispatch("changeDate", {
              short_weather: short_weather_obj,
            });
          });
        });
      });
    },
    /**判断storn内有无数据，有数据就不需要加载了 */
    judge_data_ready(func) {
      let _this = this;
      let arr = []; //储存当前无数据的属性
      let attr = _this.state.pubilc.attribute;
      for (let key in attr) {
        switch (key) {
          case "scene_data":
            if (JSON.stringify(attr[key]) == "{}") {
              arr.push("scene_data");
            }
            break;
          case "user_info":
            if (JSON.stringify(attr[key]) == "{}") {
              arr.push("user_info");
            }
            break;
          case "homeInfo":
            if (JSON.stringify(attr[key]) == "{}") {
              arr.push("homeInfo");
            }
            break;
          case "user_dev_group":
            if (JSON.stringify(attr[key]) == "{}") {
              arr.push("user_dev_group");
            }
            break;
          case "now_group_dev":
            if (attr[key].length == 0) {
              arr.push("now_group_dev");
            }
            break;
          case "short_weather":
            if (JSON.stringify(attr[key]) == "{}") {
              arr.push("short_weather");
            }
            break;
        }
      }
      func(arr);
    },
    /**警告确认 */
    warn_confrim(i) {
      this.message_set.splice(i, 1);
    },
    /**显示&隐藏加载框 */
    show_stop_setProploading(n){
      if(n == "show"){
        this.loading.show = true;
        this.loading.msg = "设置中"
      }else if(n == "hide"){
        this.loading.show = false;
      }
    }
  },
  activated() {},
  mounted() {
    let _this = this;
    //检查网络连接
    if (navigator.onLine) {
      this.registerJs();
      let setSwiper = setInterval(() => {
        if (this.swiper) {
          clearInterval(setSwiper);
          this.swiper.slideTo(1, 10, false);
        }
      }, 1);
      this.judge_data_ready((arr) => {
        for (let i = 0; i < arr.length; i++) {
          switch (arr[i]) {
            case "scene_data":
              // this.loading.show = true;
              // this.loading.msg = "加载场景中";
              this.get_Scene_Date();
              break;
            case "now_group_dev":
              this.loading.show = true;
              this.loading.msg = "加载设备中";
              this.get_common_dev();
              break;
            case "short_weather":
              // this.loading.show = true;
              // this.loading.msg = "加载天气中";
              this.getShotWeather();
              break;
          }
        }
      });
      setInterval(() => {
        //15分钟调一次接口
        this.getShotWeather();
      }, 900000);

      //先获取缓存天气接口
    
    } else {
      Tool.show_toast("无网络，请检查无线连接！");
    }
  },

  created() {
    let _this = this;
    let s_width = Number(window.screen.width);
   // Tool.hide_header()
    //设置自适应比例
    this.window_proportion = (s_width / 1280) * 10;
    _this.$store.dispatch("changeDate", {
          theme_img: '1.png',
      });
    //读取数据库
    Tool.query_sql("web_Theme", (res) => {
      let value = JSON.parse(res).data.value.split('"').join("");
      if (value == "") {
        _this.$store.dispatch("changeDate", {
          theme_img: '1.png',
        });
        Tool.add_sql("web_Theme", '1.png', (res) => {});
         
      } else {
        _this.$store.dispatch("changeDate", {
          theme_img: value,
        });
      }
    });

    
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}

.swiper {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 2rem;
  margin-top: -8rem;
}
.swiper >>> .swiper-pagination {
  .swiper-pagination-bullet {
  }
  .swiper-pagination-bullet-active {
    background-color: white;
  }
}

.swiper-pagination {
}
@mixin text_con() {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.itemBox {
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.35);
}
.itemBox_2 {
}
.itemBox_title {
  position: absolute;
  width: 9rem;
  height: 2.2rem;
  font-size: 2.2rem;
  color: white;
  text-align: left;
  left: 2.4rem;
  top: 2.3rem;
}
.itemBox_title_2 {
  position: absolute;
  width: 100%;
  border-bottom: 0.05rem solid #ffffff;
  height: 8.4rem;
  line-height: 8.4rem;
  font-size: 2.4rem;
  color: white;
  text-align: center;
}
.itemBox_warning {
  position: absolute;
  width: 100%;
  height: 4.2rem;
  background-color: rgba(0, 10, 19, 0.3);
  top: 8.4rem;
  color: white;
  font-size: 2.2rem;
  line-height: 4.2rem;
  text-align: center;
}
.newsPanel {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #7596c8;
  opacity: 0.5;
}

.listGroup {
  position: relative;
  width: 121.8rem;
  height: 55rem;
  margin-left: auto;
  margin-right: auto;
  top: 11rem;
}
.listItem {
  position: relative;
  width: 37rem;
  height: 55rem;
  margin-left: 1.8rem;
  margin-right: 1.8rem;
  float: left;
}
.img_location {
  position: absolute;
  width: 1.4rem;
  height: 1.8rem;
  left: 4rem;
  top: 11.7rem;
}
.location_info {
  position: absolute;
  width: 13rem;
  height: 2rem;
  font-size: 2rem;
  line-height: 2rem;
  text-align: left;
  @include text_con();
  left: 6.2rem;
  top: 11.7rem;
}
.weather_temp {
  position: absolute;
  width: 32rem;
  height: 8rem;
  font-size: 8rem;
  line-height: 8rem;
  text-align: left;
  left: 3.9rem;
  top: 17.3rem;
}
.weather_quality {
  position: absolute;
  width: 4rem;
  height: 2.2rem;
  background-color: #4bbb35;
  border-radius: 1.1rem;
  top: 22.3rem;
  left: 13.6rem;
}
.weather_icon {
  position: absolute;
  width: 4.6rem;
  height: 4.6rem;
  left: 3.9rem;
  top: 36.1rem;
}
.weather_name {
  position: absolute;
  width: 20rem;
  font-size: 2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: left;
  left: 5.3rem;
  top: 43.5rem;
}
.weather_info {
  position: absolute;
  width: 20rem;
  height: 2rem;
  font-size: 2rem;
  line-height: 2rem;
  text-align: left;
  left: 4rem;
  top: 48.6rem;
}
.scene_group {
  position: absolute;
  width: 100%;
  height: calc(100% - 8.4rem);
  top: 8.4rem;
  overflow-y: scroll;
  overflow-x: hidden;
}
.prop_group {
  position: absolute;
  width: 100%;
  height: calc(100% - 8.4rem);
  top: 8.4rem;
}
.scene_group::-webkit-scrollbar {
  display: none;
}
.scene_item {
  position: relative;
  width: 100%;
  height: 11.5rem;
  transition: all 1s;
  overflow: hidden;
  &_bottom {
    position: absolute;
    bottom: 0rem;
    width: 100%;
    height: 0.1rem;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0),
      white,
      rgba(255, 255, 255, 0)
    );
  }
  &_cover {
    position: absolute;
    height: 100%;
    width: 0rem;
    background-color: rgba(255, 255, 255, 0.3);
  }
  &_icon {
    position: absolute;
    left: 4rem;
    top: 4.3rem;
    width: 3rem;
    height: 3rem;
    pointer-events: none;
  }
  &_name {
    position: absolute;
    pointer-events: none;
    width: 20rem;
    height: 2.5rem;
    font-size: 2.2rem;
    line-height: 2.5rem;
    @include text_con();
    left: 9.3rem;
    top: 4.7rem;
    text-align: left;
  }
  &_mode {
    position: absolute;
    pointer-events: none;
    width: 9rem;
    height: 4.5rem;
    right: -4.5rem;
    bottom: -2rem;
    background-color: rgba(255, 255, 255, 0.4);
    transform: rotate(315deg);
    text-align: center;
    font-size: 1.2rem;
    color: white;
  }
  &_state {
    position: absolute;
    width: 5rem;
    height: 2rem;
    font-size: 1.6rem;
    line-height: 2rem;
    color: white;
    top: 5rem;
    right: 4rem;
  }
}
// .scene_item:active {
//       animation:click_animation 5s infinite;
//       -webkit-animation:click_animation 0.5s;
//       animation-iteration-count:1;/*动画只执行一次*/
// }
@-webkit-keyframes click_animation {
  0% {
    background: linear-gradient(to right, red 0%, red 0%, white 0%, white 100%);
  }
  50% {
    background: linear-gradient(
      to right,
      red 0%,
      red 50%,
      white 51%,
      white 100%
    );
  }
  100% {
    background: linear-gradient(to right, red 0%, red 50%, red 51%, red 100%);
  }

  //     @for $i from 0 through 100
  //       {
  //             $position:1%*$i;
  //             $position {background: linear-gradient(to right, red 0%,red 0%,white 0%,white 100%)}
  //       }
}
.scroll_item_group {
  width: 100%;
}
</style>