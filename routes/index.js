var redis = require("redis"),
    client = redis.createClient()

exports.ratings = function(req, res) {
    client.get('tasks', function(err, reply) {
        res.render('ratings', JSON.parse(reply));
    });
}
