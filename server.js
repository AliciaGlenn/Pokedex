/////////////////////////////////////////////
// Import Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const pokemons = require("./models/pokemons.js");

/////////////////////////////////////////////////
// Create Express Application Object
/////////////////////////////////////////////////
const app = express();

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("your server is running... better catch it.");
});

// index route
app.get("/pokemons", (req, res) => {
  res.render("index.ejs", {
    allPokemons: pokemons,
  });
});

//new route
app.get("/pokemons/new", (req, res) => {
  res.render("new.ejs");
});

// delete route
app.delete("/pokemons/:id", (req, res) => {
  pokemons.splice(req.params.id, 1); //remove the item from the array
  res.redirect("/pokemons"); //redirect back to index route
});

// edit route
app.get("/pokemons/:id/edit", (req, res) => {
  res.render(
    "edit.ejs", //render views/edit.ejs
    {
      //pass in an object that contains
      pokemon: pokemons[req.params.id], //the pokemon object
      index: req.params.id,
    }
  );
});

app.post("/pokemons", (req, res) => {
  pokemons.push(req.body);
  res.redirect("/pokemons");
});

// update route
app.put("/pokemons/:id", (req, res) => {
  pokemons[req.params.id] = req.body; //in our fruits array, find the index that is specified in the url (:indexOfFruitsArray).  Set that element to the value of req.body (the input data)
  res.redirect("/pokemons"); //redirect to the index page
});

app.get("/pokemons/:id", (req, res) => {
  res.render("show.ejs", {
    //second param must be an object
    pokemon: pokemons[req.params.id],
    index: req.params.id,
  });
});

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));
