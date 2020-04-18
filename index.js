var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/task_app");

var taskSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
});

var user = mongoose.model("user", taskSchema);

app.get('/', function (req, res) {

  user.find({}, function (err, allusers) {
    if(err){
      console.log(err);
    }
    else {
      res.render("home.ejs", {data: allusers});
    }
  });
});

app.post("/adduser", function (req, res) {

  user.create(req.body, function (err, body) {
    if(err){
      res.send(err);
    }
    else{
      user.find({}, function (err, allusers) {
        if(err){
          res.send(err);
        }
        else {
          res.render("home.ejs", {data: allusers});
        }
      });
    }
  })
});

app.get('/edit/:id', function (req, res) {
  user.findById(req.params.id, function (err, data) {
    if(err){
      console.log(err);
    }
    else {
      res.render("edit.ejs", {data: data});
    }
  });
});

app.put('/:id', function (req, res) {

  user.findByIdAndUpdate(req.params.id, req.body, function (err, updated) {
    if(err){
      res.send(err);
    }
    else{
      res.redirect("/");
    }
  });
});

app.delete('/:id', function (req, res) {
  user.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server Started!!!");
});
