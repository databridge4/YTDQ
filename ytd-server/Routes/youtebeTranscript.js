const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const axios = require("axios");

const router = express.Router();

const CHUNK_SIZE = 4000; // Розмір частини тексту для обробки GPT (може бути змінено згідно вимогам)

router.get("/", async (req, res) => {
  const videoId = req.query.videoId;
  const prompt = req.query.prompt;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!videoId) {
    return res
      .status(400)
      .json({ error: "videoId query parameter is required" });
  }

  try {
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);

    const text = transcriptData
      .map((item) => formatOffset(item.offset) + " " + item.text)
      .join("\n");

    // Розбиття тексту на частини, кожна з яких містить повні рядки
    const lines = text.split("\n");
    let chunks = [],
      chunk = "";

    for (let line of lines) {
      if ((chunk + "\n" + line).length > CHUNK_SIZE) {
        chunks.push(chunk);
        chunk = line;
      } else {
        if (chunk != "") chunk += "\n";
        chunk += line;
      }
    }
    chunks.push(chunk);

    const client = axios.create({
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    let quotes = [];
    for (let chunk of chunks) {
      const params = {
        prompt: `${prompt} and add time stamps to them :"${chunk}"`,
        model: "text-davinci-003",
        max_tokens: 2048,
        temperature: 1,
      };

      const result = await client.post(
        "https://api.openai.com/v1/completions",
        params
      );

      const quote = result.data.choices[0].text.trim();
      quotes.push(quote);
      console.log(quote);
    }

    const quoteText = quotes.join(" "); // Об'єднання всіх отриманих цитат в один текст

    await res.json({ transcript: text, quote: quoteText });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.toString() });
  }
});

function formatOffset(offset_ms) {
  // перетворення мілісекунд в секунди
  let seconds = Math.floor(offset_ms / 1000);
  // розрахунок хвилин та секунд
  let minutes = Math.floor(seconds / 60);
  seconds = seconds - minutes * 60;
  // форматування у вигляді "мм:сс"
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds
  );
}

module.exports = router;
