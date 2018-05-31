const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cons = require('consolidate');
const mongoose = require('mongoose');
const axios = require('axios');

const { BooksSchema } = require('./public/javascripts/Books_Schema');
const { SchemaModel } = require('./public/javascripts/authentication/User_Schema');
const { authenticate } = require('./public/javascripts/authentication/authenticate');

const app = express();

// view engine setup
// app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/register', (req, res) => res.render('register')); // register

app.get('/login', (req, res) => res.render('login')); // login

app.get('/books', (req, res) => res.render('mybooks')); // login

app.get('/', (req, res) => res.render('allbooks')); // homepage

app.get('/newbook', (req, res) => res.render('newBook')); // add a new book

app.get('/interested', (req, res) => res.render('notification')); // add a new book

const mongoURI = 'mongodb://admin:admin123@ds141720.mlab.com:41720/exchange-books';

mongoose.connect(mongoURI);

// authentication routes

app.post("/register", (req, res) => { // register with username, password
  const newAccount = new SchemaModel({
    username: req.body.username,
    password: req.body.password
  });
  let userdata;
  newAccount.save().then((data) => {
    userdata = data;
    return newAccount.generateAuthToken();
  }).then((token) => {
    res.cookie('authorizationToken', token).status(200).send(userdata);
  }).catch((err) => res.status(400).send(err));
});


app.post("/login", (req, res) => { // login , generate authentication token
  SchemaModel.findByCredentials(req.body.username, req.body.password).then(function (user) {
    return user.generateAuthToken().then(function (token) {
      res.cookie("authorizationToken", token).send(user);
    });
  }).catch((err) => {
    res.status(404).send();
  });
});

app.delete('/logout', authenticate, (req, res) => { // delete a book
  let token = req.cookies.authorizationToken;
  let user = req.user;
  return user.removeToken(token).then((result) => {
    res.status(200).send(result);
  }).catch((er) => res.status(400).send());
});


// APP FUNCTIONALITY 

app.post('/books', authenticate, (request, res) => { // get a book by its name using Google Books API
  let bookname = request.body.name;
  axios(`https://www.googleapis.com/books/v1/volumes?q=${bookname}+inauthor&key=AIzaSyASiGLS7ZfyQVtCJPDKD0kKWq6QuQhU87I`)
    .then((req, response) => {
      let body = req.data.items[0].volumeInfo;

      let BookInfo = {
        thumbnail: body.imageLinks.thumbnail,
        title: body.title,
        author: body.authors[0]
      };

      const newBook = new BooksSchema({
        _creator: request.user._id,
        BookTitle: body.title,
        author: body.authors[0],
        BookThumbnail: body.imageLinks.thumbnail
      });

      newBook.save().then((data) => {
        console.log(data);
      }).catch((e) => console.error(e));

      res.status(200).send(BookInfo);
    }).catch((err) => res.status(404).send(err));
});

app.get('/allbooks', (req, res) => { // get all books
  BooksSchema.find({}).populate('_creator').exec((err, result) => { // search in the books collection and match `_creator` to the `users` collection
    if (err) res.status(400).send();
    res.status(200).send(result);
  });
});

app.get('/mybooks', authenticate, (req, res) => { // get user books
  BooksSchema.find({ _creator: req.user._id }).then((books) => {
    console.log(books);
    res.status(200).send(books);
  }).catch((err) => {
    res.status(404).send();
  })
});


app.patch('/exchange/:id', authenticate, (req, res) => { // users submit their interest about a book
  const id = req.params.id;
  const username = req.user.username;

  BooksSchema.findById(id).then((book, response) => { // find the `BOOK` requested
    if (book.interestedUsers.includes(username)) { // check if the user has submitted their interest before
      return res.status(405).send();
    } else { // if the user didn't submit an interest to this book, it gets recorded.
      BooksSchema.findOneAndUpdate({ _id: req.params.id }, { $push: { "interestedUsers": username } }, { new: true }, (err, doc) => { // find the requested book and update the array of interested users
        if (err) res.status(400).send();
        res.status(200).send(doc);
      });
    }
  });
});

app.get('/auth', authenticate, (req, res) => { // check if the user is authenticated
  if (req.user) {
    return res.status(200).send(req.user);
  }
  res.status(401).send();
});

app.delete('/deletebook/:id', authenticate, (req, res) => { // delete a book
  console.log('id', req.params.id);
  BooksSchema.findOneAndRemove({
    _id: req.params.id, // id for the book that the user provided
    _creator: req.user._id // user id
  }).then((deletedBook) => {
    res.status(200).send(deletedBook);
  }).catch((e) => res.status(400).send());
});



app.listen(process.env.PORT || 3000, () => console.log('app is running on port 3000'));