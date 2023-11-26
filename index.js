const express = require('express');
// const HLSServer = require('hls-server');
// const http = require('http');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const app = express();
const port = 3000;

// const NodeMediaServer = require('node-media-server');

// const config = {
//     rtmp: {
//         port: 1935,
//         chunk_size: 60000,
//         gop_cache: true,
//         ping: 30,
//         ping_timeout: 60
//     },
//     http: {
//         port: 8000,
//         mediaroot: './media',
//         allow_origin: '*'
//     },
//     trans: {
//         ffmpeg: 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe',
//         tasks: [
//             {
//                 app: 'live',
//                 hls: true,
//                 hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
//                 hlsKeep: true, // to prevent hls file delete after end the stream
//             }
//         ]
//     }
// };

// const nms = new NodeMediaServer(config);

// nms.run();

// // Manejo de conexiones WebSocket
// nms.on('preConnect', (id, args) => {
//     console.log('[Node Media Server] WebSocket conectado:', id);
// });

// nms.on('doneConnect', (id, args) => {
//     console.log('[Node Media Server] WebSocket desconectado:', id);
// });

// // Emitir mensajes a través de WebSocket cuando un nuevo stream HLS está disponible
// nms.on('postConnect', (id, args) => {
//     if (nms.wsServer && nms.wsServer.connections) {
//         const streamPath = args.streamPath;
//         nms.wsServer.connections.forEach((connection) => {
//             connection.send(JSON.stringify({ action: 'hlsStream', streamPath }));
//         });
//     }
// });

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/hls/:streamName/index.m3u8', (req, res) => {
//     const streamName = req.params.streamName;
//     const hlsStreamPath = `${streamName}/index.m3u8`;

//     console.log(`Este es el hlsStreamPath: ${hlsStreamPath}`)

//     res.writeHead(200, {
//         'Content-Type': 'application/vnd.apple.mpegurl',
//         'Cache-Control': 'no-cache',
//         'Access-Control-Allow-Origin': '*',
//     });

//     res.write('#EXTM3U\n');
//     res.write('#EXT-X-VERSION:3\n');
//     res.write(`#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.64001e,mp4a.40.2"\n`);
//     res.write(`${hlsStreamPath}\n`);
//     res.end();
// });

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



// app.get('/hls/:streamName/index.m3u8', (req, res) => {

//     console.log("HA ENTRADO EN EL GET")

//     const streamName = req.params.streamName;
//     const hlsStreamPath = `hls/${streamName}`;

//     // Configurar cabeceras HTTP para el flujo HLS
//     res.writeHead(200, {
//         'Content-Type': 'application/vnd.apple.mpegurl',
//         'Cache-Control': 'no-cache',
//         'Access-Control-Allow-Origin': '*',
//     });



//     // Ejecutar FFmpeg para generar el archivo M3U8 usando fluent-ffmpeg
//     ffmpeg(`rtmp://localhost:1935/${streamName}`)
//         .output(`${hlsStreamPath}/index.m3u8`)
//         .outputFormat('hls')
//         .on('error', (err) => {
//             console.error(`Error en la transcodificación: ${err.message}`);
//             res.status(500).send('Error en la transcodificación');
//         })
//         .pipe(res, { end: true });
// });

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
