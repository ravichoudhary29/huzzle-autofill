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

  useEffect(() => {
    chrome.storage.local.get(['allItems'], function (result) {
      if (result.allItems) {
        setFormItems(result.allItems)
      }
    })
  }, [])

  return (
    <div className="container">
      <h1 className="title">Huzzle AI Autofill</h1>
      {formItems
        .filter((item) => item.name || item.id || item.placeholder || item.label)
        .map((item) => (
          <div className="item" key={item.id}>
            <p className="label">{item.name || item.id || item.placeholder || item.label}</p>
            <input className="input" type="text" />
          </div>
        ))}
    </div>
  )
}

export default Popup
