import * as js2xml from 'js2xmlparser';
import * as xml2json from 'xml2json';
import * as md5 from 'md5';
import * as request from 'request';
import * as url from 'url';

import { readomString } from './util';

import { WechatPayOptions, WechatSign, WechatOpenidRes, PaymentArgs } from './interface';

class WechatPay {
  // api hostname
  baseUrl: string;
  appid: string;
  secret: string;
  // tslint:disable-next-line:variable-name
  mch_id: string | number;
  // 商户密钥
  key: string;
  baseApiObj = {
    protocol: 'https',
    hostname: 'api.weixin.qq.com',
  };
  constructor(options: WechatPayOptions) {
    /* istanbul ignore if */
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
  getUserOpenId(code: string, callback?: (result: WechatOpenidRes) => void): Promise<WechatOpenidRes> {
    const { appid, secret } = this;
    return new Promise((resolve, reject) => {
      const openidUrl = url.format(Object.assign({}, {
        pathname: '/sns/jscode2session',
        query: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code',
        },
      }, this.baseApiObj));
      request.get(openidUrl, { json: true }, (err, res, data) => {
        if (err || res.statusCode !== 200) {
          throw new Error('get openid failed');
        } else {
          resolve(data as WechatOpenidRes);
          /* istanbul ignore else */
          if (callback) callback(data);
        }
      });
    });
  }

  /**
   * generator sign
   * @param obj
   */
  private _generatorSign(obj: any) {
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
   * 发起微信支付
   * @param options 发起支付的参数
   * @param callback 回调函数
   */
  payment(options: PaymentArgs, callback?: (result: any) => void) {
    if (!options) throw new Error('payment method need args');
    return new Promise((resolve, reject) => {
      const basicReq = {
        appid: this.appid,
        mch_id: this.mch_id,
        nonce_str: readomString(32),
        trade_type: 'JSAPI',
      };
      const customerReq = Object.assign({}, basicReq, options);

      const sign = this._generatorSign(customerReq);

      customerReq.sign = sign;

      const modal2xml = js2xml.parse('xml', customerReq);

      request({
        url: url.format(Object.assign({}, this.baseApiObj, { hostname: 'api.mch.weixin.qq.com', pathname: '/pay/unifiedorder' })),
        method: 'POST',
        body: modal2xml,
      }, (err, res, data) => {
        let originalData: any = { xml: {} }, wechatPayData: any = {};
        if (err || res.statusCode !== 200) {
          reject(new Error('connect failed'));
          return;
        }
        try {
          originalData = JSON.parse(xml2json.toJson(data));
        } catch (error) {
          reject(new Error('xml parse failed'));
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
          wechatPayData.paySign = this._generatorSign(wechatPayData);
        }
        resolve({
          original_data: originalData.xml,
          wechatpay_data: wechatPayData,
        });
        /* istanbul ignore else */
        if (callback) callback({ original_data: originalData, wechatpay_data: wechatPayData });
      });
    });
  }

}

export = WechatPay;
