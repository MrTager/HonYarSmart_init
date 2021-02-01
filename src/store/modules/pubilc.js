export default {
    state:{
        attribute:{
            now_use_App:"",
            appKey:"24897122",//正式版：24897122 测试版:24896341
            apppassword:"2489693724897122",//正式版：2489693724897122 测试版:2489674024896341
            user_info:{},//用户信息
            homeInfo:{},//家信息
            deviceInfo:{},//设备信息
            bindingDevList:{},//绑定的设备列表
            devBindingUserList:{},//此设备的用户绑定关系列表
            deviceProps:{},//设备的全部子属性
        },
        /**需要隐藏的设备按品类分 */
        device_config:{
            "delCategoryKey":['aaaaaa']
        },
        /**需要隐藏的设备按pk分 */
        device_pk_kill:{
            "devicePK":['aaaaaa']
        }
    },//数据容器
    mutations: {
        UPDATEDATA(state,payload){
            const { data } = payload;
            const { attribute = {} } = data;
            state.attribute = Object.assign({},state.attribute,attribute);
        },
        UPDATEPROP(state,payload){
            state.attribute.deviceProps = Object.assign({},state.attribute.deviceProps,payload);
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
            commit('UPDATEDATA',{ data: {
                attribute: value
            }})
        },
        changeProp({commit},value){
            return new Promise((resolve,reject)=>{
                commit('UPDATEPROP',value)
                resolve()
            })
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