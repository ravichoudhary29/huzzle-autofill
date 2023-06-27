console.info('Content script is running....')

interface FormItem {
  name: string
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', logInputData)
} else {
  logInputData()
}

function logInputData() {
  console.log('Inside event listener')

  const allItems: FormItem[] = []

  for (let form of Array.from(document.forms)) {
    for (let field of Array.from(form.elements)) {
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        if (field.name) {
          const item: FormItem = {
            name: field.name,
          }
          allItems.push(item)
        }
      }
    }
  }

  const url = window.location.href

  const allTexts = allItems.map((item) => item.name).join(', ')

  chrome.runtime.sendMessage({ allItems, allTexts, url })

  console.log('Message sent from content script: ', { allItems, allTexts, url })

  chrome.storage.local.set({ allItems })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateInputValue') {
      const { name, value } = message
      const element = document.querySelector(`[name="${name}"]`) as HTMLInputElement
      if (element) {
        element.value = value
      }
    } else if (message.action === 'performAutoFill') {
      const { formItems } = message
      formItems.forEach((item: { name: string; value: string }) => {
        const element = document.querySelector(`[name="${item.name}"]`) as
          | HTMLInputElement
          | HTMLTextAreaElement
        if (element) {
          element.value = item.value || ''
        }
      })
    }
  })

  // Send a message to the background script to notify that the content script is ready
  chrome.runtime.sendMessage({ action: 'contentScriptReady' })
}
