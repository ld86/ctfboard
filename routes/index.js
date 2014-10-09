var redis = require("redis"),
    client = redis.createClient()


exports.ratings = function(req, res) {
    client.get('tasks', function(err, tasks) {
        client.get('users', function(err, users) {
            tasks = JSON.parse(tasks);
            users = JSON.parse(users);

            sorted = [];
            for (var nick in users) {
                var totalScore = 0;
                for (var taskName in users[nick].tasks) {
                    totalScore += users[nick].tasks[taskName];
                }
                sorted.push([nick, totalScore]);
            }
            sorted.sort(function(a, b) { return b[1] - a[1] });

            variables = { 'tasks' : tasks.tasks, 'users' : users, 'sortedNicks': sorted};
            res.render('ratings', variables);
        });
    });
}
