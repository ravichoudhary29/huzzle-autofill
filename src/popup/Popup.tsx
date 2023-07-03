import React, { useEffect, useState } from 'react'
import { attributeToKeyMap } from './attributeToKeyMap'
import './popup.css' // importing your CSS file

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
    <div className="item">
      <label className="label">{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="input"
      />
    </div>
  )
}

const Popup: React.FC = () => {
  const [formData, setFormData] = useState<any[]>([])
  const [userData, setUserData] = useState<Record<string, any>>({})

  const [url, setUrl] = useState<string>('')

  const signIn = () => {
    // Here you will set the login status
    // and redirect the user to the options page

    chrome.runtime.openOptionsPage()
  }

  useEffect(() => {
    const userDataPromise = new Promise<Record<string, any>>((resolve) => {
      chrome.storage.local.get(['userData'], function (result) {
        resolve(result.userData)
      })
    })

    const activeTabPromise = new Promise<chrome.tabs.Tab>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0])
      })
    })

    Promise.all([userDataPromise, activeTabPromise]).then(([userData, activeTab]) => {
      setUserData(userData)
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, 'getFormData', {}, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
            return
          }
          // Map user data to form data
          const mappedFormData = response.map((field: any) => {
            let valueKey: string | undefined
            for (const attribute in attributeToKeyMap) {
              if (
                attributeToKeyMap[attribute].includes(field.name) ||
                attributeToKeyMap[attribute].includes(field.id) ||
                attributeToKeyMap[attribute].includes(field.autocomplete)
              ) {
                valueKey = attribute
              }
            }
            return {
              ...field,
              value: valueKey ? (userData as { [key: string]: any })[valueKey] : '',
            }
          })
          setFormData(mappedFormData)
          setUrl(activeTab.url || '')
        })
      }
    })
  }, [])

  const isSupportedWebsite =
    url.includes('lever.co') ||
    url.includes('greenhouse.io') ||
    url.includes('teamtailor.com') ||
    url.includes('workable.com') ||
    url.includes('jobvite.com')

  return (
    <div className="container">
      <h2 className="title">Huzzle AI Autofill</h2>
      <button onClick={signIn} className="signInButton">
        Sign In
      </button>
      {isSupportedWebsite ? (
        <>
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
                (['firstname', 'lastname', 'email', 'phone', 'cover_letter'].includes(item.id) ||
                  item.name === 'phone')) ||
              (url.includes('jobvite.com') &&
                ['given-name', 'family-name', 'email', 'tel'].includes(item.autocomplete))
            ) {
              console.log({ item })
              return <InputField key={index} label={item.label || ''} value={item.value || ''} />
            }
            return null
          })}
          <div className="autofill-button-container">
            <button className="autofill-button">Autofill</button>
          </div>
        </>
      ) : (
        <p>This website is not supported by the Huzzle autofill extension.</p>
      )}
    </div>
  )
}

export default Popup
