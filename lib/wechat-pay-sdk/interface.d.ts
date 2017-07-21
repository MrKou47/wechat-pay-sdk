export interface wechatPayOptions {
    baseUrl?: string;
    appid: string;
    secret: string;
    mch_id: string;
    key: string;
}
export interface wechatSign {
    appid: string;
    mch_id: string;
    nonce_str: string;
    body: string;
    out_trade_no: string | number;
    total_fee: number;
    spbill_create_ip: string;
    notify_url: string;
    trade_type: 'JSAPI';
    openid: string;
}
export interface wechatOpenidRes {
    expires_in: string;
    openid: string;
    session_key: string;
}
export interface paymentArgs {
    attach?: string;
    body: string;
    detail?: string;
    notify_url: string;
    openid: string;
    out_trade_no: string | number;
    spbill_create_ip: string;
    total_fee: number;
    sign?: string;
}
