document.addEventListener('DOMContentLoaded', function() {
    const blockedUrlsContainer = document.getElementById('blockedUrls');
    let isPopupOpen = false;

    // Function to display the list of blocked URLs
    function displayBlockedUrls() {
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
                        // Show popup to enter password if not already open
                        if (!isPopupOpen) {
                            isPopupOpen = true;
                            const passwordPopup = createPasswordPopup(url);
                            document.body.appendChild(passwordPopup);
                        }
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

    function createPasswordPopup(url) {
        // Create a container for the password popup
        const passwordPopupContainer = document.createElement('div');
        passwordPopupContainer.classList.add('popup-container');
        
        // Create the password popup
        const passwordPopup = document.createElement('div');
        passwordPopup.classList.add('password-popup');
        
        const passwordInput = document.createElement('input');
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('placeholder', 'Enter password');
        passwordPopup.appendChild(passwordInput);
        
        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        buttonContainer.appendChild(submitButton);
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        buttonContainer.appendChild(cancelButton);
        
        // Event listener for submit button
        submitButton.addEventListener('click', function() {
            const enteredPassword = passwordInput.value.trim();
            
            // Retrieve the stored password from Chrome storage
            chrome.storage.sync.get('password', function(data) {
                const storedPassword = data.password;
                
                if (enteredPassword === storedPassword) {
                    // Passwords match, remove the URL from the list
                    chrome.storage.sync.get({ blockedUrls: [] }, function(data) {
                        const blockedUrls = data.blockedUrls || [];
                        const updatedBlockedUrls = blockedUrls.filter(u => u !== url);
                        
                        // Update the blockedUrls array in Chrome storage
                        chrome.storage.sync.set({ blockedUrls: updatedBlockedUrls }, function() {
                            // Update UI and close the popup
                            displayBlockedUrls(); // Update list after deletion
                            document.body.removeChild(passwordPopupContainer); // Remove the popup container
                            isPopupOpen = false;
                        });
                    });
                } else {
                    // Passwords don't match, show error message or take appropriate action
                    alert('Incorrect password');
                }
            });
        });
    
        // Event listener for cancel button
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(passwordPopupContainer); // Remove the popup container
            isPopupOpen = false;
        });
    
        // Append the buttons container to the password popup
        passwordPopup.appendChild(buttonContainer);
    
        // Append the password popup to the container
        passwordPopupContainer.appendChild(passwordPopup);
    
        // Append the popup container to the body
        document.body.appendChild(passwordPopupContainer);
    
        return passwordPopupContainer;
    }
    
    

    // Display blocked URLs on page load
    displayBlockedUrls();
});
