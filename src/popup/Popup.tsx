import { useState, useEffect } from 'react'
import './Popup.css'

// Define a type for your input data
type InputData = {
  id: number
  value: string
}

function App() {
  // Use the InputData type when defining your state
  const [inputs, setInputs] = useState<InputData[]>([])

  // Add a message listener when the component mounts
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      // Check if the message inputData property exists
      if (message.inputData) {
        // Update the inputs state with the inputData from the message
        setInputs(message.inputData)
      }
    })
  }, []) // The empty array makes sure the effect runs only once on component mount

  return (
    <div className="popup-container">
      <h2 className="title-text">Huzzle Autofill</h2>

      {/* Map over the inputs state to display the input data */}
      {inputs.map((input) => (
        <p key={input.id}>
          Input {input.id}: {input.value}
        </p>
      ))}
    </div>
  )
}

export default App
