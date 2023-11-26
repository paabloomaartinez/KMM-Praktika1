const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/vod', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vod.html'));
});

app.get('/vod/v1', (req, res) => {
    const videoPath = './media/videos/v1.mp4'
    res.sendFile(videoPath, { root: __dirname })
})

app.get('/vod/i1', (req, res) => {
    const videoPath = './media/images/i1.jpg'
    res.sendFile(videoPath, { root: __dirname })
})

app.get('/live', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'live.html'));
});

app.get('/adaptative', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adaptive.html'));
});

app.get('/adaptative/v1', (req, res) => {
    const videoPath = './media/dash/out.mpd'
    res.sendFile(videoPath, { root: __dirname })
})

app.get('/adaptative/:segment', (req, res) => {
    const segmentNumber = req.params.segment;
    const segmentPath = `./media/dash/${segmentNumber}`;

    res.sendFile(segmentPath, { root: __dirname });
});

app.listen(port, () => {
    console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
