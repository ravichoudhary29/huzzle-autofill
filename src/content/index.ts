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
  const inputData = inputs.map((input, index) => {
    const label = document.querySelector(`label[for="${input.id}"]`) as HTMLElement
    return { id: index, placeholder: input.placeholder, label: label ? label.innerText : null }
  })

  const textareas = Array.from(document.querySelectorAll('textarea'))
  const textareaData = textareas.map((textarea, index) => ({
    id: index,
    placeholder: textarea.placeholder,
  }))

  const selects = Array.from(document.querySelectorAll('select'))
  const selectData = selects.map((select, index) => {
    const options = Array.from(select.options).map((option) => option.value)
    return { id: index, options }
  })

  // Send a message to the background script
  chrome.runtime.sendMessage({ inputData, textareaData, selectData })

  console.log('Message sent from content script: ', { inputData, textareaData, selectData })
}
