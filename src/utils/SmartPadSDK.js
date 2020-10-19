/**
 * 接口请求集合类
 */
import Bridge from '../config/JSbridge.js'

class SmartPadSDK {
  /**请求平台服务*/
  static getServerData(request, params, callback) {
    var msg = {
      'request': request,
      'params': params
    }
  //  console.log('下发',JSON.stringify(msg))
    Bridge.callHandler('getServerData', msg, (res) => {
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
    var msg = {
      params
    }
    Bridge.callHandler('showDialog', msg, (res) => {
      callback(res)
    })
  }
  
  static showToast( params, callback) {

    Bridge.callHandler('showToast', params, (res) => {
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

}


export default SmartPadSDK
