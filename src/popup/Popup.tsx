import React, { useEffect, useState } from 'react'

interface IInputProps {
  label: string
  value: string
}

const InputField: React.FC<IInputProps> = ({ label, value }) => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div>
      <label>{label}</label>
      <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
    </div>
  )
}

const Popup: React.FC = () => {
  const [formData, setFormData] = useState<any[]>([])
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, 'getFormData', {}, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
            return
          }
          setFormData(response)
          setUrl(activeTab.url || '')
        })
      }
    })
  }, [])

  return (
    <div>
      {formData.map((item, index) => {
        if (
          (url.includes('lever.co') &&
            [
              'name',
              'email',
              'phone',
              'org',
              'urls[LinkedIn]',
              'urls[Twitter]',
              'urls[GitHub]',
              'urls[Portfolio]',
            ].includes(item.name)) ||
          (url.includes('greenhouse.io') &&
            [
              'first_name',
              'last_name',
              'email',
              'phone',
              'job_application_answers_attributes_0_text_value',
            ].includes(item.id)) ||
          (url.includes('teamtailor.com') &&
            [
              'candidate_first_name',
              'candidate_last_name',
              'candidate_email',
              'candidate_phone',
            ].includes(item.id)) ||
          (url.includes('workable.com') &&
            ['firstname', 'lastname', 'email', 'phone', 'cover_letter'].includes(item.id))
        ) {
          return (
            <InputField key={index} label={item.name || item.id || ''} value={item.value || ''} />
          )
        }
        return null
      })}
    </div>
  )
}

export default Popup
