<template>
  <div class="SwitchDev" :style="{'pointer-events': status !== 1 ? 'none' : 'auto','opacity':status !== 1 ? '0.3' : '1'}">
    <div class="item_curtain_tag" v-if="type === 1">
      <div
        class="item_curtain_tag_item"
        :class="{'tag_active':curtain_way==0}"
        style="float:left"
        @click="tag_chick('0')"
      >窗帘一</div>
      <div
        class="item_curtain_tag_item"
        :class="{'tag_active':curtain_way==1}"
        style="float:right"
        @click="tag_chick('1')"
      >窗帘二</div>
    </div>
    <div class="item">
      <div class="slider_cover" :style="{'height':parseInt(position/window_proportion)+'rem'}"></div>
      <div class="item_curtain_panel" @touchstart="panel_chick()"></div>
      <div
        class="item_curtain_top"
        :style="{'top':parseInt(position/window_proportion)+'rem'}"
        @touchstart="panel_touchstart()"
        @touchmove="panel_touchmove()"
        @touchend="panel_touchend()"
      ></div>
    </div>
  </div>
</template>
<script>
import Tool from "@/utils/Tool";

export default {
  name: "SwitchDev",
  data() {
    return {
      window_proportion: 10,
      type: 0, //0、单路1、双路
      dev_prop: this.prop_data,
      iotId: this.dev_iotId,
      start_position: "",
      position: "",
      clientY: "",
      position_step: [0, 25, 50, 75, 100],
      dev_status: this.status,
      //双路窗帘
      curtain_way: 0, //0、第一路,1、第二路
    };
  },
  props: ["prop_data", "dev_iotId", "status"],
  computed: {
    prop_group() {
      let _this = this;
      let arr = [
        "PowerSwitch_1",
        "PowerSwitch_2",
        "PowerSwitch_3",
        "PowerSwitch_4",
        "PowerSwitch_5",
        "PowerSwitch_6",
      ];
      let new_dev_group = [];
      for (let i = 0; i < _this.dev_prop.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (_this.dev_prop[i].identifier == arr[j]) {
            new_dev_group.push(_this.dev_prop[i]);
          }
        }
      }
      return new_dev_group;
    },
  },
  watch: {
    prop_data: {
      handler: function (newVal, oldVal) {
        let _this = this;
        if (newVal) {
          if (newVal.length > 1) {
            this.type = 1;

            if (_this.curtain_way == 0) {
              for (let i = 0; i < newVal.length; i++) {
                if (newVal[i].identifier == "CurtainPosition_1") {
                  let _value = newVal[i].snapshot.value;
                  _this.twoWayInitPosition(0, _value);
                }
              }
            } else {
              for (let i = 0; i < newVal.length; i++) {
                if (newVal[i].identifier == "CurtainPosition_2") {
                  let _value = newVal[i].snapshot.value;
                  _this.twoWayInitPosition(1, _value);
                }
              }
            }
          } else {
            this.type = 0;
            //初始化行程
            if (newVal.length == 1) {
              this.position =
                (_this.changeValue(newVal[0].snapshot.value) / 100) *
                (38 * _this.window_proportion);
            }
          }
          this.dev_prop = newVal;
        }
      },
      immediate: true,
      deep: true,
    },
    dev_iotId: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.iotId = newVal;
        }
      },
      immediate: true,
      deep: true,
    },
    status: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.dev_status = newVal;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    tag_chick(n) {
      let _this = this;
      if (n == "1") {
        _this.curtain_way = 1;
        for (let i = 0; i < _this.dev_prop.length; i++) {
          if (_this.dev_prop[i].identifier == "CurtainPosition_2") {
            let _value = _this.dev_prop[i].snapshot.value;
            _this.twoWayInitPosition(1, _value);
          }
        }
      } else {
        _this.curtain_way = 0;
        for (let i = 0; i < _this.dev_prop.length; i++) {
          if (_this.dev_prop[i].identifier == "CurtainPosition_1") {
            let _value = _this.dev_prop[i].snapshot.value;
            _this.twoWayInitPosition(0, _value);
          }
        }
      }
    },
    twoWayInitPosition(way, value) {
      let _this = this;
      if (way == 0) {
        this.curtain_way = 0;
        this.position =
          (_this.changeValue(value) / 100) * (38 * _this.window_proportion);
      } else {
        this.curtain_way = 1;
        this.position =
          (_this.changeValue(value) / 100) * (38 * _this.window_proportion);
      }
    },
    panel_chick(e) {
      let _this = this;
      _this.$emit("show_stop_setProploading","show")
      e = event || window.event;
      let startPosition = parseInt(
        (e.changedTouches[0].clientY / 10) * _this.window_proportion -
          25 * _this.window_proportion
      );
      _this.position =
        (_this.changeValue(
          parseInt((startPosition / (38 * _this.window_proportion)) * 100)
        ) /
          100) *
        (38 * _this.window_proportion);
      let obj = {};
      obj["CurtainPosition"] = _this.position;
      Tool.setDeviceProperties(_this.iotId, obj, (res) => {
        _this.$emit("show_stop_setProploading","hide")
        if (Tool.judge_code(res)) {
        } else {
          Tool.show_toast(
            `${Tool.transition_resq(res).code}设置失败，${
              Tool.transition_resq(res).message
            }`
          );
        }
      });
    },
    panel_touchstart(e) {
      let _this = this;
      e = event || window.event;
      if (_this.dev_status == 1) {
        _this.position = e.target.offsetTop;
        _this.start_position = e.target.offsetTop;
        _this.clientY = e.changedTouches[0].clientY;
      }
    },
    panel_touchmove(e) {
      let _this = this;
      e = event || window.event;
      if (_this.dev_status == 1) {
        let move_clientY = e.changedTouches[0].clientY;
        let move_Y = parseInt(move_clientY - _this.clientY);
        //限制行程
        if (_this.start_position + move_Y <= 0) {
          _this.position = 0;
        } else if (
          _this.start_position + move_Y >=
          parseInt(38 * _this.window_proportion)
        ) {
          _this.position = parseInt(38 * _this.window_proportion);
        } else {
          _this.position = _this.start_position + move_Y;
        }
      }
    },
    panel_touchend(e) {
      let _this = this;
      e = event || window.event;
      if (_this.dev_status == 1) {
        let end_Top = e.target.offsetTop;
        _this.position =
          (_this.changeValue(
            parseInt((end_Top / (38 * _this.window_proportion)) * 100)
          ) /
            100) *
          (38 * _this.window_proportion);
        let obj = {};
        obj["CurtainPosition"] = _this.position;
        _this.$emit("show_stop_setProploading","show")
        Tool.setDeviceProperties(_this.iotId, obj, (res) => {
          _this.$emit("show_stop_setProploading","hide")
          if (Tool.judge_code(res)) {
          } else {
            Tool.show_toast(
              `${Tool.transition_resq(res).code}设置失败，${
                Tool.transition_resq(res).message
              }`
            );
          }
        });
      }
    },
    //0-25-50-75-100靠近哪个显示哪个
    changeValue(value) {
      var arr = [
        { num: 0, diff: null },
        { num: 25, diff: null },
        { num: 50, diff: null },
        { num: 75, diff: null },
        { num: 100, diff: null },
      ];
      for (var i = 0; i < arr.length; i++) {
        arr[i].diff = Math.abs(value - arr[i].num);
      }
      arr.sort(function (a, b) {
        return a.diff - b.diff;
      });
      return arr[0].num;
    },
  },
  created() {
    let s_width = Number(window.screen.width);
    //设置自适应比例
    this.window_proportion = (s_width / 1280) * 10;
  },
};
</script>
<style lang="scss" scoped>
.SwitchDev {
  width: 100%;
  height: 100%;
}
.slider_cover {
  position: absolute;
  width: 28rem;
  left: calc(50% - 14rem);
  top: 1rem;
  background-color: rgba(255, 255, 255, 0.3);
}
.item {
  position: relative;
  width: 30rem;
  height: 40rem;
  left: calc(50% - 15rem);
  top: 5.2rem;
  transition: all 1s;
  overflow: hidden;
}
.item_curtain_tag {
  position: absolute;
  width: 20rem;
  height: 4rem;
  border-radius: 2rem;
  left: calc(50% - 10rem);
  top: 0.5rem;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
}
.item_curtain_top {
  position: absolute;
  width: 30rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: white;
  left: calc(50% - 15rem);
  top: 5rem;
}
.item_curtain_panel {
  position: absolute;
  width: 28rem;
  height: 38rem;
  background-color: rgba(0, 0, 0, 0.3);
  left: calc(50% - 14rem);
  top: 1rem;
  border-radius: 0rem 0rem 1rem 1rem;
}
.item_title {
  position: absolute;
  width: 5rem;
  height: 2.5rem;
  text-align: left;
  color: white;
  font-size: 2.2rem;
  line-height: 2.5rem;
  left: 6.9rem;
  top: 3.6rem;
}
.item_curtain_tag_item {
  width: 50%;
  height: 4rem;
  font-size: 2.2rem;
  line-height: 4rem;
  text-align: center;
}
.tag_active {
  background-color: rgba(255, 255, 255, 0.3);
}
.item_number_value {
  position: absolute;
  width: 6rem;
  height: 2.5rem;
  font-size: 2.2rem;
  line-height: 2.5rem;
  color: white;
  text-align: right;
  top: 3.8rem;
  right: 1.7rem;
}
.item_icon {
  position: absolute;
  width: 3.2rem;
  height: 3.2rem;
  left: 2.2rem;
  top: 3rem;
}
.item_name {
  position: absolute;
  width: 100%;
  height: 2.5rem;
  font-size: 2.2rem;
  line-height: 2.5rem;
  color: white;
  text-align: center;
  top: 4.6rem;
}
.item_line {
  position: absolute;
  width: 2.8rem;
  height: 0.5rem;
  left: 17.1rem;
  top: 8.5rem;
}
.item_bottom {
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
.slide {
  position: absolute;
  width: 32.6rem;
  height: 8rem;
  border-radius: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  top: 7.2rem;
  left: 2.2rem;
}
</style>