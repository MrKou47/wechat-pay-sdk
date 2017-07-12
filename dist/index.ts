export interface WechatPayOptions {
  baseUrl?: string;
  appid: string;
  secret: string;
  mch_id: string;
}

class WechatPay {
  baseUrl: string;
  appid: string;
  secret: string;
  mch_id: string | number;
  constructor(options: WechatPayOptions) {
    this.baseUrl = options.baseUrl || 'https://api.weixin.qq.com';
    this.appid = options.appid;
    this.secret = options.secret;
    this.mch_id = options.mch_id;
  }

}


export default WechatPay;