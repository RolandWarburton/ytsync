// __  __            __        __            ___    ____  ____
// \ \/ /___  __  __/ /___  __/ /_  ___     /   |  / __ \/  _/
//  \  / __ \/ / / / __/ / / / __ \/ _ \   / /| | / /_/ // /
//  / / /_/ / /_/ / /_/ /_/ / /_/ /  __/  / ___ |/ ____// /
// /_/\____/\__,_/\__/\__,_/_.___/\___/  /_/  |_/_/   /___/
// Extract {title, channelId, publishedAt} from an array of youtube links
// Make sure to use an API key below
//
// A good way i found of getting lists of youtube urls is to use Link Gopher.
// Though the results do require some minimal filtering to get only youtube watch URLs
// https://addons.mozilla.org/en-US/firefox/addon/link-gopher/

// ? Example input data:
//
// [
// "https://www.youtube.com/watch?v=yuRaiarXYuM&amp;list=LLFPStYdObZlOzzjVLJntQyQ&amp;index=3353&amp;t=0s",
// "https://www.youtube.com/watch?v=yuRaiarXYuM",
// "https://www.youtube.com/watch?v=hffu2JNcYV0",
// ]

// ? Example return data:
//
// {
// 	"title": "King Gizzard & The Lizard Wizard - Quarters! (Full Album)",
// 	"channelId": "UCE0Y8aON3Gt6SkzFpA9uDkg",
// 	"publishedAt": "2015-07-08T02:30:10Z"
// },
// {
// 	"title": "You'll be back Animatic",
// 	"channelId": "UC99Dg2_ZKyGRaVlfgugQOUw",
// 	"publishedAt": "2016-10-18T20:18:15Z"
// },
// {
// 	"title": "Angra - No Pain For The Dead",
// 	"channelId": "UCYNG2ZhvDdniIHRT0Cuo3XQ",
// 	"publishedAt": "2008-10-14T06:07:21Z"
// },

const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const debug = require("debug")("YTSync");
// const { parse } = require("node-html-parser");
require("dotenv").config();

// ! API KEY HERE
const key = process.env.YOUTUBE_API_KEY;

/**
 * Returns all the links from a .html file.
 * This step can be skipped if you already have an array of links that you can "read in" in main
 * @example
 * getLinks("./links.html")
 */
// const getLinks = (filepath) => {
// 	// read the urls in and parse them into a DOM node structure
// 	const videos = parse(fs.readFileSync(filepath, "utf8"));

// 	// grab all the urls from the html file
// 	const urls = videos.querySelectorAll("a");

// 	// individual hrefs go here
// 	const links = [];

// 	for (const domURL of urls) {
// 		const link = domURL.rawAttributes.href;
// 		if (link) links.push(domURL.rawAttributes.href);
// 	}

// 	return links;
// };

/**
 * auth with youtube v3 api 🔒
 * Make sure you define the API key at the top of this file
 */
const youtube = google.youtube({
	version: "v3",
	auth: key,
});

// // TODO find a way to use Oauth to get a users private playlist to make this way more efficient.
// /**
//  * Query Youtube api for the video ID. 🔍
//  * Returns a promise that resolves to an array where
//  * the id=id so its super expensive and probably shouldnt be done like this
//  * @param {String} id - ID of the videa
//  * @example
//  * search("hffu2JNcYV0")
//  */
// const search = async (id) => {
// 	return youtube.videos
// 		.list({
// 			part: "id,snippet",
// 			id: id,
// 		})
// 		.then((res) => {
// 			if (res.data) {
// 				return {
// 					title: res.data.items[0].snippet.title,
// 					channelId: res.data.items[0].snippet.channelId,
// 					publishedAt: res.data.items[0].snippet.publishedAt,
// 				};
// 			}
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// };

/**
 * Super jank way of extracting the video ID from a URL
 * @param {String} link
 */
const stripID = (link) => {
	return link.substring(32, 43);
};

/**
 * Return a new array of results that have all null values removed
 * @param {JSON} data
 */
const filterNullValues = (data) => {
	// return all elems where elem exists
	return data.filter((elem) => !!elem);
};

function loadClient() {
	// gapi.client.setApiKey("YOUR_API_KEY");
	return gapi.client
		.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
		.then(
			function () {
				console.log("GAPI client loaded for API");
			},
			function (err) {
				console.error("Error loading GAPI client for API", err);
			}
		);
}

// Run! 🚀
const main = async () => {
	debug("starting");
	// youtube.videos
	res = await youtube.videos.list({
		part: ["snippet,contentDetails"],
		maxResults: 25,
		playlistId: "PLBCF2DAC6FFB574DE",
	});
	debug(res);
	// const links = getLinks();
	// const stats = [];
	// for (const link of links) {
	// 	stats.push(search(stripID(link)));
	// }
	// const data = await Promise.all(stats);
	// // write the data!
	// fs.writeFileSync("./output.json", JSON.stringify(data));
};

module.exports = main();
