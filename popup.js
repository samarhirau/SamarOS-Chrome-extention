document.getElementById('newTabButton').addEventListener('click', () => {
     chrome.tabs.create({ url: 'https://www.google.com' });
   });

