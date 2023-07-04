chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'getFormData') {
    let allInputNodes = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input,textarea',
    )
    const allInputElements = Array.from(allInputNodes)
    const allInputData = allInputElements.map((inputElement) => {
      const inputElementId = inputElement.id
      const inputElementLabelSelector = `label[for="${inputElementId}"]`
      let label = document.querySelector(inputElementLabelSelector)
      let labelText = label?.innerText
      if (!labelText) {
        let inputLabel = inputElement
        while (inputLabel && inputLabel?.tagName !== 'LABEL') {
          inputLabel = inputLabel?.parentElement
        }
        labelText = inputLabel?.innerText
      }

      return {
        name: inputElement.name,
        id: inputElement.id,
        value: inputElement.value,
        placeholder: inputElement.placeholder,
        type: inputElement.type,
        autocomplete: inputElement.autocomplete,
        label: labelText,
      }
    })
    sendResponse(allInputData)
  } else if (message.type === 'AUTOFILL') {
    const allInputElements = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input,textarea',
    )
    const formValues = message.formData

    allInputElements.forEach((inputElement) => {
      const matchingValue = formValues.find(
        (field: any) => field.name === inputElement.name || field.id === inputElement.id,
      )

      if (matchingValue) {
        inputElement.value = matchingValue.value
      }
    })
  }

  return true
})
