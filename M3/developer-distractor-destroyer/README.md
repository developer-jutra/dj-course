# Developer Distractor Destroyer (DDD) Chrome Extension

A productivity-focused Chrome extension that **blocks distracting websites** (with wildcard support) and **tracks your browsing time** with second-level accuracy. Features a beautiful UI, real-time updates, inactivity detection, and a motivational custom block page.

## Features

- **Website Blocking**
  - Block any site or domain (supports wildcards, e.g. `*.facebook.com`)
  - Toggle blocking on/off easily
  - Custom block page with productivity tips and motivational quotes

- **Time Tracking**
  - Tracks time spent on each website (active tab only)
  - Second-level precision, real-time updates
  - Excludes time when tab is inactive or browser is unfocused
  - Browsing analytics: see your top sites by time spent

- **User Interface**
  - Clean, modern popup UI
  - Easy configuration of blocked sites
  - Live session timer and per-site time stats
  - Clear all data with one click

- **Local Storage**
  - All data is stored locally (no external servers)

## Installation

1. **Download the Source**
   - Download or clone this repository.

2. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the folder containing these files

3. **Start Using**
   - The extension icon will appear in your toolbar.
   - Click to open the popup and configure your blocking/time tracking.

## Usage

### Blocking Websites

1. Open the extension popup.
2. Enter a domain (e.g. `facebook.com` or `*.reddit.com`) and click "Add".
3. Toggle "Block websites" on/off as needed.
4. Blocked sites show a custom motivational page.

### Time Tracking

- See time spent on the current site (live, updates every second).
- View your top 10 sites by time spent.
- Click "Clear All Data" to reset stats.

### Wildcard Examples

- `facebook.com` — blocks facebook.com and all its subpages
- `*.reddit.com` — blocks all Reddit subdomains (e.g. www.reddit.com, old.reddit.com)
- `youtube.com` — blocks YouTube

## File Structure

```
developer-distractor-destroyer/
│
├── manifest.json         # Chrome extension manifest (MV3)
├── popup.html            # Popup UI
├── popup.js              # Popup logic
├── background.js         # Background service worker (time tracking)
├── content.js            # Content script (activity detection)
├── blocked.html          # Custom block page
├── rules.json            # Declarative net request rules template
└── README.md             # This documentation
```

## Permissions

- `storage` — Store settings and time data locally
- `activeTab` — Detect the current active tab
- `declarativeNetRequest` — Block/redirect websites
- `tabs` — Listen for tab changes
- `host_permissions: ` — Needed to monitor and block all websites

## Privacy

All data is stored **locally** in your browser. No data is ever sent to any server.

## Productivity Tips (from the Block Page)

- Focus on one task at a time
- Use the Pomodoro Technique: work 25 min, rest 5 min
- Make a daily to-do list
- Take short breaks and deep breaths
- Move your body for mental clarity

## License

MIT License

**Stay focused, achieve more!**
