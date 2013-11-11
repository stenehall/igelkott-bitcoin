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
      plugins:['privmsg'],
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };

    igelkott = new Igelkott(config);
  });


  it('Should be able to return current USD exchange rates', function(done) {
    igelkott.plugin.load('bitcoin', Bitcoin);

    s.on('data', function(data) {
      if(data == "PRIVMSG ##botbotbot :dsmith: The current USD exchange rate for one bitcoin is 371.42\r\n")
      {
        done();
      }
    });

    var couchdb = nock('http://data.mtgox.com')
                .get('/api/2/BTCUSD/money/ticker_fast')
                .reply(200, {"result":"success","data":{"last_local":{"value":"371.42000","value_int":"37142000","display":"$371.42","display_short":"$371.42","currency":"USD"},"last":{"value":"371.42000","value_int":"37142000","display":"$371.42","display_short":"$371.42","currency":"USD"},"last_orig":{"value":"271.55600","value_int":"27155600","display":"271.56\u00a0\u20ac","display_short":"271.56\u00a0\u20ac","currency":"EUR"},"last_all":{"value":"364.72686","value_int":"36472686","display":"$364.73","display_short":"$364.73","currency":"USD"},"buy":{"value":"371.42000","value_int":"37142000","display":"$371.42","display_short":"$371.42","currency":"USD"},"sell":{"value":"371.49643","value_int":"37149643","display":"$371.50","display_short":"$371.50","currency":"USD"},"now":"1384194990833249"}});

    igelkott.connect();
    s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!bitcoin\r\n");
  });


  it('Should be able to return other exchange rates', function(done) {
    igelkott.plugin.load('bitcoin', Bitcoin);

    s.on('data', function(data) {
      if(data == "PRIVMSG ##botbotbot :dsmith: The current SEK exchange rate for one bitcoin is 2384.31\r\n")
      {
        done();
      }
    });

    var couchdb = nock('http://data.mtgox.com')
                .get('/api/2/BTCSEK/money/ticker_fast')
                .reply(200, {"result":"success","data":{"last_local":{"value":"2245.520","value_int":"2245520","display":"2,246\u00a0Kr","display_short":"2,246\u00a0Kr","currency":"SEK"},"last":{"value":"2245.520","value_int":"2245520","display":"2,246\u00a0Kr","display_short":"2,246\u00a0Kr","currency":"SEK"},"last_orig":{"value":"371.42000","value_int":"37142000","display":"$371.42","display_short":"$371.42","currency":"USD"},"last_all":{"value":"2443.916","value_int":"2443916","display":"2,444\u00a0Kr","display_short":"2,444\u00a0Kr","currency":"SEK"},"buy":{"value":"2384.309","value_int":"2384309","display":"2,384\u00a0Kr","display_short":"2,384\u00a0Kr","currency":"SEK"},"sell":{"value":"2444.419","value_int":"2444419","display":"2,444\u00a0Kr","display_short":"2,444\u00a0Kr","currency":"SEK"},"now":"1384195209157671"}});

    igelkott.connect();
    s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!bitcoin SEK\r\n");
  });
});