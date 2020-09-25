const debug = require("debug")("YTSync");
const fs = require("fs");
require("dotenv").config();

const fExist = (fp) => {
	if (fs.existsSync(fp)) return true;
};

function getFile(fp, timeout) {
	debug("getting file");
	return new Promise((resolve, reject) => {
		function checkLock() {
			if (!fExist(fp)) {
				debug("File lock is released");
				resolve();
			} else {
				setTimeout(checkLock, timeout);
				debug("It's been 1s. Execute the function again.");
			}
		}
		checkLock();
	});
}

const snatchFile = "/home/sftp/lacie/youtube/snatch.list";

module.exports = async (req, res) => {
	debug("new like hook");
	debug(req.body);

	// do a simple password check
	if (req.body.key != process.env.KEY)
		return res.status(400).json({ success: false });

	// wait for no lock
	debug("checking for lock");
	await getFile("/tmp/ytdlrc.lock", 1000);

	// append to snatch file
	try {
		debug(`attempting to append ${req.body.url}`);
		fs.appendFileSync(snatchFile, req.body.url);
		debug("successfully wrote new video");
	} catch (err) {
		debug("error writing to snatch file");
		// Uncomment if not running in systemd
		// fs.appendFileSync(__dirname + "/log.txt", err);

		// return an all bad
		return res.status(500).json({ success: false });
	}

	// return all good
	return res.status(200).json({ success: true });
};
