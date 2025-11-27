document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');
    const storageKeys = [
        'timeData', 
        'gotchaStats', 
        'isBlocking', 
        'blockedWebsites', 
        'currentSessionTime'
    ];

    function createSection(key, data) {
        const section = document.createElement('div');
        section.className = 'data-section';

        const header = document.createElement('div');
        header.className = 'section-header';
        
        const title = document.createElement('h2');
        title.textContent = key;
        
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.textContent = '▶';

        header.appendChild(title);
        header.appendChild(arrow);

        const content = document.createElement('div');
        content.className = 'section-content';
        const pre = document.createElement('pre');
        pre.textContent = JSON.stringify(data, null, 2);
        content.appendChild(pre);

        section.appendChild(header);
        section.appendChild(content);
        
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
        });

        return section;
    }

    chrome.storage.local.get(storageKeys, (result) => {
        storageKeys.forEach(key => {
            const data = result[key] !== undefined ? result[key] : 'Not set';
            const sectionElement = createSection(key, data);
            dataContainer.appendChild(sectionElement);
        });
    });
}); 