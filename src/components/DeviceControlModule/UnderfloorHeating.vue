<template>
  <div class="UnderfloorHeating" :style="{'pointer-events': status !== 1 ? 'none' : 'auto','opacity':status !== 1 ? '0.3' : '1'}">
    <div class="item" >
      <img class="sub" src="@/assets/images/deviceControl/sub.png" alt @click="set_temp('sub')" />
      <img class="add" src="@/assets/images/deviceControl/add.png" alt @click="set_temp('add')" />
      <div class="temp_icon">℃</div>
      <div class="temp_value">{{temp_num}}</div>
      
    </div>
    <Power :powerstate="power_state" @power_set="power_set"></Power>
  </div>
</template>
<script>
import Tool from "@/utils/Tool";
import Power from "@/components/DeviceControlModule/Tool/Power"

export default {
  name: "UnderfloorHeating",
  data() {
    return {
      window_proportion: 10,
      dev_prop: this.prop_data,
      iotId: this.dev_iotId,
      dev_status: this.status,
    };
  },
  components:{
    Power
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
      _this.$emit("show_stop_setProploading","show")
      let temp = _this.temp_num;
      switch (type) {
        case "sub":
          if (temp > _this.temp_set_rule.min) {
            temp -= _this.temp_set_rule.step;
          }else{
            Tool.show_toast('最低温度了哦')
          }
          break;
        case "add":
          if (temp < _this.temp_set_rule.max) {
            temp += _this.temp_set_rule.step;
          }else{
            Tool.show_toast('最高温度了哦')
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
  top: 16.9rem;
  left: 5.4rem;
}
.add {
  position: absolute;
  width: 3.2rem;
  height: 3.2rem;
  top: 16.9rem;
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
  top: 14.5rem;
  text-align: center;
}
.temp_icon {
  position: absolute;
  width: 4rem;
  height: 4rem;
  font-size: 2.4rem;
  color: white;
  right: 10rem;
  top: 14.6rem;
}
</style>