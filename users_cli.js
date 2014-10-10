#!/usr/bin/node

var redis = require('redis'),
    client = redis.createClient()

var action = process.argv[2];

if (action == "add_score") {
    var nick = process.argv[3];
    var task = process.argv[4];
    var score = parseFloat(process.argv[5]);

    client.get('users', function(err, reply) {
        var users = JSON.parse(reply);
        console.log(users);
        if (!users[nick]) {
            users[nick] = {"tasks": {}}
        }
        users[nick].tasks[task] = score
        console.log(users);
        client.set('users', JSON.stringify(users), function() {
            process.exit();
        });
    });
}

if (action == "rm_user") {
    var nick = process.argv[3];

    client.get('users', function(err, reply) {
        var users = JSON.parse(reply);
        console.log(users);
        delete users['ld86'];
        console.log(users);
        client.set('users', JSON.stringify(users), function() {
            process.exit();
        });
    });
}

if (action == "add_task") {
    var name = process.argv[3];

    client.get('tasks', function(err, reply) {
        var tasks = JSON.parse(reply);
        console.log(tasks);
        tasks.tasks.push({'name' : name});
        console.log(tasks);
        client.set('tasks', JSON.stringify(tasks), function() {
            process.exit();
        });
    });
}

