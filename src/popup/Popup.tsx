import React, { useEffect, useState } from 'react'
import './popup.css'

interface FormItem {
  id: number
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  label?: string | null
  name?: string
  options?: string[]
}

const Popup: React.FC = () => {
  const [formItems, setFormItems] = useState<FormItem[]>([])
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getAllItems' }, (response) => {
      if (response && response.allItems) {
        setFormItems(response.allItems)
      }
    })

    // Get current URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url)
      }
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    console.log('Input changed: ', id, value)

    // Perform any logic or send messages to the background script as needed
  }

  return (
    <div className="container">
      <h1 className="title">Huzzle AI Autofill</h1>
      {formItems
        .filter((item) => item.name || item.id || item.placeholder || item.label)
        .map((item) => (
          <div className="item" key={item.id}>
            <p className="label">{item.name || item.id || item.placeholder || item.label}</p>
            <input
              className="input"
              type="text"
              id={item.id.toString()}
              onChange={handleInputChange}
            />
          </div>
        ))}
      <p className="url">Current URL: {currentUrl}</p> {/* Display the current URL */}
    </div>
  )
}

export default Popup
