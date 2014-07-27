var express    = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var multer  = require('multer')

var app = express();
app.use(multer({ dest: '../site/img/uploads'}));
//app.use(busboy());
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
//app.use(bodyParser.json())
//checks request.body for HTTP method overrides
//app.use(methodOverride());

//Where to serve static content
app.use(express.static(path.join(__dirname, '..', 'site')));

app.use(errorhandler());

app.use(function (req, res, next) {
  console.log('..' + JSON.stringify(req.body));
  next();
})

mongoose.connect('mongodb://localhost/library_database');

var Keywords = new mongoose.Schema({
  keyword: String
});

var Book = new mongoose.Schema({
  title: String,
  author: String,
  releaseDate: Date,
  keywords: [String],
  coverImage: String
});

var BookModel = mongoose.model('Book', Book);

app.get('/api/books', function(request, response) {
  return BookModel.find(function(err, books) {
    if (!err) {
      console.log(books);
      return response.send(books);
    } else {
      return console.error(err);
    }
  });
});

app.get('/api/books/:id', function(request, response) {
  return BookModel.findById(request.params.id, function(err, book) {
    if(!err) {
      return response.send(book);
    } else {
      return console.log(err);
    }
  });
});

app.post('/api/books', function(req, response) {
  console.log('Adding book');
  var book = new BookModel();
  book.title = req.body.title;
  book.author = req.body.author;
  book.releaseDate = req.body.releaseDate;
  book.keywords = req.body.keywords;
  book.coverImage = '/img/uploads/' + req.files.coverImage.name;
  console.log(req.files)
  console.log(req.files.coverImage)

  console.log(book);
  return book.save(function(err) {
    if (!err) {
      console.log('created');
      return response.send(book);
      } else {
        console.log(err);
      }
  });
});

app.put('/api/books/:id', function(request, response) {
  return BookModel.findById(request.params.id, function(err, book) {
    console.log('Updating book ' + book.title);
    book.title = request.body.title || book.title;
    book.author = request.body.author || book.author;
    book.releaseDate = request.body.releaseDate || new Date().getTime();
    book.keywords = request.body.keywords || book.keywords || [];

    return book.save(function(err) {
      if(!err) {
        console.log('book updated');
        return response.send(book);
      } else {
        console.log(err);
      }
    });
  });
});

app.delete('/api/books/:id', function(request, response) {
  console.log('Deleting book with id: ' + request.params.id);
  return BookModel.findById(request.params.id, function(err, book) {
    return book.remove(function(err) {
      if(!err) {
        console.log('Book removed');
        return response.send('');
      } else {
        console.log(err);
      }
    });
  });
});

var port = 4000;
app.listen( port, function() {
  console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});