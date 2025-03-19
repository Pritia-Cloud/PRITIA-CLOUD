/** uc3m/IBiDat adNPM.@author Miguel A Bermejo Agueda <mibermej@pa.uc3m.es> **/

const pixelName = "uc3m_adFnpm.js";
const pixelVersion = "pixel_adFnpmV6";
const ws_port_prod = '3001';
const videoUrl = 'https://cdnsonata.taptapnetworks.com/video/5bd720b25f41e113d9057fcb/video_1689190067677_607d0b334.mp4';
const videoNAmeTAPTAP = "video_1689190067677_607d0b334.mp4";
let numFetches = 12;
const timeout = 7500;
const refreshingTime = 200
const totalWaitingTime = 1500;


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


async function getIPAddress() {
    try{
        const response = await fetch('https://api.ipify.org/?format=json');
        const jsonIP = await response.json();
        return jsonIP.ip;
    } catch {}
};
async function getIPApi() {
    try {
        const request = await fetch(`http://ip-api.com/json?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`);
        const jsonGeoIP = await request.json();
        return jsonGeoIP;
    } catch {}
};

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
    await doSendJSONdata2();
    await doSendJSONdata3();
};


const ws_host_prod = 'wss://zompopo3.it.uc3m.es';
const ws = new WebSocket(ws_host_prod + ':' + ws_port_prod);

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
                return resource.name.includes(videoNAmeTAPTAP);
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
                    "angle": screenSettings.screenOrientation.angle,
                    "type": screenSettings.screenOrientation.type,
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

async function doSendJSONdata2() {
    try {
        const IPAddress = await Promise.all([
            getIPAddress(),
        ]);
        return sendJSONdata2(IPAddress[0])
    } catch {}
}
function sendJSONdata2(outcomeIPAddress) {
    return new Promise((resolve, reject) => {
        const JSONdata2 = {
            "idAd": idAd,
            "IPaddress": outcomeIPAddress,
        }
        ws.send(JSON.stringify(JSONdata2));
        resolve();
    });
};

async function doSendJSONdata3() {
    try {
        const IPApi = await getIPApi()

        const res = await Promise.all([
            IPApi,
        ]);

        return sendJSONdata3(
            res[0], 
            )
    } catch {}
}
function sendJSONdata3(
    outcomeIPApi
    ) {
    return new Promise((resolve, reject) => {
        const JSONdata3 = {
            "idAd": idAd,
            "IPApi": {
                "ip": outcomeIPApi.query,
                "message": outcomeIPApi.message,
                "country": outcomeIPApi.country,
                "regionName": outcomeIPApi.regionName,
                "city": outcomeIPApi.city,
                "district": outcomeIPApi.district,
                "zip": outcomeIPApi.zip,
                "lat": outcomeIPApi.lat,
                "lon": outcomeIPApi.lon,
                "timezone": outcomeIPApi.timezone,
                "isp": outcomeIPApi.isp,
                "org": outcomeIPApi.org,
                "as": outcomeIPApi.as,
                "asname": outcomeIPApi.asname,
                "reverse": outcomeIPApi.reverse,
                "mobile": outcomeIPApi.mobile,
                "proxy": outcomeIPApi.proxy,
                "hosting": outcomeIPApi.hosting,
            },
        }
        ws.send(JSON.stringify(JSONdata3));
        resolve();
    });
};
