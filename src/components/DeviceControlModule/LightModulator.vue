<template>
  <div class="lightModulator" :style="{'pointer-events': status !== 1 ? 'none' : 'auto','opacity':status !== 1 ? '0.3' : '1'}">
    <div class="item" >
        <img class="item_icon" src="@/assets/images/deviceControl/light_icon.png" alt="">
        <div class="item_title">亮度</div>
        <div class="item_number_value">{{light_per}}%</div>
        <Slider :per="light_per"  @percent="light_percent"></Slider>
    </div>
    <div class="item" >
        <img class="item_icon" src="@/assets/images/deviceControl/temp_icon.png" alt="">
        <div class="item_title">色温</div>
        <div class="item_number_value">{{color_temp}}</div>
        <Slider :per="temp_per"  @percent="temp_percent"></Slider>
    </div>
    <Power :powerstate="LightSwitch" @power_set="power_set"></Power>
  </div>
</template>
<script>
import Tool from "@/utils/Tool";
import Slider from "@/components/DeviceControlModule/Tool/Slider" 
import Power from "@/components/DeviceControlModule/Tool/Power"
export default {
  name: "LightModulator",
  data() {
    return {
      dev_prop: this.prop_data,
      iotId: this.dev_iotId,
      light_per:0,//亮度百分比
      temp_per:0,//色温百分比
      dev_status: this.status,
    };
  },
  components:{
    Slider,
    Power
  },
  props: ["prop_data", "dev_iotId","status"],
  computed: {
    LightSwitch(){
      let _this = this;
      for(let i=0;i<_this.dev_prop.length;i++){
        if(_this.dev_prop[i].identifier == "LightSwitch"){
          return Number(_this.dev_prop[i].snapshot.value)
        }
      }
    },
    color_temp(){
      return parseInt((6500-2700)*(this.temp_per/100)+2700)
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
    //亮度百分比
    light_percent(data){
      let _this = this;
      _this.$emit("show_stop_setProploading","show")
      this.light_per = data
      Tool.setDeviceProperties(
        _this.iotId,
        {
          "Brightness": data,
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
    //色温百分比
    temp_percent(data){
      let _this = this;
      _this.$emit("show_stop_setProploading","show")
      this.temp_per = data
      Tool.setDeviceProperties(
        _this.iotId,
        {
          "ColorTemperature": _this.color_temp,
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
    power_set() {
      let _this = this;
      _this.$emit("show_stop_setProploading","show")
      let power = 0;
      if (this.LightSwitch == 1) {
        power = 0;
      } else {
        power = 1;
      }
      Tool.setDeviceProperties(
        _this.iotId,
        {
          "LightSwitch": power,
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
.lightModulator {
  width: 100%;
  height: 100%;
}
.item {
  position: relative;
  width: 100%;
  height: 15.5rem;
  transition: all 1s;
  overflow: hidden;
}
.item_title{
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
.item_number_value{
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
.item_icon{
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

</style>