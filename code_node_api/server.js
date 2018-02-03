// require the dependencies we installed
var app = require('express')();
var responseTime = require('response-time')
var bodyParser = require('body-parser')
var axios = require('axios');
var redis = require('redis');
var consul = require('consul');
const async = require ('async')

// create a new redis client and connect to our local redis instance
var client = redis.createClient();

// if an error occurs, print it to the console
client.on('error', function (err) {
    console.log("Error " + err);
});

// create a new consul client and connect to the consul instance
var consul = new consul({
  host: 'consul',
  port: 8500,
});

// register service to the consul agent
let options = {
  "Name": 'service_api',
  "ID": 'service_api',
  "Tags": [ "primary", "v1" ],
  "Address": "node_api",
  "Port": 7000,
	"Check": {
		"id": "ping",
		"HTTP": "http://node_api:7000/ping",
		"Interval": "10s",
		"timeout": "5s"
   }
};

consul.agent.service.register(options, function(err) {
  if (err) throw err;
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

app.get('/api/product/:product', function(req, res){
  var key = req.params.product;
  client.get(key, function(error, result) {
      if (result) {
        res.send(result);
      } else {
        res.send("not set");
      }
  });
});

app.get('/api/all', function (req, res) {
    var products = [];
    client.keys('*', function (err, keys) {
        if (err) return console.log(err);
        if(keys){
            async.map(keys, function(key, cb) {
               client.get(key, function (error, value) {
                    if (error) return cb(error);
                    var products = {};
                    products['key']=key;
                    products['value']=value;
                    cb(null, products);
                });
            }, function (error, results) {
               if (error) return console.log(error);
               res.send(results);
            });
        }
    });
});

app.get('/ping', function(req, res) {
  res.send("pong");
});

app.listen(app.get('port'), function(){
  console.log('Server listening on port: ', app.get('port'));
});
