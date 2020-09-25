const express = require("express");
const debug = require("debug");
const hooks = require("./routes/hooks");
const bodyParser = require("body-parser");
require("dotenv").config();

const log = debug("YTSync:log");
const err = debug("YTSync");

const port = 2212;
const app = express();

const urlencodedParser = bodyParser.urlencoded({
	limit: "10mb",
	extended: true,
});
// parse json
// app.use(bodyParser.json());

// Support x-www-urlencoded on all routes (body)
app.use(urlencodedParser);

// routes
app.use("/hook", hooks);

// run
app.listen(port, () => {
	log(`server running on port ${port}`);
	// console.log(`server running on port ${port}`);
});

// fallback
app.get("/", (req, res) => {
	return res.json({ success: "true" });
});
