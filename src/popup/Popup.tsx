import React, { useEffect, useState } from 'react'
import './popup.css'

interface FormItem {
  name: string
  value?: string
}

const Popup: React.FC = () => {
  const [formItems, setFormItems] = useState<FormItem[]>([])
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getAllItems' }, (response) => {
      if (response && response.allItems) {
        const searchTexts = [
          'name',
          'firstname',
          'lastname',
          'email',
          'phone',
          'linkedin',
          'twitter',
          'github',
          'portfolio',
          'gender',
        ]
        const filteredItems = response.allItems.filter((item: FormItem) =>
          searchTexts.some((searchText) => item.name.toLowerCase().includes(searchText)),
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
    const { name, value } = e.target
    console.log('Input changed: ', name, value)

    const updatedFormItems = formItems.map((item) =>
      item.name.toLowerCase() === name.toLowerCase() ? { ...item, value: value } : item,
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
          formItems: filledFormItems.map((item) => ({ name: item.name, value: item.value })),
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
        <div className="item" key={item.name}>
          <p className="label">{item.name}</p>
          <input
            className="input"
            type="text"
            name={item.name}
            value={item.value || ''}
            onChange={handleInputChange}
          />
        </div>
      ))}
      <p className="url">Current URL: {currentUrl}</p>
    </div>
  )
}

export default Popup
