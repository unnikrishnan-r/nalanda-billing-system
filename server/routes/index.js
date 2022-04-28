const path = require("path");
const router = require("express").Router();


// This is temporary. For somereason the API route is not hitting the above code, hence altered it this way
// If no API routes are hit, send the React app
router.use(function (req, res) {
  console.log("No Routes are hit", req.url, req.method);
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  // res.send("No Routes were hit")
});

module.exports = router;
