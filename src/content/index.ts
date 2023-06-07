console.info('Content script is running....')
// console.log('Before event listener')

// interface FormItem {
//   id: number
//   type: 'input' | 'textarea' | 'select'
//   placeholder?: string
//   label?: string | null // <-- Allow null value here
//   options?: string[]
// }

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', logInputData)
// } else {
//   logInputData()
// }

// function logInputData() {
//   console.log('Inside event listener')

//   const allItems: FormItem[] = []

//   for (let form of Array.from(document.forms)) {
//     for (let field of Array.from(form.elements)) {
//       const item: FormItem = {
//         id: field.id,
//         type: field.tagName.toLowerCase() as 'input' | 'textarea' | 'select',
//       }
//       if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
//         item.placeholder = field.placeholder
//         item.label =
//           (document.querySelector(`label[for="${field.id}"]`) as HTMLElement)?.innerText || null
//       }
//       if (field instanceof HTMLSelectElement) {
//         item.options = Array.from(field.options).map((option) => option.value)
//       }
//       allItems.push(item)
//     }
//   }

//   const url = window.location.href

//   const allTexts = allItems.map((item) => {
//     if (item.type === 'input' || item.type === 'textarea') {
//       return item.placeholder || item.label
//     } else {
//       return item.options?.join(',')
//     }
//   })

//   chrome.runtime.sendMessage({ allItems, allTexts, url })

//   console.log('Message sent from content script: ', { allItems, allTexts, url })
// }
