const express = require('express');
// const HLSServer = require('hls-server');
// const http = require('http');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const app = express();
const port = 3000;

const NodeMediaServer = require('node-media-server');

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30,
    },
};

const nms = new NodeMediaServer(config);

// nms.on('postPublish', (id, streamPath, args) => {
//     // Transcodificación de RTMP a HLS usando ffmpeg
//     const hlsStreamPath = `hls${streamPath}`;
//     console.log("Este es el hlsStreamPath: ", hlsStreamPath)
//     console.log("Este es el streamPath: ", streamPath)

//     ffmpeg(`rtmp://localhost:1935${streamPath}`)
//         .output(`http://localhost:3000/${hlsStreamPath}/index.m3u8`)
//         .outputFormat('hls')
//         .on('end', () => console.log(`Transcodificación completa: ${hlsStreamPath}`))
//         .on('error', (err) => console.error(`Error en la transcodificación: ${err.message}`))
//         .run();
// });

nms.run();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/hls/:streamName/index.m3u8', (req, res) => {

    console.log("HA ENTRADO EN EL GET")

    const streamName = req.params.streamName;
    const hlsStreamPath = `hls/${streamName}`;

    // Configurar cabeceras HTTP para el flujo HLS
    res.writeHead(200, {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
    });



    // Ejecutar FFmpeg para generar el archivo M3U8 usando fluent-ffmpeg
    ffmpeg(`rtmp://localhost:1935/${streamName}`)
        .output(`${hlsStreamPath}/index.m3u8`)
        .outputFormat('hls')
        .on('error', (err) => {
            console.error(`Error en la transcodificación: ${err.message}`);
            res.status(500).send('Error en la transcodificación');
        })
        .pipe(res, { end: true });
});

// Intento de hacerlo con HLS
// const server = http.createServer(app);

// const hls = new HLSServer(server, {
//     path: '/live', // Ruta para acceder al stream HLS
//     dir: path.join(__dirname, 'streams'), // Directorio donde se guardarán los segmentos de video
// });

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
