#!/usr/bin/node

var routes = require('./routes')
var express = require('express');
var morgan = require('morgan')
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'))

app.get('/re/14/ratings.html', routes.ratings);

app.listen(8080, "localhost", function() {
    console.log("I listen you.")
});
