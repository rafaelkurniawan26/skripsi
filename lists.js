document.addEventListener("DOMContentLoaded", function() {
    var blacklistUrls = document.getElementById("blacklist");
    var whitelistUrls = document.getElementById("whitelist");

    // Function to load URLs from local storage and display them
    function loadUrls(listName, element) {
        chrome.storage.local.get(listName, function(result) {
            var list = result[listName] || [];
            element.innerHTML = "";
            list.forEach(function(url, index) {
                var li = document.createElement("li");
                li.textContent = url;
                var deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.addEventListener("click", function() {
                    deleteUrl(listName, index);
                });
                li.appendChild(deleteBtn);
                element.appendChild(li);
            });
        });
    }

    // Function to delete URL from specified list in local storage
    function deleteUrl(listName, index) {
        chrome.storage.local.get(listName, function(result) {
            var list = result[listName];
            if (index > -1) {
                list.splice(index, 1); // Remove the URL at the specified index
                chrome.storage.local.set({[listName]: list}, function() {
                    loadUrls(listName, listName === "blacklist" ? blacklistUrls : whitelistUrls);
                });
            }
        });
    }

    // Load URLs when the page loads
    loadUrls("blacklist", blacklistUrls);
    loadUrls("whitelist", whitelistUrls);
});
