<template>
  <div class="MessageWindow" v-if="show" ref="msg_window">
    <div class="mode_panel" @click="hide"></div>
    <div class="MessagePanel" ref="msg_panel">
      <div class="msg_panel_cover"></div>
      <div class="Message_title">消息记录</div>
      <div class="message_option">
        <ul>
          <li
            v-for="(item,i) in message_option_list"
            :class="[{option_click:option_index===i}]"
            :key="i"
            @click="title_switch(i)"
          >{{item}}</li>
        </ul>
      </div>
      <div class="line" ></div>
      <div class="vertical_line" @touchstart="hide"></div>
      <div
        class="message_group"
        ref="message_group"
        @scene_touchmove="message_touchstart"
        @touchmove="message_touchmove"
      >
        <DropDownRefresh :on-refresh="onRefresh" :startRefresh_flag="startRefresh_flag">
          <div class="type_option" v-if="option_index == 1">
            <div class="message_group_item" v-for="(item,i) in scene_Log" :key="i">
              <div class="message_group_body_item" v-for="(smallItem,k) in item" :key="k">
                <div class="message_group_T_title">{{item[0].day}}</div>
                <div class="message_group_body_item_time">{{smallItem.hourTime}}</div>
                <div class="message_group_body_item_dot"></div>
                <div class="message_group_body_item_line" v-if="k+1 !== item.length"></div>
                <div class="message_group_body_item_event">{{smallItem.sceneName}}</div>
                <div
                  class="message_group_body_item_event_action"
                >{{smallItem.ruleName}}{{smallItem.ruleName !== '' && smallItem.result !== '' ? ':' : ''}}{{smallItem.result}}</div>
              </div>
            </div>
            <div class="bottom_txt">－－－－暂无更多－－－－</div>
          </div>
          <div class="type_option" v-if="option_index == 2">
            <div class="message_group_item" v-for="(item,i) in message_Log" :key="i">
              <div class="message_group_body_item" v-for="(smallItem,k) in item" :key="k">
                <div class="message_group_T_title">{{item[0].day}}</div>
                <div class="message_group_body_item_time">{{smallItem.time}}</div>
                <div class="message_group_body_item_dot"></div>
                <div class="message_group_body_item_line" v-if="k+1 !== item.length"></div>
                <div class="message_group_body_item_event">{{smallItem.extData.sceneName}}</div>
                <div class="message_group_body_item_event_action">{{smallItem.body}}</div>
              </div>
            </div>
            <div class="bottom_txt">－－－－暂无更多－－－－</div>
          </div>
          <div class="type_option" v-if="option_index == 0">
            <div class="message_group_item" v-for="(item,i) in dev_Log" :key="i">
              <div class="message_group_body_item" v-for="(smallItem,k) in item" :key="k">
                <div class="message_group_T_title">{{smallItem.day}}</div>
                <div class="message_group_body_item_time">{{smallItem.time}}</div>
                <div class="message_group_body_item_dot"></div>
                <div class="message_group_body_item_line" v-if="k+1 !== item.length"></div>
                <div class="message_group_body_item_event">{{smallItem.type}}</div>
                <div class="message_group_body_item_event_action">{{smallItem.body}}</div>
              </div>
            </div>
            <div class="bottom_txt">－－－－暂无更多－－－－</div>
          </div>
        </DropDownRefresh>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Tool from "@/utils/Tool";
import DropDownRefresh from "@/components/DropDownRefresh";

export default {
  name: "MessagePanel",
  data() {
    return {
      message_option_list: ["设备", "场景", "消息"],
      option_index: 1, //当前列表显示的消息种类 1、场景 2、消息 0、设备
      /**是否显示这个插件 */
      show: this.show_msg,
      startRefresh_flag: false,
    };
  },
  components: {
    DropDownRefresh,
  },
  props: ["show_msg"],
  watch: {
    show_msg: {
      handler: function (newVal, oldVal) {
        this.show = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    /*时间转换，毫秒转换成时间*/
    transDate(n) {
      let date = new Date(n);
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        date.getDate() < 10 ? "0" + date.getDate() + "_" : date.getDate() + "_";
      let HH =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      let MM =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      let SS =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + HH + MM + SS;
    },
    /**解析场景日志 */
    transition_SceneLog(res) {
      //格式化数据
      let sceneArr = JSON.parse(res).data.records;
      let new_scene_arr = [];
      let new_scene_index = 0;
      for (let i = 0; i < sceneArr.length; i++) {
        let time_str = sceneArr[i].time;
        let date_str = time_str.substring(0, 10);
        let hour_str = time_str.substring(11, 19);
        sceneArr[i]["day"] = date_str;
        sceneArr[i]["hourTime"] = hour_str;
      }
      for (let j = 0; j < sceneArr.length; j++) {
        if (j == 0) {
          new_scene_arr[new_scene_index] = [0];
        } else {
          if (sceneArr[j].day == sceneArr[j - 1].day) {
            new_scene_arr[new_scene_index].push(j);
          } else {
            new_scene_index++;
            new_scene_arr[new_scene_index] = [j];
          }
        }
      }
      let sceneArr2 = [];
      for (let k = 0; k < new_scene_arr.length; k++) {
        sceneArr2[k] = [];
        for (let l = 0; l < new_scene_arr[k].length; l++) {
          sceneArr2[k].push(sceneArr[new_scene_arr[k][l]]);
        }
      }
      return sceneArr2;
    },
    /** 解析消息日志*/
    transition_AppMsg_Log(res) {
      let _this = this;
      let msgdata = JSON.parse(res).data.data;
      let new_msg_arr = [];
      let new_msg_index = 0;
      for (let i = 0; i < msgdata.length; i++) {
        let date = _this.transDate(Number(msgdata[i].gmtCreate));
        let day = date.substring(0, 10);
        let time = date.substring(11, 19);
        msgdata[i]["day"] = day;
        msgdata[i]["time"] = time;
      }
      for (let j = 0; j < msgdata.length; j++) {
        if (j == 0) {
          new_msg_arr[new_msg_index] = [0];
        } else {
          if (msgdata[j].day == msgdata[j - 1].day) {
            new_msg_arr[new_msg_index].push(j);
          } else {
            new_msg_index++;
            new_msg_arr[new_msg_index] = [j];
          }
        }
      }
      let msgArr2 = [];
      for (let k = 0; k < new_msg_arr.length; k++) {
        msgArr2[k] = [];
        for (let l = 0; l < new_msg_arr[k].length; l++) {
          msgArr2[k].push(msgdata[new_msg_arr[k][l]]);
        }
      }
      return msgArr2;
    },
    /** 解析设备日志 */
    transition_Dev_Log(res) {
      let _this = this;
      let dev_data = JSON.parse(res).data.data;
      let new_dev_arr = [];
      let new_dev_index = 0;
      for (let i = 0; i < dev_data.length; i++) {
        let date = _this.transDate(Number(dev_data[i].gmtCreate));
        let day = date.substring(0, 10);
        let time = date.substring(11, 19);
        dev_data[i]["day"] = day;
        dev_data[i]["time"] = time;
        let type = "";
        switch (dev_data[i].eventType) {
          case "info":
            type = "信息";
            break;
          case "error":
            type = "故障";
            break;
          case "alert":
            type = "告警";
            break;
          case "":
            type = ""; //他又没传
            break;
        }
        dev_data[i]["type"] = type;
      }
      for (let j = 0; j < dev_data.length; j++) {
        if (j == 0) {
          new_dev_arr[new_dev_index] = [0];
        } else {
          if (dev_data[j].day == dev_data[j - 1].day) {
            new_dev_arr[new_dev_index].push(j);
          } else {
            new_dev_index++;
            new_dev_arr[new_dev_index] = [j];
          }
        }
      }
      let dev_data2 = [];
      for (let k = 0; k < new_dev_arr.length; k++) {
        dev_data2[k] = [];
        for (let l = 0; l < new_dev_arr[k].length; l++) {
          dev_data2[k].push(dev_data[new_dev_arr[k][l]]);
        }
      }
      return dev_data2;
    },
    /**消息列表刷新回调 */
    onRefresh(done) {
      let _this = this;
      switch (_this.option_index) {
        case 0:
          Tool.getDevLog(_this.userId, (res) => {
            _this.$store.dispatch("changeDate", {
              dev_Log: _this.transition_Dev_Log(res),
            });
            done();
          });
          break;
        case 1:
          Tool.getAppSceneLog((res) => {
            _this.$store.dispatch("changeDate", {
              scene_Log: _this.transition_SceneLog(res),
            });
            done();
          });
          break;
        case 2:
          Tool.getAppMsgCenterQueryScene(_this.homeInfo.homeId, (res) => {
            _this.$store.dispatch("changeDate", {
              message_Log: _this.transition_AppMsg_Log(res),
            });
            done();
          });
          break;
      }
    },
    /**标题栏切换 */
    title_switch(i) {
      let _this = this;
      if (_this.option_index == i) {
      } else {
        switch (i) {
          case 0:
            _this.option_index = 0;
            break;
          case 1:
            _this.option_index = 1;
            break;
          case 2:
            _this.option_index = 2;
            break;
        }
      }
    },
    /**隐藏消息面板 */
    hide() {
      this.$refs.msg_panel.style.animation = "hide_message 0.3s 1 ease-in-out";
      setTimeout(() => {
        this.$emit("hide_message");
      }, 300);
    },
    message_touchstart(e) {
      e = event || window.event;
      if (this.$refs.message_group.scrollTop == 0) {
        this.startRefresh_flag = true;
      } else {
        this.startRefresh_flag = false;
      }
    },
    message_touchmove(e) {
      e = event || window.event;
      if (this.$refs.message_group.scrollTop == 0) {
        this.startRefresh_flag = true;
      } else {
        this.startRefresh_flag = false;
      }
    },
  },
  computed: {
    ...mapState({
      state: (state) => {
        return state;
      },
      userId: (state) => {
        if (typeof state.pubilc.attribute.user_info.data == "undefined") {
        } else {
          return state.pubilc.attribute.user_info.data.userId;
        }
      },
      user_info: (state) => {
        return state.pubilc.attribute.user_info;
      },
      homeInfo: (state) => {
        return state.pubilc.attribute.homeInfo;
      },
      dev_Log: (state) => {
        return state.pubilc.attribute.dev_Log;
      },
      scene_Log: (state) => {
        return state.pubilc.attribute.scene_Log;
      },
      message_Log: (state) => {
        return state.pubilc.attribute.message_Log;
      },
    }),
  },
  mounted() {
    let _this = this;
    Tool.getAppSceneLog((res) => {
      _this.$store.dispatch("changeDate", {
        scene_Log: _this.transition_SceneLog(res),
      });
    });
    Tool.getAppMsgCenterQueryScene(_this.homeInfo.homeId, (res) => {
      _this.$store.dispatch("changeDate", {
        message_Log: _this.transition_AppMsg_Log(res),
      });
    });
    let loop = setInterval(() => {
      if (typeof _this.userId == "undefined") {
      } else {
        Tool.getDevLog(_this.userId, (res) => {
          _this.$store.dispatch("changeDate", {
            dev_Log: _this.transition_Dev_Log(res),
          });
          _this.option_index = 0;
        });
        clearInterval(loop);
      }
    }, 1);
  },
  updated() {
    //   console.log(this.scene_Log)
  },
  created() {},
};
</script>
<style lang="scss" scoped>
$message_group_width: 46rem;
.MessageWindow {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.MessagePanel {
  position: absolute;
  width: 54rem;
  height: 100%;
  right: 0rem;
  animation: show_message 0.3s 1 ease-in-out;
}
.Message_title {
  position: absolute;
  width: 100%;
  height: 3rem;
  font-size: 2.8rem;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  top: 2.7rem;
}
.mode_panel {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}
.msg_panel_cover {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #000000;
  box-shadow: 0.1rem 1rem 3rem 0rem rgba(0, 0, 0, 0.75);
  opacity: 0.6;
}
.option_click {
  background-color: #4068ff;
}
$option_height: 5rem;
.message_option {
  position: absolute;
  height: $option_height;
  width: 40rem;
  left: calc(50% - 20rem);
  top: 8.6rem;
  ul {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    height: $option_height;
  }
  li {
    width: 8rem;
    height: $option_height;
    float: left;
    margin-left: 2.6rem;
    margin-right: 2.6rem;
    text-align: center;
    color: white;
    font-size: 2.4rem;
    line-height: $option_height;
    border-radius: 1rem;
    font-family: PingFang SC;
    font-weight: 500;
  }
}
.line {
  position: absolute;
  width: 46rem;
  height: 0.1rem;
  background: #ffffff;
  opacity: 0.3;
  border-radius: 0.1px;
  top: 15.8rem;
  left: calc(50% - 23rem);
}
.message_group {
  position: absolute;
  width: $message_group_width;
  height: calc(100% - 15.8rem);
  top: 15.8rem;
  left: calc(50% - 23rem);
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .message_group_item {
    margin-top: 1.5rem;
    left: 1.5rem;
  }
  .message_group_T_title {
    position: absolute;
    font-size: 1.4em;
    height: 1.8rem;
    width: $message_group_width;
    top: 2.5rem;
    text-align: left;
    color: white;
    left: 4.5rem;
  }
  .message_group_body_item {
    position: relative;
    width: $message_group_width;
    height: 5.8rem;
    top: 0.5rem;
  }
  .message_group_body_item_time {
    position: absolute;
    font-size: 2rem;
    width: 10rem;
    height: 2rem;
    color: white;
    left: 4.5rem;
  }
  .message_group_body_item_dot {
    position: absolute;
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: white;
    left: 14.2rem;
    top: 1.5rem;
  }
  .message_group_body_item_line {
    position: absolute;
    width: 0.1rem;
    height: 6rem;
    left: 14.7rem;
    top: 1.5rem;
    background-color: white;
  }
  .message_group_body_item_event {
    position: absolute;
    width: $message_group_width - 9rem;
    height: 2.1rem;
    font-size: 2rem;
    left: 17.1rem;
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    color: white;
  }
  .message_group_body_item_event_action {
    position: absolute;
    width: $message_group_width - 9rem;
    height: 2.8rem;
    font-size: 1.4rem;
    color: white;
    top: 2.5rem;
    left: 17rem;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    word-break: normal;
  }
  .bottom_txt {
    width: 100%;
    height: 2rem;
    text-align: center;
    font-size: 1.5rem;
    margin-top: 3rem;
    color: white;
  }
}
.vertical_line {
  position: absolute;
  width: 0.6rem;
  height: 9rem;
  background-color: white;
  border-radius: 0.15rem;
  top: calc(50% - 4.5rem);
  left: 0.8rem;
}
.vertical_line:active {
  box-shadow: 0rem 0rem 0.25rem #ffffff;
}
@keyframes show_message {
  0% {
    right: -5.4rem;
    opacity: 0;
  }
  100% {
    right: 0;
    opacity: 1;
  }
}
@keyframes hide_message {
  0% {
    right: 0;
    opacity: 1;
  }
  100% {
    right: -5.4rem;
    opacity: 0;
  }
}
</style>