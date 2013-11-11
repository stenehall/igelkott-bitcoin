http = require("http");

var Bitcoin = function Bitcoin() {

  this.listeners = {'trigger:bitcoin': this.bitcoin};

  this.api_host = 'data.mtgox.com';
  this.api_verions = '/api/2/';
  this.api_action = '/money/ticker_fast';
  this.default_currency = 'USD';

  this.name = 'bitcoin';
  this.help = {
    "default": "Keep track of the current bitcoin exchange rates by doing !bitcoin currency> (USD, AUD, CAD, CHF, CNY, DKK, EUR, GBP, HKD, JPY, NZD, PLN, RUB, SEK, SGD, THB)",
  };
};

Bitcoin.prototype.bitcoin = function bitcoin(message) {
  var parts = message.parameters[1].split(' ');

  var currency = this.default_currency;
  if (parts.length === 2)
  {
    currency = parts[1];
  }

  this._query('BTC'+currency, function(response) {

    if (response.result === 'success')
    {
      var value = Math.round(response.data.buy.value * 100) / 100; // Round to two decimals
      var obj = {
        command: 'PRIVMSG',
        parameters: [message.parameters[0], message.prefix.nick+': The current '+currency+' exchange rate for one bitcoin is '+value]
      };
      this.igelkott.push(obj);
    }
  }.bind(this));

};

Bitcoin.prototype._query = function _query(api_query, callback) {


  http.get({ hostname: this.api_host, path: this.api_verions+api_query+this.api_action }, function(response) {
    response.body = "";
    response.on("data", function(chunk) {
      response.body = response.body + chunk;
    });
    response.on("end", function() {
      callback(JSON.parse(response.body));
    });
  });
};


exports.Plugin = Bitcoin;