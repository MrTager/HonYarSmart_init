//
//  NativeJsBridge
//
//  Version: V1.0.0
//
//  Copyright (c) 2018年 HonYar. All rights reserved.
//
//****************************************************************************//
/**
 1. General Conventions:
 interactive data format: json string.

 ① js -> native: the request json data structure
 {
 "platform": 0,          // 云平台，0-阿里iLop，1-... (根据需求自定，不传默认为0)
 "url": "/test/get.do",  // 仅透传接口有效，请求的url地址(不包含Host部分)
 "apiVer": "1.0.0",      // 仅透传接口有效，API版本
 "isAuth": 0,            // 仅透传接口有效，标识该接口是否需要身份认证，0-不需要，1-需要
 "params": {             // 仅透传接口有效，接口请求附加参数
 ......              // 参数区，<根据实际接入平台、设备而定，请查看相关文档>
 },
 "datas": {              // 接口请求Body内容
 ......              // 数据区，<根据实际接入平台、设备而定，请查看相关文档>
 }
 }

 ② native -> js: the response json data structure
 {
 "errCode": 0,           // 接口请求返回的错误码
 “errDesc": "",          // errCode非0时的错误描述(不一定有)
 "data": {               // 接口请求返回的数据内容，errCode非0时data可能为空或不存在
 ......              // 请求返回内容，<根据实际接入平台、设备而定，请查看相关文档>
 }
 }

 ③ the message subscribe returned json data structure:
 {
 "topic": "message topic",   // 消息主题
 "data": {                   // 消息订阅返回的数据内容
 ......                  // 上报内容，<根据实际接入平台、设备而定，请查看相关文档>
 }
 }

 2. Native call javascript method:
 (you need to implement the following method in javascript where you are using it.)
 ① procUploadData (resData)             // 数据上报接口，resData格式见上面 1.3 小节
 ② procNativeData (resData)             // Native到Web的透传接口 (resData格式根据实际业务需求协商定义)

 3. javascript method call demo:
 ① 状态提示
 bridge.showMessage("{\"type\": \"...\", \"mesg\":\"...\"}");   // 显示提示框
 ......
 bridge.showMessage();   // 隐藏提示框，(非 status 类型不需要主动调用此方法进行隐藏)

 ② 透传接口 <接口第一个参数按实际接入平台、设备而定，请查看相关文档>
 bridge.sendToNative({...}, function(response){
 ......  // response 结构见 1.2 小节
 });

 */
//****************************************************************************//

function connectWebViewJavascriptBridge(callback) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

    // Android
    if (isAndroid) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener(
                "WebViewJavascriptBridgeReady",
                function () {
                    callback(WebViewJavascriptBridge);
                },
                false
            );
        }
    }

    // iOS
    if (isiOS) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }

        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }

        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement("iframe");
        WVJBIframe.style.display = "none";
        WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
}

// 调试log信息输出控制
// 0x00-disable, 0x1X-native, 0x2X-web
// 0xX1-error, 0xX2-warn, 0xX4-debug, 0xX8-info, 0xXF-all
var wvjbEnableNativeLog = "0x00";

var wbjsBridge = wbjsBridge || {};
(function (wbjsBridge) {
    if (wbjsBridge.method) {
        console.warn("wbjsBridge.method is already defined.");
        return;
    }

    wbjsBridge.method = wbjsBridge.method || {};
    connectWebViewJavascriptBridge(function (bridge) {
        /**
         * 数据上报接口
         *
         */
        bridge.registerHandler("uploadData", function (data, responseCallback) {
            if (typeof procUploadData == "function") {
                console.info("uploadData got response: ", data);
                procUploadData(data);
                responseCallback('{"errCode": 0}');
            } else {
                // 不存在或不是function
                console.error("procUploadData function not found.");
                responseCallback('{"errCode": -1}');
            }
        });

        /**
         * app to web 数据透传接口
         *
         * @param   data    从App发送来的数据
         *
         * {
         *      "cmd":"203",
         *      "data":{
         *           "iotId":"o3GLBs1EEyoMaQqlvtQo0010342100",
         *           "groupIdList":[],"groupId":"",
         *            "tenantId":"AE5232AB19DA42E6A345DD679D8E386A",
         *           "thingType":"DEVICE","batchId":"0204e91f3ad8457984f8dcefcb507df9",
         *           "gmtCreate":1536649645779,
         *            "productKey":"a1EfzYn6XTg",
         *           "deviceName":"000D6F000E88FBEC",
         *           "items":{
         *               "PowerSwitch_2":{
         *                    "time":1536649645778,
         *                     "value":1
         *                  }
         *           }
         *      }
         * }
         *
         */
        bridge.registerHandler("subAllEvent", function (data, responseCallback) {
            test_suball = data;
            // console.info("sendToWeb got response: ", data);
            // proNativeData(data);
            // responseCallback('{"errCode": 0}');
            if (typeof proNativeData == "function") {
                res_flag = true;
                // console.info("sendToWeb got response: ", data);
                proNativeData(data);
                responseCallback('{"errCode": 0}');
            } else {
                res_flag = false;
                //不存在或不是function
                console.error("proNativeData function not found.");
                responseCallback('{"errCode": -1}');
            }
        });

        bridge.registerHandler("nativeSignal", function (data, responseCallback) {
            // console.info("sendToWeb got response: ", data);
            // backRequest(data);
            // responseCallback('{"errCode": 0}');
            if (typeof backRequest == "function") {
                console.info("sendToWeb got response: ", data);
                backRequest(data);
                responseCallback('{"errCode": 0}');
            } else {
                //不存在或不是function
                console.error("backRequest function not found.");
                responseCallback('{"errCode": -1}');
            }
        });
        wbjsBridge.method.bridge = bridge;
    });
})(wbjsBridge);

//****************************************************************************//
//                                  工具类接口
//****************************************************************************//
/**
 * 从 H5 返回 Native
 *
 * @note
 *     一般在 H5 页面全屏带导航栏时使用.
 */
wbjsBridge.method.returnBack = function () {
    wbjsBridge.method.bridge.callHandler("returnBack", "", function (response) {
        console.info("returnBack got response: ", response);
    });
};

/**
 * 显示 Toast 提示框
 *
 * @param   msgString   提示内容
 */

wbjsBridge.method.showLoading = function (msgString, funcCallback) {
    wbjsBridge.method.bridge.callHandler("showLoading", msgString, function (response) {
        // console.info("showLoading got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

/**
 * 加载插件
 *
 * @param   param   加载插件参数
 * {
 *     "pluginKey": "插件key",
 *     "pluginPackage": "风格key"
 * }
 *
 */
wbjsBridge.method.loadPlugin = function (param, funcCallback) {
    wbjsBridge.method.bridge.callHandler("loadPlugin", param, function (response) {
        console.info("loadPlugin got response", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};


/**
 * 显示 Message 提示框
 *
 * @param   param   显示的内容
 * {
 *     "type": "提示框类型", // status | warn | info | success | error
 *     "mesg": "提示内容"
 * }
 *
 * 注: status类型的提示框需要再次调用该接口(param不传或传{})来取消显示
 */
wbjsBridge.method.showMessage = function (param) {
    wbjsBridge.method.bridge.callHandler("showMessage", param, function (response) {
        console.info("showMessage got response", response);
    });
};

/**
 * 显示 Progress 进度框
 *
 * @param   param    进度+提示内容
 * {
 *     "vale": "进度Value", // 范围: 0~100
 *     "mesg": "提示内容"
 * }
 *
 * 注: 需要再次调用该接口(param不传或传{})来取消显示
 */
wbjsBridge.method.showProgress = function (param) {
    wbjsBridge.method.bridge.callHandler("showProgress", param, function (response) {
        console.info("showProgress got response", response);
    });
};

//****************************************************************************//
//                                通用数据透传接口
//****************************************************************************//
/**
 * 数据透传接口
 *
 * @param   params  发送给Native端的数据
 *                  (按 1.1 小节结构根据实际需求传递参数)
 *             {
 *              "cmd":"201",    //进入定时任务
 *              "data":{
 *                  "iotId":"xxxx"
 *                  }
 *              }
 *
 *              {
 *              "cmd":"202",    //修改开关位名称
 *              "data":{
 *                  "iotId":"xxxx"，
 *                  "id":"xxxxxxxx"
 *                  }
 *              }
 *
 *              {
 *              "cmd":"102",    //获取所有开关位名称
 *              "data":{
 *                  "iotId":"xxxx"
 *                  }
 *              }
 *
 * @param   funcCallback    回调函数
 * {
 *      "errCode": 0,           // 请求返回的错误码
 *      "data": {               // 请求返回的数据内容，errCode非0时data可能为空或不存在
 *          ......
 *      }
 *  }
 *  {
 *      "cmd":"102",           // 请求返回的错误码
 *      "data": {               // 请求返回的数据内容，errCode非0时data可能为空或不存在
 *          "data":[{
 *               "identifier": "PowerSwitch_3",
 *               "specs": "{\"0\":\"关闭\",\"1\":\"开启\"}",
 *               "name": "开关3",
 *               "id": "6cf00e07bdd84a839893f8666ee63287",
 *               "type": "bool"
 *           },
 *           {
 *               "identifier": "PowerSwitch_1",
 *               "specs": "{\"0\":\"关闭\",\"1\":\"开启\"}",
 *               "name": "开关1",
 *               "id": "8204b0489ddb4d39a32b39e0be30ef12",
 *               "type": "bool"
 *           },
 *           {
 *               "identifier": "PowerSwitch_2",
 *               "specs": "{\"0\":\"关闭\",\"1\":\"开启\"}",
 *               "name": "开关2",
 *               "id": "cb551607d13f4fff9782fbc4c86260e5",
 *               "type": "bool"
 *           }]
 *      }
 *  }
 */
wbjsBridge.method.sendToNative = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("sendToNative", params, function (response) {
        console.info("sendToNative got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

//****************************************************************************//
//                                  设备相关接口
//****************************************************************************//
/**
 * 获取设备信息
 *
 * @param   funcCallback    回调函数
 * {
 *      "errCode": 0,           // 请求返回的错误码
 *      "data": {               // 请求返回的数据内容，errCode非0时data可能为空或不存在
 *          "nickName":"",
 *          "categoryImage":"",//产品图片地址
 *          "status":"",//在线状态
 *          "productKey":"",
 *          "productName":"",
 *          "iotId":""
 *      }
 *  }
 */
wbjsBridge.method.getDeviceInfo = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getDeviceInfo", params, function (response) {

        console.info("getDeviceInfo got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};
/**
 * 设备状态查询
 *
 * @param   params  查询参数
 *                  (按 1.1 小节结构根据实际需求传递参数)
 *
 * @param   funcCallback    回调函数
 * {
 *      "errCode": 0,           // 请求返回的错误码
 *      "data": {               // 请求返回的数据内容，errCode非0时data可能为空或不存在
 *          ......
 *      }
 *  }
 *
 * {
 *      "errorCode":0,
 *      "data":{
 *          "PowerSwitch_2":{
 *              "time":1536648997577,
 *              "value":0
 *              },
 *          "PowerSwitch_1":{
 *              "time":1536648997039,
 *              "value":1
 *              }
 *          }
 *   }
 */
wbjsBridge.method.getDeviceStatus = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getDeviceStatus", params, function (response) {
        console.info("getDeviceStatus got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

/**
 * 修改设备状态
 *
 * @param   params  设置参数
 *                  (按 1.1 小节结构根据实际需求传递参数)
 *          {
 *              "params":{
 *                  "iotId":"xxx",
 *                  "items":{
 *                      "PowerSwitch":1
 *                      }
 *                  }
 *              }
 *
 * @param   funcCallback    回调函数
 * {
 *      "errCode": 0,           // 请求返回的错误码
 *      "data": {               // 请求返回的数据内容，errCode非0时data可能为空或不存在
 *          ......
 *      }
 *  }
 */
wbjsBridge.method.setDeviceStatus = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("setDeviceStatus", params, function (response) {
        console.info("setDeviceStatus got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};
wbjsBridge.method.setDeviceService = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("setDeviceService", params, function (response) {
        console.info("setDeviceService got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

//新增功能
wbjsBridge.method.debugPing = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("debugPing", params, function (response) {
        console.info("debugPing got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.getProductTsl = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getProductTsl", params, function (response) {
        console.info("getProductTsl got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.getDeviceProperties = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getDeviceProperties", params, function (response) {
        console.info("getDeviceProperties got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.setDeviceProperties = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("setDeviceProperties", params, function (response) {
        console.info("setDeviceProperties got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.invokeDeviceService = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("invokeDeviceService", params, function (response) {
        // console.info("invokeDeviceService got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.getServerData = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getServerData", params, function (response) {
        // console.info("getServerData got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.getAliServerData = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getAliServerData", params, function (response) {
        console.info("getAliServerData got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.getAliPlugService = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getAliPlugService", params, function (response) {
        console.info("getAliPlugService got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.showToast = function (msgString, funcCallback) {
    wbjsBridge.method.bridge.callHandler("showToast", msgString, function (response) {
        console.info("showToast got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.finishActivity = function (funcCallback) {
    wbjsBridge.method.bridge.callHandler("finishActivity", "", function (response) {
        console.info("finishActivity got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.getAppInfo = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getAppInfo", params, function (response) {
        console.info("getAppInfo got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.nativeSignal = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("nativeSignal", params, function (response) {
        // console.info("nativeSignal got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.aliLogOut = function (funcCallback) {
    wbjsBridge.method.bridge.callHandler("aliLogOut", "", function (response) {
        console.info("aliLogOut got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.aliLogIn = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("aliLogIn", params, function (response) {
        console.info("aliLogIn got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};
wbjsBridge.method.showInputDialog = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("showInputDialog", params, function (response) {
        console.info("showInputDialog got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};
wbjsBridge.method.showDialog = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("showDialog", params, function (response) {
        console.info("showInputDialog got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

wbjsBridge.method.nativeStorage = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("nativeStorage", params, function (response) {
        console.info("showInputDialog got response: ", response);

        if (typeof funcCallback == "function") {
            funcCallback(response);
        }
    });
};

//****************************************************************************//

function obj2string(o) {
    var r = [];
    if (typeof o == "string") {
        return (
            '"' +
            o
                .replace(/([\'\"\\])/g, "\\$1")
                .replace(/(\n)/g, "\\n")
                .replace(/(\r)/g, "\\r")
                .replace(/(\t)/g, "\\t") +
            '"'
        );
    }

    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o) {
                r.push(i + ":" + obj2string(o[i]));
            }

            if (
                !!document.all &&
                !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(
                    o.toString
                )
            ) {
                r.push("toString:" + o.toString.toString());
            }

            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(obj2string(o[i]));
            }

            r = "[" + r.join() + "]";
        }

        return r;
    }

    return o.toString();
}

(function (window, undefined) {
    if (0 !== (wvjbEnableNativeLog & 0x1f)) {
        var uniqueId = 1;

        console = new Object();
        console.log = function () {
            var logString = "";
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == "object") {
                    logString += obj2string(arguments[i]);
                } else {
                    logString += arguments[i];
                }
            }

            if (wvjbEnableNativeLog & 0x10) {
                var iframe = document.createElement("IFRAME");
                iframe.setAttribute("src", "wvjblog:#JSBRIDGE#" + logString);
                document.documentElement.appendChild(iframe);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            } else if (wvjbEnableNativeLog & 0x20) {
                var logEle = document.getElementById("log");
                if (logEle) {
                    var el = document.createElement("div");
                    el.className = "logLine";
                    el.innerHTML = "(" + uniqueId++ + "). " + logString + "<br/><hr>";

                    if (logEle.children.length) {
                        logEle.insertBefore(el, logEle.children[0]);
                    } else {
                        logEle.appendChild(el);
                    }
                }
            }
        };

        console.info = function () {
            if (wvjbEnableNativeLog & 0x08) {
                console.log.apply(this, arguments);
            }
        };

        console.debug = function () {
            if (wvjbEnableNativeLog & 0x04) {
                console.log.apply(this, arguments);
            }
        };

        console.warn = function () {
            if (wvjbEnableNativeLog & 0x02) {
                console.log.apply(this, arguments);
            }
        };

        console.error = function () {
            if (wvjbEnableNativeLog & 0x01) {
                console.log.apply(this, arguments);
            }
        };

        console.trace = function () {
            if (wvjbEnableNativeLog & 0x10) {
                console.log.apply(this, arguments);
            }
        };
    }
	bridge = wbjsBridge.method;
    export default bridge
	
})(window);
