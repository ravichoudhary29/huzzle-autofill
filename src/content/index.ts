chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'getFormData') {
    const allInputElements = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input,textarea',
    )
    const allInputData = Array.from(allInputElements).map((inputElement) => {
      return {
        name: inputElement.name,
        id: inputElement.id,
        value: inputElement.value,
        placeholder: inputElement.placeholder,
        type: inputElement.type,
        autocomplete: inputElement.autocomplete,
        label:
          (inputElement.labels &&
            inputElement.labels.length > 0 &&
            inputElement.labels[0].textContent) ||
          '',
      }
    })
    sendResponse(allInputData)
  }

  return true
})
