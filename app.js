const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//MONGO DB Connection
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

//Root Route
app.get("/", (req, res) => {
  res.send("working");
});

//Index Route
app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.Listing);
  await newListing.save();
  res.redirect("/listings");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});



//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
  res.redirect("/listings");
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//TestListing Route
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "By the forest",
//     price: 12000,
//     location: "Shimla, Himachal Pradesh",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log(sampleListing);
//   res.send("success");
// });

//Listening port
app.listen(8080, () => {
  console.log("Listening on Port 8080");
});
