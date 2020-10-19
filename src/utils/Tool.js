/**
 * 接口
 */
import store from '../store'
import SmartPadSDK from './SmartPadSDK'
import Bridge from '../config/JSbridge.js'


const Tool = {
    /**获取用户信息 */
    getUserId(func) {
        let request = {
            'platform': '1',
            'api': 'appUser/getAppUser',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {

        }
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
    getListBindingByAccount(userId, pageNo, pageSize, appKey, func) {
        let request = {
            'platform': '1',
            'api': 'appUser/listBindingByAccount',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            'userId': userId,
            'pageNo': pageNo,
            'pageSize': pageSize,
            'appKey': appKey,
        }
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
    /**获取家信息 */
    getHomeInfo(func) {
        let request = {
            'platform': '1',
            'api': 'appHome/getHomeInfo',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
        }
        SmartPadSDK.getServerData(request, params, (res) => {
            if (JSON.parse(res).code === 200) {
                let _homeInfo = JSON.parse(res).data
                store.dispatch('changeDate', {
                    homeInfo: _homeInfo,
                });
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
    /**设置设备属性*/
    setDeviceProperties(iotId, items, func) {
        let timeOut = false
        let request = {
            'platform': '1',
            'api': 'appDevice/setDeviceProperties',
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
        SmartPadSDK.getServerData(request, params, (res) => {
            timeOut = true
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
            }

        })
        /**三十秒超时处理 */
        setTimeout(()=>{
            if(timeOut == false){
                this.show_toast("设置超时，请重试")
            }
        },30000)

    },
    /** 获取设备属性 */
    getDeviceProperties(iotId, func) {
        let request = {
            'platform': '1',
            'api': 'appDevice/getDeviceProperties',
            'Content-Type': 'application/json',
            'needAuth': 'true'
        }
        let params = {
            "request": {
                "platform": "1"
            },
            "params": {
                "iotId": iotId
            }
        }
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.getServerData(request, params, (res) => {
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
        SmartPadSDK.listSupportServer(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.getNativePage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.getNativePage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.getNativePage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
            }
        })
    },
    get_aboutAppPage(func){
        let request = {
            "router":"/honyar/AboutActivity"
        }
        let params = {
        }
        SmartPadSDK.getNativePage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.getLocationInfo(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.nativeStorage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.nativeStorage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.nativeStorage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.nativeStorage(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.getInternetData(request, params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
            }
        })
    },
    /**
     * 
     * @param {*} title 弹窗标题
     * @param {*} messageType 	“warn”,”success”,”error”三种类型对应三种样式弹窗
     * @param {*} message 弹窗信息内容
     * @param {*} cancelButtonName 取消按钮名称
     * @param {*} confirmButtonName 	确认按钮名称
     * @param {*} func 回调
     */
    show_alert(title, messageType, message, cancelButtonName, confirmButtonName, func) {
        let params = {
            "title": title,
            "messageType": messageType,
            "message": message,
            "cancelButtonName": cancelButtonName,
            "confirmButtonName": confirmButtonName
        }
        SmartPadSDK.showDialog(params, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                // console.log("func_undefined")
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
        SmartPadSDK.showToast({ "message": message }, (res) => {
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
        SmartPadSDK.showToast({ "signalType": "titleBar"},{"needShow":false}, (res) => {
            if (func !== undefined) {
                func(res)
            } else {
                console.error(); ("func_undefined")
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

export default Tool