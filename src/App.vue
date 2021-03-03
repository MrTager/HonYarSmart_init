<template>
  <transition :name="direction" >
    <div id="app">
      <!-- <keep-alive :include="includePages"> -->
      <router-view/>
      <!-- </keep-alive> -->
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import HonYar from '@/utils/WebAPI'
import axios from 'axios'
export default {
  name: 'App',
  data(){
    return {
      direction: "slide-right",
      includePages:['main','news','Weather'],
      loading_data_flag:false,
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      if (to.path == "/") {
        this.direction = "slide-right";
      } else if (from.path == "/") {
        this.direction = "slide-left";
      }else{
        this.direction = toDepth < fromDepth ? "slide-right" : "slide-left";
      }
    }
  },
  components: {
    // OffLinePage
  },
  mounted() {
    let _this = this;
  },
  computed: {
    ...mapState({
      state: (state) => {
        return state;
      },
    }),

   },
  methods: {
    save_appkey(appKey){
      let _this = this;
      let now_use_App = "";
      switch (appKey) {
            case "22593195":
                now_use_App = "蓝绿智家";
                break;
            case "23548028":
                now_use_App = "智享人生";
                break;
            case "27784524":
                now_use_App = "鸿雁智+";
                break;
            case "24518347":
                now_use_App = "启博";
                break;
            case "25508337":
                now_use_App = "智慧用电";
                break;
            case "21224927":
                now_use_App = "能效管理";
                break;
            case "21856927":
                now_use_App = "测试";
                break;
            case "28567632":
                now_use_App = "浙电华云";
                break;
            case "28611437":
                now_use_App = "普天信息";
                break;
            case "28980883":
                now_use_App = "鸿雁产测";
                break;
            case "24517723":
                now_use_App = "名特网络";
                break;
        }
        _this.$store.dispatch("changeDate", {
          now_use_App : now_use_App
        });
    },
    registerJs () {
      let _this = this;
      this.$bridge.registerHandler('nativeSignal', (data, responseCallback) => {
        //this.$store.dispatch('updateNativeSignal', data)
        //console.log('回复数据1',data)
        _this.deal_reported_data("nativeSignal",data)
        responseCallback('{"errCode": 0}') // 回复给Native,data为回复数据
      })
      this.$bridge.registerHandler('subAllEvent', (data, responseCallback) => {
        //this.$store.dispatch('updateEvent', data)
        //console.log('回复数据2',data)
        _this.deal_reported_data("subAllEvent",data)
        responseCallback('{"errCode": 0}') // 回复给Native,data为回复数据
      })
   },
   start(){
    let _this = this;
    _this.registerJs();
    HonYar.hide_header((res)=>{})
    
    //加载超时处理
    // let loadingTime = setTimeout(()=>{
    //   if(this.loading_data_flag){
    //     HonYar.show_toast("数据请求超时",()=>{})
    //     clearTimeout(loadingTime)
    //   }
    // },5000)
    //开始加载数据
    //获取设备属性
    HonYar.getDeviceInfo('','1','',(res)=>{
      if(JSON.parse(res).code == 200){
        let data = JSON.parse(res).data
        if(data.owned === 1 || "1"){
          _this.$store.dispatch("changeDate", {
              deviceAdmin : true
          });
        }else{
          _this.$store.dispatch("changeDate", {
              deviceAdmin : false
          });
        }
        //console.log("设备信息",data)
        //data传入store里
        _this.$store.dispatch("changeDate", {
          deviceInfo : data
        });
        //获取用户信息
        HonYar.getUserInfo(data.userId,(res)=>{
          if(JSON.parse(res).code == 200){
            _this.$store.dispatch("changeDate", {
              user_info : JSON.parse(res).data
            });
            _this.save_appkey(JSON.parse(res).data.appKey)
          }else{
            HonYar.show_toast("获取用户信息失败"+res,(res)=>{})
          }
        })
        /**获取用户绑定列表 */
        HonYar.getListBindingByAccount(data.userId, 1, 1000, (res)=>{
          if(JSON.parse(res).code == 200){
            _this.$store.dispatch("changeDate", {
              bindingDevList : JSON.parse(res).data
            });
          }else{
            HonYar.show_toast("获取用户的绑定列表失败"+res,(res)=>{})
          }
        })
        /**获取此设备的绑定关系 */
        HonYar.getlistBindingByDev(data.iotId,(res)=>{
          console.log("此设备的绑定关系",res);
          if(JSON.parse(res).code == 200){
            _this.$store.dispatch("changeDate", {
              devBindingUserList : JSON.parse(res).data
            });
          }else{
            HonYar.show_toast(res,(res)=>{})
          }
        })
        /**获取设备属性 */
        HonYar.getDeviceProperties('1',data.iotId,(res)=>{
          //console.log("设备子属性",res)
          if(JSON.parse(res).code === 200){
            let props = JSON.parse(res).data;
            let allObj = {}
            for(let a = 0;a<props.length;a++){
              allObj[props[a].attribute] = props[a].value
            }
            _this.$store.dispatch("changeProp",allObj).then(()=>{
              HonYar.getDeviceChildPrpps(data.iotId)
              .then((res)=>{
                _this.$store.dispatch("changeDate",{
                  deviceChildProps:JSON.parse(res).data
                }).then(res => {
                })
              })
            })
          }else{
            HonYar.show_toast("获取设备属性失败"+res,(res)=>{})
          }
        })
      }else{
        HonYar.show_toast("获取设备信息失败"+res,(res)=>{})
      }
    })
    //获取家信息
     HonYar.getHomeInfo("/appHome/getHomeInfo","",(res)=>{
      if(JSON.parse(res).code == 200){
        let _homeInfo = JSON.parse(res).data
        if(_homeInfo.parent === 1 || "1"){
          _this.$store.dispatch("changeDate", {
              homeAdmin : true
          });
        }else{
          _this.$store.dispatch("changeDate", {
              homeAdmin : false
          });
        }
        _this.$store.dispatch('changeDate', {
            homeInfo: _homeInfo,
        });
      }else{
        HonYar.show_toast("获取家信息失败"+res,(resp)=>{})
      }
     },'1',"1.0")
   },
   deal_reported_data(type,data){
     if(type === "subAllEvent"){
       
     }else if (type === "nativeSignal"){

     }
   }
   
  },
  created(){
    this.start()

  }
}
</script>
<style>
.appView {
  position: absolute;
  width:100%;
  transition: transform 0.3s ease-out;
}
.slide-left-enter{
  transform: translate(100%, 0);
}
.slide-left-leave-active{
  transform: translate(-50%, 0);
}
.slide-right-enter {
  transform: translate(-50%, 0);
}
.slide-right-leave-active{
  transform: translate(100%, 0);
}
</style>
<style>
html,body,#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  font-family:PingFang SC;
  width: 100%;
  height: 100%;
  background-color: RGBA(246, 246, 246, 1);
}


/* 清除内外边距 */
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, /* structural elements 结构元素 */
dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
pre, /* text formatting elements 文本格式元素 */
fieldset, lengend, button, input, textarea, /* form elements 表单元素 */
th, td { /* table elements 表格元素 */
    margin: 0;
    padding: 0;
}

/* 设置默认字体 */
body,
button, input, select, textarea { /* for ie */
    /*font: 12px/1 Tahoma, Helvetica, Arial, "宋体", sans-serif;*/
    font: 12px/1 Tahoma, Helvetica, Arial, "\5b8b\4f53", sans-serif; /* 用 ascii 字符表示，使得在任何编码下都无问题 */
}

h1 { font-size: 18px; /* 18px / 12px = 1.5 */ }
h2 { font-size: 16px; }
h3 { font-size: 14px; }
h4, h5, h6 { font-size: 100%; }

address, cite, dfn, em, var { font-style: normal; } /* 将斜体扶正 */
code, kbd, pre, samp, tt { font-family: "Courier New", Courier, monospace; } /* 统一等宽字体 */
small { font-size: 12px; } /* 小于 12px 的中文很难阅读，让 small 正常化 */

/* 重置列表元素 */
ul, ol { list-style: none; }

/* 重置文本格式元素 */
a { text-decoration: none; }
a:hover { text-decoration: underline; }

abbr[title], acronym[title] { /* 注：1.ie6 不支持 abbr; 2.这里用了属性选择符，ie6 下无效果 */
border-bottom: 1px dotted;
cursor: help;
}

q:before, q:after { content: ''; }

/* 重置表单元素 */
legend { color: #000; } /* for ie6 */
fieldset, img { border: none; } /* img 搭车：让链接里的 img 无边框 */
/* 注：optgroup 无法扶正 */
button, input, select, textarea {
    font-size: 100%; /* 使得表单元素在 ie 下能继承字体大小 */
}

/* 重置表格元素 */
table {
border-collapse: collapse;
border-spacing: 0;
}

/* 重置 hr */
hr {
    border: none;
    height: 1px;
}
</style>
