function updateBlockedUrls() {
  chrome.storage.sync.get({ blockedUrls: [] }, function(data) {
      const blockedUrls = data.blockedUrls;
      const urlPatterns = blockedUrls.map(url => `*://${url}/*`);

      chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
      if (urlPatterns.length > 0) {
          chrome.webRequest.onBeforeRequest.addListener(
              blockRequest,
              { urls: urlPatterns },
              ["blocking"]
          );
      }
  });
}

function blockRequest(details) {
  return { cancel: true };
}

chrome.runtime.onStartup.addListener(updateBlockedUrls);
chrome.runtime.onInstalled.addListener(updateBlockedUrls);

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.blockedUrls) {
      updateBlockedUrls();
  }
});