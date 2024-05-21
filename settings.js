document.addEventListener("DOMContentLoaded", function() {
    // Get references to HTML elements
    var urlInput = document.getElementById("urlInput");
    var addToBlacklistBtn = document.getElementById("addToBlacklistBtn");
    var addToWhitelistBtn = document.getElementById("addToWhitelistBtn");

    // Function to add URL to specified list in local storage
    function addToList(listName, url) {
        // Get both blacklist and whitelist from local storage
        chrome.storage.local.get(["blacklist", "whitelist"], function(result) {
            var blacklist = result["blacklist"] || [];
            var whitelist = result["whitelist"] || [];
            
            // Check if the URL is already in the opposite list
            if ((listName === "blacklist" && whitelist.includes(url)) || (listName === "whitelist" && blacklist.includes(url))) {
                alert("URL is already in the " + (listName === "blacklist" ? "whitelist" : "blacklist"));
                return; // Exit the function early if URL is already in the opposite list
            }

            // Proceed to add URL to the specified list
            var list = result[listName] || [];
            if (!list.includes(url)) {
                list.push(url);
                var updatedList = {};
                updatedList[listName] = list;
                chrome.storage.local.set(updatedList, function() {
                    // Clear the input field
                    urlInput.value = "";
                    // Reload the list of blocked URLs
                    loadBlockedUrls();
                });
            } else {
                alert("URL is already in the " + listName);
            }
        });
    }

    // Function to add URL to blacklist
    addToBlacklistBtn.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent form submission
        var url = urlInput.value.trim();
        if (url !== "") {
            addToList("blacklist", url);
        }
    });

    // Function to add URL to whitelist
    addToWhitelistBtn.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent form submission
        var url = urlInput.value.trim();
        if (url !== "") {
            addToList("whitelist", url);
        }
    });

    // Function to load the list of blocked URLs
    function loadBlockedUrls() {
        // Your implementation here to load and display the blocked URLs
    }
});
