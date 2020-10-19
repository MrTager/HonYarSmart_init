<template>
  <div class="FreshAir" :style="{'pointer-events': status !== 1 ? 'none' : 'auto','opacity':status !== 1 ? '0.3' : '1'}">
    <div class="item" v-for="(item,i) in WindSpeed" :key="i" @click="switch_click(item,i,$event)">
        <div class="item_name">{{item.value}}</div>
        <img
        v-if="now_WindSpeed == Number(item.title)"
        class="item_line"
        src="@/assets/images/deviceControl/switch_open_line.png"
      />
      <img v-else class="item_line" src="@/assets/images/deviceControl/switch_close_line.png" />
      <div class="item_bottom"></div>
    </div>
    <Power :powerstate="power_state" @power_set="power_set"></Power>
  </div>
</template>
<script>
import Tool from "@/utils/Tool";
import Power from "@/components/DeviceControlModule/Tool/Power"

export default {
  name: "FreshAir",
  data() {
    return {
      dev_prop: this.prop_data,
      iotId: this.dev_iotId,
      dev_status: this.status,
      animation: [],
    };
  },
  components:{
    Power
  },
  props: ["prop_data", "dev_iotId","status"],
  computed: {
    // prop_group() {
    //   let _this = this;
    //   let arr = [
    //     "PowerSwitch_1",
    //     "PowerSwitch_2",
    //     "PowerSwitch_3",
    //     "PowerSwitch_4",
    //     "PowerSwitch_5",
    //     "PowerSwitch_6",
    //   ];
    //   let new_dev_group = [];
    //   for (let i = 0; i < _this.dev_prop.length; i++) {
    //     for (let j = 0; j < arr.length; j++) {
    //       if (_this.dev_prop[i].identifier == arr[j]) {
    //         new_dev_group.push(_this.dev_prop[i]);
    //       }
    //     }
    //   }
    //   return new_dev_group;
    // },
    WindSpeed(){
         let _this = this;
      for (let i = 0; i < _this.dev_prop.length; i++) {
        if (_this.dev_prop[i].identifier == "WindSpeed") {
            let specs = JSON.parse(_this.dev_prop[i].specs) 
            let arr = []
            for(let key in specs){
                let obj = {};
                obj["title"] = key
                obj["value"] = specs[key]
                arr.push(obj)
            }
            return arr
        }
      }
    },
    now_WindSpeed(){
            let _this = this;
      let obj = {};
      for (let i = 0; i < _this.dev_prop.length; i++) {
        if (_this.dev_prop[i].identifier == "WindSpeed") {
            return Number(_this.dev_prop[i].snapshot.value)
        }
      }
      return obj;
    },
    power_state(){
      let _this = this;
      let obj = {};
      for (let i = 0; i < _this.dev_prop.length; i++) {
        if (_this.dev_prop[i].identifier == "PowerSwitch") {
            return Number(_this.dev_prop[i].snapshot.value)
        }
      }
      return obj;
    }
  },
  watch: {
    prop_data: {
      handler: function (newVal, oldVal) {
        if (newVal) {
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
    switch_click(item,i,e) {
      let _this = this;
      _this.$emit("show_stop_setProploading","show")
      let obj = {};
      obj["WindSpeed"] = item.title;
      Tool.setDeviceProperties(_this.iotId, obj, (res) => {
        _this.$emit("show_stop_setProploading","hide")
        if (Tool.judge_code(res)) {
        } else {
          Tool.show_toast(
            `${Tool.transition_resq(res).code}设置失败，${Tool.transition_resq(res).message}`
          );
        }
      });
      this.switch_animation(i,e)
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
     power_set() {
      let _this = this;
      _this.$emit("show_stop_setProploading","show")
      let power = 0;
      if (this.power_state == 1) {
        power = 0;
      } else {
        power = 1;
      }
      Tool.setDeviceProperties(
        _this.iotId,
        {
          PowerSwitch: power,
        },
        (res) => {
          _this.$emit("show_stop_setProploading","hide")
          if (Tool.judge_code(res)) {
          } else {
            Tool.show_toast(
              `${Tool.transition_resq(res).code}设置失败，${
                Tool.transition_resq(res).message
              }`
            );
          }
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.FreshAir {
  width: 100%;
  height: 100%;
}
.item {
  position: relative;
  width: 100%;
  height: 11.5rem;
  transition: all 1s;
  overflow: hidden;
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
  pointer-events: none;
}
.item_line {
  position: absolute;
  pointer-events: none;
  width: 2.8rem;
  height: 0.5rem;
  left: 17.1rem;
  top: 8.5rem;
}
.item_bottom {
  position: absolute;
  pointer-events: none;
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
</style>