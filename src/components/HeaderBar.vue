<template>
  <div class="headerBar">
    <img class="back" src="../assets/images/back_white.png" alt="返回" @click="goback()">
    <span class="time">{{Time.hour}}:{{Time.min}}</span>
    <div class="connect_state" @click="connect_again">{{connect}}22222</div>
    <span class="userName" v-if="state.pubilc.attribute.user_info.data" @click="get_debugPage">{{state.pubilc.attribute.user_info.data.userName}}</span>
    <img class="refresh" id="refresh" src="@/assets/images/refresh.png" alt="刷新" @click="refresh()">
    <img class="smallBell" src="@/assets/images/smallBell.png" @click="showMessage()" />
    <div class="red_dot" v-if="messageFlag"></div>
    <router-link :to="{path:'/setting'}" tag="div" replace>
    <img class="setting" src="@/assets/images/setting.png" />
    </router-link>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Tool from "@/utils/Tool";
export default {
  name: "headerBar",
  data() {
    return {
      Time: {},
      UserName: "我的家",
      connect:"",
      messageFlag:false,
    };
  },
  props:["connect_status","message_flag"],
  watch:{
    connect_status: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.connect = newVal;
        }
      },
      immediate: true,
      deep: true,
    },
    message_flag:{
       handler: function (newVal, oldVal) {
        if (newVal) {
          this.messageFlag = newVal;
        }
      },
      immediate: true,
      deep: true,
    }
  },
  computed: {
    ...mapState({
      state: (state) => {
        return state;
      },
    }),
  },
  methods: {
    connect_again(){
      Tool.reconnectServer();
    },
    goback(){
      Tool.finishActivity();
    },
    showMessage(){
      this.$emit("show_message")
    },
    refresh(){
      window.location.reload()
      document.getElementById("refresh").style.animation = "refrash_animation 1s infinite";
      setTimeout(()=>{
          document.getElementById("refresh").style.animation = "none"
      },1000)
    },
    get_debugPage(){
      Tool.get_debugPage()
    }

  },
  created() {
    let _this = this;
    setInterval(() => {
      _this.Time = Tool.getTime();
    }, 1000);
  },
};
//头部高度80
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 8rem;
  position: relative;
  left: 0;
  top: 0;
  z-index: 988;
}
.time {
  position: absolute;
  font-size: 2.6rem;
  left: 10rem;
  top: 2.7rem;
}
.userName {
  position: absolute;
  width: 50rem;
  top: 3rem;
  font-size: 3rem;
  left: calc(50% - 25rem);
  top: calc(50% - 1.5rem);
  text-align: center;
}
.smallBell {
  position: absolute;
  top: 2.4rem;
  right: 11rem;
  width: 3rem;
  height: 3rem;
}
.refresh{
  position: absolute;
  top: 2.4rem;
  right: 17rem;
  width: 3rem;
  height: 3rem;
}
.setting {
  position: absolute;
  top: 2.4rem;
  right: 5rem;
  width: 3rem;
  height: 3rem;
}
.connect_state{
  position: absolute;
  font-size: 2.6rem;
  left: 20rem;
  top: 2.7rem;
}
.red_dot{
  position: absolute;
  width: 1rem;
  height: 1rem;
  background-color: red;
  top: 2.4rem;
  right: 11rem;
  border-radius: 0.5rem;
}
.back{
  position: absolute;
  width: 1.45rem;
  height: 2.76rem;
  left: 5rem;
  top: calc(50% - 1.38rem);
}
</style>
<style lang="scss">
@keyframes refrash_animation {
    0% {transform:rotate(0deg); }
    50% {transform:rotate(180deg);}
    100% {transform:rotate(360deg);}
}
</style>