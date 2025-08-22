# pixel-adNPM

Este script es **parametrizable** y no incluye valores de producción.

**Prioridad de configuración (de mayor a menor):**

1. Variable global `window.__ADNPM_CONFIG__`
2. Atributos `data-*` en la etiqueta `<script>`
3. Query params en el `src` del `<script>`

> **WebSocket:** `wsHost` puede ser una **URL completa** (`wss://host:puerto`) o solo un **host** (`mi-dominio.com`) y combinarlo con `wsPort`.
> Si se pasa URL completa con puerto, `wsPort` es opcional.
> **Importante:** usar `wss://` cuando página cargue por `https://`.

> **Nota:** `pixelName` debe coincidir con el **nombre del fichero del pixel** que estás cargando. El script lo usa para localizarse a sí mismo y leer macros del `src`.

---

## A) Configuración Global (`window.__ADNPM_CONFIG__`)

```html
<script>
  window.__ADNPM_CONFIG__ = {
    pixelName: 'pixel_name.js',
    pixelVersion: 'pixel_version',
    wsHost: 'wss://mi-ws.mi-dominio.com',  // o 'mi-dominio.com'
    wsPort: 'numero',

    /* Parámetros de medición de ancho de banda */
    videoUrl: 'https://cdn.ejemplo.com/video/mi_video.mp4',
    videoName: 'mi_video.mp4',
    numFetches: 12,
    timeout: 7500,
    refreshingTime: 200,
    totalWaitingTime: 1500
  };
</script>
<script src="/pixel-adNPM.js"></script>
```

---

## B) Atributos `data-*` en el `<script>`

```html
<script
  src="/pixel-adNPM.js"
  data-pixel-name="pixel_name.js"
  data-pixel-version="pixel_version"
  data-ws-host="mi-dominio.com"
  data-ws-port="numero"
  data-video-url="https://cdn.ejemplo.com/video/mi_video.mp4"
  data-video-name="mi_video.mp4"
  data-num-fetches="12"
  data-timeout="7500"
  data-refreshing-time="200"
  data-total-waiting-time="1500"
></script>
```

---

## C) Query params en el `src`

```html
<script src="/pixel-adNPM.js
  ?pixelName=pixel_name.js
  &pixelVersion=pixel_version
  &wsHost=mi-dominio.com
  &wsPort=numero
  &videoUrl=https%3A%2F%2Fcdn.ejemplo.com%2Fvideo%2Fmi_video.mp4
  &videoName=mi_video.mp4
  &numFetches=12
  &timeout=7500
  &refreshingTime=200
  &totalWaitingTime=1500"></script>
```

---

## Campos disponibles

* `pixelName` (string) — **Requerido**: nombre del fichero del pixel (se usa para localizar el propio `<script>` y leer macros).
* `pixelVersion` (string) — Recomendado: versión que se reporta en los mensajes.
* `wsHost` (string) — Requerido: host del WebSocket.

  * URL completa: `wss://host:puerto`
  * Solo host (sin esquema): `mi-dominio.com`
* `wsPort` (string/número) — Opcional si `wsHost` ya incluye puerto.

**Parámetros de medición:**

* `videoUrl` (string) — URL de vídeo **fallback** para medir ancho de banda si no se detecta el recurso de la página.
* `videoName` (string) — Nombre de archivo del vídeo para **detectar entre los recursos de la página** (si se encuentra, se usa ese).
* `numFetches` (número) — Descargas repetidas para calcular el promedio.
* `timeout` (ms) — Tiempo máximo por fetch antes de abortar.
* `refreshingTime` (ms) — Intervalo para escanear recursos de la página.
* `totalWaitingTime` (ms) — Tiempo máximo esperando a detectar el vídeo de la página antes de usar `videoUrl`.

### Macros opcionales (en el `src` del `<script>`)

El pixel admite parámetros adicionales por query, leídos del propio `src`:

* `uuid`
* `lat`
* `lon`
* `geotype`

---

## Notas de funcionamiento

* Si el script detecta un recurso cuyo nombre **incluye** `videoName`, usará ese para la medición. Si no, usará `videoUrl` como fallback.
* La URL del WebSocket se construye con `wsHost`/`wsPort` y el esquema según la página (`wss://` si la página está en HTTPS).

---

## Troubleshooting

* **No conecta al WS**: revisa `wsHost`/`wsPort`, el esquema (`wss://` en HTTPS) y la configuración del backend / reverse proxy (soporte de WebSocket).
* **No se detecta el vídeo**: verifica que `videoName` coincida (al menos como substring) con el nombre del recurso en la página, o proporciona un `videoUrl` válido como fallback.
