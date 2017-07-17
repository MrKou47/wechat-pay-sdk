(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("js2xmlparser"), require("xml2json"), require("md5"), require("fs"), require("request"), require("url"));
	else if(typeof define === 'function' && define.amd)
		define(["js2xmlparser", "xml2json", "md5", "fs", "request", "url"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("js2xmlparser"), require("xml2json"), require("md5"), require("fs"), require("request"), require("url")) : factory(root["js2xmlparser"], root["xml2json"], root["md5"], root["fs"], root["request"], root["url"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var xmlParser = __webpack_require__(1);
var xml2json = __webpack_require__(2);
var md5 = __webpack_require__(3);
var fs = __webpack_require__(4);
var request = __webpack_require__(5);
var url = __webpack_require__(6);
var util_1 = __webpack_require__(7);
var WechatPay = (function () {
    function WechatPay(options) {
        this.baseApiObj = {
            protocol: 'https',
            hostname: 'api.weixin.qq.com'
        };
        if (!options) {
            throw new Error('options is required');
        }
        this.baseUrl = options.baseUrl || 'https://api.weixin.qq.com';
        this.appid = options.appid;
        this.secret = options.secret;
        this.mch_id = options.mch_id;
        this.key = options.key;
    }
    /**
     * 获取用户openid
     * @param code url上的code
     * @param callback 回调
     */
    WechatPay.prototype.getUserOpenId = function (code, callback) {
        var _this = this;
        var _a = this, appid = _a.appid, secret = _a.secret;
        return new Promise(function (resolve, reject) {
            var openidUrl = url.format(Object.assign({}, {
                pathname: '/sns/jscode2session',
                query: {
                    appid: appid,
                    secret: secret,
                    js_code: code,
                    grant_type: 'authorization_code'
                }
            }, _this.baseApiObj));
            request.get(openidUrl, { json: true }, function (err, res, data) {
                if (err || res.statusCode !== 200) {
                    throw new Error('get openid failed');
                }
                else {
                    resolve(data);
                    if (callback)
                        callback(data);
                }
            });
        });
    };
    /**
     * generator sign
     * @param obj
     */
    WechatPay.prototype._generatorSign = function (obj) {
        var sortArr = Object.keys(obj).sort();
        var sortStr = '';
        sortArr = sortArr.map(function (key) {
            return key + "=" + obj[key];
        });
        sortArr.push("key=" + this.key);
        sortStr = sortArr.join('&');
        return md5(sortStr).toUpperCase();
    };
    /**
     * 获取client的ip
     * @param req request
     */
    WechatPay.prototype.getClientIp = function (req) {
        return req.ip.match(/\d+\.\d+\.\d+\.\d+/);
    };
    /**
     * 发起微信支付
     * @param options 发起支付的参数
     * @param callback 回调函数
     */
    WechatPay.prototype.payment = function (options, callback) {
        var _this = this;
        if (!options)
            throw new Error('payment method need args');
        return new Promise(function (resolve, reject) {
            var basicReq = {
                appid: _this.appid,
                mch_id: _this.mch_id,
                nonce_str: util_1.readomString(32),
                trade_type: 'JSAPI',
            };
            var customerReq = Object.assign({}, basicReq, options);
            var sign = _this._generatorSign(customerReq);
            customerReq.sign = sign;
            var modal2xml = xmlParser.parse('xml', customerReq);
            request({
                url: url.format(Object.assign({}, _this.baseApiObj, { hostname: 'api.mch.weixin.qq.com', pathname: '/pay/unifiedorder' })),
                method: 'POST',
                body: modal2xml,
            }, function (err, res, data) {
                var originalData = { xml: {} }, wechatPayData = {};
                if (err || res.statusCode !== 200) {
                    reject(new Error('connect failed'));
                    return;
                }
                try {
                    originalData = JSON.parse(xml2json.toJson(data));
                }
                catch (error) {
                    reject(new Error('xml parsing failed'));
                    return;
                }
                if (originalData.xml.return_code === 'SUCCESS') {
                    var prepay_id = originalData.xml.prepay_id;
                    wechatPayData = {
                        appId: _this.appid,
                        timeStamp: new Date().getTime(),
                        nonceStr: util_1.readomString(32),
                        package: "prepay_id=" + prepay_id,
                        signType: 'MD5',
                    };
                }
                resolve({
                    original_data: originalData.xml,
                    wechatpay_data: wechatPayData
                });
                if (callback)
                    callback({ original_data: originalData, wechatpay_data: wechatPayData });
            });
        });
    };
    return WechatPay;
}());
module.exports = WechatPay;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function readomString(length) {
    if (length === void 0) { length = 32; }
    var possibleStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var tempStrArr = [];
    for (var i = 0; i < length; i++) {
        tempStrArr.push(possibleStr.charAt(Math.floor(Math.random() * length)));
    }
    return tempStrArr.join('');
}
exports.readomString = readomString;


/***/ })
/******/ ]);
});