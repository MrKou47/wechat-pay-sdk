import { expect } from 'chai';
// const WechatPay = require('../src');
import WechatPay from '../src';

const wechatPay = new WechatPay({
  appid: '1234567',
  secret: '1234567',
  mch_id: '1234567',
  key: '1234567',
});

import { readomString } from '../src/util';
import 'mocha';

describe('Test readom string with length', () => {
  it('should return a string which length equal input', () => {
    const str: number = readomString(10).length;
    expect(str).to.equal(10);
  })
});

describe('Test class wechatPay', () => {
  describe('Test get user openid method', () => {
    it('should return error or openid response', (done) => {
      wechatPay.getUserOpenId('str').then((res) => {
        const reg = /errcode|openid/ig;
        expect(reg.test(JSON.stringify(res))).to.equal(true);
        done();
      }).catch((err) => {
        done(err);
      })
    });
  });
  describe('Test payment method', () => {
    it('should return error or per response', (done) => {
      wechatPay.payment({
        body: '',
        openid: '123123',
        out_trade_no: 1,
        total_fee: 200,
        notify_url: 'http://www.baidu.com',
        spbill_create_ip: '123',
      }).then((res) => {
        expect(Array.from(Object.keys(res)).join(',')).to.equal('original_data,wechatpay_data');
        done();
      }).catch((err) => {
        done(err);
      })
    });
  });
});
