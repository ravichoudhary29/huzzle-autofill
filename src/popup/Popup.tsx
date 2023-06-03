import { useState, useEffect } from 'react'
import './Popup.css'

// Define a type for your input data
type InputData = {
  id: number
  placeholder: string
  label: string | null
}

// Define a type for your textarea data
type TextAreaData = {
  id: number
  placeholder: string
}

// Define a type for your select data
type SelectData = {
  id: number
  options: string[]
}

function App() {
  // Use the InputData type when defining your state
  const [inputs, setInputs] = useState<InputData[]>([])

  // Define your states for textarea and select data
  const [textareas, setTextareas] = useState<TextAreaData[]>([])
  const [selects, setSelects] = useState<SelectData[]>([])

  // Add a message listener when the component mounts
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      // Check if the message inputData property exists
      if (message.inputData) {
        // Update the inputs state with the inputData from the message
        setInputs(message.inputData)
      }

      if (message.textareaData) {
        setTextareas(message.textareaData)
      }

      if (message.selectData) {
        setSelects(message.selectData)
      }
    })
  }, []) // The empty array makes sure the effect runs only once on component mount

  return (
    <div className="popup-container">
      <h2 className="title-text">Huzzle Autofill</h2>

      {/* Map over the inputs state to display the input data */}
      {inputs.map((input) => (
        <p key={input.id}>
          Input {input.id}: Placeholder - {input.placeholder}, Label - {input.label}
        </p>
      ))}

      {/* Map over the textareas state to display the textarea data */}
      {textareas.map((textarea) => (
        <p key={textarea.id}>
          Textarea {textarea.id}: {textarea.placeholder}
        </p>
      ))}

      {/* Map over the selects state to display the select data */}
      {selects.map((select) => (
        <div key={select.id}>
          <p>Select {select.id}:</p>
          <ul>
            {select.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default App
