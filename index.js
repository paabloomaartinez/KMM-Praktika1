const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

/*const { spawn } = require('child_process');
const ffmpeg = spawn('ffmpeg', [
    '-f', 'dshow', // Fuente de video en Windows
    //'-i', 'video="13d3:56b2"', // Especifica la fuente de video (puede variar)
    // '-i', 'video="OBS Virtual Camera"', // Especifica la fuente de video (puede variar)
    '-c:v', 'libx264', // Codec de video
    '-preset', 'ultrafast', // Opciones de codificación
    '-tune', 'zerolatency',
    '-f', 'flv', // Formato de salida
    'http://localhost:3000/live/streamKey', // URL de transmisión
]);

ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ffmpeg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});*/

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

app.get('/adaptive', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adaptive.html'));
});

app.get('/adaptative/v1', (req, res) => {
    const videoPath = './media/dash/out.mpd'
    res.sendFile(videoPath, { root: __dirname })
})

app.listen(port, () => {
    console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
