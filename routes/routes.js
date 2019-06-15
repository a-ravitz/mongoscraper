var db = require("../models/");
var axios = require("axios");
var cheerio = require("cheerio");
var flash = require('connect-flash');


module.exports = function(app) {

//route for scraping al jazeera and saving it to an initial database  
  app.get("/scrape", function(req, res) {
      // First, we grab the body of the html with axios
      axios.get("https://www.aljazeera.com/news/").
      then(function(response) {

        var $ = cheerio.load(response.data);
    
        $("div .topics-sec-item-cont").each(function(i, element) {
          var result = {};
    
          const title = $(element).find(".topics-sec-item-head").text()
          console.log("this is the title: " + title)
          const summary = $(element).find(".topics-sec-item-p").text()
          console.log("this is the summary: " + summary)
          const link = "https://www.aljazeera.com" + $(element).find(".topics-sec-item-label").next().attr('href')
          console.log("this is the link: " + link)
          const image = "https://www.aljazeera.com" + $(element).next().find('a').next().find('img').attr('data-src')
          console.log("this is the image link: " + image)
          console.log('\n')
          
          result.title = title
          result.summary = summary
          result.link = link
          result.image = image
    
          db.Article.create(result)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        });
        res.redirect("index");    
      });
  });
  
// Route for saving/updating an Article's associated Note
  app.post("/saved/:id", function(req, res) {
    console.log("-----note has been saved-----")
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Save.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbSave) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbSave);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

//saving a note into a seperate database
  app.get("/saved/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Save.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbSave) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbSave);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

//first page that loads, it also drops previously scraped articles
  app.get("/", function (req, res) {
    db.Article.deleteMany({}, function(err) { 
        console.log('-----collection removed-----') 
      }); 
    res.render("index")
  })

//display the documents and send them to the handlebars
  app.get("/index", function (req, res ) {
    db.Article.find({}, function(err, data) {
        if(err) {
            console.log(err)
        } else {
            var scraperObject = {scraper: data}
          //   res.render('index')
            res.render("index", scraperObject)  
        }
    })
  })

//route for saving articles 
  app.post("/articleSaver/:id", function (req, res) {
    console.log(req)
    db.Article.findOne({
      _id : req.params.id
    }).
    then(function(dbSaved) {
          console.log(dbSaved)
          console.log("\n-----this is the article we are saving-----\n\n" + dbSaved)

          var toBeSaved = {}

          toBeSaved.title = dbSaved.title,
          toBeSaved.summary = dbSaved.summary,
          toBeSaved.link = dbSaved.link,
          toBeSaved.image = dbSaved.image
        
          db.Save.create(toBeSaved)
          .then(function(result) {
            console.log(result)
            console.log("\n-----article was added to saved collection-----\n");
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      })
  })

// route to delete saved article
  app.delete("/saved/:id", function (req, res) {
    db.Save.deleteOne({
      _id : req.params.id
    }).then(function(deleted){
      console.log("\n-----the following article has been deleted-----\n")
      // console.log(deleted)
      res.send("shit is gone")
      res.json(deleted)
      
    }).catch(function(err) {
      console.log(err)
    })
  })

//route for loading the saved data  
  app.get('/saved', function(req, res){
    db.Save.find({}, function(err, data) {
      if(err) {
          console.log(err)
      } else {
          var SavedObject = {saved: data}
        //   res.render('index')
          res.render("saved", SavedObject)
      }
    })
  })
}

