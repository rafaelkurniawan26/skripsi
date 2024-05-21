document.addEventListener('DOMContentLoaded', function() {
    const scanButton = document.getElementById('scanButton');
    const apiUrlInput = document.getElementById('apiUrl');
    let currentUrl = '';
  
    // Get the current tab URL when the extension button is clicked
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      currentUrl = tabs[0].url;
      console.log('Current URL:', currentUrl);
    });
  
    scanButton.addEventListener('click', function() {

      if (apiUrl && currentUrl) {
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: currentUrl
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to send data to the API');
          }
          return response.json();
        })
        .then(data => {
          console.log('API response:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } else {
        alert('Please provide the API URL and ensure a webpage is open.');
      }
    });
  });
  