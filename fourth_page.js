document.addEventListener('DOMContentLoaded', function() {
    const blockBtn = document.getElementById('blockBtn');
    const blockedUrlsContainer = document.getElementById('blockedUrls');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const container = document.querySelector('.container');
    const registerBox = document.querySelector('.register-box');

    // Function to update the blocked URLs list
    function updateBlockedUrlsList() {
        chrome.storage.sync.get({ blockedUrls: [] }, function(data) {
            const blockedUrls = data.blockedUrls || [];
            blockedUrlsContainer.innerHTML = ''; // Clear existing content
            
            if (blockedUrls.length > 0) {
                blockedUrls.forEach(function(url) {
                    const listItem = document.createElement('li');
                    listItem.textContent = url;
                    
                    // Create a delete button for each blocked URL
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', function() {
                        // Remove the URL from the list and update storage
                        const updatedBlockedUrls = blockedUrls.filter(u => u !== url);
                        chrome.storage.sync.set({ blockedUrls: updatedBlockedUrls }, function() {
                            updateBlockedUrlsList(); // Update list after deletion
                        });
                    });
                    
                    // Append delete button to the list item
                    listItem.appendChild(deleteButton);
                    blockedUrlsContainer.appendChild(listItem);
                });
            } else {
                const message = document.createElement('p');
                message.textContent = 'No URLs blocked.';
                blockedUrlsContainer.appendChild(message);
            }
        });
    }

    // Check if password is already registered
    chrome.storage.sync.get('passwordRegistered', function(data) {
        if (data.passwordRegistered) {
            registerBox.style.display = 'none'; // Hide the register box if password is already registered
            container.style.display = 'block'; // Show the container
            updateBlockedUrlsList(); // Update the blocked URLs list
        }
    });

    // Event listener for blocking a new URL
    blockBtn.addEventListener('click', function() {
        const urlInput = document.getElementById('urlInput').value.trim();
        if (urlInput) {
            chrome.storage.sync.get({ blockedUrls: [] }, function(data) {
                let blockedUrls = data.blockedUrls;
                if (!blockedUrls.includes(urlInput)) {
                    blockedUrls.push(urlInput);
                    chrome.storage.sync.set({ blockedUrls: blockedUrls }, function() {
                        updateBlockedUrlsList(); // Update list after blocking URL
                        document.getElementById('result').textContent = `Blocked URL: ${urlInput}`;
                    });
                } else {
                    document.getElementById('result').textContent = `URL already blocked: ${urlInput}`;
                }
            });
        } else {
            document.getElementById('result').textContent = 'Please enter a URL';
        }
    });

    // Function to register the password
    function registerPassword(password, confirmPassword, callback) {
        if (password && confirmPassword && password === confirmPassword) {
            // Save the password value
            chrome.storage.sync.set({ password: password, passwordRegistered: true }, function() {
                console.log('Password registered:', password);
                callback(null); // Callback without error
            });
        } else {
            callback('Please enter matching passwords');
        }
    }

    // Event listener for registering password
    document.getElementById('registerBtn').addEventListener('click', function() {
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        registerPassword(password, confirmPassword, function(error) {
            if (error) {
                alert(error);
            } else {
                // Store the password in Chrome storage
                chrome.storage.sync.set({ password: password }, function() {
                    console.log('Password saved in Chrome storage');
                });

                // Hide the register box and show the container
                registerBox.style.display = 'none';
                container.style.display = 'block';
            }
        });
    });

});
