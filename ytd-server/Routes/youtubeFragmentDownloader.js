const express = require("express");
const ytdl = require("ytdl-core");
const fs = require("fs");
const { spawn } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { url, startTime, endTime, quality } = req.query;
    let codeQuality = "134";
    switch (quality) {
      case "1080p":
        codeQuality = "137";
        break;
      case "720p":
        codeQuality = "136";
        break;
      case "480p":
        codeQuality = "135";
        break;
      case "360p":
        codeQuality = "134";
    }

    const videoInfo = await ytdl.getInfo(url);
    let format = ytdl.chooseFormat(videoInfo.formats, { quality: codeQuality });
    const videoId = videoInfo.videoDetails.videoId;

    const videoPath = `./videos/${videoId}.mp4`;
    const videoWriteStream = fs.createWriteStream(videoPath);
    ytdl(url, { format: format }).pipe(videoWriteStream);

    videoWriteStream.on("finish", () => {
      const audioFormat = ytdl.chooseFormat(videoInfo.formats, "audioonly");
      const audioPath = `./videos/${videoId}_audio.mp3`;
      const audioWriteStream = fs.createWriteStream(audioPath);
      ytdl(url, { format: audioFormat }).pipe(audioWriteStream);

      audioWriteStream.on("finish", () => {
        const mergedVideoPath = `./videos/${videoId}_merged.mp4`;
        const ffmpegMergeProcess = spawn(ffmpegPath, [
          "-i",
          videoPath,
          "-i",
          audioPath,
          "-c",
          "copy",
          "-y",
          mergedVideoPath,
        ]);

        ffmpegMergeProcess.on("close", () => {
          const trimmedVideoPath = `./videos/${videoId}_trimmed.mp4`;
          const ffmpegProcess = spawn(ffmpegPath, [
            "-i",
            mergedVideoPath,
            "-ss",
            startTime,
            "-to",
            endTime,
            "-y",
            trimmedVideoPath,
          ]);

          ffmpegProcess.on("close", () => {
            const absoluteTrimmedVideoPath = path.resolve(trimmedVideoPath);
            res.sendFile(absoluteTrimmedVideoPath, (err) => {
              if (err) {
                console.error("Помилка при відправленні відео:", err);
                deleteFilesInDirectory("./videos");
                res.status(500).send("Помилка при відправленні відео");
              } else {
                deleteFilesInDirectory("./videos");
              }
            });
          });
        });
      });
    });
  } catch (err) {
    console.error("Помилка при обробці запиту:", err);
    deleteFilesInDirectory("./videos");
    res.status(500).send("Помилка при обробці запиту");
  }
});

function deleteFilesInDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

module.exports = router;
