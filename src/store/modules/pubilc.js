export default {
    state:{
        attribute:{
            scene_data:{},//场景信息
            user_info:{},//用户信息
            homeInfo:{},//家信息
            user_all_dev:{},//用户下所有的设备
            user_dev_group:{},//用户下的设备分组
            now_group_dev:[],//当前常用组下的设备列表
            suballData: {},//主动上报的数据
            nativeSignalData: {},//app nativeSignalData
            scene_Log:[],//场景日志
            message_Log:[],//消息日志
            dev_Log:[],//设备日志
            theme_img:"",
            short_weather:{},//短时天气
        },
         /**需要分按钮的属性 */
         switch_config:{
            "PowerBtn":["PowerSwitch","PowerSwitch_1","PowerSwitch_2","PowerSwitch_3","PowerSwitch_4","SocketSwitch_1","SocketSwitch_2","SocketSwitch_3","SocketSwitch_4","LightSwitch"],
            "Temperature":["CurrentTemperature","TargetTemperature"]
        },
        /**需要隐藏的设备按品类分 */
        device_config:{
            "delCategoryKey":['SensorSignalCollector','DoorContact','GasDetector','WaterDetector','Siren','AlarmSwitch','SmokeAlarm','IRDetector','GeneralGateway','BackgroundMusicController']
        },
        /**需要隐藏的设备按pk分 */
        device_pk_kill:{
            "devicePK":['hy4n6bKG3gz','a1PBERiUwmX']
        }
        
    },//数据容器

    mutations: {
        updateDate(state,payload){
            const { data } = payload;
            const { attribute = {} } = data;
            state.attribute = Object.assign({},state.attribute,attribute)
        },
      
        UPDATE_SUBALLEVENT(state, data) {
            state.attribute.suballData = data
          },
        UPDATE_NATIVESIGNAL(state, data) {
          state.attribute.nativeSignalData = data
        }
    },
    actions : {
        changeDate({commit},value){
            commit('updateDate',{ data: {
                attribute: value
            }})
        },
        updateEvent({commit}, data) {
            commit('UPDATE_SUBALLEVENT', data)
        },
        updateNativeSignal({commit}, data) {
            commit('UPDATE_NATIVESIGNAL', data)
        }
    },
    // getters : {
    //     suballData: state => state.attribute.suballData,
    //     nativeSignalData: state => state.attribute.nativeSignalData
    // }
}