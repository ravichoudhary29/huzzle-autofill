import React, { useEffect, useState } from 'react'
import { attributeToKeyMap } from './attributeToKeyMap'
import './popup.css'
import { JobSite, JobSiteMap } from '../consts'

interface IInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const InputField: React.FC<IInputProps> = ({ label, value, onChange }) => {
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
        onChange={(e) => {
          setInputValue(e.target.value)
          onChange(e.target.value)
        }}
        className="input"
      />
    </div>
  )
}

const Popup: React.FC = () => {
  const [formData, setFormData] = useState<any[]>([])
  const [userData, setUserData] = useState<Record<string, any>>({})

  const [url, setUrl] = useState<string>('')

  const handleInputChange = (index: number, newValue: string) => {
    setFormData((prevFormData) => {
      const newFormData = [...prevFormData]
      newFormData[index] = { ...newFormData[index], value: newValue }

      setUserData((prevUserData) => {
        const updatedUserData = { ...prevUserData }
        const updatedKey =
          newFormData[index].name || newFormData[index].id || newFormData[index].autocomplete
        if (updatedKey) {
          updatedUserData[updatedKey] = newValue
        }

        // Store updated user data to chrome.storage
        chrome.storage.local.set({ userData: updatedUserData }, function () {
          console.log('User data updated in chrome.storage')
        })
        return updatedUserData
      })

      return newFormData
    })
  }

  const autofill = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0].id) return
      chrome.tabs.sendMessage(tabs[0].id, { type: 'AUTOFILL', formData })
    })
  }

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
              value: valueKey && userData[valueKey] !== undefined ? userData[valueKey] : '',
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
    url.includes('jobvite.com') ||
    url.includes('myworkdayjobs.com') ||
    url.includes('bamboohr.com')

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
              (item.label &&
                item.label.trim() !== '' &&
                url.includes(JobSite.LEVER) &&
                JobSiteMap[JobSite.LEVER].NAMES.includes(item.name)) ||
              (url.includes(JobSite.GREENHOUSE) &&
                JobSiteMap[JobSite.GREENHOUSE].IDS.includes(item.id)) ||
              (url.includes(JobSite.TEAMTAILOR) &&
                JobSiteMap[JobSite.TEAMTAILOR].IDS.includes(item.id)) ||
              (url.includes(JobSite.WORKABLE) &&
                JobSiteMap[JobSite.WORKABLE].IDS.includes(item.id)) ||
              JobSiteMap[JobSite.WORKABLE].NAMES.includes(item.name) ||
              (url.includes(JobSite.JOBVITE) &&
                JobSiteMap[JobSite.JOBVITE].AUTO_COMPLETES.includes(item.autocomplete)) ||
              (url.includes(JobSite.WORKDAY) &&
                JobSiteMap[JobSite.WORKDAY].IDS.includes(item.id)) ||
              (url.includes(JobSite.BAMBOOHR) && JobSiteMap[JobSite.BAMBOOHR].IDS.includes(item.id))
            ) {
              return (
                <InputField
                  key={index}
                  label={item.label || ''}
                  value={item.value || ''}
                  onChange={(newValue) => handleInputChange(index, newValue)}
                />
              )
            }
            return null
          })}
          <div className="autofill-button-container">
            <button className="autofill-button" onClick={autofill}>
              Autofill
            </button>
          </div>
        </>
      ) : (
        <p>This website is not supported by the Huzzle autofill extension.</p>
      )}
    </div>
  )
}

export default Popup
