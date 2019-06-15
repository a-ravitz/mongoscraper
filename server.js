var express = require("express");
var mongoose = require("mongoose");
var session = require('express-session');
var cookieParser = require('cookie-parser');  
var flash = require('connect-flash');
var PORT = process.env.PORT || 3000;



// Initialize Express

var app = express();
var exphbs = require("express-handlebars");

app.engine("handlebars", 
    exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat', 
  cookie: { maxAge: 60000 },
  resave: false,    // forces the session to be saved back to the store
  saveUninitialized: false  // dont save unmodified
}));
app.use(flash());

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraperHomework";
// ('useNewUrlParser', true ), mongoose.set('useFindAndModify', false), mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, mongoose.set)
// Routes
require("./routes/routes")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running at http://localhost:" + PORT + " !");
});
