document.getElementById('classifyBtn').addEventListener('click', function() {
    const urlInput = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('result');

    // Check if URL input is empty
    if (!urlInput) {
        resultDiv.textContent = 'Please enter a URL.';
        return;
    }

    // Clear previous result and show loading message
    resultDiv.textContent = 'Loading...';

    // Check if URL is in blacklist or whitelist
    checkLists(urlInput)
        .then(lists => {
            if (lists.blacklist) {
                resultDiv.textContent = 'Result: URL is 100% malicious (According to you :> it\'s in your blacklist)';
                resultDiv.style.color = 'red';
            } else if (lists.whitelist) {
                resultDiv.textContent = 'Result: URL is 100% safe (According to you :> it\'s in your whitelist)';
                resultDiv.style.color = 'green';
            } else {
                // Make a POST request to the Flask API
                fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: urlInput })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const prediction = data.predictions[0];
                        const result = prediction.result.toLowerCase(); // Convert to lowercase for case-insensitive comparison
                        const maliciousPercentage = prediction['malicious percentage'];

                        resultDiv.textContent = `Result: ${prediction.result} (Malicious Percentage: ${maliciousPercentage})`;
                        
                        if ((result.includes('safe') && result.includes('but')) || 
                            (result.includes('suspicious') && result.includes('but'))) {
                            resultDiv.style.color = 'orange';
                        } else if (result.includes('safe')) {
                            resultDiv.style.color = 'green';
                        } else if (result.includes('suspicious')) {
                            resultDiv.style.color = 'red';
                        }

                        document.getElementById('feedbackSection').style.display = 'block';
                    } else {
                        resultDiv.textContent = 'Error: Unable to classify the URL';
                    }  
                })
                .catch(error => {
                    console.error('Error:', error);
                    resultDiv.textContent = 'Error: Unable to classify the URL';
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.textContent = 'Error: Unable to check the URL against lists';
        });
});

function checkLists(url) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['blacklist', 'whitelist'], function(result) {
            const blacklist = result['blacklist'] || [];
            const whitelist = result['whitelist'] || [];

            const isBlacklisted = blacklist.includes(url);
            const isWhitelisted = whitelist.includes(url);

            if (isBlacklisted) {
                resolve({ blacklist: true });
            } else if (isWhitelisted) {
                resolve({ whitelist: true });
            } else {
                resolve({});
            }
        });
    });
}
