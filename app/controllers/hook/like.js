const debug = require("debug");
const fs = require("fs");
require("dotenv").config();

const log = debug("YTSync:log");
const err = debug("YTSync");

const fExist = (fp) => {
	if (fs.existsSync(fp)) return true;
};

function getFile(fp, timeout) {
	log("getting file");
	return new Promise((resolve, reject) => {
		function checkLock() {
			if (!fExist(fp)) {
				log("File lock is released");
				resolve();
			} else {
				setTimeout(checkLock, timeout);
				log("It's been 1s. Execute the function again.");
			}
		}
		checkLock();
	});
}

const snatchFile = "/home/sftp/lacie/youtube/snatch.list";

module.exports = async (req, res) => {
	log("new like hook");
	log(req.body);

	// do a simple password check
	log(`checking password ${req.body.key} == ${process.env.KEY}`);
	if (req.body.key != process.env.KEY) {
		log("password is incorrect");
		return res.status(400).json({ success: false });
	}

	// wait for no lock
	log("checking for lock");
	await getFile("/tmp/ytdlrc.lock", 1000);

	// append to snatch file
	try {
		log(`attempting to append ${req.body.url}`);
		fs.appendFileSync(snatchFile, req.body.url);
		log("successfully wrote new video");
	} catch (err) {
		log("error writing to snatch file");
		// Uncomment if not running in systemd
		// fs.appendFileSync(__dirname + "/log.txt", err);

		// return an all bad
		return res.status(500).json({ success: false });
	}

	// return all good
	return res.status(200).json({ success: true });
};
