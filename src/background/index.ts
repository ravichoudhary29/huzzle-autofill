console.log('Background script running')

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Log the inputData property of the message
  if (message.inputData) {
    console.log('Message received in background script: ', message.inputData)
  }
})
