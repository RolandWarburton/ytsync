const express = require("express");
const buildRouter = require("./buildRouter");
const debug = require("debug")("YTSync:routers");
const router = express.Router();

const like = require("../../controllers/hook/like");

const routes = [
	{
		path: "/like",
		method: "post",
		middleware: [],
		handler: like,
		help: {
			description: "IFTTT Hook",
			method: this.method,
			parameters: [],
			example: "/like",
		},
	},
];

// build the router!
debug("building the hook routes");
buildRouter(router, routes, "hooks");

module.exports = router;
