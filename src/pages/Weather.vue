<template>
    <div class="weather" >
        <div class="themeBG" v-if="theme_img.length > 0" :style="{ backgroundImage: 'url(' + require('@/assets/themeImg/'+theme_img) + ')',backgroundRepeat: 'no-repeat',backgroundSize: '100% 100%'}"></div>
        <div class="header">
            <router-link :to="{path:'/main'}">
            <img class="back" src="../assets/images/back_white.png" alt="返回" >
            </router-link>
            <span class="time">{{Time.hour}}:{{Time.min}}</span>
        </div>
        <div class="position_value">
            <!-- <router-link :to="{path:'/main'}"></router-link> -->
            <img class="position_img" src="@/assets/images/location.png">
            <p class="position_name">{{city.secondaryname}}{{city.name}}</p>
        </div>
        <div class="weatherGroup_one">
            <div class="shotWeather">
                <div class="newsPanel"></div>
                <div class="weatherbg_color"></div>
                <div class="shotWeather_info">
                    <div class="shotWeather_info_temp">{{shortWeatherData.temp}}</div>
                    <div class="shotWeather_info_unit">℃</div>
                    <div class="shotWeather_info_condition">{{shortWeatherData.condition}}</div>
                    <div class="shotWeather_info_scope">{{oneWeatherLowTemp}}~{{oneWeatherTopTemp}}℃</div>
                    <div class="shotWeather_info_aqi" :style="{'background-color':aqiColor}">{{aqi_value}}</div>
                </div>
                <div class="shotWeather_info_otherTxt">{{shortWeatherData.windDir}}{{shortWeatherData.windLevel}}级 | 湿度{{shortWeatherData.humidity}}%</div>
            </div>
            <div class="oneDayWeather">
                <div class="newsPanel"></div>
                <div class="weatherbg_color"></div>
                <div class="oneDayWeather_title">24小时预报</div>
                <div class="oneDayWeather_left_group">
                    <div class="oneDayWeather_temp_high">{{oneWeatherTopTemp}}°</div>
                    <div class="oneDayWeather_temp_low">{{oneWeatherLowTemp}}°</div>
                    <div class="oneDayWeather_air">湿度</div>
                    <div class="oneDayWeather_wind">风力</div>
                </div>
                <div class="oneDayWeather_right_group">
                    <TempStatistics :oneDayWeather="oneDayWeather" :shortWeather="shortWeather"></TempStatistics>
                </div>
            </div>
        </div>
        <div class="weatherGroup_two">
            <div class="fifteenWeather">
                <div class="newsPanel"></div>
                <div class="weatherbg_color"></div>
                <div class="fifteenWeather_title">15天预报</div>
                <ul class="fifteenWeather_group">
                    <li class="fifteenWeather_item" v-for="(item,i) in fifteenWeather" :key="i" :style="{'border-left':(i == 0 ? 'none':''),'border-right':(i == fifteenWeather.length-1?'none':''),'opacity':(i == 0 ? '0.5' : '1')}">
                        <p class="fifteenWeather_item_week">{{item.week}}</p>
                        <p class="fifteenWeather_item_date">{{item.weatherDate}}</p>
                        <p class="fifteenWeather_item_condition">{{item.conditionDay}}</p>
                        <img class="fifteenWeather_item_img" :src="require(`../assets/weatherImage/W${item.weatherImgId}.png`)">
                        <p class="fifteenWeather_item_tempScope">{{item.tempDay}}~{{item.tempNight}}℃</p>
                        <p class="fifteenWeather_item_wind">{{item.windDirDay}}{{item.windSpeedDay}}级</p>
                        <p class="fifteenWeather_item_hum">湿度{{item.humidity}}%</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="weatherGroup_three">
            <div class="liveWeather">
                <div class="newsPanel"></div>
                <ul>
                    <li class="live_item" v-for="(item,i) in lifeWeather" :key="i" :style="{'border-left':(i == 0 ? 'none':''),'border-right':(i == lifeWeather.length-1?'none':'')}">
                        <img class="live_item_img" :src="require(`../assets/weatherPage/${item.icon}.png`)">
                        <div class="live_item_statue">{{item.status}}</div>
                        <div class="live_item_title">{{item.title}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import TWEEN from '@tweenjs/tween.js'
import TempStatistics from '@/components/TempStatistics';
import Header from '@/components/HeaderBar';
import Tool from '@/utils/Tool';
import axios from 'axios'
export default {
    name:'weather',
    components:{TempStatistics,Header},
    data() {
        return {
            shortWeatherData:{
                temp:'',
                condition:'',
                tempScope:'',
                humidity:'',
                windDir:'',
                windLevel:'',
            },
            city:{
                secondaryname:'',
                name:''
            },
            shortWeather:{},
            fifteenWeather:[],
            lifeWeather:[],
            oneDayWeather:[],
            oneWeatherTopTemp:'',
            oneWeatherLowTemp:'',
            sql_flag:{
                shortWeather:false,
                fifteenWeather:false,
                oneDayWeather:false,
                lifeWeather:false,
            },
            aqiColor:'',
            aqi_value:'',
            loadingFlag:false,
        //    themeAddress: "background_img_1.png",
        Time: {},
        }
    },
    computed:{
         ...mapState({
      state: (state) => {
        return state;
      },
       theme_img:(state)=>{
        return state.pubilc.attribute.theme_img;
      }
      
      })
    },
    methods:{
        /**
         * 短时天气
         */
        getShotWeather(){
            
            let _this = this;
            let lat = '';
            let lon = '';
            Tool.getLon_lat((res)=>{
                  
                  lat = JSON.parse(JSON.parse(res).data).lat;
                  lon = JSON.parse(JSON.parse(res).data).lon;
                  let obj = {};
                  obj['lat'] = lat;
                  obj['lon'] = lon;
                  Tool.getShortWeather(String(lon),String(lat),(res)=>{
                        _this.sql_flag.shortWeather = true
                        _this.shortWeather = JSON.parse(res).data.condition;
                        _this.shortWeatherData.temp = JSON.parse(res).data.condition.temp;
                        _this.shortWeatherData.condition = JSON.parse(res).data.condition.condition;
                        _this.shortWeatherData.humidity = JSON.parse(res).data.condition.humidity;
                        _this.shortWeatherData.windDir = JSON.parse(res).data.condition.windDir;
                        _this.shortWeatherData.windLevel = JSON.parse(res).data.condition.windLevel;
                        _this.city.secondaryname = JSON.parse(res).data.city.secondaryname;
                        _this.city.name = JSON.parse(res).data.city.name;
                        Tool.change_sql('web_ShotWeather',_this.shortWeatherData,(res)=>{
                        if(JSON.parse(res).code == 200){
                        }else{
                        console.error('存入数据库失败',res)
                        }
                        })
                  });
                    

            });
        },
        /**
         * 15日天气
         */
        getFifteenWeather(){
            let _this = this;
            let lat = '';
            let lon = '';
            Tool.getLon_lat((res)=>{
                  lat = JSON.parse(JSON.parse(res).data).lat;
                  lon = JSON.parse(JSON.parse(res).data).lon;
                  let obj = {};
                  obj['lat'] = lat;
                  obj['lon'] = lon;
                  Tool.getFifteenWeather(String(lon),String(lat),(res)=>{
                        _this.fifteenWeather = [];
                        for(let i = 0;i<JSON.parse(res).data.data.forecast.length;i++){
                            let obj = {};
                            let tempDay = JSON.parse(res).data.data.forecast[i].tempDay;
                            let tempNight = JSON.parse(res).data.data.forecast[i].tempNight;
                            obj['tempDay'] = tempDay;
                            obj['tempNight'] = tempNight;
                            let conditionDay = JSON.parse(res).data.data.forecast[i].conditionDay;
                            obj['conditionDay'] = conditionDay;
                            let conditionIdDay = JSON.parse(res).data.data.forecast[i].conditionIdDay;
                            let humidity = JSON.parse(res).data.data.forecast[i].humidity;
                            obj['humidity'] = JSON.parse(res).data.data.forecast[i].humidity;
                            let predictDate = JSON.parse(res).data.data.forecast[i].predictDate;
                            switch(i){
                                case 0:
                                    obj['week'] = '昨天';
                                    break;
                                case 1:
                                    obj['week'] = '今天';
                                    break;
                                case 2:
                                    obj['week'] = '明天';
                                    break;
                                default:
                                    obj['week'] = _this.getWeek(predictDate);
                                    break;
                            }
                            
                            let weatherDate = predictDate.substring(5,7)+'/'+predictDate.substring(8,10);
                            obj['weatherDate'] = weatherDate;
                            let windDirDay = JSON.parse(res).data.data.forecast[i].windDirDay;
                            let windSpeedDay = JSON.parse(res).data.data.forecast[i].windSpeedDay;
                            let windLevelDay = JSON.parse(res).data.data.forecast[i].windLevelDay;
                            obj['windDirDay'] = windDirDay;
                            obj['windSpeedDay'] = windLevelDay;
                            let weatherImgId = conditionIdDay;
                            obj['weatherImgId'] = weatherImgId;
                            _this.fifteenWeather.push(obj);
                        }
                        _this.sql_flag.fifteenWeather = true;
                        Tool.change_sql('web_fifteenWeather',_this.fifteenWeather,(res)=>{
                            if(JSON.parse(res).code == 200){
                            }else{
                            console.error('存入数据库失败',res)
                            }
                        })

                  })
            });
        },
        /**
         * 生活指数
         */
        getLifeWeather(){
            let _this = this;
            let lat = '';
            let lon = '';
            Tool.getLon_lat((res)=>{
                  lat = JSON.parse(JSON.parse(res).data).lat;
                  lon = JSON.parse(JSON.parse(res).data).lon;
                  let obj = {};
                  obj['lat'] = lat;
                  obj['lon'] = lon;
                  Tool.getLifeWeather(String(lon),String(lat),(res)=>{
                       _this.lifeWeather = [];
                        // let date = new Date();
                        // let year = date.getFullYear();
                        // let mon = date.getMonth()+1;
                        // let day = date.getDate();
                        // mon < 10 ? mon = '0'+mon : mon = ''+mon
                        // day < 10 ? day = '0'+day : day = ''+day
                        // let dateString = year+'-'+mon+'-'+day
                        let lifeDate = [];
                        for(let key in JSON.parse(res).data.data.liveIndex){
                            lifeDate = JSON.parse(res).data.data.liveIndex[key];         
                        }
                        for(let i=0;i<lifeDate.length;i++){
                            let obj = {};
                            let status = lifeDate[i].status;
                            obj['status'] = status;
                            switch(lifeDate[i].code){
                                case 20:
                                    //穿衣
                                    obj['title'] = lifeDate[i].name;
                                    obj['icon'] = lifeDate[i].code;
                                    _this.lifeWeather[0] = obj;
                                    break;
                                case 12:
                                    //感冒
                                    obj['title'] = lifeDate[i].name;
                                    obj['icon'] = lifeDate[i].code;
                                    _this.lifeWeather[1] = obj;
                                    break;
                                case 26:
                                    //运动
                                    obj['title'] = lifeDate[i].name;
                                    obj['icon'] = lifeDate[i].code;
                                    _this.lifeWeather[2] = obj;
                                    break;
                                case 21:
                                    //紫外线
                                    obj['title'] = lifeDate[i].name;
                                    obj['icon'] = lifeDate[i].code;
                                    _this.lifeWeather[3] = obj;
                                    break;
                                case 7:
                                    //护肤
                                    obj['title'] = lifeDate[i].name;
                                    obj['icon'] = lifeDate[i].code;
                                    _this.lifeWeather[4] = obj;
                                    break;
                                case 28:
                                    //钓鱼
                                    obj['title'] = lifeDate[i].name;
                                    obj['icon'] = lifeDate[i].code;
                                    _this.lifeWeather[5] = obj;
                                    break;
                                case 17:
                                    //洗车
                                    obj['title'] = lifeDate[i].name;
                                    obj['icon'] = lifeDate[i].code;
                                    _this.lifeWeather[6] = obj;
                                    break;
                                default:
                                    break;
                            }
                        }
                        Tool.change_sql('web_lifeWeather',_this.lifeWeather,(res)=>{
                            if(JSON.parse(res).code == 200){
                            }else{
                            console.error('存入数据库失败',res)
                            }
                        })
                    }) 
            });
        },
        /**
         * 获取二十四小时天气
         */
        getOneDayWeather(){
            let _this = this;
            let lat = '';
            let lon = '';
            Tool.getLon_lat((res)=>{
                  lat = JSON.parse(JSON.parse(res).data).lat;
                  lon = JSON.parse(JSON.parse(res).data).lon;
                  let obj = {};
                  obj['lat'] = lat;
                  obj['lon'] = lon;
                //   _this.$store.dispatch('changeDate',{
                //         lay_lon:obj
                //   })
                  
                  Tool.getOnedayWeather(String(lon),String(lat),(res)=>{
                        let array = JSON.parse(res).data.data.hourly;
                        let tempArr=[];
                        let newData = [];
                        for(let i = 0;i<array.length;i++){
                            let obj={};
                            let temp = Number(array[i].temp);
                            tempArr.push(temp);
                            obj['temp'] = array[i].temp;//温度
                            obj['winSpeed'] = array[i].windlevel;//速度
                            obj['hour'] = array[i].hour//时间
                            obj['humidity'] = array[i].humidity;//湿度
                            obj['condition'] = array[i].condition;
                            obj['iconDay'] = array[i].iconDay;
                            newData[i] = obj
                        };
                        _this.oneDayWeather = newData;
                        _this.sql_flag.oneDayWeather = true;
                        Tool.change_sql('web_oneDayWeather',_this.oneDayWeather,(res)=>{
                            if(JSON.parse(res).code == 200){
                            }else{
                            console.error('存入数据库失败',res)
                            }
                        })
                        tempArr.sort(function (a, b) {
                            return a-b;
                        });
                        _this.oneWeatherLowTemp = tempArr[0];
                        _this.oneWeatherTopTemp = tempArr[tempArr.length-1];
                        _this.loadingFlag = false;
                        
                  }) 
            });
        },
        getWeatherAQI(){
            let _this = this;
            let lat = '';
            let lon = '';
            Tool.getLon_lat((res)=>{
                lat = JSON.parse(JSON.parse(res).data).lat;
                lon = JSON.parse(JSON.parse(res).data).lon;
                let obj = {};
                obj['lat'] = lat;
                obj['lon'] = lon;
                Tool.getWeatherAQI(String(lon),String(lat),(res)=>{
                    let aqi = JSON.parse(res).data.data.aqi.value;
                    if(aqi>=0&&aqi<50){
                        _this.aqiColor = '#4BBB35'
                        _this.aqi_value = '优'
                    }else if(aqi>=50&&aqi<100){
                        _this.aqiColor = '#EBCE0D'
                        _this.aqi_value = '良'
                    }else if(aqi>=100&&aqi<150){
                        _this.aqiColor = '#E77C25'
                        _this.aqi_value = '轻度污染'
                    }else if(aqi>=150&&aqi<200){
                         _this.aqiColor = '#D73838'
                        _this.aqi_value = '中度污染'
                    }else if(aqi>=200&&aqi<300){
                        _this.aqiColor = '#950854'
                        _this.aqi_value = '重度污染'
                    }else if(aqi>=300&&aqi<500){
                        _this.aqiColor = '#540000'
                        _this.aqi_value = '严重污染'
                    }else if(aqi>=500&&aqi<100000){
                        _this.aqiColor = '#670000'
                        _this.aqi_value = '爆表'
                    }else{
                        _this.aqiColor = '#230000'
                        _this.aqi_value = '其他'
                    }

                })
            });
        },
        /**
         * 日期转换成星期
         */
        getWeek(dateString) {
            let dateArray = dateString.split("-");
            let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
            return "周" + "日一二三四五六".charAt(date.getDay());
        },
        goBack(){
            this.$router.replace({ path: '/main'})

        },
        /**监听上报 */
        registerJs () {
            let _this = this
            this.$bridge.registerHandler('nativeSignal', (data, responseCallback) => {
                this.$store.dispatch('updateNativeSignal', data)
                _this.dealDate(data);
                responseCallback('{"errCode": 0}') // 回复给Native,data为回复数据
            })
            this.$bridge.registerHandler('subAllEvent', (data, responseCallback) => {
                this.$store.dispatch('updateEvent', data)
                _this.dealDate(data);
                responseCallback('{"errCode": 0}') // 回复给Native,data为回复数据
            })
        },
        dealDate(res){
            let _this = this;
            let _data = JSON.parse(res);
            //监听返回键
            if(_data.request.signalType){
                if(_data.request.signalType == 'back'){
                //_this.$router.go(-1);
                //_this.$router.push('/home');
                this.$router.replace({ path: '/main'})
                }
            }
        }
    },
    mounted () {
        this.registerJs()
    },
    created(){
        let _this = this;
          setInterval(() => {
            _this.Time = Tool.getTime();
            }, 1000);
        _this.loadingFlag = true;
        //二话不说先读数据库
        Tool.query_sql('web_ShotWeather',(res)=>{
            if(JSON.parse(res).code == 200){
                if(JSON.parse(res).data.value == ""){//空数据库
                    
                }else{
                    if(_this.sql_flag.shortWeather == false){
                        _this.shortWeatherData = JSON.parse(JSON.parse(res).data.value)
                    }
                }
            }else{
                console.error('查询数据库失败',res)
            }
        })
        
        Tool.query_sql('web_fifteenWeather',(res)=>{
            if(JSON.parse(res).code == 200){
                if(JSON.parse(res).data.value == ""){//空数据库
                    
                }else{
                    if(_this.sql_flag.fifteenWeather == false){
                        _this.fifteenWeather = JSON.parse(JSON.parse(res).data.value)
                    }
                }
            }else{
                console.error('查询数据库失败',res)
            }
        });
        
        Tool.query_sql('web_oneDayWeather',(res)=>{
            if(JSON.parse(res).code == 200){
                if(JSON.parse(res).data.value == ""){//空数据库
                    
                }else{
                    if(_this.sql_flag.oneDayWeather == false){
                        _this.oneDayWeather = JSON.parse(JSON.parse(res).data.value)
                    }
                }
            }else{
                console.error('查询数据库失败',res)
            }
        });
        Tool.query_sql('web_lifeWeather',(res)=>{
            if(JSON.parse(res).code == 200){
                if(JSON.parse(res).data.value == ""){//空数据库
                    
                }else{
                    if(_this.sql_flag.lifeWeather == false){
                        _this.lifeWeather = JSON.parse(JSON.parse(res).data.value)
                    }
                }
            }else{
                console.error('查询数据库失败',res)
            }
        });

        _this.getShotWeather();
        _this.getFifteenWeather();
        _this.getLifeWeather();
        _this.getOneDayWeather();
        _this.getWeatherAQI();
        setInterval(()=>{
            _this.getShotWeather();
            _this.getFifteenWeather();
            _this.getLifeWeather();
            _this.getOneDayWeather();
            _this.getWeatherAQI();
        },60000)
        
    }
}
</script>
<style lang="scss" scoped>
html,body,#app{
    height: 100%;
    width: 100%;
}
.newsPanel{
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #7596C8;
      opacity: 0.5;
}
.header{
    position: relative ;
    width: 100%;
    height: 8rem;
    left: 0;
    top: 0;
    z-index: 988;
}
.back{
    position: absolute;
    width: 1.45rem;
    height: 2.76rem;
    left: 5rem;
    top: calc(50% - 1.38rem);
}
.time {
  position: absolute;
  font-size: 2.6rem;
  left: 10rem;
  top: 2.7rem;
}
.themeBG{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 0;
    left: 0;
    top: 0;
   // margin-top: -8rem;
}
.weather{
    width: 100%;
    height: 100%;
    $position_valueHeight:2.8rem;
    color: white;
    .back{
        position: absolute;
        width: 1.46rem;
        height: 2.76rem;
        left: 4.84rem;
    }
    .position_value{
        width: 100%;
        height: $position_valueHeight;
        position: relative;
        // margin-top: 1.7rem;
        // margin-bottom: 1.7rem;
    }
    .position_img{
        width: 2.2rem;
        height: $position_valueHeight;
        position: absolute;
        right: 24.3rem;
    }
    .position_name{
        position: absolute;
        width: 20rem;
        height: $position_valueHeight;
        font-size: $position_valueHeight;
        color: white;
        right: 3rem;
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    $weatherGroup_one_height:28rem;
    .weatherbg_color{
        position: absolute;
        width: 100%;
        height: 100%;
        //background-color: #4B4D56;
    }
    .weatherGroup_one{
        position: relative;
        width: 100%;
        height: $weatherGroup_one_height;
        .shotWeather{
            position: absolute;
            width: 43.2rem;
            height: $weatherGroup_one_height;
            left: 5rem;
            border-radius: 2rem;
            overflow: hidden;
        }

        $shotWeather_info_height:4.45*2rem;
        .shotWeather_info{
            position: absolute;
            width: 100%;
            height: $shotWeather_info_height;
            top: 4.05*2rem;
            &_temp{
                position: absolute;
                width: 12*2rem;
                height: $shotWeather_info_height;
                font-size: 6*2rem;
                color: white;
                line-height: $shotWeather_info_height;
                left: 1.85*2rem;
            }
            &_unit{
                position: absolute;
                width: 2.6*2rem;
                height: 2.6*2rem;
                font-size: 2.6*2rem;
                line-height: 2.6*2rem;
                color: white;
                bottom: 0*2rem;
                left: 9.05*2rem;
            }
            &_condition{
                position: absolute;
                width: 10*2rem;
                height: 1.5*2rem;
                right: 2*2rem;
                font-size: 1.5*2rem;
                text-align: center;
            }
            &_scope{
                position: absolute;
                width: 10*2rem;
                height: 1.5*2rem;
                right: 0*2rem;
                font-size: 1.5*2rem;
                text-align: center;
                bottom: 0*2rem;
            }
            &_aqi{
                position: absolute;
                width: 2.5*2rem;
                height: 1.5*2rem;
                right: 2.1*2rem;
                top: 0*2rem;
                border-radius: 0.75*2rem;
                color: white;
                font-size: 0.9*2rem;
                text-align: center;
                line-height: 1.5*2rem;
            }
        }
        .shotWeather_info_otherTxt{
                position: absolute;
                width: 100%;
                height: 1.2*2rem;
                font-size: 1.2*2rem;
                text-align: center;
                bottom: 0.95*2rem;
        }
        .oneDayWeather{
            position: absolute;
            width: 36.1*2rem;
            height: $weatherGroup_one_height;
            right: 2.5*2rem;
            border-radius: 1*2rem;
            overflow: hidden;
            &_title{
                position: absolute;
                width: 7*2rem;
                height: 1.2*2rem;
                font-size: 1.2*2rem;
                left: 1.5*2rem;
                top: 1*2rem;
                opacity: 1;
            }
            &_left_group{
                position: absolute;
                width: 3.25*2rem;
                height: 100%;
                opacity: 1;
            }
            &_temp_high{
                position: absolute;
                width: 2*2rem;
                height: 1*2rem;
                right: 0*2rem;
                top: 4.25*2rem;
                font-size: 1*2rem;
                text-align: center;
                opacity: 1;
            }
            &_temp_low{
                position: absolute;
                width: 2*2rem;
                height: 1*2rem;
                right: 0*2rem;
                top: 7.5*2rem;
                font-size: 1*2rem;
                text-align: center;
                opacity: 1;
            }
            &_air{
                position: absolute;
                width: 2*2rem;
                height: 1*2rem;
                right: 0*2rem;
                top: 9.6*2rem;
                font-size: 0.8*2rem;
                text-align: center;
                opacity: 1;
            }
            &_wind{
                position: absolute;
                width: 2*2rem;
                height: 1*2rem;
                right: 0*2rem;
                top: 10.85*2rem;
                font-size: 0.8*2rem;
                text-align: center;
                opacity: 1;
            }
            &_right_group{
                position: absolute;
                width: 32.7*2rem;
                height: 10*2rem;
                right: 0*2rem;
                top: 3.4*2rem;
                overflow: hidden;

            }
        }
       
        
    } 
    .weatherGroup_two{
        position: relative;
        width: 100%;
        height: 15*2rem;
        margin-top: 1.3*2rem;
        .fifteenWeather{
            position: absolute;
            width: 59*2rem;
            height: 15*2rem;
            border-radius: 1*2rem;
            left: calc(50% - 29.5*2rem);
            overflow: hidden;
        }
        .fifteenWeather_title{
            position: absolute;
            width: 10*2rem;
            height: 1.2*2rem;
            font-size: 1.2*2rem;
            left: 1.4*2rem;
            top: 1*2rem;
        }
        $fifteenWeather_group_height:11.8*2rem;
        .fifteenWeather_group{
            position: absolute;
            width: 59*2rem;
            height: $fifteenWeather_group_height;
            top: 2.6*2rem;
            vertical-align:top;
            white-space: nowrap;
            overflow-x:scroll;
            overflow-y:hidden;
            -webkit-overflow-scrolling : touch;
        }
        .fifteenWeather_item{
            position: relative;
            display: inline-block;
            vertical-align:top;
            width: 7*2rem;
            height: $fifteenWeather_group_height;
            border-left: 0.025*2rem solid rgba(255,255,255,0.2);
            border-right: 0.025*2rem solid rgba(255,255,255,0.2);
            &_week{
                position: absolute;
                width: 100%;
                height: 0.8*2rem;
                font-size: 0.8*2rem;
                text-align: center;
                top: 0.5*2rem;
            }
            &_date{
                position: absolute;
                width: 100%;
                height: 0.7*2rem;
                font-size: 0.8*2rem;
                text-align: center;
                top: 1.8*2rem;
            }
            &_condition{
                position: absolute;
                width: 100%;
                height: 0.7*2rem;
                font-size: 0.8*2rem;
                text-align: center;
                top: 3*2rem;
            }
            &_img{
                position: absolute;
                width: 1.5*2rem;
                height: 1.5*2rem;
                left: calc(50% - 0.75*2rem);
                top: 4.9*2rem;
            }
            &_tempScope{
                position: absolute;
                width: 100%;
                height: 1*2rem;
                font-size: 1*2rem;
                text-align: center;
                top: 7*2rem;
            }
            &_wind{
                position: absolute;
                width: 100%;
                height: 0.8*2rem;
                font-size: 0.8*2rem;
                text-align: center;
                top: 9.2*2rem;
            }
            &_hum{
                position: absolute;
                width: 4*2rem;
                height: 1*2rem;
                font-size: 0.8*2rem;
                text-align: center;
                top: 10.3*2rem;
                border-radius: 0.55*2rem;
                line-height: 1*2rem;
                left: calc(50% - 2*2rem);
            }
        }
    }
    .weatherGroup_three{
        position: relative;
        width: 100%;
        height: 15*2rem;
        margin-top: 1.3*2rem;
        margin-bottom: 1.3*2rem;
        .liveWeather{
            position: absolute;
            width: 59*2rem;
            height: 15*2rem;
            border-radius: 1*2rem;
            left: calc(50% - 29.5*2rem);
            overflow: hidden;
           // background-color: #4B4D56;
            ul{
                position: absolute;
                width: 100%;
                height: 10.8*2rem;
                top: 2.1*2rem;
                .live_item{
                    position: relative;
                    width: 8.4*2rem;
                    height: 10.8*2rem;
                    box-sizing:border-box;
                    border-left: 0.05*2rem solid rgba(255,255,255,0.2);
                    border-right: 0.05*2rem solid rgba(255,255,255,0.2);
                    float: left;
                }
                .live_item_img{
                    position: absolute;
                    width: 3*2rem;
                    height: 3*2rem;
                    top: 1.75*2rem;
                    left: calc(50% - 1.5*2rem);
                }
                .live_item_statue{
                    position: absolute;
                    width: 100%;
                    height: 1*2rem;
                    font-size: 1*2rem;
                    line-height: 1*2rem;
                    color: white;
                    top: 6.35*2rem;
                    text-align: center;
                }
                .live_item_title{
                    position: absolute;
                    width: 100%;
                    height: 0.8*2rem;
                    font-size: 0.8*2rem;
                    line-height: 0.8*2rem;
                    color: white;
                    top: 8.3*2rem;
                    text-align: center;
                }
            }
        }
    }
}

</style>