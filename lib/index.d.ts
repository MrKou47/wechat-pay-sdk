import { WechatPayOptions, WechatOpenidRes, PaymentArgs } from './interface';
declare class WechatPay {
    baseUrl: string;
    appid: string;
    secret: string;
    mch_id: string | number;
    key: string;
    baseApiObj: {
        protocol: string;
        hostname: string;
    };
    constructor(options: WechatPayOptions);
    /**
     * 获取用户openid
     * @param code url上的code
     * @param callback 回调
     */
    getUserOpenId(code: string, callback?: (result: WechatOpenidRes) => void): Promise<WechatOpenidRes>;
    /**
     * generator sign
     * @param obj
     */
    private _generatorSign(obj);
    /**
     * 发起微信支付
     * @param options 发起支付的参数
     * @param callback 回调函数
     */
    payment(options: PaymentArgs, callback?: (result: any) => void): Promise<{}>;
}
export = WechatPay;
