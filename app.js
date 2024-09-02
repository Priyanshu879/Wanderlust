const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

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

//Schema Validation middleware --- Server side 
const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  next();
};

//Root Route
app.get("/", (req, res) => {
  res.send("working");
});

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "send valid data for listing!")
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    res.redirect("/listings");
  })
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

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

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

//Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error occured!" } = err;
  res
    .status(statusCode)
    .render("listings/error.ejs", { statusCode, message, err });
  // res.status(statusCode).send(message);
});

//Listening port
app.listen(8080, () => {
  console.log("Listening on Port 8080");
});
