document.getElementById('openTabButton').addEventListener('click', () => {
     chrome.tabs.create({ url: 'https://www.google.com' });
   });