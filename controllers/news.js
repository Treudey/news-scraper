const axios = require('axios');
const cheerio = require('cheerio');

const db = require('../models');

// private helper functions
const addArticle = (articleObj) => {
  db.Article.findOne({ headline: articleObj.headline }, (err, article) => {
         
    if (err) throw err;
 
    //check if the article was found
    if (article) {
      console.log('Article already exists');
    } else {
      //code if no user with entered email was found
      // Create a new Article using the `result` object built from scraping
      db.Article.create(articleObj)
        .then(dbArticle => {
          console.log(dbArticle);
        })
        .catch(err => {
          if (err) throw err;
        });
    }
  });
};

exports.getArticles = (req, res) => {
  db.Article.find({})
    .then(dbArticles => {
      // If any Articles are found, send them to the client
      const hbsObj = {
        articles: dbArticles,
        pageTitle: 'Articles'
      }
      
      res.render('index', hbsObj);
    })
    .catch(err =>{
      // If an error occurs, send it back to the client
      if (err) throw err;
    });
};

exports.scrapeSites = (req, res) => {
  // First, we grab the bodies of the html with axios
  axios.get("https://www.sportsnet.ca/").then(response => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    $(".post").each((i, element) => {
      
      // Add the text and href of every link, and save them as properties of the result object
      const link = $(element).find("h3").children().attr("href") || $(element).find("h4").children().attr("href");;
      const title = $(element).find("h3").children().text() || $(element).find("h4").children().text();
      let img = $(element).find("img").attr("src");

      // filter out low quality images
      if (img.includes('115x115')) img = false;

      if (title && link && img) {
        // Save an empty result object
        const result = {};
        result.url = link;
        result.headline = title;
        result.image = img;

        addArticle(result);
      }
    });
  });

  axios.get("https://www.espn.com/").then(response => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    $(".contentItem__content--story").each((i, element) => {
      
      // Add the text and href of every link, and save them as properties of the result object
      const link = $(element).find("a").attr("href");
      const title = $(element).find("h1").text();
      const img = $(element).find("img.media-wrapper_image").data("default-src") || $(element).find("img").attr("src");

      if (link && img && title) {
        // Save an empty result object
        const result = {};
        result.url = link.includes("https") ? link : 'https://www.espn.com' + link;
        result.headline = title;
        result.image = img;

        addArticle(result);
      }
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
};