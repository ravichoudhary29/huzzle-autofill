import React, { useEffect, useState } from 'react'
import './popup.css'

interface FormItem {
  id: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  label?: string | null
  value?: string // Added value property for storing the user input
}

const Popup: React.FC = () => {
  const [formItems, setFormItems] = useState<FormItem[]>([])
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getAllItems' }, (response) => {
      if (response && response.allItems) {
        const filteredItems = response.allItems.filter(
          (item) =>
            (item.label || item.placeholder || item.name) &&
            (item.type === 'input' || item.type === 'textarea'),
        )
        setFormItems(filteredItems)
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

    const updatedFormItems = formItems.map((item) =>
      item.id === id ? { ...item, value: value } : item,
    )
    setFormItems(updatedFormItems)
  }

  const handleAutoFill = () => {
    // Filter out the form items that have user input
    const filledFormItems = formItems.filter((item) => item.value)

    // Send message to content script to perform autofill action with the filled form items
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'performAutoFill',
          formItems: filledFormItems,
        })
      }
    })
  }

  return (
    <div className="container">
      <h1 className="title">Huzzle AI Autofill</h1>
      <div className="autofill-button-container">
        <button className="autofill-button" onClick={handleAutoFill}>
          Autofill
        </button>
      </div>
      {formItems.map((item) => (
        <div className="item" key={item.id}>
          <p className="label">
            {String(
              item.label || item.placeholder || '',
            ).replace(/[_-]/g, ' ')}
          </p>
          <input
            className="input"
            type="text"
            id={item.id.toString()}
            value={item.value || ''}
            onChange={handleInputChange}
          />
        </div>
      ))}
      <p className="url">Current URL: {currentUrl}</p> {/* Display the current URL */}
    </div>
  )
}

export default Popup
