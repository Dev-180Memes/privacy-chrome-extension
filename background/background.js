// Initialize default settings if they do not exist
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['blockTrackers', 'enableDNT', 'secureDNS'], (data) => {
        if (data.blockTrackers === undefined) {
            chrome.storage.sync.set({ blockTrackers: true });
        }
        if (data.enableDNT === undefined) {
            chrome.storage.sync.set({ enableDNT: true });
        }
        if (data.secureDNS === undefined) {
            chrome.storage.sync.set({ secureDNS: true });
        }
    });
});
  
// Update the extension's behavior based on stored settings
function updateSettings() {
    chrome.storage.sync.get(['blockTrackers', 'enableDNT', 'secureDNS'], (data) => {
        updateBlockTrackers(data.blockTrackers);
        updateDNTHeader(data.enableDNT);
        updateSecureDNS(data.secureDNS);
    });
}
  
// Function to update tracker blocking
function updateBlockTrackers(enabled) {
    if (enabled) {
        chrome.webRequest.onBeforeRequest.addListener(
            blockTrackersHandler,
            { urls: ["<all_urls>"] },
            ["blocking"]
        );
    } else {
        chrome.webRequest.onBeforeRequest.removeListener(blockTrackersHandler);
    }
}
  
function blockTrackersHandler(details) {
    const trackers = [
        "*://*.doubleclick.net/*",
        "*://*.google-analytics.com/*",
        "*://*.adservice.google.com/*",
        "*://*.trackingdomain.com/*"
        // Add more tracking domains here
    ];

    for (let tracker of trackers) {
        if (details.url.includes(tracker)) {
            return { cancel: true };
        }
    }
    return { cancel: false };
}
  
// Function to update DNT header
function updateDNTHeader(enabled) {
    if (enabled) {
        chrome.webRequest.onBeforeSendHeaders.addListener(
            dntHeaderHandler,
            { urls: ["<all_urls>"] },
            ["blocking", "requestHeaders"]
        );
    } else {
        chrome.webRequest.onBeforeSendHeaders.removeListener(dntHeaderHandler);
    }
}
  
function dntHeaderHandler(details) {
    details.requestHeaders.push({ name: "DNT", value: "1" });
    return { requestHeaders: details.requestHeaders };
}
  
// Function to update secure DNS
function updateSecureDNS(enabled) {
    if (enabled) {
        chrome.privacy.network.webRTCIPHandlingPolicy.set({ value: 'default_public_interface_only' });
        chrome.privacy.network.networkPredictionEnabled.set({ value: false });
    } else {
        chrome.privacy.network.webRTCIPHandlingPolicy.clear({});
        chrome.privacy.network.networkPredictionEnabled.clear({});
    }
}
  
// Listen for changes in settings and update the extension's behavior accordingly
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'blockTrackers') {
            updateBlockTrackers(newValue);
        }
        if (key === 'enableDNT') {
            updateDNTHeader(newValue);
        }
        if (key === 'secureDNS') {
            updateSecureDNS(newValue);
        }
    }
});

// Initial settings load
updateSettings();
  