import React, { useEffect, useState } from 'react'
import { attributeToKeyMap } from './attributeToKeyMap'
import './popup.css' // importing your CSS file

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
                  'resume',
                  'name',
                  'email',
                  'phone',
                  'org',
                  'urls[LinkedIn]',
                  'urls[Twitter]',
                  'urls[GitHub]',
                  'urls[Portfolio]',
                  'urls[Other]',
                  'comments',

                  'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field1]',
                  'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field2]',
                  'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field3]',
                  'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field4]',
                  'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field6]',

                  'cards[62e3c836-a509-40e6-9895-ae79407cdcae][field1]',
                  'cards[62e3c836-a509-40e6-9895-ae79407cdcae][field2]',
                  'cards[62e3c836-a509-40e6-9895-ae79407cdcae][field0]',

                  'cards[a496c793-bdcd-4703-9bff-2f23c7a8dc5c][field0]',

                  'cards[522c5a72-a91c-4b9f-a8cf-eb5f0cb25ab7][field0]',
                  'cards[88ca6817-b704-45cc-aef3-59a24df2f405][field0]',

                  'cards[7123737d-00b8-4900-a9bf-0059cbbbb3ff][field0]',

                  'cards[205cbc38-3a25-46fa-b3a7-ede8966e314f][field0]',
                  'cards[1e303a9c-924a-40dd-ab18-b3cbe5672441][field0]',
                  'cards[06fd7b42-4805-4b54-a182-a3fa44266a4f][field0]',
                  'cards[06fd7b42-4805-4b54-a182-a3fa44266a4f][field3]',
                  'cards[1511a958-cba8-4266-8468-abdd3e0d8d9b][field3]',
                ].includes(item.name)) ||
              (url.includes('greenhouse.io') &&
                [
                  'first_name',
                  'last_name',
                  'email',
                  'phone',
                  'job_application_answers_attributes_0_text_value',
                  'job_application_answers_attributes_6_text_value',
                  'job_application_answers_attributes_4_text_value',
                  'job_application_answers_attributes_5_text_value',
                  'job_application_answers_attributes_2_text_value',
                ].includes(item.id)) ||
              (url.includes('teamtailor.com') &&
                [
                  'candidate_first_name',
                  'candidate_last_name',
                  'candidate_email',
                  'candidate_phone',
                ].includes(item.id)) ||
              (url.includes('workable.com') &&
                ([
                  'firstname',
                  'lastname',
                  'email',
                  // 'phone',
                  'cover_letter',
                  'address',
                  'CA_6551',
                  'school',
                  'field_of_study',
                  'degree',
                  'summary',
                ].includes(item.id) || item.name === 'phone',
                // 'start_date',
                // 'end_date'
                'title',
                'company',
                'industry',
                'summary')) ||
              (url.includes('jobvite.com') &&
                ['given-name', 'family-name', 'email', 'tel'].includes(item.autocomplete))
            ) {
              console.log({ item })
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
