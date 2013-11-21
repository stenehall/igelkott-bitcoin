var assert = require('chai').assert,
Stream = require('stream'),
nock = require('nock'),

Igelkott = require('igelkott'),
Bitcoin = require('../igelkott-bitcoin.js').Plugin;


describe('Bitcoin', function() {

  var igelkott,
  config,
  s,
  server;

  beforeEach(function () {
    s = new Stream.PassThrough({objectMode: true});

    config = {
      core:['privmsg'],
      plugins: {},
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };

    igelkott = new Igelkott(config);
  });


  it('Should be able to return current USD exchange rates', function(done) {
    igelkott.plugin.load('bitcoin', {}, Bitcoin);

    s.on('data', function(data) {
      if(data == "PRIVMSG ##botbotbot :dsmith: The current USD exchange rate for one bitcoin is 371.42\r\n")
      {
        done();
      }
    });

    nock('http://data.mtgox.com')
      .get('/api/2/BTCUSD/money/ticker_fast')
      .reply(200, {"result":"success","data":{"buy":{"value":"371.42000"}}});

    igelkott.connect();
    s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!bitcoin\r\n");
  });


  it('Should be able to return other exchange rates', function(done) {
    igelkott.plugin.load('bitcoin', {}, Bitcoin);

    s.on('data', function(data) {
      if(data == "PRIVMSG ##botbotbot :dsmith: The current SEK exchange rate for one bitcoin is 2384.31\r\n")
      {
        done();
      }
    });

    nock('http://data.mtgox.com')
      .get('/api/2/BTCSEK/money/ticker_fast')
      .reply(200, {"result":"success","data":{"buy":{"value":"2384.309"}}});

    igelkott.connect();
    s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!bitcoin SEK\r\n");
  });
});