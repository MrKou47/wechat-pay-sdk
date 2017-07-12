export interface WechatPayOptions {
    baseUrl?: string;
    appid: string;
    secret: string;
    mch_id: string;
}
declare class WechatPay {
    baseUrl: string;
    appid: string;
    secret: string;
    mch_id: string | number;
    constructor(options: WechatPayOptions);
}
export default WechatPay;
