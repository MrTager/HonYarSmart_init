<template>
  <div
    class="AirConditioner"
    :style="{'pointer-events': status !== 1 ? 'none' : 'auto','opacity':status !== 1 ? '0.3' : '1'}"
    v-if="temp_num !== undefined && power_state !== undefined && temp_set_rule !== undefined && workMode !== undefined && speedMode !== undefined"
  >
    
    <div class="mode_value">{{workMode.value}}</div>
    <div class="item">
      <img class="sub" src="@/assets/images/deviceControl/sub.png" alt @click="set_temp('sub')" />
      <img class="add" src="@/assets/images/deviceControl/add.png" alt @click="set_temp('add')" />
      <div class="temp_icon">℃</div>
      <div class="temp_value">{{temp_num}}</div>
      <div class="speed_value">{{speedMode.value}}</div>
      <div class="windSpeed">
        <div class="button cold_button button_active" @click="mode_set(workMode)">
          <img
            class="button_img"
            :src="require(`@/assets/images/deviceControl/${workMode.img}.png`)"
            alt
          />
        </div>
        <div class="button wind_button button_active" @click="speed_set(speedMode)">
          <img
            class="button_img"
            :src="require(`@/assets/images/deviceControl/${speedMode.img}.png`)"
            alt
          />
        </div>
      </div>
    </div>
    <Power :powerstate="power_state" @power_set="power_set"></Power>
   
  </div>
</template>
<script>
import Tool from "@/utils/Tool";
import Power from "@/components/DeviceControlModule/Tool/Power";


export default {
  name: "AirConditioner",
  data() {
    return {
      window_proportion: 10,
      dev_prop: this.prop_data,
      iotId: this.dev_iotId,
      dev_status: this.status,
      mode_img: [
        { num: 1, title: "制冷", imgName: "cold_icon" },
        { num: 2, title: "制热", imgName: "heating_icon" },
        { num: 3, title: "通风", imgName: "ventilate_icon" },
        { num: 4, title: "除湿", imgName: "dehumidification_icon" },
      ],
      speed_img: [
        { num: 2, title: "低档", imgName: "lowSpeed" },
        { num: 3, title: "中档", imgName: "mediumSpeed" },
        { num: 4, title: "高档", imgName: "highSpeed" },
      ],
    };
  },
  components: {
    Power,

  },
  props: ["prop_data", "dev_iotId", "status"],
  computed: {
    temp_num() {
      let _this = this;
      let temp = null;
      for (let i = 0; i < _this.dev_prop.length; i++) {
        if (_this.dev_prop[i].identifier == "TargetTemperature") {
          temp = parseInt(_this.dev_prop[i].snapshot.value);
          break;
        }
      }
      return temp;
    },
    power_state() {
      let _this = this;
      let power = null;
      for (let i = 0; i < _this.dev_prop.length; i++) {
        if (_this.dev_prop[i].identifier == "PowerSwitch") {
          power = Number(_this.dev_prop[i].snapshot.value);
          break;
        }
      }
      return power;
    },
    //下发的属性限制
    temp_set_rule() {
      let _this = this;
      let obj = {};
      for (let i = 0; i < _this.dev_prop.length; i++) {
        if (_this.dev_prop[i].identifier == "TargetTemperature") {
          let unit = JSON.parse(_this.dev_prop[i].specs).unit;
          let min = Number(JSON.parse(_this.dev_prop[i].specs).min);
          let unitName = JSON.parse(_this.dev_prop[i].specs).unitName;
          let max = Number(JSON.parse(_this.dev_prop[i].specs).max);
          let step = Number(JSON.parse(_this.dev_prop[i].specs).step);
          obj["unit"] = unit;
          obj["min"] = min;
          obj["unitName"] = unitName;
          obj["max"] = max;
          obj["step"] = step;
          break;
        }
      }
      return obj;
    },
    workMode() {
      let _this = this;
      for (let i = 0; i < _this.dev_prop.length; i++) {
        if (_this.dev_prop[i].identifier == "WorkMode") {
          let specs = JSON.parse(_this.dev_prop[i].specs);
          for (let key in specs) {
            if (String(_this.dev_prop[i].snapshot.value) == key) {  
              for (let j = 0; j < _this.mode_img.length; j++) {
                if (_this.mode_img[j].num == Number(key)) {
                  return {
                    num: Number(key),
                    value: specs[key],
                    img: _this.mode_img[j].imgName,
                  };
                }
              }
            }
          }
        }
      }
    },
    speedMode() {
      let _this = this;
      for (let i = 0; i < _this.dev_prop.length; i++) {
        if (_this.dev_prop[i].identifier == "WindSpeed") {
          let specs = JSON.parse(_this.dev_prop[i].specs);
          for (let key in specs) {
            if (String(_this.dev_prop[i].snapshot.value) == key) {
              for (let j = 0; j < _this.speed_img.length; j++) {
                if (_this.speed_img[j].num == Number(key)) {
                  return {
                    num: Number(key),
                    value: specs[key],
                    img: _this.speed_img[j].imgName,
                  };
                }
              }
            }
          }
        }
      }
    },
  },
  watch: {
    prop_data: {
      handler: function (newVal, oldVal) {
        let _this = this;
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
    set_temp(type) {
      let _this = this;
      let temp = _this.temp_num;
      _this.$emit("show_stop_setProploading","show")
      switch (type) {
        case "sub":
          if (temp > _this.temp_set_rule.min) {
            temp -= _this.temp_set_rule.step;
          } else {
            Tool.show_toast("最低温度了哦");
          }
          break;
        case "add":
          if (temp < _this.temp_set_rule.max) {
            temp += _this.temp_set_rule.step;
          } else {
            Tool.show_toast("最高温度了哦");
          }
          break;
      }
      Tool.setDeviceProperties(
        _this.iotId,
        {
          TargetTemperature: temp,
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
    //下发模式
    mode_set(item) {
      let _this = this;
      _this.$emit("show_stop_setProploading","show")
      let mode_num = 1;
      if (item.num == 4) {
        mode_num = 1;
      } else {
        mode_num = item.num + 1;
      }
      Tool.setDeviceProperties(
        _this.iotId,
        {
          WorkMode: mode_num,
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
    //下发速度
    speed_set(item) {
      let _this = this;
      _this.$emit("show_stop_setProploading","show")
      let speed_num = 1;
      if (item.num == 4) {
        speed_num = 2;
      } else {
        speed_num = item.num + 1;
      }
      Tool.setDeviceProperties(
        _this.iotId,
        {
          WorkMode: speed_num,
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
  created() {
    let s_width = Number(window.screen.width);
    //设置自适应比例
    this.window_proportion = (s_width / 1280) * 10;
  },
};
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  width: 100%;
  height: 100%;
  //   left: calc(50% - 15rem);
  //   top: 5.2rem;
  //   transition: all 1s;
  //   overflow: hidden;
}
.sub {
  position: absolute;
  width: 3.2rem;
  height: 3.2rem;
  top: 12.4rem;
  left: 5.4rem;
}
.add {
  position: absolute;
  width: 3.2rem;
  height: 3.2rem;
  top: 12.4rem;
  right: 5.4rem;
}
.temp_value {
  position: relative;
  width: 16rem;
  height: 8rem;
  font-family: PingFang-SC-Regular;
  font-size: 8rem;
  line-height: 8rem;
  color: white;
  font-weight: 400;
  left: calc(50% - 8rem);
  top: 9.7rem;
  text-align: center;
}
.temp_icon {
  position: absolute;
  width: 4rem;
  height: 4rem;
  font-size: 2.4rem;
  color: white;
  right: 10rem;
  top: 10.6rem;
}
.windSpeed {
  position: absolute;
  width: 100%;
  height: 7.6rem;
  top: 24.7rem;
}
.button {
  position: absolute;
  width: 7.6rem;
  height: 7.6rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3.8rem;
  //border: 0.1rem solid gray;
  &_img {
    position: absolute;
    width: 2.9rem;
    height: 3.1rem;
    top: calc(50% - 1.55rem);
    left: calc(50% - 1.45rem);
  }
}
.cold_button {
  left: 20%;
}
.wind_button {
  right: 20%;
}
.button_active {
  background-color: rgba(255, 255, 255, 0.3);
}
.mode_value {
  position: absolute;
  width: 100%;
  height: 2.5rem;
  line-height: 2.5rem;
  font-size: 2.2rem;
  color: white;
  text-align: center;
  top: 3.9rem;
}
.speed_value {
  position: absolute;
  width: 100%;
  height: 2.5rem;
  font-size: 2.2rem;
  color: white;
  text-align: center;
  top: 19.4rem;
}
</style>