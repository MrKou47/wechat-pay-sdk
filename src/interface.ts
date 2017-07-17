export interface wechatPayOptions {
  baseUrl?: string;
  appid: string;
  secret: string;
  mch_id: string;
  key: string;
}

export interface wechatSign {
  appid: string,
  mch_id: string,
  nonce_str: string;
  body: string,
  out_trade_no: string | number,
  total_fee: number,
  spbill_create_ip: string,
  notify_url: string,
  trade_type: 'JSAPI',
  openid: string;
}

export interface wechatOpenidRes {
  expires_in: string;
  openid: string;
  session_key: string;
}

export interface paymentArgs {
  // // appid
  // appid?: string,
  // 附加数据
  attach?: string,
  // 商品描述
  body: string,
  // 商家id
  // mch_id?: string,
  // 商品详情
  detail?: string,
  // random string
  // nonce_str?: string,
  // callback url
  notify_url: string,
  // openid
  openid: string,
  // business order sn 
  out_trade_no: string,
  // client ip
  spbill_create_ip: string,
  // 总金额（分）
  total_fee: number,
  
  // trade_type?: "JSAPI" | "Native" | "APP",

  sign?: string;
}