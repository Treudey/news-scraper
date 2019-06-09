const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const newsController = require('./controllers/news');
const apiController = require('./controllers/api');

const connectionString = 'mongodb+srv://alex:67ECNUeIAsc30u04@cluster0-ofcaa.mongodb.net/scraper?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, '/public')));

// set Handlebars as view engine
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main.hbs',
  }),
);
app.set('view engine', 'hbs');

// Connect to the Mongo DB
mongoose.connect(connectionString, { useNewUrlParser: true, useFindAndModify: false });

// Routes

// A GET route for scraping the sports news websites
app.get("/", newsController.getIndex);

// Route for getting all Articles from the db
app.get("/articles", newsController.getArticles);

// A POST route for adding a Comment
app.post("/api/add-comment", apiController.postComment);

app.post('/api/delete-comment', apiController.deleteComment);
// Start Server
app.listen(PORT, () => {
  console.log('App running on port ' + PORT + '!');
});
