const xmlParser = require('js2xmlparser');
const xml2json = require('xml2json');
const md5 = require('md5');
const fs = require('fs');

import { wechatPayOptions, wechatSign, wechatOpenidRes, paymentArgs } from './interface';
import * as request from 'request';
import * as url from 'url';
import { readomString } from './util';

class WechatPay {
	// api hostname
  baseUrl: string;
  appid: string;
  secret: string;
  mch_id: string | number;
	// 商户密钥
	key: string;
  baseApiObj = {
    protocol: 'https',
    hostname: 'api.weixin.qq.com'
  }
  constructor(options: wechatPayOptions) {
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
  getUserOpenId(code: string, callback: ({}) => void): Promise<wechatOpenidRes> {
    const { appid, secret } = this;
    return new Promise((resolve, reject) => {
      const openidUrl = url.format(Object.assign({}, {
        pathname: '/sns/jscode2session',
        query: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code'
        }
      }, this.baseApiObj));
      request.get(openidUrl, { json:true }, (err, res, data) => {
        if (err || res.statusCode !== 200) {
          throw new Error('get openid failed');
        } else {
          resolve(<wechatOpenidRes>data);
          if (callback) callback(data);
        }
      })
    });
  }

  /**
   * generator sign
   * @param obj 
   */
  private _generatorSign(obj:any) {

		let sortArr = Object.keys(obj).sort();
		let sortStr = '';
		sortArr = sortArr.map((key) => {
			return `${key}=${obj[key]}`; 
		});
    sortArr.push(`key=${this.key}`);
    sortStr = sortArr.join('&');
    return md5(sortStr).toUpperCase();

  }

  /**
   * 获取client的ip
   * @param req request
   */
  getClientIp(req) {
    return req.ip.match(/\d+\.\d+\.\d+\.\d+/); 
  }

  /**
   * 发起微信支付
   * @param options 发起支付的参数
   * @param callback 回调函数
   */
  payment(options: paymentArgs, callback:({}) => void) {
    if(!options) throw new Error('payment method need args');
    return new Promise((resolve, reject) => {
      const basicReq = {
        appid: this.appid,
        mch_id: this.mch_id,
        nonce_str: readomString(32),
        trade_type: 'JSAPI',
      }
      const customerReq = Object.assign({}, basicReq, options);

      let sign = this._generatorSign(customerReq);

      customerReq.sign = sign;

      let modal2xml = xmlParser.parse('xml', customerReq);

      request({
        url: url.format(Object.assign({}, this.baseApiObj, { hostname: 'api.mch.weixin.qq.com', pathname: '/pay/unifiedorder' })),
        method: 'POST',
        body: modal2xml,
      }, (err, res, data) => {
        let originalData:any = { xml: {} }, wechatPayData:any = {};
        if (err || res.statusCode !== 200) {
          reject(new Error('connect failed'));
          return;
        }
        try {
          originalData = JSON.parse(xml2json.toJson(data));
        } catch (error) {
          reject(new Error('xml parsing failed'));
          return;
        }
        if (originalData.xml.return_code === 'SUCCESS') {
          const prepay_id = originalData.xml.prepay_id;
          wechatPayData = {
            appId: this.appid,
            timeStamp: new Date().getTime(),
            nonceStr: readomString(32),
            package: `prepay_id=${ prepay_id }`,
            signType: 'MD5',
          };
        }
        resolve({
          original_data: originalData.xml,
          wechatpay_data: wechatPayData
        })
        if(callback) callback({ original_data: originalData, wechatpay_data: wechatPayData });
      })
    })
  }

}


export = WechatPay;