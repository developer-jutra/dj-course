document.addEventListener('DOMContentLoaded', () => {
    const QUOTES_FILE = 'quotes.json';

    function getQuoteOfTheDay(quotes) {
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const daysSinceEpoch = Math.floor(Date.now() / oneDayInMillis);
        const quoteIndex = daysSinceEpoch % quotes.length;
        return quotes[quoteIndex];
    }

    fetch(QUOTES_FILE)
        .then(response => response.json())
        .then(quotes => {
            const quoteData = getQuoteOfTheDay(quotes);
            const quoteElement = document.getElementById('quote');
            const authorElement = document.getElementById('author');

            if (quoteElement && authorElement && quoteData) {
                quoteElement.textContent = `"${quoteData.quote}"`;
                authorElement.textContent = `- ${quoteData.author}`;
            }
        })
        .catch(error => {
            console.error('Error fetching quotes:', error);
            const quoteContainer = document.getElementById('quote-container');
            if (quoteContainer) {
                quoteContainer.textContent = 'Could not load a quote today. Stay focused!';
            }
        });
}); 