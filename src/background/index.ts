console.log('Background script running')

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'getAllItems') {
    chrome.storage.local.get(['allItems'], function (result) {
      const allItems = result.allItems
      sendResponse({ allItems })
    })
    return true // Required to indicate that we will send a response asynchronously
  }
  // Add other message handling logic as needed
})
