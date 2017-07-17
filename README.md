# wechat-pay-sdk
sdk for wechat developer

### Install

> npm install wechat-pay-sdk --save

### Usage
```js
const wechatPay = require('wechat-pay-sdk');
const customize = new wechatPay({
  appid: 'your appid',
  secret: 'your wechat secret',
  mch_id: 'your mch_id',
  key: 'your key',
});

customize.getUserOpenId(code).then((res) => {
  console.log(res); // openid result
});

customize.payment({...options}).then((res) => {
  console.log(res); // wechat pay result
});
```

### API

```js
wechatPay.getUserOpenId();
```
return Promise;

```js
wechatPay.payment(options);
```
return Promise;

#### Options object for `constructor()`

**All params is required**
```js
var wechatPayOptions = {
  appid: 'your appid',
  secret: 'your wechat secret',
  mch_id: 'your mch_id',
  key: 'your key',
};
```

- **appid**: your wechat appid,
- **secret**: your wechat secret,
- **mch_id**: your mchid, you can find it on [微信商户平台](https://pay.weixin.qq.com)
- **key**: your key, you can find it on [微信商户平台](https://pay.weixin.qq.com), *微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置*

#### Options for `getUserOpenId()`
```js
wechatPay.getUserOpenId('code');
```
This method need a *string argument*, which you can find on `req.query`. see an [Example](https://github.com/MrKou47/wechat-pay-sdk/blob/master/example/index.js#L23);

#### Options object for `payment()`

```js
var paymentOptions = {
  attach: 'some detail',
  body: 'description',
  detail: 'description',
  notify_url: 'http://www.weixin.qq.com/wxpay/pay.php',
  openid: 'J892IK12e1A912309c',
  out_trade_no: '20150806125346',
  spbill_create_ip: '123.12.13.123',
  total_fee: 100,
};
```
You can find params descrption on [微信支付文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1&index=1)

#### Run example

```bash
$ git clone https://github.com/MrKou47/wechat-pay-sdk.git
$ cd wechat-pay-sdk
```

Before start example, you shou edit `wechat-config.js` with you config. And then:

```bash
$ npm run dev
```
