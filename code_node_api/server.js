// require the dependencies we installed
var app = require('express')();
var responseTime = require('response-time')
var bodyParser = require('body-parser')
var axios = require('axios');
var redis = require('redis');

// create a new redis client and connect to our local redis instance
var client = redis.createClient();

// if an error occurs, print it to the console
client.on('error', function (err) {
    console.log("Error " + err);
});

app.set('port', (process.env.PORT || 7000));
// set up the response-time middleware
app.use(responseTime());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/api/product', function(req, res) {
  var key = req.body.key;
  var value = req.body.value;
  client.set(key, value, function(error, result) {
      if (result) {
        res.send({ "result": result });
      } else {
        res.send({ "result": "not OK" });
      }
  });
});

app.get('/api/:product', function(req, res){
  var key = req.params.product;
  client.get(key, function(error, result) {
      if (result) {
        res.send({ "price": result });
      } else {
        res.send({ "price": "not set" });
      }
  });
});

app.get('/ping', function(req, res) {
  res.send({ "ping": "pong" });
});

app.listen(app.get('port'), function(){
  console.log('Server listening on port: ', app.get('port'));
});
