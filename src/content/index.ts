console.info('Content script is running....')

interface FormItem {
  id: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  label?: string | null
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
      const item: FormItem = {
        id: field.id,
        type: field.tagName.toLowerCase() as 'input' | 'textarea' | 'select',
        label: null, // Initialize the label as null
      }
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        item.placeholder = field.placeholder
        const labelElement = document.querySelector(`label[for="${field.id}"]`) as HTMLElement
        if (labelElement) {
          item.label = labelElement.innerText // Get the label text
        }
      }

      allItems.push(item)
    }
  }

  const url = window.location.href

  const allTexts = allItems.map((item) => {
    if (item.type === 'input' || item.type === 'textarea') {
      return item.placeholder || item.label
    }
  })

  chrome.runtime.sendMessage({ allItems, allTexts, url })

  console.log('Message sent from content script: ', { allItems, allTexts, url })

  chrome.storage.local.set({ allItems })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateInputValue') {
      const { id, value } = message
      const element = document.getElementById(id) as HTMLInputElement
      if (element) {
        element.value = value
      }
    } else if (message.action === 'performAutoFill') {
      const { formItems } = message
      formItems.forEach((item: { id: string; value: string }) => {
        const element = document.getElementById(item.id) as HTMLInputElement | HTMLTextAreaElement
        if (element) {
          element.value = item.value || ''
        }
      })
    }
  })

  // Send a message to the background script to notify that the content script is ready
  chrome.runtime.sendMessage({ action: 'contentScriptReady' })
}
