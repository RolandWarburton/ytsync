const debug = require("debug")("YTSync:routers");

/**
 * Appends routes to the router object and returns an express router.
 * See example at bottom of this file for route formatting example
 * @param {Router} router - Express router object
 * @param {Array} routes - An array of routes
 * @param {String} context - Base of the routes
 * @example buildRouter(router, routes, "images")
 */
const buildRouter = (router, routes) => {
	debug(`got ${routes.length} routes to build`);
	// for each route in the provided routes array
	for (let i in routes) {
		debug(`building route ${routes[i].path}`);
		// build the route like you would one by one
		// EG: router.get("/image/meta/:id", getImageMeta);
		router[routes[i].method](
			routes[i].path,
			routes[i].middleware,
			routes[i].handler
		);
		router.stack[i].helpDescription = routes[i].help;
	}

	return router;
};

module.exports = buildRouter;

// ? Example route
//
// [
// 	{
// 		path: "/like",
// 		method: "post",
// 		middleware: [],
// 		handler: like,
// 		help: {
// 			description: "IFTTT Hook",
// 			method: this.method,
// 			parameters: [],
// 			example: "/like",
// 		},
// 	},
// ];
