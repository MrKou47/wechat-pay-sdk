import { expect } from 'chai';
import WechatPay = require('../src/index');
import { readomString } from '../src/util';

const wechatPay = new WechatPay({
  appid: '1234567',
  secret: '1234567',
  mch_id: '1234567',
  key: '1234567',
});

describe('Test readom string with length', () => {
  it('should return a string which length equal input', () => {
    const str: number = readomString(10).length;
    expect(str).to.equal(10);
  });
});

describe('Test class wechatPay', () => {
  describe('Test get user openid method', () => {
    const reg = /errcode|openid/i;
    it('should return error or openid response', (done) => {
      wechatPay.getUserOpenId('str', (result) => {
        console.log(result);
        expect(reg.test(JSON.stringify(result))).to.equal(true);
      }).then((res) => {
        console.log(res);
        expect(reg.test(JSON.stringify(res))).to.equal(true);
        done();
      }).catch((err) => {
        console.log(err);
        done(err);
      });
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
      }, (result) => {
        expect(Array.from(Object.keys(result)).join(',')).to.equal('original_data,wechatpay_data');
      }).then((res) => {
        expect(Array.from(Object.keys(res)).join(',')).to.equal('original_data,wechatpay_data');
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});
