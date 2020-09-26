# TODO list for ytdl database

1. read an id from snatch.list
2. check it doesn't exist in archive.list
3. if not download it
4. after each download append that id to archive.list

for id in snatch
	if (exist in archive.list)
		continue/skip
	else
		await downloadVideo()
