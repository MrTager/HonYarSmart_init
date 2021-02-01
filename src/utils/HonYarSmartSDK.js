/**
 * 接口请求集合类
 */
import Bridge from '../config/JSbridge.js'
//import Bridge from './webJsBridge'

class HonYarSmartSDK {
  /**请求平台服务*/
  static getServerData(request, params, callback) {
    var msg = {
      'request': request,
      'params': params
    }
   
    Bridge.callHandler('getServerData', msg, (res) => {
      callback(res)
    })
  }
  /**
   * 请求阿里服务
   */
  static getAliServerData( params,callback){
    Bridge.callHandler('getAliServerData', params, (res) => {
      callback(res)
    })
  }
  static getNativePage(request, params, callback) {
    var msg = {
      'request': request,
      'params': params
    }
    //console.log('下发',JSON.stringify(msg))
    Bridge.callHandler('getNativePage', msg, (res) => {
      callback(res)
    })
  }
  static listSupportServer(request, params, callback) {
    var msg = {
      'request': request,
      'params': params
    }
    Bridge.callHandler('listSupportServer', msg, (res) => {
      callback(res)
    })
  }
  static getLocationInfo(request, params, callback) {
    var msg = {
      'request': request,
      'params': params
    }
    Bridge.callHandler('getLocationInfo', msg, (res) => {
      callback(res)
    })
  }

  static nativeStorage(request, params, callback) {
    var msg = {
      'request': request,
      'params': params
    }
    Bridge.callHandler('nativeStorage', msg, (res) => {
      callback(res)
    })
  }
  static getInternetData(request, params, callback) {
    var msg = {
      'request': request,
      'params': params
    }
    Bridge.callHandler('getInternetData', msg, (res) => {
      callback(res)
    })
  }
  
  static showDialog( params, callback) {
    Bridge.callHandler('showDialog', params, (res) => {
      callback(res)
    })
  }
  
  static showToast( params, callback) {
    Bridge.callHandler('showToast', params, (res) => {
      callback(res)
    })
  }

  static showLoading( params, callback) {
    Bridge.callHandler('showLoading', params, (res) => {
      callback(res)
    })
  }
  
  static nativeSignal( request,params, callback){
    var msg = {
      'request':request,
      'params':params
    }
    Bridge.callHandler('nativeSignal', msg, (res) => {
      callback(res)
    })
  }
  /**退出H5 */
  static finishActivity( params, callback){
    Bridge.callHandler('finishActivity', params, (res) => {
      callback(res)
    })
  }
  /**调用原生输入框 */
  static showInputDialog( params, callback){
    Bridge.callHandler('showInputDialog', params, (res) => {
      callback(res)
    })
  }
  /**
   *获取设备信息
   */
  static getDeviceInfo( params,callback){
    
    Bridge.callHandler('getDeviceInfo', params, (res) => {
      callback(res)
    })
  }

}


export default HonYarSmartSDK
