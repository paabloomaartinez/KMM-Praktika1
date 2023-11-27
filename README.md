# Streaming Plataforma

## Ngnix deskargatu

1. [Ngnix](https://github.com/illuspas/nginx-rtmp-win32) RTMP moduloarekin zerbitzariaren zip-a deskargatu eta deskonprimitu zure ordenagailuan.
2. Deskonprimitatutako karpeta ireki eta `nginx/conf` barruan, `nginx.conf` fitxeroa modificatu:
      ```
      worker_processes  1;
      error_log  logs/rtmp_error.log debug;
      pid        logs/nginx.pid;

      events {
          worker_connections  1024;
      }

      http {
          server {
              listen 8080;

              location /live {
                  # Serve HLS fragments

                  # CORS setup
                  add_header 'Access-Control-Allow-Origin' '*' always;
                  add_header 'Access-Control-Expose-Headers' 'Content-Length';

                  # allow CORS preflight requests
                  if ($request_method = 'OPTIONS') {
                      add_header 'Access-Control-Allow-Origin' '*';
                      add_header 'Access-Control-Max-Age' 1728000;
                      add_header 'Content-Type' 'text/plain charset=UTF-8';
                      add_header 'Content-Length' 0;
                      return 204;
                  }
                  types {
                      application/vnd.apple.mpegurl m3u8;
                      video/mp2t ts;
                  }
                  root /nginx/temp/;
                  add_header Cache-Control no-cache;
              }     
          }
      }

      rtmp {
          server {
              listen 1935;

              application live {
                  live on;
                  record off;
                  
                  hls on;
                  hls_path /nginx/temp/live;
              }

          }
      }
      ```

## OBS deskargatu

1. [OBS](https://obsproject.com/es/download) (Open Broadcaster Software) aplikazioa deskargatu.
2. Aplikazioa ireki eta _Emisio konfigurazioan_:
   1. Serbitzuan, _Pertsonalizatua_ aukeratu.
   2. Zerbitzarian, rtmp://localhost/live jarri.
   3. Pasahitza bezala, _stream_ hitza jarri.
   4. Konfigurazio berria gorde (_Aplikatu_ botoia sakatuz).

## Aplikazioa exekutatu

  1. [Biltegia](https://github.com/paabloomaartinez/KMM-Praktika1) GitHub-etik zure ordenagailura deskargatu/klonatu.
  2. [Esteka honetatik](https://drive.google.com/file/d/1hS1zaVo7MBBlKfYqd7raKJRTi2T92Hi1/view?usp=sharing) bideoa deskargatu eta txertatu proiektuaren direktorio honetan: `KMM_PRAKTIKA1/media/videos` 
  3. [Esteka honetatik](https://drive.google.com/file/d/1XQNf_bIi2oMC0bq4-5aTMOYQ1KX8q-mu/view?usp=sharing) irudia deskargatu eta txertatu proiektuaren direktorio honetan: `KMM_PRAKTIKA1/media/images`
  4. [Esteka honetatik](url) karpeta deskargatu eta txertatu proiektuaren direktorio honetan: `KMM_PRAKTIKA1/media/`
  5. Terminal batekin, praktikaren karpetaren barruan kokatu.
  6. Instalatu bulego guztiak: `npm install`
  7. Aplikazioa abiatu: `npm start`
  8. Ngnix abiatu.
  9. OBS-an stream-a abiatu.
  10. Aplikazioa ejekutatzen da http://localhost:3000 url-an.