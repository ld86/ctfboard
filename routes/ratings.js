var redis = require("redis"),
    client = redis.createClient()

exports.index = function(req, res) {
    client.get('tasks', function(err, reply) {
        res.render('index', JSON.parse(reply));
    });
}
