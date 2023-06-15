console.info('Content script is running....')

interface FormItem {
  id: number
  type: 'input' | 'textarea' | 'select' | 'button'
  placeholder?: string
  label?: string | null
  options?: string[]
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
        type: field.tagName.toLowerCase() as 'input' | 'textarea' | 'select' | 'button',
      }
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        item.placeholder = field.placeholder
        item.label =
          (document.querySelector(`label[for="${field.id}"]`) as HTMLElement)?.innerText || null
      }
      if (field instanceof HTMLSelectElement) {
        item.options = Array.from(field.options).map((option) => option.value)
      }
      if (field instanceof HTMLButtonElement) {
        item.label = field.textContent || null
      }
      allItems.push(item)
    }
  }

  const url = window.location.href

  const allTexts = allItems.map((item) => {
    if (item.type === 'input' || item.type === 'textarea') {
      return item.placeholder || item.label
    } else if (item.type === 'button') {
      return item.label
    } else {
      return item.options?.join(',')
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
    } else if (message.action === 'performButtonClick') {
      const { id } = message
      const element = document.getElementById(id.toString()) as HTMLButtonElement
      if (element) {
        element.click()
      }
    }
  })

  // Send a message to the background script to notify that the content script is ready
  chrome.runtime.sendMessage({ action: 'contentScriptReady' })
}
