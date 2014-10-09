var redis = require("redis"),
    client = redis.createClient()

exports.index = function(req, res) {
    client.get('tasks', function(err, tasks) {
    client.get('users', function(err, users) {
        tasks = JSON.parse(tasks)
        users = JSON.parse(users)
        variables = { 'tasks' : tasks['tasks'], 'users' : users['users']}

        res.render('index', variables)
    }});
}
