var redis = require("redis"),
    client = redis.createClient()


exports.ratings = function(req, res) {
    client.get('tasks', function(err, tasks) {
        client.get('users', function(err, users) {
            tasks = JSON.parse(tasks);
            users = JSON.parse(users);

            sorted = [];
            for (var i = 0; i < users.users.length; ++i) {
                var totalScore = 0;
                for (var taskName in users.users[i].tasks) {
                    totalScore += users.users[i].tasks[taskName];
                }
                sorted.push([i, totalScore]);
            }
            sorted.sort(function(a, b) { return b[1] - a[1] });

            for (var i = 0; i < sorted.length; ++i) {
                sorted[i] = users.users[sorted[i][0]]
            }

            variables = { 'tasks' : tasks.tasks, 'users' : sorted};
            res.render('ratings', variables);
        });
    });
}
