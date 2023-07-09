const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
require("dotenv").config();
const port = process.env.PORT || 3000;

const youtubeTranscript = require("./Routes/youtebeTranscript");
const youtubeDownloader = require("./Routes/youtubeFragmentDownloader");
const youtubeQuality = require("./Routes/youtubeQuality");
const youtubeDuration = require("./Routes/YoutubeDuration");

app.use("/transcript", youtubeTranscript);
app.use("/videoDownload", youtubeDownloader);
app.use("/quality", youtubeQuality);
app.use("/duration", youtubeDuration);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
