const express = require("express");
const ytdl = require("ytdl-core");

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  const info = await ytdl.getInfo(url);
  const duration = info.videoDetails.lengthSeconds;

  await res.json(duration); // повертає тривалість відео в секундах
});

module.exports = router;
