/**
 * 接口
 */
import store from '../store'
import HonYarSmartSDK from './HonYarSmartSDK'
import Bridge from '../config/JSbridge.js'


const WebAPI = {
    /**
     * 提交意见
     * @param {*} tel 用户联系方式
     * @param {*} message 用户反馈内容
     * @param {*} userId 用户的userId
     */
    submit_feedback(tel,message,userId,func){
        let request = {
            "platform": "1",
            "url": "",
            "api": "/help/feedback",
            "Content-Type": "multipart/form-data",
            "needAuth": "true"
        }
        let params = {
            "contacts": tel,
            "content": message,
            "userId": userId
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //提示
                console.warn(res)
            }
        })
    },
    /**获取用户信息*/
    getUserInfo(UserId,func,platform,apiVersion) {
        let request = {
            "platform": platform === undefined ? "1" : platform,
            "apiVersion": apiVersion === undefined ? "1.0" : apiVersion,
            "url": "",
            "api": "/appUser/getAppUser",
            "Content-Type": "application/json",
            "needAuth": "true"
        }
        let param = {
            "userId": UserId
        }
        HonYarSmartSDK.getServerData(request, param, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    getServer(api, params, func, platform,apiVersion) {
        let request = {
            "platform": platform === undefined ? "1" : platform,
            "apiVersion": apiVersion === undefined ? "1.0" : apiVersion,
            "url": "",
            "api": api,
            "Content-Type": "application/json",
            "needAuth": "true"
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
                this.show_toast(res)
            }
        })
    },
    /**获取设备分组列表 */
    getListGroup(userId, func) {
        let request = {
            'platform': '1',
            'api': 'appUser/listGroup',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            'userId': userId
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    /**获取分组内设备列表 */
    getListGroup_Device(groupId, func) {
        let request = {
            'platform': '1',
            'api': 'appUser/listIotIdByGroup',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            'groupId': groupId
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    /**获取用户绑定的设备列表 */
    getListBindingByAccount(userId, pageNo, pageSize, func) {
        let request = {
            'platform': '1',
            'api': '/appUser/listBindingByAccount',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            'userId': userId,
            'pageNo': pageNo,
            'pageSize': pageSize,
        //    'appKey': appKey,
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    /**
     * 获取当前设备下的子设备
     * @param {*} userId 用户userId
     * @param {*} iotId 设备IotId
     * @param {*} parentProductKey 当前设备的parentProductKey
     * @param {*} platform 平台代码
     */
    getListSubDevice(userId,iotId,parentProductKey,platform){
        let request = {
            'platform': platform === undefined ? "1" : platform,
            'api': '/appUser/listSubDevices',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "userId": userId,
            "pageNo": 1,
            "pageSize": 1000,
            "parentIotId": iotId,
            "parentProductKey": parentProductKey
        }
        return new Promise((resolve,reject)=>{
            HonYarSmartSDK.getServerData(request, params, (res) => {
                if(JSON.parse(res).code === 200){
                    resolve(res)
                }else{
                    reject(res)
                }
            })
        })
    },
    /**根据设备获取用户绑定关系 */
    getlistBindingByDev(iotId,func){
        let request = {
            'platform': '1',
            'api': '/appUser/listBindingByDev',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "iotId":iotId,
            "pageNo":0,
            "pageSize":1000
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    /**消息查询 */
    getMessages(homeId, userId, func) {
        let request = {
            'platform': '1',
            'api': 'appMsgCenter/queryScene',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "homeId": homeId,
            "pageNo": 1,
            "pageSize": 1000,
            "sceneId": ''
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    /**
     * 
     * @param {*} api 服务端路径
     * @param {*} params 参数
     * @param {*} func 回调
     * @param {*} platform 平台代码
     * @param {*} apiVersion api版本
     */
    getHomeInfo(api,params,func,platform,apiVersion) {
        let request = {
            "platform": platform === undefined ? "1" : platform,
            "apiVersion": apiVersion === undefined ? "1.0" : apiVersion,
            "url": "",
            "api": api,
            "Content-Type": "application/json",
            "needAuth": "true"
        }
        let param = params
        HonYarSmartSDK.getServerData(request, param, (res) => {
            if (JSON.parse(res).code === 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    /**获取场景列表 */
    getSceneList(func) {
        let request = {
            'platform': '1',
            'api': 'appScene/listScene',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "pageNo": 1,
            "pageSize": 1000,
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    /**触发场景 */
    setScene(sceneId, func) {
        let request = {
            'platform': '1',
            'api': 'appScene/fire',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "sceneId": sceneId
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
            }
        })
    },
    /**获取场景日志 */
    getAppSceneLog(func) {
        let request = {
            'platform': '1',
            'api': 'appScene/log',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "pageNo": 1,
            "pageSize": 10000,
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                //弹错
                console.error(res)
            }
        })
    },
    /**获取消息日志 */
    getAppMsgCenterQueryScene(homeId, func) {
        let request = {
            'platform': '1',
            'api': 'appMsgCenter/queryScene',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            request: {},
            params: {
                "homeId": homeId,
                "pageNo": 1,
                "pageSize": 10000,
            }
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            // console.log('消息',res)
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                console.error(res)
            }
        })
    },
    /**获取设备日志 */
    getDevLog(userId, func) {
        let request = {
            'platform': '1',
            'api': 'appMsgCenter/query',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            'userId': userId,
            "pageNo": 1,
            "pageSize": 10000,
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            }
            else {
                console.error(res)
            }
        })
    },
    /**获取设备信息 */
    getDeviceInfo( userId,platform,iotId,func){
        let params = {
            "request": {
                "userId": userId,
                "platform": platform
            },
            "params": {
                "iotId": iotId
            }
        }
        HonYarSmartSDK.getDeviceInfo( params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
            }
        })
    },
/**
 * 设置设备属性
 * @param {*} iotId 
 * @param {*} items 
 * @param {*} platform 
 * @param {*} apiVersion 
 */
    setDeviceProperties(iotId, items,platform,apiVersion) {
        return new Promise((resolve, reject) => {
            let timeOut = false
            if(iotId.length > 0 ){
            }else{
                reject("服务端数据获取中,请稍后再试")
            }
            let request = {
                'platform': platform === undefined ? "1" : platform,
                "apiVersion": apiVersion === undefined ? "1.0" : apiVersion,
                "url": "",
                'api': '/appDevice/setDeviceProperties',
                'Content-Type': 'application/json',
                'needAuth': 'true'
            }
            let params = {
                "request": {
                    "platform": '1'
                },
                "params": {
                    "iotId": iotId,
                    "items": items
                }
            }
            HonYarSmartSDK.getServerData(request, params, (res) => {
                timeOut = true
                if(JSON.parse(res).code === 200){
                    resolve(res)
                }else{
                    reject(res)
                }
                
            })
            /**10s of timeout */
            setTimeout(()=>{
                if(timeOut == false){
                    reject("请求返回超时")
                }
            },10000)
        })
    },
    /** 请求阿里服务 */
    getAliServerData(path,params,func){
        let requestMessage = {
            "request": {
                "path": path,
                "needAuth": "true"
            },
            "params": params
        };
        HonYarSmartSDK.getAliServerData( requestMessage, (res) => {
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                console.error(res)
            }
        })
    },
    /** 获取设备属性 */
    getDeviceProperties(platform,iotId, func) {
        this.getServer("/appDevice/getDeviceProperties",{
            "request": {
                "platform": platform
            },
            "params": {
                "iotId": iotId
            }
            },  (res) => {
                if (func !== undefined) {
                    func(res)
                }
            })
    },
    /**
     * 获取设备子属性
     * @param {*} iotId 
     */
    getDeviceChildPrpps(iotId){
        return new Promise((resole,reject)=>{
            this.getServer("/appUserIot/getIotPropByiotId",{
                "iotId": iotId
            },  (res) => {
                resole(res)
            })
        })
        
    },
    /** 获取短时天气属性 */
    getShortWeather(lng, lat, func) {
        let request = {
            'platform': '1',
            'api': 'appWeather/getCondition',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "lng": lng,
            "lat": lat
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            console.log("短时天气",res)
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                console.error(res)
            }
        })
    },
    /** 获取24时天气属性 */
    getOnedayWeather(lng, lat, func) {
        let request = {
            'platform': '1',
            'api': 'appWeather/get24Hours',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "lng": lng,
            "lat": lat
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                console.error(res)
            }
        })
    },
    /**
    * 获取15日天气属性
    * @param {*} lng 经度
    * @param {*} lat 纬度
    * @param {*} func 回调函数
    */
    getFifteenWeather(lng, lat, func) {
        let request = {
            'platform': '1',
            'api': 'appWeather/get15Days',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "lng": lng,
            "lat": lat
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                console.error(res)
            }
        })
    },

    /**
     * 获取生活指数属性
     * @param {*} lng 经度
     * @param {*} lat 纬度
     * @param {*} func 回调函数
     */
    getLifeWeather(lng, lat, func) {
        let request = {
            'platform': '1',
            'api': 'appWeather/index',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "lng": lng,
            "lat": lat
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                console.error(res)
            }
        })
    },
    getWeatherAQI(lng, lat, func) {

        let request = {
            'platform': '1',
            'api': 'appWeather/getAqi',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "lng": lng,
            "lat": lat
        }
        HonYarSmartSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code == 200) {
                if (func !== undefined) {
                    func(res)
                } else {
                    // console.log("func_undefined")
                }
            } else {
                console.error(res)
            }
        })
    },

    /**
     * 请求京希接口
     * @param {*} func  回调函数
     */
    request_jingxi(func) {
        let request = {
        }
        let params = {

        }
        HonYarSmartSDK.listSupportServer(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 账号设置页面
     * @param {*} func 回调函数
     */
    getAccountSettings(func) {
        let request = {
            "router": "/honyar/AccountManagerActivity"
        }
        let params = {

        }
        HonYarSmartSDK.getNativePage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 调用对讲页面
     * @param {*} func 回调函数
     */
    getIntercomSystem(func) {
        let request = {
            "router": "/jingXi/JXMainActivity"
        }
        let params = {
        }
        HonYarSmartSDK.getNativePage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 调用调试页面
     * @param {*} func 
     */
    get_debugPage(func){
        let request = {
            "router":"/honyar/DebugActivity"
        }
        let params = {
        }
        HonYarSmartSDK.getNativePage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    get_aboutAppPage(func){
        let request = {
            "router":"/honyar/AboutActivity"
        }
        let params = {
        }
        HonYarSmartSDK.getNativePage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 获取经纬度
     * @param {*} func 回调函数
     */
    getLon_lat(func) {
        let request = {

        }
        let params = {

        }
        HonYarSmartSDK.getLocationInfo(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 查询数据库
     * @param {*} action select
     * @param {*} key 
     * @param {*} func 
     */
    query_sql(key, func) {
        let request = {
            "storageType": "lightData",
            "operationType": "select"
        }
        let params = {
            "key": key
        }
        HonYarSmartSDK.nativeStorage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 删除数据库
     * @param {*} action delete
     * @param {*} key 
     * @param {*} func 
     */
    del_sql(key, func) {
        let request = {
            "storageType": "lightData",
            "operationType": 'delete'
        }
        let params = {
            "key": key
        }
        HonYarSmartSDK.nativeStorage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 增加数据库
     * @param {*} action insert
     * @param {*} key "web_"+key
     * @param {*} value 
     * @param {*} func 
     */
    add_sql(key, value, func) {
        let request = {
            "storageType": "lightData",
            "operationType": "insert"
        }
        let params = {
            "key": key,
            "value": value
        }
        HonYarSmartSDK.nativeStorage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 修改数据库
     * @param {*} action update
     * @param {*} key 
     * @param {*} value 
     * @param {*} func 
     */
    change_sql(key, value, func) {
        let request = {
            "storageType": "lightData",
            "operationType": 'update'
        }
        let params = {
            "key": key,
            "value": value
        }
        HonYarSmartSDK.nativeStorage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 
     * @param {*} action 
     * @param {*} url 
     * @param {*} func 
     */
    get_News(action, url, func) {
        let request = {
            "method": action,
            "url": url
        }
        let params = {

        }
        HonYarSmartSDK.getInternetData(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
    * 
    * @param {*} cancel 取消
    * @param {*} title 标题
    * @param {*} message 内容
    * @param {*} cancelButtonName 取消按键名
    * @param {*} confirmButtonName 确认按键名
    * @param {*} func 回调函数
    */
    show_alert(cancel, title,messageType, message,cancelButtonName,confirmButtonName, func) {
        var params = {
            "title": title,
            "messageType": messageType,
            "message": message,
            "confirmButtonName": confirmButtonName
        };
        if (cancel) {
            params.mainKey = ["title", "messageType", "message", "cancelButtonName", "confirmButtonName"];
            params.cancelButtonName = cancelButtonName;
        } else {
            params.mainKey = ["title", "messageType", "message", "confirmButtonName"];
        }
        HonYarSmartSDK.showDialog(params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined")
            }
        })
    },
    /**
     * 
     * @param {*} message 错误消息
     * @param {*} func 回调
     * 
     */
    show_toast(message, func) {
        HonYarSmartSDK.showToast({ "message": message }, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined"); 
            }
        })
    },
    /**
     * 加载框
     * @param {*} message 加载提示
     * @param {*} func 回调函数
     */
    show_Loading(message, func) {
        HonYarSmartSDK.showLoading({
            "message": message
        }, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined");
            }
        })
    },
    /**
     * 停止加载框
     * @param {*} func 
     */
    stop_Loading(func){
        HonYarSmartSDK.showLoading({},(res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.warn("func_undefined");
            }
        })
    },
    /**
     * 关闭APP当前页面
     */
    finishActivity(){
        HonYarSmartSDK.finishActivity({},(res) => {
            return new Promise((resolve,reject)=>{
                resolve(res)
            })
        })
    },
    /**
     * 
     * @param {*} title 弹窗标题
     * @param {*} message 弹窗信息内容
     * @param {*} inputHint 输入提醒
     * @param {*} cancelButtonName 取消按钮名称
     * @param {*} confirmButtonName 确认按钮名称
     * @param {*} func 回调函数
     */
    showInputDialog(title,message,inputHint,func){
        let params = {
            "title": title,
            "message": message,
            "inputHint": inputHint,
            "cancelButtonName": "取消",
            "confirmButtonName": "确认"
        }
        HonYarSmartSDK.showInputDialog(params,(res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.error(); ("func_undefined")
            }
        })
    },
    /**
     * 隐藏标题栏
     * @param {*} func 
     */
    hide_header(func) {
        HonYarSmartSDK.nativeSignal({ "signalType": "titleBar"},{"needShow":false}, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.error("func_undefined"); 
            }
        })
    },
    
    /**
     * 获取当前时间
     */
    getTime() {
        let date = new Date();
        let year = date.getFullYear();
        let mon = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        mon < 10 ? mon = '0' + mon : mon = '' + mon;
        day < 10 ? day = '0' + day : day = '' + day;
        hour < 10 ? hour = '0' + hour : hour = '' + hour;
        min < 10 ? min = '0' + min : min = '' + min;
        sec < 10 ? sec = '0' + sec : sec = '' + sec;
        let obj = {};
        let week = date.getDay();
        let _week = "";
        switch (week) {
            case 0:
                _week = '周日'
                break;
            case 1:
                _week = '周一'
                break;
            case 2:
                _week = '周二'
                break;
            case 3:
                _week = '周三'
                break;
            case 4:
                _week = '周四'
                break;
            case 5:
                _week = '周五'
                break;
            case 6:
                _week = '周六'
                break;
        }
        obj['year'] = year;
        obj['mon'] = mon;
        obj['day'] = day;
        obj['hour'] = hour;
        obj['min'] = min;
        obj['sec'] = sec;
        obj['week'] = _week;
        return obj
    },
    /**
     * 判断返回code是否为200
     * @param {*} res 传入参数
     */
    judge_code(res) {
        //判断当前传进来的值为string还是object
        switch (this.transition_resq(res).code) {
            case 200:
                return true
            default:
                return false
        }
    },
    /**
     * 将字符串类型的回调转换成json
     */
    transition_resq(res) {
        switch (typeof res) {
            case "string":
                return JSON.parse(res)
            case "object":
                return res
            default:
                console.error("传入参数不合法！")
                break;
        }
    },
    /**
     * 请求下发超出30秒提示请求超时
     * @param {*} func 
     */
    request_timeout(func) {
        setTimeout(()=>{
            func(-1)
        },30000)
    }


}

export default WebAPI