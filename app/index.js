'use strict';

var express = require('express');
var morgan = require('morgan');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  res.render('index');
});

app.post('/', function(req, res){
  var url = 'http://api.wunderground.com/api/93c780c5e1dadc42/conditions/q/' + req.body.zip + '.json';
  request(url, function(err, response, body){
    body = JSON.parse(body);
    var temp = body.current_observation.temp_f;
    var thermHeight = Math.floor(temp) * 2;
    var color;
    if(temp <= 32){
      color = 'blue';
    }else if(temp <= 70){
      color = 'green';
    }else if(temp <= 80){
      color = 'yellow';
    }else if(temp <= 95){
      color = 'orange';
    }else if(temp > 95){
      color = 'red';
    }
    //console.log(body.current_observation.temp_f);
    res.render('weather', {temp:temp.toFixed(2),height:thermHeight,top:200-thermHeight,color:color});
  });
});
/*
// to test CSS without using API request call
app.post('/', function(req, res){
  var temp = 20;
  var thermHeight = Math.floor(temp) * 2;
  var color;
  if(temp <= 32){
    color = 'blue';
  }else if(temp <= 70){
    color = 'green';
  }else if(temp <= 80){
    color = 'yellow';
  }else if(temp <= 95){
    color = 'orange';
  }else if(temp > 95){
    color = 'red';
  }
  res.render('weather', {temp:temp.toFixed(2),height:thermHeight,top:200-thermHeight,color:color});
});
*/

var port = process.env.PORT;

app.listen(port, function(){
  console.log('Express is listening on PORT:', port);
});
