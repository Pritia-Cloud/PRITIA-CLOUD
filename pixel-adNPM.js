// ======= adNPM Pixel — Config parametrizable =======
(function () {
  const DEFAULT_CONFIG = {
    pixelName:        'CHANGE_ME.js',
    pixelVersion:     'CHANGE_ME',
    wsPort:           'PORT_NUMBER',
    videoUrl:         'CHANGE_ME',
    videoName:        'CHANGE_ME',
    numFetches:       12,
    timeout:          7500,
    refreshingTime:   200,
    totalWaitingTime: 1500,
    wsHost:           null,
  };

  function getCurrentScript() {
    const cs = document.currentScript;
    if (cs) return cs;
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1] || null;
  }

  function parseQuery(qs) {
    const out = {};
    if (!qs) return out;
    const q = qs.replace(/^[^?]*\?/, '');
    if (!q) return out;
    for (const part of q.split('&')) {
      const [k, v] = part.split('=');
      if (!k) continue;
      out[decodeURIComponent(k)] = v ? decodeURIComponent(v.replace(/\+/g, ' ')) : '';
    }
    return out;
  }

  function resolveConfig() {
    const cfg = { ...DEFAULT_CONFIG, ...(window.__ADNPM_CONFIG__ || {}) };
    const s = getCurrentScript();

    // Atributos data-* en el <script>
    if (s && s.dataset) {
      const d = s.dataset;
      if (d.pixelName)        cfg.pixelName        = d.pixelName;
      if (d.pixelVersion)     cfg.pixelVersion     = d.pixelVersion;
      if (d.wsPort)           cfg.wsPort           = d.wsPort;
      if (d.videoUrl)         cfg.videoUrl         = d.videoUrl;
      if (d.videoName)        cfg.videoName        = d.videoName;
      if (d.numFetches)       cfg.numFetches       = Number(d.numFetches);
      if (d.timeout)          cfg.timeout          = Number(d.timeout);
      if (d.refreshingTime)   cfg.refreshingTime   = Number(d.refreshingTime);
      if (d.totalWaitingTime) cfg.totalWaitingTime = Number(d.totalWaitingTime);
      if (d.wsHost)           cfg.wsHost           = d.wsHost;
    }

    // Overrides vía query params del src
    if (s && s.src) {
      const q = parseQuery(s.src);
      if (q.pixelName)        cfg.pixelName        = q.pixelName;
      if (q.pixelVersion)     cfg.pixelVersion     = q.pixelVersion;
      if (q.wsPort)           cfg.wsPort           = q.wsPort;
      if (q.videoUrl)         cfg.videoUrl         = q.videoUrl;
      if (q.videoName)        cfg.videoName        = q.videoName;
      if (q.numFetches)       cfg.numFetches       = Number(q.numFetches);
      if (q.timeout)          cfg.timeout          = Number(q.timeout);
      if (q.refreshingTime)   cfg.refreshingTime   = Number(q.refreshingTime);
      if (q.totalWaitingTime) cfg.totalWaitingTime = Number(q.totalWaitingTime);
      if (q.wsHost)           cfg.wsHost           = q.wsHost;
    }

    return cfg;
  }

  window.__ADNPM_CFG__ = resolveConfig();
})();


const {
  pixelName,
  pixelVersion,
  wsPort,
  videoUrl,
  videoName,
  numFetches,
  timeout,
  refreshingTime,
  totalWaitingTime,
  wsHost,
  enableIPInfo
} = window.__ADNPM_CFG__;

const video_name = videoName;
const ws_port_prod = wsPort;


function getMacrosBid() {
    var uuid, lat, lon, geotype;
    uuid = lat = lon = geotype = null;
    let urlScript, currentScript;
    let macros = {};

    let scripts = document.getElementsByTagName('script');
    if (!scripts.length > 0) return 'noScr';
    for (let i = 0; i < scripts.length; i++) {
        urlScript = scripts[i].getAttribute("src");
        if (urlScript) {
            if (urlScript.indexOf(pixelName) > -1) {
                currentScript = scripts[i];
            }
        }
    }
    if (!currentScript) return 'notFnd';
    if (currentScript) {
        let queryString = currentScript.src.replace(/^[^?]+\??/, '');
        if (!queryString) return 'empty';
        let Pairs = queryString.split(/[&]/);
        for (let i = 0; i < Pairs.length; i++) {
            let KeyVal = Pairs[i].split('=');
            if (!KeyVal || KeyVal.length !== 2) continue;
            let key = decodeURIComponent(KeyVal[0]);
            let val = decodeURIComponent(KeyVal[1]);
            val = val.replace(/\+/g, ' ');
            macros[key] = val;
        }
        uuid = macros.uuid;
        lat = macros.lat;
        lon = macros.lon;
        geotype = macros.geotype;
    }
    return {uuid, lat, lon, geotype}
};
const macrosBid = getMacrosBid();

const idAd = new Date().valueOf() + Math.random().toFixed(14).substring(2);


function getUserAgent() {
    const ua = 'userAgent' in navigator ? navigator.userAgent : 'NA';
    return ua;
};
const userAgent = getUserAgent();

function getDNTsettings() {
    if ('doNotTrack' in navigator || 'doNotTrack' in window || 'msDoNotTrack' in navigator) {
        if (navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || window.doNotTrack == "1" || navigator.msDoNotTrack == "1") {
            return 'enabled';
        } else {
            return 'disabled';
        }
    } else {
        return 'NA';
    }
};
const dntSettings = getDNTsettings();

function getReferer() {
    const ref = 'referrer' in document ? document.referrer : 'NA';
    return ref;
};
const referer = getReferer();

function getURL() {
    const url = 'URL' in document ? document.URL : 'NA';
    return url;
};
const url = getURL();

function getTimeZOffset() {
    const tZoneOffset = 'getTimezoneOffset' in new Date() ? new Date().getTimezoneOffset() : 'NA';
    return tZoneOffset;
};
const timeZOffset = getTimeZOffset();

function getNetInfo() {
    var downlink, downlinkMAX, effectiveType, rtt, saveData, type;
    downlink = downlinkMAX = effectiveType = rtt = saveData = type = null;

    if (navigator?.connection) {
        downlink = navigator.connection.downlink;
        effectiveType = navigator.connection.effectiveType;
        rtt = navigator.connection.rtt;
        saveData = navigator.connection.saveData;

        if (navigator?.connection?.downlinkMax ) {
            downlinkMAX = navigator.connection.downlinkMAX;
        }
        if (navigator?.connection?.type ) {
            type = navigator.connection.type;
        }
    }
    return {
        downlink,
        downlinkMAX,
        effectiveType,
        rtt,
        saveData,
        type
    };
};
const netInfo = getNetInfo();

function getScreenSettings() {
    const screenColorDepth = 'colorDepth' in screen ? screen.colorDepth : 'NA';
    const screenOrientation = 'orientation' in screen ? screen.orientation : 'NA';
    if(!window.screenLeft) {
        window.screenLeft = window.screenX;
    }
    const screenLeft = 'screenLeft' in window ? window.screenLeft : 'NA';
    const innerWidth = 'innerWidth' in window ? window.innerWidth : 'NA';
    const innerHeight = 'innerHeight' in window ? window.innerHeight : 'NA';
    const outerWidth = 'outerWidth' in window ? window.outerWidth : 'NA';
    const outerHeight = 'outerHeight' in window ? window.outerHeight : 'NA';
    return {
        screenColorDepth,
        screenOrientation,
        screenLeft,
        innerWidth,
        innerHeight,
        outerWidth,
        outerHeight,
    };
};
const screenSettings = getScreenSettings();

function getDisplayWindow() {
    const availWidth = 'availWidth' in screen ? screen.availWidth : 'NA';
    const availHeight = 'availHeight' in screen ? screen.availHeight : 'NA';
    const availLeft = 'availLeft' in screen ? screen.availLeft : 'NA';
    const availTop = 'availTop' in screen ? screen.availTop : 'NA';

    const fullScreenEnabled = 'fullscreenEnabled' in document ? document.fullscreenEnabled : 'NA';
    
    return {
        availWidth,
        availHeight,
        availLeft,
        availTop,
        fullScreenEnabled
    };
};
const displayWindow = getDisplayWindow();



async function measureConnectionSpeed(resources, resourceNames, videoResource, videoAvailable) {
    var fullVideoAddr;
    var snitchRes = [];
    var creativitySizeRes = [];
    var durationRes = [];

    const otherFetches = [];
    for (let i = 0; i < numFetches; i++) {
        const cacheBuster = "?r=" + Math.random();
        if (videoAvailable) {
            fullVideoAddr = videoResource.name + cacheBuster;
        } else {
            fullVideoAddr = videoUrl + cacheBuster;
        }        
        const fetchPromise = fetch(fullVideoAddr);
        otherFetches.push(performFetch(fetchPromise, i, snitchRes, creativitySizeRes, durationRes));
    }

    await Promise.all(otherFetches);

    const snitchArray = [];
    const creativitySizeArray = [];
    const durationArray = [];

    let speedMbpsAverage = 0;
    let creativitySizeAverage = 0;
    let largestcreativitySizeAverage = 0;
    let smallestcreativitySizeAverage = 0;
    let durationAverage = 0;
    let durationDiscardedAverage = 0;
    let difTimeDurationAverage = 0;
    let timeDurationAverage = 0;

    for (let i = 0; i < numFetches; i++) {
        snitchArray.push(snitchRes[i].snitch);
        creativitySizeArray.push(creativitySizeRes[i].bytesRead);
        durationArray.push(durationRes[i].duration.toFixed(5));
    }

    const snitchCorrespValue = [];
    const snitchDiscardedValue = [];
    const largestCreativitySize = [];
    const smallestCreativitySize = [];
    const durationCorrespValue = [];
    const durationDiscardedValue = [];
    const selectedIndexes = [];
    for (let i = 0; i < creativitySizeArray.length; i++) {
        const currentValue = creativitySizeArray[i];
        if (largestCreativitySize.length < 6 || currentValue > Math.min(...largestCreativitySize)) {
            largestCreativitySize.push(currentValue);
            selectedIndexes.push(i);
            if (largestCreativitySize.length > 6) {
                const minValueCreativitySize = Math.min(...largestCreativitySize);
                const minIndexCreativitySize = largestCreativitySize.indexOf(minValueCreativitySize);
                largestCreativitySize.splice(minIndexCreativitySize, 1);
                selectedIndexes.splice(minIndexCreativitySize, 1);
            }
        }
    }
    for (const index of selectedIndexes) {
        durationCorrespValue.push(durationArray[index]);
        snitchCorrespValue.push(snitchArray[index]);
    }
    for (let j = 0; j < numFetches; j++) {
        if (!selectedIndexes.includes(j)) {
            durationDiscardedValue.push(durationArray[j]);
            snitchDiscardedValue.push(snitchArray[j]);
            smallestCreativitySize.push(creativitySizeArray[j]);
        }
    }

    for (let k = 0; k < largestCreativitySize.length; k++) {
        largestcreativitySizeAverage += largestCreativitySize[k];
        smallestcreativitySizeAverage += smallestCreativitySize[k];
        durationAverage += parseFloat(durationCorrespValue[k]);
        durationDiscardedAverage += parseFloat(durationDiscardedValue[k]);
    }

    if (numFetches === 6) {
        difTimeDurationAverage = durationAverage / 6;
        smallestcreativitySizeAverage = largestcreativitySizeAverage;
    } else {
        difTimeDurationAverage = (durationDiscardedAverage - durationAverage) /6;
    }
    if (difTimeDurationAverage <= 2) {
        timeDurationAverage = durationAverage / 6;
        creativitySizeAverage = largestcreativitySizeAverage;
        speedMbpsAverage = (creativitySizeAverage * 8 / 1024 / 1024) / timeDurationAverage;
    } else if (difTimeDurationAverage > 2) {
        timeDurationAverage = difTimeDurationAverage;
        creativitySizeAverage = smallestcreativitySizeAverage;
        speedMbpsAverage = (creativitySizeAverage * 8 / 1024 / 1024) / timeDurationAverage;
    }
    speedMbpsAverage = (speedMbpsAverage).toFixed(2);

    doSendJSONdata1(resources, resourceNames, creativitySizeArray, durationArray, videoAvailable, snitchArray, speedMbpsAverage)
}
async function performFetch(fetchPromise, index, snitchRes, creativitySizeRes, durationRes) {
    var snitch;
    let bytesRead = 0;
    var startTime, endTime;
    var speed, duration;

    startTime = performance.now();

    try {
        const response = await fetchPromise;

        const reader = response.body && response.body.getReader();

        if (!reader) {
            throw new Error(`El cuerpo de la respuesta no es legible en el fetch ${index}`);
        }

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                snitch = 'download';
                break;
            }

            bytesRead += value.length;

            if ((performance.now() - startTime) > timeout) {
                reader.cancel();
                snitch = 'time';
                break;
            }
        }

        endTime = performance.now();

        duration = (endTime - startTime) / 1000;
        console.log(`Fetch ${index} - Tiempo: ${duration.toFixed(2)} segundos, Descargado: ${(bytesRead / 1000 / 1000).toFixed(2)} MB`);

        snitchRes[index] = {snitch}
        creativitySizeRes[index] = { bytesRead };
        durationRes[index] = { duration };
    } catch (error) {
        snitchRes[index] = { snitch: 'error' };
        creativitySizeRes[index] = { bytesRead: NaN };
        durationRes[index] = { duration: NaN };
    }
}


async function InitiateSpeedDetection(resources, resourceNames, videoResource, videoAvailable) {
    await measureConnectionSpeed(resources, resourceNames, videoResource, videoAvailable);
};


const __wsURL = (() => {
  const h = wsHost || location.host;
  const scheme = location.protocol === 'https:' ? 'wss://' : 'ws://';
  if (/^wss?:\/\//i.test(h)) return h;
  return scheme + h + (ws_port_prod ? ':' + ws_port_prod : '');
})();
const ws = new WebSocket(__wsURL);

ws.addEventListener('open', async () => {
    try{
        var res = performance.getEntriesByType("resource");
        var resNames = [];
        for (let i = 0; i < res.length; i++) {
            resNames.push(res[i].name)
        }
        doSendJSONdata0(res, resNames);

        var videoAvailable = false;
        var resources = [];
        var resourceNames = [];
        var videoResource = null;

        var getResourceInterval;
        var initiateSpeedTimeout;

        function getResources() {
            var currentResources = performance.getEntriesByType("resource");
            var currentResourceNames = [];
            for (let i = 0; i < currentResources.length; i++) {
                currentResourceNames.push(currentResources[i].name);
            }
            resources.push(...currentResources);
            resourceNames.push(...currentResourceNames);
            var videoResource = resources.find(function(resource) {
                return resource.name.includes(video_name);
            });
            
            if (videoResource) {
                videoAvailable = true;
                clearInterval(getResourceInterval);
                clearTimeout(initiateSpeedTimeout);
                InitiateSpeedDetection(resources, resourceNames, videoResource, videoAvailable);
            }
        }
        getResourceInterval = setInterval(getResources, refreshingTime);
        initiateSpeedTimeout = setTimeout(function () {
            clearInterval(getResourceInterval);
            clearTimeout(initiateSpeedTimeout);
            InitiateSpeedDetection(resources, resourceNames, videoResource, videoAvailable);
        }, totalWaitingTime);


        const observer = new ReportingObserver((reports, observer) => {
            doSendJSONdataXXX(reports);
        }, { buffered: true });
        observer.observe();


    } catch {}
});

function doSendJSONdataXXX(reports) {
    return new Promise((resolve, reject) => {
        const JSONdataXXX = {
            "idAd": idAd,
            "heavyAdIntervention": 'false',
            "reportsAdIntervention": reports,

        }  
        ws.send(JSON.stringify(JSONdataXXX));
        resolve();
    });
}

function doSendJSONdata0(res, resNames) {
    return new Promise((resolve, reject) => {
        const JSONdata0 = {
            "idAd": idAd,
            "uuid": macrosBid.uuid,
            "latitude": macrosBid.lat,
            "longitude": macrosBid.lon,
            "geotype": macrosBid.geotype,
            "vPixel": pixelVersion,
            "ua": userAgent,
            "dnt": dntSettings,
            "ref": referer,
            "url": url, 
            "tZoneOffset": timeZOffset,
            "netInfo": {
                "downlink": netInfo.downlink,
                "downlinkMAX": netInfo.downlinkMAX,
                "effectiveType": netInfo.effectiveType,
                "rtt": netInfo.rtt,
                "saveData": netInfo.saveData,
                "type": netInfo.type,
            },
            "screen": {
                "screenColorDepth": screenSettings.screenColorDepth,
                "screenOrientation": {
                    "angle": screenSettings.screenOrientation?.angle ?? null,
                    "type":  screenSettings.screenOrientation?.type  ?? null,
                },
                "screenLeft": screenSettings.screenLeft,
                "screenInnerWidth": screenSettings.innerWidth,
                "screenInnerHeight": screenSettings.innerHeight,
                "screenOuterWidth": screenSettings.outerWidth,
                "screenOuterHeight": screenSettings.outerHeight,
            },
            "displayWindow": {
                "availWidth": displayWindow.availWidth,
                "availHeight": displayWindow.availHeight,
                "availLeft": displayWindow.availLeft,
                "availTop": displayWindow.availTop,
                "fullScreenEnabled": displayWindow.fullScreenEnabled,
            },
            "initialResources": res,
            "initialResNames": resNames,
        }
        ws.send(JSON.stringify(JSONdata0));
        resolve();
    });
};

function doSendJSONdata1(resources, resourceNames, creativitySizeArray, durationArray, videoAvailable, snitchArray, speedMbpsAverage) {
    return new Promise((resolve, reject) => {
        const JSONdata1 = {
            "idAd": idAd,
            "finalResources": resources,
            "finalResNames": resourceNames,
            "creativitySize": creativitySizeArray,
            "duration": durationArray,
            "creativityAvailable": videoAvailable,
            "speedADvideoURL": speedMbpsAverage,
            "abortionSnitch": snitchArray,
        }
        ws.send(JSON.stringify(JSONdata1));
        resolve();
    });
};
