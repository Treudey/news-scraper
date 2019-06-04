const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

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
    defaultLayout: 'main',
  }),
);
app.set('view engine', 'hbs');

// Connect to the Mongo DB
mongoose.connect(connectionString, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.sportsnet.ca/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    $(".post").each(function(i, element) {
      
      // Add the text and href of every link, and save them as properties of the result object
      const link = $(this).find("h3").children().attr("href") || $(this).find("h4").children().attr("href");;
      const title = $(this).find("h3").children().text() || $(this).find("h4").children().text();
      const img = $(this).find("img").attr("src");

      if (title && link) {
        // Save an empty result object
        const result = {};
        result.url = link;
        result.headline = title;
        result.image = img || 'none';
        console.log(result);


        db.Article.findOne({ headline: result.headline }, (err, article) => {
          if(err) {
             //handle error here
          }
       
          //if a user was found, that means the user's email matches the entered email
          if (article) {
            var err = new Error('A user with that email has already registered. Please use a different email..')
            err.status = 400;
            return next(err);
          } else {
            //code if no user with entered email was found
          }
       }); 
      }
      console.log('sportsnet' + i);
      /*

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      */
    });
  });
  axios.get("https://www.espn.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    $(".contentItem__content--story").each(function(i, element) {
      
      // Add the text and href of every link, and save them as properties of the result object
      const link = $(this).find("a").attr("href");
      const title = $(this).find("h1").text();
      const img = $(this).find("img").attr("src");

      if (link) {
        // Save an empty result object
        const result = {};
        result.url = link;
        result.headline = title;
        result.image = img || 'none';
        console.log(result);
      }
      console.log('espn' + i);
      /*

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      */
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
});


// Start Server
app.listen(PORT, function() {
  console.log('App running on port ' + PORT + '!');
});
