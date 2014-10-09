#!/usr/bin/node

var express = require('express');
var routes = require('./routes')
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', routes.index);

app.listen(8080, "localhost", function() {
    console.log("I listen you.")
});
