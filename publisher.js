var redis = require("redis");
var publisher = redis.createClient();

publisher.publish("notification", "{\"message\":\"HI!\"}", function(){
 process.exit(0);
});