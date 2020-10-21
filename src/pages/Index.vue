<template>
  <div class="main">
  </div>
</template>
<script>
import { mapState } from "vuex";
import Tool from "@/utils/HonYar";
import axios from "axios";

export default {
  name: "Main",
  title: "Pagination",
  components: {
 
  },

  data() {
    return {
     
    };
  },
  computed: {
    ...mapState({
      state: (state) => {
        return state;
      },
     
    }),
   },
  methods: {
   
   
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
  
    /**处理上报数据 */
    processing_reported_data(resq) {
      let _this = this;
    
    },
     

   
  },
  activated() {},
  mounted() {
    let _this = this;
    //检查网络连接
    if (navigator.onLine) {
      this.registerJs();
    }
  },

  created() {
    let _this = this;
   
    },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}

</style>