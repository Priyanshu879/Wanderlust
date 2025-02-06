const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });
const {
  index,
  renderNewForm,
  createNewListing,
  showListing,
  renderEditForm,
  updateListing,
  deleteListing,
} = require("../controllers/listings.js");

router.route("/").get(wrapAsync(index)).post(
  isLoggedIn,
  upload.single("listing[image][url]"),
  validateListing,
  wrapAsync(createNewListing)
);

//New Route
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
