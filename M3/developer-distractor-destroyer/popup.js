document.addEventListener('DOMContentLoaded', function() {
    const blockingToggle = document.getElementById('blockingToggle');
    const websiteInput = document.getElementById('websiteInput');
    const addWebsiteBtn = document.getElementById('addWebsite');
    const blockedSites = document.getElementById('blockedSites');
    const viewStatsBtn = document.getElementById('viewStats');

    let isBlocking = false;
    let blockedWebsites = [];

    // Initialize
    loadSettings();

    // Event listeners
    blockingToggle.addEventListener('click', toggleBlocking);
    addWebsiteBtn.addEventListener('click', addWebsite);
    websiteInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addWebsite();
        }
    });

    viewStatsBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('stats.html') });
    });

    // Load settings from storage
    function loadSettings() {
        chrome.storage.local.get(['isBlocking', 'blockedWebsites'], function(result) {
            isBlocking = result.isBlocking === undefined ? true : result.isBlocking;
            
            // On first run, initialize with LinkedIn if no sites are blocked
            if (result.blockedWebsites === undefined) {
                blockedWebsites = ["*.linkedin.com"];
                chrome.storage.local.set({ blockedWebsites: blockedWebsites });
            } else {
                blockedWebsites = result.blockedWebsites;
            }

            updateUI();
        });
    }

    // Update UI elements
    function updateUI() {
        blockingToggle.classList.toggle('active', isBlocking);
        updateBlockedSitesList();
    }

    // Toggle blocking on/off
    function toggleBlocking() {
        isBlocking = !isBlocking;
        chrome.storage.local.set({isBlocking: isBlocking});
        updateUI();
    }

    // Add website to blocked list
    function addWebsite() {
        const website = websiteInput.value.trim().toLowerCase();
        if (website && !blockedWebsites.includes(website)) {
            blockedWebsites.push(website);
            chrome.storage.local.set({blockedWebsites: blockedWebsites});
            updateUI();
            websiteInput.value = '';
        }
    }

    // Remove website from blocked list
    function removeWebsite(website) {
        blockedWebsites = blockedWebsites.filter(site => site !== website);
        chrome.storage.local.set({blockedWebsites: blockedWebsites});
        updateUI();
    }

    // Update blocked sites list in UI
    function updateBlockedSitesList() {
        blockedSites.innerHTML = '';
        blockedWebsites.forEach(site => {
            const siteItem = document.createElement('div');
            siteItem.className = 'site-item';

            const siteText = document.createElement('span');
            siteText.textContent = site;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => removeWebsite(site));

            siteItem.appendChild(siteText);
            siteItem.appendChild(removeBtn);
            blockedSites.appendChild(siteItem);
        });
    }
});