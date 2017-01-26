//Server set up

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var path = require('path');

mongoose.connect('mongodb://Amacuse:123456@jello.modulusmongo.net:27017/ijori5pI');

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

// define model =================
var Todo = mongoose.model('Todo', {
    text: String
});

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/todos', function(req, res) {

    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
});

// create todos and send back all todos after creation
app.post('/api/todos', function(req, res) {

    // create a todos, information comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});

// delete a todos
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

//listen
app.listen(8080);

/*
 // catch 404 and forward to error handler
 app.use(function (req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
 });

 // error handler
 app.use(function (err, req, res, next) {
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};

 // render the error page
 res.status(err.status || 500);
 res.render('error');
 });

 module.exports = app;*/
