console.info('Content script is running....')
console.log('Before event listener')

if (document.readyState === 'loading') {
  // Loading has not finished
  document.addEventListener('DOMContentLoaded', logInputData)
} else {
  // `DOMContentLoaded` has already fired
  logInputData()
}

function logInputData() {
  console.log('Inside event listener')

  const inputs = Array.from(document.querySelectorAll('input'))
  const inputItems = inputs.map((input, index) => {
    const label = document.querySelector(`label[for="${input.id}"]`) as HTMLElement
    return {
      id: index,
      type: 'input',
      placeholder: input.placeholder,
      label: label ? label.innerText : null,
    }
  })

  const textareas = Array.from(document.querySelectorAll('textarea'))
  const textareaItems = textareas.map((textarea, index) => ({
    id: index,
    type: 'textarea',
    placeholder: textarea.placeholder,
  }))

  const selects = Array.from(document.querySelectorAll('select'))
  const selectItems = selects.map((select, index) => {
    const options = Array.from(select.options).map((option) => option.value)
    return {
      id: index,
      type: 'select',
      options,
    }
  })

  // Get the URL of the current page
  const url = window.location.href

  // Combine all items into a single array
  const allItems = [...inputItems, ...textareaItems, ...selectItems]

  // Send a message to the background script
  chrome.runtime.sendMessage({ allItems, url })

  console.log('Message sent from content script: ', { allItems, url })
}
