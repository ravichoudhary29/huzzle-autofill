import React, { useEffect, useState } from 'react'
import './popup.css'

interface FormItem {
  id: number
  type: 'input' | 'textarea' | 'select' | 'button'
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

    // Send message to content script to update the input value in the web page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateInputValue', id, value })
      }
    })
  }

  const handleButtonClick = (id: number) => {
    // Send message to content script to perform button click action
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'performButtonClick', id })
      }
    })
  }

  return (
    <div className="container">
      <h1 className="title">Huzzle AI Autofill</h1>
      {formItems
        .filter((item) => item.name || item.id || item.placeholder || item.label)
        .map((item) => (
          <div className="item" key={item.id}>
            {item.type === 'button' ? (
              <button className="button" onClick={() => handleButtonClick(item.id)}>
                {item.label}
              </button>
            ) : (
              <>
                <p className="label">
                  {String(item.name || item.id || item.placeholder || item.label).replace(
                    /[_-]/g,
                    ' ',
                  )}
                </p>
                <input
                  className="input"
                  type="text"
                  id={item.id.toString()}
                  onChange={handleInputChange}
                />
              </>
            )}
          </div>
        ))}
      <p className="url">Current URL: {currentUrl}</p> {/* Display the current URL */}
    </div>
  )
}

export default Popup
