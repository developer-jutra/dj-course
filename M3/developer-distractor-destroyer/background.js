// Background service worker for time tracking
let currentTabId = null;
let currentDomain = null;
let startTime = null;
let isActive = false;

// let isBlocking = true;
// let blockedWebsites = [];

// Initialize when extension starts
chrome.runtime.onStartup.addListener(initializeExtension);
chrome.runtime.onInstalled.addListener(initializeExtension);

function initializeExtension() {
    console.log('Developer Distractor Destroyer initialized');
    loadSettingsFromStorage();
    console.log('initialize')

    // Initialize storage
    chrome.storage.local.get(['timeData', 'currentSessionTime', 'gotchaStats'], function(result) {
        if (!result.timeData) {
            chrome.storage.local.set({timeData: {}});
        }
        if (!result.currentSessionTime) {
            chrome.storage.local.set({currentSessionTime: 0});
        }
        if (!result.gotchaStats) {
            chrome.storage.local.set({gotchaStats: {}});
        }
    });

    // Start tracking current tab
    // startContinuousTracking();
    // setInterval(monitorIfBlocked, 3000);
    chrome.alarms.create('timeTracker', { periodInMinutes: 1 / 60 }); // 1 second
    chrome.alarms.create('blocker', { periodInMinutes: 3 / 60 }); // 3 seconds
}

function trackActiveTab() {
    chrome.windows.getLastFocused({ populate: false, windowTypes: ['normal'] }, (window) => {
        if (!window || !window.focused) {
            return;
        }

        chrome.tabs.query({active: true, windowId: window.id}, (tabs) => {
            if (!tabs || tabs.length === 0) {
                return;
            }

            const tab = tabs[0];
            const extensionUrl = `chrome-extension://${chrome.runtime.id}`;
            if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith(extensionUrl)) {
                return;
            }

            chrome.idle.queryState(60, (state) => {
                if (state === 'active') {
                    try {
                        const url = new URL(tab.url);
                        const domain = url.hostname;
                        updateTime(domain);
                    } catch (error) {
                        console.log('Invalid URL for tracking:', tab.url);
                    }
                }
            });
        });
    });
}

function updateTime(domain) {
    chrome.storage.local.get(['timeData', 'currentSessionTime'], (result) => {
        const timeData = result.timeData || {};
        const currentSessionTime = result.currentSessionTime || 0;

        timeData[domain] = (timeData[domain] || 0) + 1;

        chrome.storage.local.set({
            timeData: timeData,
            currentSessionTime: currentSessionTime + 1
        });
    });
}

function loadSettingsFromStorage() {
    console.log('loadSettingsFromStorage')
    chrome.storage.local.get(['isBlocking', 'blockedWebsites'], (result) => {
        if (result.isBlocking === undefined) {
            chrome.storage.local.set({ isBlocking: true });
        }
        if (result.blockedWebsites === undefined) {
            chrome.storage.local.set({ blockedWebsites: [] });
        }
        updateIconBadge();
    });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log('storage changed')
    if (changes.isBlocking) {
        // isBlocking = changes.isBlocking.newValue;
        updateIconBadge();
    }
    // if (changes.blockedWebsites) {
    //     blockedWebsites = changes.blockedWebsites.newValue || [];
    // }
});

function updateIconBadge() {
    chrome.storage.local.get('isBlocking', (result) => {
        const isBlocking = result.isBlocking === undefined ? true : result.isBlocking;
        if (isBlocking) {
            chrome.action.setBadgeText({ text: 'ON' });
            chrome.action.setBadgeBackgroundColor({ color: '#d93025' }); // Red
        } else {
            chrome.action.setBadgeText({ text: '' });
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('tabs onUpdated', { changeInfo, tab })

    if (!changeInfo.url) {
        return;
    }

    chrome.storage.local.get(['isBlocking', 'blockedWebsites'], (result) => {
        const isBlocking = result.isBlocking === undefined ? true : result.isBlocking;
        const blockedWebsites = result.blockedWebsites || [];

        if (!isBlocking) {
            return;
        }

        const url = new URL(changeInfo.url);
        const domain = url.hostname;

        const isBlocked = blockedWebsites.some(blockedSite => {
            if (blockedSite.startsWith('*.')) {
                return domain.endsWith(blockedSite.substring(2));
            }
            return domain === blockedSite;
        });

        if (isBlocked) {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked.html') });
            
            chrome.storage.local.get('gotchaStats', (result) => {
                const stats = result.gotchaStats || {};
                stats[domain] = (stats[domain] || 0) + 1;
                chrome.storage.local.set({ gotchaStats: stats });
            });
        }
    });
});

function monitorIfBlocked() {
    chrome.storage.local.get(['isBlocking', 'blockedWebsites'], (result) => {
        const isBlocking = result.isBlocking === undefined ? true : result.isBlocking;
        const blockedWebsites = result.blockedWebsites || [];
        if (!isBlocking) {
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs || tabs.length === 0 || !tabs[0].url) {
                return;
            }

            const tab = tabs[0];
            const blockedPageUrl = chrome.runtime.getURL('blocked.html');
            if (tab.url.startsWith(blockedPageUrl)) {
                return;
            }

            try {
                const url = new URL(tab.url);
                const domain = url.hostname;

                const isBlocked = blockedWebsites.some(blockedSite => {
                    if (blockedSite.startsWith('*.')) {
                        return domain.endsWith(blockedSite.substring(2));
                    }
                    return domain === blockedSite;
                });

                if (isBlocked) {
                    chrome.tabs.update(tab.id, { url: blockedPageUrl });
                    chrome.storage.local.get('gotchaStats', (result) => {
                        const stats = result.gotchaStats || {};
                        stats[domain] = (stats[domain] || 0) + 1;
                        chrome.storage.local.set({ gotchaStats: stats });
                    });
                }
            } catch (error) {
                // Ignore invalid URLs
            }
        });
    });
}

// Message handling
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getTimeData') {
        chrome.storage.local.get(['timeData', 'currentSessionTime', 'currentDomain'], function(result) {
            sendResponse({
                timeData: result.timeData || {},
                currentSessionTime: result.currentSessionTime || 0,
                currentDomain: result.currentDomain || ''
            });
        });
        return true;
    }

    if (request.action === 'resetSession') {
        chrome.storage.local.set({currentSessionTime: 0});
        sendResponse({success: true});
    }

    if (request.action === 'getCurrentDomain') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url) {
                try {
                    const url = new URL(tabs[0].url);
                    sendResponse({ domain: url.hostname });
                } catch (e) {
                    sendResponse({ domain: '' });
                }
            } else {
                sendResponse({ domain: '' });
            }
        });
        return true;
    }
});


chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'timeTracker') {
        trackActiveTab();
    } else if (alarm.name === 'blocker') {
        monitorIfBlocked();
    }
});

console.log('Background script loaded');
