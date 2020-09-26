#!/usr/bin/python3

import os
import youtube_dl
from urllib.parse import urlparse
import json

# base directory
ytdl_root_dir="/home/sftp/lacie/test"

# snatch file
snatchFile = "{0}/snatch.list".format(ytdl_root_dir)

# archive file
archiveFile = "{0}/archive.list".format(ytdl_root_dir)

# describe the video quality type or exclusions
ytdl_format="best[filesize<100M]"

# format for output files
ytdl_output_template="%(uploader)s.%(upload_date)s.%(title)s.%(resolution)s.%(id)s.%(ext)s"

# ======================================================================
# No need to edit anything past this point
# ======================================================================

def getDBLock():
	# print("creating lock")
	# write an empty file to indicate a locked database
	f = open("ytdldb.lock", "w")
	f.close()
	

def checkDBLock():
	"""[summary] Return true if DB is locked"""
	# print("checking for lock")
	if os.path.exists("ytdldb.lock"):
		print("lock exists")
		return True
	# else:
		# print("lock doesn't exist")
	return False

def releaseDBLock():
	# print("removing lock")
	os.remove("ytdldb.lock")



def getVideoValue(url):
	"""[summary] Return meta information about the url video or playlist"""
	ydl_opts = {
		"print-json": True,
		"quiet": True,
		"continue": True,
		"download": False
	}

	# print("getting meta")
	with youtube_dl.YoutubeDL(ydl_opts) as ydl:
		try:
			# try and get information about the video and return it
			ie_result = ydl.extract_info(url, False)
			return ie_result
		except:
			# if that fails return nothing
			return None

def download_video(url, subdir, title):
	# parsedURL = urlparse(url)
	# print(parsedURL.path)

	writeURL = "{ytdl_root_dir}/videos/{subdir}/%(title)s.%(ext)s".format(ytdl_root_dir = ytdl_root_dir, subdir = subdir)
	opt = {
		# 'outtmpl': "./"
		'outtmpl': writeURL,
		# "format": "best[filesize<500M]",
		"print-json": False,
		"quiet": True,
		"continue": True,
		"writeinfojson": True,
		"keep": True
	}

	with youtube_dl.YoutubeDL(opt) as ydl:
		ydl.download([url])
		ydl.extract_info(url, download=False)
		# print(a)
		print("wrote to", writeURL)
		# print("downloaded", urlparse(url).query)

def appendArchive(videoURL):
	f=open(archiveFile, "a+")
	f.write(videoURL + "\n")
	f.close()

def main():
	# create a lock to prevent file write errors
	getDBLock()


	# open the file and read it into an array of video URLs
	snatch = open(snatchFile, 'r') 
	snatchVideos = snatch.read().splitlines()

	# open the file and read it into an array of skip URLs
	archive = open(archiveFile, "r")
	archiveVideos = archive.read().splitlines()

	# print out some stats
	# print("{0} snatch videos".format(len(snatchVideos)))
	# print("{0} archive videos".format(len(archiveVideos)))

	# get the difference of files in snatchVids but not in archiveVids
	downloadQueue = [i for i in snatchVideos if i not in archiveVideos]
	print("Queued {0}".format(len(downloadQueue)))

	# for testing you can take a slice of the array like this
	test = downloadQueue[:2]

	for i in range(len(test)):
		videoURL = downloadQueue[i]
		meta = getVideoValue(videoURL)
		if meta == None: continue
		urlType = meta.get("_type") or "video"
		# print("downloading", urlType, urlparse(videoURL).query)

		# [v]_[id]_[title] <- video
		# [p]_[id]_[title] <- playlist
		directory = "[{0}]_[{1}]_[{2}]".format(urlType[:1], meta.get("id"), meta.get("title"))

		# [v]_[id]_[title] <- video
		# [p]_[id]_[title] <- playlist
		# %()s <- placeholder format
		title = "[{0}]_[{1}]".format(meta.get("id"), "%(title)s.%(ext)s")

		# if the type is none then assume its a single video
		if urlType == "playlist":
			print("downloading playlist")
			download_video(videoURL, directory, title)
		else:
			download_video(videoURL, directory, title)

		# append the url to the archive so it skips next time
		appendArchive(videoURL)




if __name__ == '__main__':
	# prevent accidental file mishaps
	if checkDBLock(): exit()

	# Uncomment this to see the documentation
	# help(youtube_dl)

	# run the script
	main()

	# release the lock
	releaseDBLock()


# ? Field response types
# _type
# entries
# id
# title
# uploader
# uploader_id
# uploader_url
# extractor
# webpage_url
# webpage_url_basename
# extractor_key