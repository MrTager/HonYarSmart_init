<template>
  <div class="loading">
    <div class="loading_window">
      <img class="loading_img" src="../assets/images/loading.png" />
      <span class="loading_txt">{{loading_txt}}{{dotList[dot]}}</span>
    </div>
  </div>
</template>
<script>
import Tool from "@/utils/Tool";
export default {
  name: "loading",
  data() {
    return {
      dotList: ["", ".", "..", "...", "...."],
      dot: "",
      loading_txt:'加载中',
      timeout:null,
    };
  },
  props:['loading'],
  watch:{
    loading:{
      handler:(newVal,oldVal)=>{
          this.loading_txt = newVal
      },
      immediate:true,
      deep:true
    }
  },
  created() {
    let _this = this
    let index = 0;
    setInterval(() => {
      if (index < 4) {
        index++;
      } else {
        index = 0;
      }
      this.dot = index;
    }, 500);
    let second = 0
    _this.timeout = setInterval(()=>{
      if(second <= 60){
        second++
      }else{
        clearInterval(_this.timeout)
        this.$emit("hideLoading")
        second = 0
      }
    },1000)
  },
  beforeDestroy(){
    let _this = this;
    clearInterval(_this.timeout)
  }
};
</script>
<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  //animation: show_warning 0.5s 1 ease-in-out;
}
.loading_close {
  animation: close_warning 0.5s 1 ease-in-out;
}
.loading_window {
  position: absolute;
  width: 46.4rem;
  height: 26.8rem;
  top: calc(50% - 15.4rem);
  left: calc(50% - 23.2rem);
  background: #ffffff;
  box-shadow: 0px 5.1rem 5.7rem 0px rgba(104, 106, 138, 0.69);
  opacity: 0.8;
  border-radius: 2rem;
}
.loading_img {
  position: absolute;
  width: 10.1rem;
  height: 10.2rem;
  top: 5.1rem;
  left: calc(50% - 5.05rem);
  // transition: 0.5s;
  animation: rotate 1.5s linear infinite; /*开始动画后无限循环，用来控制rotate*/
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  40% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading_txt {
  position: absolute;
  width: 100%;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  top: 19.6rem;
  font-size: 2.4rem;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}
</style>