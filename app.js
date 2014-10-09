#!/usr/bin/node

var express = require('express');
var routes = require('./routes')
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/re/14/ratings.html', routes.index);

app.listen(8080, function() {
    console.log("I listen you.")
});
