const express = require('express');
const ytdl = require('ytdl-core');

const router = express.Router();

router.get('/', async (req, res) => {

    const { url } = req.query;

    const videoInfo = await ytdl.getInfo(url);
    const formats = videoInfo.formats;
    let quality = 0;
    formats.forEach(e => {
        if (e.height > quality){
            quality = e.height;
        }
    })
    await res.json(quality)
})

module.exports = router;