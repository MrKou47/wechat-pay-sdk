import { wechatPayOptions, wechatOpenidRes, paymentArgs } from './interface';
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
    constructor(options: wechatPayOptions);
    /**
     * 获取用户openid
     * @param code url上的code
     * @param callback 回调
     */
    getUserOpenId(code: string, callback?: ({}) => void): Promise<wechatOpenidRes>;
    /**
     * generator sign
     * @param obj
     */
    private _generatorSign(obj);
    /**
     * 获取client的ip
     * @param req request
     */
    getClientIp(req: any): any;
    /**
     * 发起微信支付
     * @param options 发起支付的参数
     * @param callback 回调函数
     */
    payment(options: paymentArgs, callback?: ({}) => void): Promise<{}>;
}
export default WechatPay;
