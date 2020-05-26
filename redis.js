//requirements for redis save file
const redis = require('redis');
const jsonify = require('redis-jsonify');
const save = jsonify(redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true}));
module.exports = storage = {
    get: function (channelId){
        return new Promise((resolve,reject) => {
            save.get(channelId, function(err,character){
                if(!character) resolve({})
                else resolve(character) 
            }) 
        }) 
    },
    set: (channelId, userData) => save.set(channelId, userData)
}

//redis server responds to being connected
save.on('connect', function() {
    console.log('connected');
});