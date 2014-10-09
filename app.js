#!/usr/bin/node

var express = require('express');
var morgan = require('morgan')
var routes = require('./routes')
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'))

app.get('/re/14/ratings.html', routes.index);

app.listen(8080, "localhost", function() {
    console.log("I listen you.")
});
