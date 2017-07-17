const wechatPay = require('wechat-pay-sdk');
const http = require('http');
const url = require('url');
const wechatPayConf = require('./wechat-config.js');

const customize = new wechatPay(wechatPayConf);

function formatUrlQuery(urlStr) {
  const parserUrl = url.parse(urlStr);
  const queryObj = {};
  if (!parserUrl.query) return queryObj;
  parserUrl.query.split('&').forEach(function(str) {
    const tempArr = str.split('=');
    queryObj[tempArr[0]] = tempArr[1];
  });
  return queryObj;
}

http.createServer((req, res) => {
  const query = formatUrlQuery(req.url);
  if (req.url.match('openid')) {
    if (!query.code) return res.end('Error: code is required');
    customize.getUserOpenId(query.code).then((wechatRes) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(wechatRes));
    });
  } else if(req.url.match('pay') && req.method === 'POST') {
      var jsonString = '';

      req.on('data', function (data) {
        jsonString += data;
      });

      req.on('end', function () {
        const jsonObj = JSON.parse(jsonString);
        customize.payment({
          body: 'test',
          spbill_create_ip: '123.12.12.123',
          out_trade_no: '20150806125346',
          total_fee: 100,
          notify_url: 'http://www.weixin.qq.com/wxpay/pay.php',
          openid: 'obYT80AvGGLHB9FrHEJHv14pUwHo'
        }).then((payResult) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payResult));
        });
      });
  } else {
    res.write('<p>Welcome!</p>')
    res.end();
  }
}).listen(8088, () => {
  console.log('server start on port 8088');
});



